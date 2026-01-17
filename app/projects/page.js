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
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ExternalLink, Sparkles } from "lucide-react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
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
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchSettingsAndProjects();
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
      <section className="relative min-h-screen py-24 bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b82f615,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_120%,#8b5cf615,transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Executive Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl mb-4">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className="text-xs font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase">
                Portfolio Showcase
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
              <span className="bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                Digital Craft.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic font-serif tracking-normal">
                Real Impact.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Synthesizing complex logic into elegant user experiences. Browse my latest explorations in web architecture and design.
            </p>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] rounded-[2.5rem] bg-gray-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group relative"
                  >
                    {/* Shadow & Aura */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
                    
                    <div className="relative h-full flex flex-col bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:translate-y-[-8px] group-hover:border-blue-500/30">
                      
                      {/* Image Preview */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={project.image || "/fallback.png"}
                          alt={project.title}
                          fill
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                        
                        {/* Project Index Overlay */}
                        <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 font-black text-xs">
                          0{index + 1 + (currentPage - 1) * itemsPerPage}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex-1 space-y-4">
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed line-clamp-3 font-medium">
                            {project.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex items-center gap-3">
                          {(project.liveLink || project.buttonLink) && (
                            <a
                              href={project.liveLink || project.buttonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                            >
                              Live App
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-transparent dark:border-white/5"
                            >
                              <Image 
                                src="https://avatars.githubusercontent.com/u/9919?s=200&v=4" 
                                alt="github" 
                                width={18} 
                                height={18} 
                                className="rounded-full invert dark:invert-0 brightness-0 dark:brightness-100" 
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Luxury Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-24"
            >
              <Pagination className="flex justify-center">
                <PaginationContent className="bg-white dark:bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer w-10 h-10 p-0 rounded-full flex items-center justify-center transition-all ${
                        currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-blue-500 hover:text-white"
                      }`}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                        className={`cursor-pointer w-10 h-10 rounded-full font-black text-xs transition-all ${
                          index + 1 === currentPage
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                            : "text-gray-400 hover:text-blue-500"
                        }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`cursor-pointer w-10 h-10 p-0 rounded-full flex items-center justify-center transition-all ${
                        currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-blue-500 hover:text-white"
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
