"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useLoader } from "@/context/LoaderContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


const ITEMS_PER_PAGE = 1;//control this from admin panel

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader()
    const fetchBlogs = async () => {
      try {
        const blogSnapshot = await getDocs(collection(db, "blogs"));
        const blogList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogList);
      } catch (error) {
        // console.error("Error fetching blogs:", error);
      }finally{
        hideLoader()
      }
    };

    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Optional smooth scroll
    }
  };

  return (
    <section className="px-4 py-16 mt-10 text-white min-h-[85vh]">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
        My Blog
      </h1>
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-800 p-5 rounded-lg shadow-lg max-w-xl w-full flex flex-col"
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 640px) 100vw, 400px"
                priority
              />
            </div>
            <h2 className="text-2xl font-semibold text-indigo-300 mt-4">
              {blog.title}
            </h2>
            <p className="text-gray-400 mt-2 flex-grow">{blog.about}</p>
            <Link
              href={`/blogs/${blog.slug}`}
              className="mt-4 text-indigo-400 hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination */}
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
    </section>
  );
};

export default BlogPage;
