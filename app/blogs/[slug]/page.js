"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import matter from "gray-matter";
import { unified } from "unified"; // ✅ CORRECT IMPORT
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
import Footer from "@/components/footer";
import { Share2 } from "lucide-react";

export default function BlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
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
          setBlog(metadata);

          const processed = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSlug)
            .use(rehypeDocument, {
              title: metadata.title || "Blog",
              description: metadata.about || "Blog description here",
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
        router.push("/blogs");
      } finally {
        hideLoader();
      }
    };

    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, router]);

  const handleShare = async () => {
    const shareData = {
      title: blog.title || "Check out this blog!",
      text: "Have a look at this blog post:",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        toast.error("Sharing cancelled or failed");
      }
    } else {
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };


  if (!blog) return <p className="text-center text-indigo-400">Loading...</p>;

  return (
    <>
      <div className="mt-20 mb-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Blog Content */}
          <div className="flex-1 bg-gray-200 dark:bg-gray-900 p-6 rounded-xl shadow-gray-400 dark:shadow-gray-600 shadow-xl transition-colors">
            {blog.coverImage && (
              <div className="w-full h-64 md:h-96 mb-8 overflow-hidden rounded-lg border border-black/10 dark:border-white/10 shadow-md">
                <Image
                  src={blog.coverImage}
                  alt={blog.title || "Blog Cover"}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-400 leading-tight">
              {blog.title}
            </h1>

            {blog.about && (
              <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 dark:text-gray-300 text-lg mb-8">
                &ldquo;{blog.about}&rdquo;
              </blockquote>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-600 dark:text-gray-400 text-sm mb-8">
              <p className="italic">
                By{" "}
                <span className="font-semibold text-pink-600 dark:text-pink-400">
                  {blog.author}
                </span>
              </p>
              <p>{blog.date}</p>
            </div>

            <article
              className="prose max-w-none dark:prose-invert prose-p:leading-relaxed dark:prose-pre:bg-transparent dark:prose-code:text-white dark:prose-code:bg-transparent dark:prose-a:text-blue-400 dark:prose-headings:text-white dark:prose-blockquote:border-l-indigo-500 dark:prose-strong:text-white dark:prose-li:marker:text-indigo-400"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
              <button
                onClick={() => router.push("/blogs")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Blogs
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Share2 size={18} />
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>

          {/* Right Column - TOC */}
          <aside className="hidden lg:block w-80 sticky top-32 self-start">
            <OnThisPage htmlContent={htmlContent} />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}  