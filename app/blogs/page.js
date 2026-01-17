"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Footer from "@/components/footer";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useLoader } from "@/context/LoaderContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion ,AnimatePresence} from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Calendar, Eye } from "lucide-react";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSettingsAndBlogs = async () => {
      setLoading(true);
      showLoader();
      try {
        const settingsRef = doc(db, "settings", "blogs");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const { itemsPerPage } = settingsSnap.data();
          if (itemsPerPage) setItemsPerPage(itemsPerPage);
        }

        const blogSnapshot = await getDocs(collection(db, "blogs"));
        const blogList = blogSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((blog) => blog.status === "published")
          .sort((a, b) => {
             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
             return dateB - dateA;
          });

        setBlogs(blogList);
      } catch (error) {
        console.error("Error loading blog data:", error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchSettingsAndBlogs();
  }, [showLoader, hideLoader]);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const featuredBlog = blogs[0];

  return (
    <>
      <section className="relative min-h-screen py-16 md:py-24 bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
          {/* Executive Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl mb-6 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] text-gray-500 dark:text-gray-400 uppercase">
                Technical Journal
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
              <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
                Insights &
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent italic font-serif tracking-normal">
                Discoveries.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
              Documenting the intersection of complex backend architecture and pixel-perfect frontend engineering.
            </p>
          </motion.div>

          {/* Featured Post (Only on Page 1) */}
          {currentPage === 1 && featuredBlog && !loading && (
             <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mb-12 md:mb-20"
             >
                <Link href={`/blogs/${featuredBlog.slug}`} className="group relative block aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-2xl">
                  <Image 
                    src={featuredBlog.coverImage} 
                    alt={featuredBlog.title} 
                    fill 
                    sizes="100vw"
                    priority
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                      <Sparkles size={12} className="animate-pulse" />
                      Latest Publication
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white max-w-3xl leading-tight group-hover:text-blue-400 transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-gray-300 max-w-xl line-clamp-2 text-sm sm:text-lg font-medium opacity-80 hidden sm:block">
                      {featuredBlog.about}
                    </p>
                  </div>
                </Link>
             </motion.div>
          )}

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-80 sm:h-96 rounded-[2rem] sm:rounded-[2.5rem] bg-gray-200 dark:bg-white/5 animate-pulse" />)
              ) : (
                currentBlogs
                  .filter(b => currentPage !== 1 || b.id !== featuredBlog?.id)
                  .map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="relative h-full flex flex-col bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 group-hover:translate-y-[-8px] group-hover:border-blue-500/30">
                      
                      {/* Image */}
                      <div className="relative h-48 sm:h-60 overflow-hidden">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, 500px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-[9px] font-black tracking-widest text-gray-400 uppercase mb-3">
                           <Calendar size={12} className="text-blue-500" />
                           {blog.date || "Tech Entry"}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight group-hover:text-blue-500 transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3 font-medium">
                          {blog.about}
                        </p>

                        <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-100 dark:border-white/5">
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white group/link"
                          >
                            Read Full Journal
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Luxury Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 sm:mt-24 w-full overflow-x-auto overflow-y-hidden"
            >
              <Pagination className="flex justify-center min-w-max px-4">
                <PaginationContent className="bg-white dark:bg-white/5 backdrop-blur-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 dark:border-white/10 shadow-2xl flex items-center gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`cursor-pointer min-w-[32px] sm:min-w-[40px] px-2 sm:px-4 h-8 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                        currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-blue-500 hover:text-white"
                      }`}
                    />
                  </PaginationItem>

                  <div className="flex items-center gap-1 sm:gap-2 mx-1 sm:mx-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                          className={`cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-[10px] sm:text-xs transition-all flex items-center justify-center ${
                            index + 1 === currentPage
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                              : "text-gray-400 dark:text-gray-500 hover:text-blue-500"
                          }`}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`cursor-pointer min-w-[32px] sm:min-w-[40px] px-2 sm:px-4 h-8 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                        currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-blue-500 hover:text-white"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}

          {blogs.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center py-32 sm:py-40 animate-pulse text-center">
               <BookOpen className="text-gray-300 dark:text-white/10 h-12 w-12 sm:h-16 sm:w-16 mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] sm:text-xs">Penning down some thoughts... stay tuned.</p>
             </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogPage;
