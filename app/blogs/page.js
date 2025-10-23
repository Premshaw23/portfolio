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
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Calendar, Eye } from "lucide-react";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
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
          .filter((blog) => blog.status === "published");

        setBlogs(blogList);
      } catch (error) {
        console.error("Error loading blog settings or blogs:", error);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchSettingsAndBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <>
      <section className="relative min-h-screen px-4 py-20 bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                Thoughts & Tutorials
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Blog
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Sharing insights, tutorials, and experiences from my development
              journey
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="flex flex-wrap justify-center gap-8 min-h-[400px]">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce delay-200" />
                <p className="ml-3 text-indigo-600 dark:text-indigo-300 text-lg font-medium">
                  Loading blogs...
                </p>
              </div>
            ) : currentBlogs.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 w-full">
                No blogs found.
              </p>
            ) : (
              currentBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative max-w-xl w-full"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl flex flex-col h-full">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, 600px"
                        priority
                        className="group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          New Post
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{blog.date || "Recent"}</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views || "0"} views</span>
                        </div> */}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">
                        {blog.about}
                      </p>

                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all duration-300 group/link"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </motion.div>
              ))
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
                            ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
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

export default BlogPage;
