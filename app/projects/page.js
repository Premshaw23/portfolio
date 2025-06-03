"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Bt2 from "@/components/buttonUi/Button2";

const ITEMS_PER_PAGE = 2;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const currentProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-transparent text-gray-300 min-h-screen py-16 mt-10 body-font">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-16">
          My Projects
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {currentProjects.map(
            ({ id, title, description, image, buttonText, buttonLink }) => (
              <div
                key={id}
                className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
              >
                <Image
                  src={image}
                  alt={title}
                  width={300}
                  height={300}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                    {title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-5">{description}</p>
                  <a 
                    href={buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Bt2 name={buttonText || "View Project"} />
                  </a>
                </div>
              </div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-16 flex justify-center cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                    href="#"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
