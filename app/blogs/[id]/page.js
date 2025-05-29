"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

  return (
    <section className="px-10 py-16 mt-10 text-white min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-indigo-400 mb-8">{blog.title}</h1>
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full rounded-lg mb-8"
        />
      )}
      <article className="prose prose-invert text-lg">
        {blog.content.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
    </section>
  );
};

export default BlogDetails;
