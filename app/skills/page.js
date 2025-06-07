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
import Footer from "@/components/footer";

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default fallback
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSkillsAndSettings = async () => {
      try {
        showLoader();

        // Fetch itemsPerPage setting first to know chunk size early
        const settingsData = await getDoc(doc(db, "settings", "skills"));
        if (settingsData.exists()) {
          const { itemsPerPage } = settingsData.data();
          if (itemsPerPage) setItemsPerPage(itemsPerPage);
        }

        // Fetch skills data
        const snapshot = await getDocs(collection(db, "skills"));
        const skillsList = snapshot.docs.map((doc) => doc.data().name);
        setSkills(skillsList);
      } catch (error) {
        console.error("Error fetching skills or settings:", error);
      } finally {
        hideLoader();
      }
    };

    fetchSkillsAndSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(skills.length / itemsPerPage));

  // Reset currentPage if it goes beyond totalPages due to data changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
    <>
      <section className="min-h-screen mt-10 py-16 px-6 md:px-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-12">
            My Skills
          </h1>

          <div className="flex justify-center flex-wrap gap-3 md:gap-6">
            {currentSkills.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                No skills found.
              </p>
            ) : (
              currentSkills.map((skill, index) => (
                <div
                  key={index}
                  className="min-w-sm bg-gray-200 dark:bg-gray-800 rounded-2xl px-6 py-4 text-center shadow-lg hover:shadow-indigo-500 transition duration-300"
                >
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {skill}
                  </p>
                </div>
              ))
            )}
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
                    aria-label="Previous page"
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                      href="#"
                      aria-current={
                        index + 1 === currentPage ? "page" : undefined
                      }
                      aria-label={`Page ${index + 1}`}
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
                    aria-label="Next page"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SkillPage;
