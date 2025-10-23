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
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSkillsAndSettings = async () => {
      try {
        showLoader();

        const settingsData = await getDoc(doc(db, "settings", "skills"));
        if (settingsData.exists()) {
          const { itemsPerPage } = settingsData.data();
          if (itemsPerPage) setItemsPerPage(itemsPerPage);
        }

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
      <section className="relative min-h-screen py-20 px-6 md:px-10 bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm mb-6">
              <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                Tech Stack & Expertise
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                My Skills
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A collection of technologies and tools I use to bring ideas to
              life
            </p>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center flex-wrap gap-4 md:gap-6 min-h-[300px]"
          >
            {currentSkills.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                No skills found.
              </p>
            ) : (
              currentSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-5 shadow-lg hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {skill}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Pagination className="mt-16 flex justify-center">
                <PaginationContent className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                      aria-label="Previous page"
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                        href="#"
                        className={`cursor-pointer rounded-full ${
                          index + 1 === currentPage
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : "hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                        }`}
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
                      className={`cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                      aria-label="Next page"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SkillPage;
