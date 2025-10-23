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
import { motion } from "framer-motion";
import { Rocket, ExternalLink, Sparkles } from "lucide-react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
      <section className="relative min-h-screen py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 container mx-auto px-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm mb-6">
              <Rocket className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                Featured Work
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                My Projects
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore my latest work and side projects built with modern
              technologies
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="flex flex-wrap justify-center gap-8 min-h-[400px]">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce delay-200" />
                <p className="ml-3 text-indigo-600 dark:text-indigo-300 text-lg font-medium">
                  Loading projects...
                </p>
              </div>
            ) : currentProjects.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 w-full">
                No projects found.
              </p>
            ) : (
              currentProjects.map(
                (
                  { id, title, description, image, buttonText, buttonLink },
                  index
                ) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative max-w-sm"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <Image
                          src={image || "/fallback.png"}
                          alt={title || "Project image"}
                          fill
                          priority
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                          {description}
                        </p>

                        <a
                          href={buttonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
                        >
                          {buttonText || "View Project"}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )
              )
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
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
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                        }`}
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

export default ProjectsPage;
