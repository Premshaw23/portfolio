"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLoader } from "@/context/LoaderContext";

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSkillsAndSettings = async () => {
      try {
        showLoader();

        // Fetch skills
        const snapshot = await getDocs(collection(db, "skills"));
        const skillsList = snapshot.docs.map((doc) => doc.data().name);
        setSkills(skillsList);

        // Fetch itemsPerPage setting
        const settingsData = await getDoc(doc(db, "settings", "skills"));
        if (settingsData.exists()) {
          const { itemsPerPage } = settingsData.data();
          if (itemsPerPage) setItemsPerPage(itemsPerPage);
        }
      } catch (error) {
        console.error("Error fetching skills or settings:", error);
      } finally {
        hideLoader();
      }
    };

    fetchSkillsAndSettings();
  }, []);

  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const currentSkills = skills.slice(
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
    <section className="min-h-screen mt-10 text-gray-300 py-16 px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
          My Skills
        </h1>

        <div className="flex justify-center flex-wrap md:gap-6 gap-3">
          {currentSkills.map((skill, index) => (
            <div
              key={index}
              className="min-w-sm bg-gray-800 rounded-2xl px-6 py-4 text-center shadow-lg hover:shadow-indigo-500 transition duration-300"
            >
              <p className="text-lg font-semibold text-indigo-300">{skill}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-12 flex justify-center cursor-pointer">
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

export default SkillPage;
