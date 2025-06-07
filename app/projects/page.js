"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
import { useLoader } from "@/context/LoaderContext";
import Footer from "@/components/footer";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // NEW loading state
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSettingsAndProjects = async () => {
      setLoading(true);
      try {
        showLoader();
        const settingsData = await getDoc(doc(db, "settings", "projects"));
        if (settingsData.exists()) {
          const { itemsPerPage } = settingsData.data();
          if (itemsPerPage) setItemsPerPage(itemsPerPage);
        }

        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects or settings", error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchSettingsAndProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 min-h-[87vh] py-16 mt-12 body-font">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-14">
          My Projects
        </h1>

        <div className="flex flex-wrap justify-center gap-8 min-h-[250px]">
          {loading ? (
            <p className="text-indigo-600 dark:text-indigo-300 text-lg animate-pulse">
              Loading projects...
            </p>
          ) : currentProjects.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 w-full">
              No projects found.
            </p>
          ) : (
            currentProjects.map(
              ({ id, title, description, image, buttonText, buttonLink }) => (
                <div
                  key={id}
                  className="bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  <Image
                    src={image || "/fallback.png"}
                    alt={title || "Project image"}
                    width={300}
                    priority
                    height={300}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                      {title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-400 text-sm mb-5">
                      {description}
                    </p>
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
            )
          )}
        </div>

        {!loading && totalPages > 1 && (
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
    <Footer/>
        </>
  );
  
};

export default ProjectsPage;
