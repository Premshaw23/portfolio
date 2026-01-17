"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { Share2, Clock, Calendar, ArrowLeft, ChevronRight, User as UserIcon } from "lucide-react";
import BlogInteractions from "@/components/BlogInteractions";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import remarkGfm from "remark-gfm";

const calculateReadTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function BlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [blog, setBlog] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const { showLoader, hideLoader } = useLoader();

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
          const computedReadTime = metadata.readTime || calculateReadTime(markdownContent);
          setBlog({ ...metadata, id: docSnap.id, readTime: computedReadTime });

          const processed = await unified()
            .use(remarkParse)
            .use(remarkGfm)
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
  }, [slug, router, showLoader, hideLoader]);

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

  if (!blog) return null;

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30 dark:opacity-20 blur-[120px]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
          {/* Breadcrumbs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8"
          >
            <Link href="/blogs" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-500 transition-colors">Blogs</Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 truncate max-w-[200px]">{blog.title}</span>
          </motion.div>

          {/* Title & Author */}
          <div className="space-y-6 text-center md:text-left mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1] text-gray-900 dark:text-white"
            >
              {blog.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-bold text-gray-500/80 uppercase tracking-widest"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                  <UserIcon size={10} />
                </div>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-indigo-500" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-purple-500" />
                <span>{blog.readTime} Min Read</span>
              </div>
            </motion.div>
          </div>

          {/* Large Cinematic Image */}
          {blog.coverImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                className="object-cover transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pb-24 pt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-16">
            
            {/* Left Column: Article Body */}
            <article className="min-w-0">
              <div className="bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                
                {/* Intro Blockquote (About) */}
                {blog.about && (
                  <div className="relative mb-10 last:mb-0">
                    <div className="absolute -left-6 top-1 bottom-1 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <p className="text-lg md:text-xl font-medium italic text-gray-600 dark:text-gray-300 leading-relaxed">
                      &ldquo;{blog.about}&rdquo;
                    </p>
                  </div>
                )}

                {/* Content Render */}
                <div
                  className="prose dark:prose-invert max-w-none 
                    prose-headings:text-gray-900 dark:prose-headings:text-white 
                    prose-headings:font-black prose-headings:tracking-tighter
                    prose-h2:text-xl md:text-2xl prose-h2:mt-12 prose-h2:mb-6
                    prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-[1.8] prose-p:text-sm md:prose-p:text-base
                    prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                    prose-a:text-indigo-500 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-[2rem] prose-img:shadow-2xl
                    prose-pre:bg-[#0d1117] prose-pre:rounded-[1.5rem] prose-pre:border prose-pre:border-white/5
                    prose-pre:p-4 prose-pre:overflow-x-auto selection:bg-indigo-500/30
                    prose-pre:text-[13px] prose-pre:leading-relaxed
                    [&_pre]:scrollbar-hide [&_pre]:!bg-transparent
                    prose-code:text-indigo-500 dark:prose-code:text-indigo-200 prose-code:bg-indigo-500/5 dark:prose-code:bg-white/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                    prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl
                    prose-li:marker:text-indigo-500 prose-li:text-sm md:prose-li:text-base
                    prose-table:w-full prose-table:overflow-x-auto prose-table:block md:prose-table:table
                    prose-table:border-collapse prose-thead:border-b-indigo-500/20
                    prose-th:p-4 prose-th:text-[10px] prose-th:uppercase prose-th:tracking-widest prose-td:p-4 prose-td:text-sm"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Action Footer */}
                <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
                  <button
                    onClick={() => router.push("/blogs")}
                    className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-indigo-500 transition-colors"
                  >
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                    Archive
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 dark:hover:bg-gray-200"
                  >
                    <Share2 size={16} />
                    {copied ? "Link Captured" : "Distribute"}
                  </motion.button>
                </div>
              </div>

              {/* Interaction Panel */}
              <div className="mt-12">
                <BlogInteractions blogId={blog.id} blogSlug={slug} />
              </div>
            </article>

            {/* Right Column: Table of Contents & Sticky Elements */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Structure
                  </h3>
                  <OnThisPage htmlContent={htmlContent} />
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
