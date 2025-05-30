"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DOMPurify from "dompurify";

const BlogDetails = ({ params }) => {
  // Unwrap params promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [blog, setBlog] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        } else {
          router.push("/blogs"); // Redirect if blog not found
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        router.push("/blogs");
      }
    };

    fetchBlog();
  }, [id, router]);

  if (!blog) return <p className="text-center text-indigo-400">Loading...</p>;

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <section className="px-6 md:px-10 py-16 mt-10 text-white min-h-screen max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-6 text-center leading-snug">
        {blog.title}
      </h1>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full h-auto mb-6 rounded-xl overflow-hidden shadow-lg border border-white/10">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            className="object-cover w-full h-full"
            width={800}
            height={400}
          />
        </div>
      )}

      {/* About & Author Info */}
        <p className="text-gray-300 italic text-lg my-4 border-l-4 py-2 border-gray-500 pl-4">&quot;{blog["about"]}&quot;</p>
        <div className="flex flex-wrap justify-between text-sm text-gray-400">
          <p className="flex-shrink-0 mb-4">
            By <span className="font-medium text-pink-400 italic">{blog.author}</span>
          </p>
          <p>
            {blog.createdAt && blog.createdAt.toDate().toLocaleDateString()}
          </p>
        </div>

      {/* Blog Content */}
      <article
        className="prose prose-invert text-base md:text-lg max-w-none prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </section>
  );
};

export default BlogDetails;
