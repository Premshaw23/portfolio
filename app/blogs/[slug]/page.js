"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
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
import Footer from "@/components/footer";
import { Share2, Clock, Calendar } from "lucide-react";
import BlogInteractions from "@/components/BlogInteractions";

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
          const docSnap = querySnapshot.docs[0];
          const docData = docSnap.data();
          const { content, ...metadata } = docData;

          const { content: markdownContent } = matter(content);
          setBlog({ ...metadata, id: docSnap.id });

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
          toast.error("Blog not found");
          router.push("/blogs");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
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
      text: blog.about || "Have a look at this blog post:",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Sharing failed");
        }
      }
    } else {
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

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-20 mb-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_15rem] gap-10">
          {/* Main Content */}
          <article className="min-w-0">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="w-full h-64 md:h-96 mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title || "Blog Cover"}
                    width={1200}
                    height={630}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                {blog.title}
              </h1>

              {/* Description */}
              {blog.about && (
                <blockquote className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-6 py-2 italic text-gray-700 dark:text-gray-300 text-lg mb-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-r-lg">
                  &ldquo;{blog.about}&rdquo;
                </blockquote>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {blog.author?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {blog.author}
                  </span>
                </div>

                {blog.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                )}

                {blog.readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert 
                  prose-headings:scroll-mt-24
                  prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-a:text-indigo-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline dark:prose-a:text-indigo-400
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700
                  prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/30 prose-blockquote:py-1 prose-blockquote:rounded-r
                  prose-img:rounded-lg prose-img:shadow-lg
                  prose-hr:border-gray-300 dark:prose-hr:border-gray-700
                  prose-li:marker:text-indigo-500"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Interactions: Likes & Comments */}
              <BlogInteractions blogId={blog.id} blogSlug={slug} />

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-white/10 flex-wrap gap-4">
                <button
                  onClick={() => router.push("/blogs")}
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  Back to Blogs
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Share2 size={16} />
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>
          </article>

          {/* Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <OnThisPage htmlContent={htmlContent} />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
