"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import OnThisPage from "@/components/onthispage";
import { useLoader } from "@/context/LoaderContext";

export default function BlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (!slug) return;
    showLoader();

    const fetchBlog = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const { content, ...metadata } = docData;

          const { content: markdownContent } = matter(content);
          const frontmatter = metadata;
          setBlog(frontmatter);

          const processed = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSlug)
            .use(rehypeDocument, {
              title: frontmatter.title || "Blog",
              description: blog?.about || "Blog description here",
            })
            .use(rehypeAutolinkHeadings)
            .use(rehypePrettyCode, {
              theme: "github-dark",
              transformers: [
                transformerCopyButton({
                  visibility: "always",
                  feedbackDuration: 3000,
                }),
              ],
            })
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(markdownContent);

          setHtmlContent(processed.toString());
        } else {
          router.push("/blogs");
        }
      } catch (error) {
        // console.error("Failed to fetch blog:", error);
        router.push("/blogs");
      } finally {
        hideLoader();
      }
    };

    fetchBlog();
  }, [slug, router]);

  if (!blog) return <p className="text-center text-indigo-400">Loading...</p>;

  return (
    <div className="mt-20 mb-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Blog Content */}
        <div className="flex-1 bg-gray-900 p-6 rounded-xl shadow-gray-600 shadow-xl">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="w-full h-64 md:h-96 mb-8 overflow-hidden rounded-lg border border-white/10 shadow-md">
              <img
                src={blog.coverImage}
                alt={blog.title || "Blog Cover"}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {/* Blog Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-400 leading-tight">
            {blog.title}
          </h1>

          {/* Description */}
          {blog.about && (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-300 text-lg mb-8">
              &ldquo;{blog.about}&rdquo;
            </blockquote>
          )}

          {/* Author & Date */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-400 text-sm mb-8">
            <p className="italic">
              By{" "}
              <span className="font-semibold text-pink-400">{blog.author}</span>
            </p>
            <p>{blog.date}</p>
          </div>

          {/* Blog Content */}
          <article
            className="prose prose-invert prose-a:text-blue-400 max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Optional: Back Button */}
          <button
            onClick={() => router.push("/blogs")}
            className="mt-8 text-sm text-blue-400 hover:underline"
          >
            ← Back to Blogs
          </button>
        </div>

        {/* Right Column - TOC */}
        <aside className="hidden lg:block w-80 sticky top-32 self-start">
          <OnThisPage htmlContent={htmlContent} />
        </aside>
      </div>
    </div>
  );
}
