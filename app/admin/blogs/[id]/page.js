"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import CustomMarkdownEditor from "@/components/CustomMarkdownEditor";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import MarkdownWrapper from "@/components/customConvertor";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  Settings, 
  FileText, 
  Sparkles, 
  Calendar, 
  User, 
  Link as LinkIcon,
  ChevronRight,
  Monitor,
  Layout,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(
    "### Write your markdown content here..."
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("draft"); // draft or published

  useEffect(() => {
    if (!id || id === "new") return;

    setLoading(true);
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setAbout(data.about || "");
          setAuthor(data.author || "");
          setDate(data.date || "");
          setCoverImage(data.coverImage || "");
          setSlug(data.slug || "");
          setContent(data.content || "");
          setStatus(data.status || "draft");
        } else {
          toast.error("Blog not found");
          router.push("/admin/blogs");
        }
      } catch (error) {
        toast.error("Failed to load blog");
        router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  useEffect(() => {
    if (id === "new") {
      setSlug(slugify(title));
    }
  }, [title, id]);

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString().split("T")[0];
      let docRef;

      if (id === "new") {
        // Create a new doc with a generated ID
        docRef = doc(collection(db, "blogs"));
      } else {
        docRef = doc(db, "blogs", id);
      }

      if (!content) {
        toast.error("Content is empty!");
        return;
      }
      await setDoc(
        docRef,
        {
          title,
          about,
          author,
          date: date || now,
          coverImage,
          slug,
          content,
          status, // save draft or published
          updatedAt: serverTimestamp(),
          ...(id === "new" ? { createdAt: serverTimestamp() } : {}),
        },
        { merge: true }
      );

      if (id === "new") {
        toast.success("Blog created successfully");
        router.push("/admin/blogs");
      } else {
        toast.success("Blog updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save blog");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-500 pb-20">
      {/* Top Header Workspace */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 md:px-8 py-3">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => router.push("/admin/blogs")}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-indigo-500 transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </motion.button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <FileText size={18} />
              </div>
              <div className="truncate">
                <h1 className="text-lg font-black tracking-tight leading-none flex items-center gap-2 truncate">
                  {id === "new" ? "New Entry" : "Edit Post"}
                  <ChevronRight size={14} className="text-gray-400 shrink-0" />
                  <span className="text-indigo-600 truncate">{title || "Untitled"}</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                showPreview 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {showPreview ? <Layout size={16} /> : <Eye size={16} />}
              <span className="hidden sm:inline">{showPreview ? "Editor" : "Preview"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? "..." : "Save"}</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto p-4 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Configuration (lg:w-1/4) */}
          <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6">
            <section className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <Settings size={14} />
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Post Configuration</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Slug (URL)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold appearance-none cursor-pointer"
                  >
                    <option value="draft">Draft Mode</option>
                    <option value="published">Live Publication</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden">
              <CloudinaryUpload
                label="Cover Image"
                description="Upload entry thumbnail"
                currentImage={coverImage}
                onUploadSuccess={(url) => setCoverImage(url)}
              />
            </section>

            <section className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Layers size={14} />
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Excerpt</h3>
              </div>
               <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="A brief summary..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium resize-none leading-relaxed"
              />
            </section>
          </aside>

          {/* Right Panel: Content (lg:w-3/4) */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden min-h-[750px] flex flex-col">
              <AnimatePresence mode="wait">
                {showPreview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live View Preview</span>
                      </div>
                      <Monitor size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                      <div className="max-w-3xl mx-auto">
                        {coverImage && (
                          <div className="relative aspect-[21/9] w-full mb-10 rounded-xl overflow-hidden shadow-2xl">
                            <Image src={coverImage} alt="Cover" fill priority className="object-cover" />
                          </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">{title || "Journal Title"}</h1>
                        <MarkdownWrapper content={content} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1 p-2 md:p-4">
                      <CustomMarkdownEditor content={content} setContent={setContent} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
