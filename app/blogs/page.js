"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogSnapshot = await getDocs(collection(db, "blogs"));
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);
    };

    fetchBlogs();
  }, []);


  return (
    <section className="px-4 py-16 mt-10 text-white min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
        My Blog
      </h1>

      <div className="flex flex-wrap gap-8 max-w-7xl mx-10">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-800 p-5 rounded-lg shadow-lg max-w-sm flex flex-col flex-grow"
            style={{ flexBasis: "300px" }}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 640px) 100vw, 400px"
                priority={true}
              />
            </div>
            <h2 className="text-2xl font-semibold text-indigo-300 mt-4">
              {blog.title}
            </h2>
            <p className="text-gray-400 mt-2 flex-grow">{blog.snippet}</p>
            <Link href={`/blogs/${blog.id}`}>
              <button className="mt-4 text-indigo-400 hover:underline cursor-pointer">
                Read More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
   
};

export default BlogPage;
