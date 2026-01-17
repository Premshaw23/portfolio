"use client";

import React, { useEffect, useState ,useCallback} from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Settings2,
  BookOpen,
  ArrowRight,
  Calendar,
  MessageSquare,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlogsPage() {
  // ----- State -----
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newItemsPerPage, setNewItemsPerPage] = useState(6);

  // ----- Fetch Settings -----
  const fetchItemsPerPage = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "blogs"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setItemsPerPage(data.itemsPerPage || 6);
        setNewItemsPerPage(data.itemsPerPage || 6);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  // ----- Fetch Blogs -----
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const blogsRef = collection(db, "blogs");
      let q;

      if (filter === "all") {
        q = query(blogsRef, orderBy("date", "desc"));
      } else {
        q = query(
          blogsRef,
          where("status", "==", filter),
          orderBy("date", "desc")
        );
      }

      const snapshot = await getDocs(q);
      const blogsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Fetch comment counts
      const commentsSnapshot = await getDocs(collection(db, "comments"));
      const commentsData = commentsSnapshot.docs.map(doc => doc.data());

      // Fetch like counts
      const likesSnapshot = await getDocs(collection(db, "likes"));
      const likesData = likesSnapshot.docs.map(doc => doc.data());
      
      const blogsWithCounts = blogsList.map(blog => ({
        ...blog,
        commentCount: commentsData.filter(c => c.blogId === blog.id).length,
        likeCount: likesData.filter(l => l.blogId === blog.id).length
      }));

      setBlogs(blogsWithCounts);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // ----- Delete Blog -----
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete blog");
    }
    setModalOpen(false);
    setBlogToDelete(null);
  };

  // ----- Effects -----
  useEffect(() => {
    fetchItemsPerPage();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500 py-12 px-6">
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
        title="Delete Publication"
        description="Are you sure you want to permanently remove this blog entry? This action cannot be undone."
      />

      <div className="max-w-[1400px] mx-auto">
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-4">
              <BookOpen size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Journal Management</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900 leading-[1.1]">
              Manage <span className="text-indigo-500">Blogs.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
              {["all", "published", "draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === status
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <Link
              href="/admin/blogs/new"
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={20} />
              Create New Entry
            </Link>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                <Settings2 size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paging Configuration</p>
                <p className="text-sm font-bold dark:text-white">Active Display Limits</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <input
                type="number"
                min={1}
                value={newItemsPerPage}
                onChange={(e) => setNewItemsPerPage(parseInt(e.target.value) || 0)}
                className="w-20 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2.5 font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500"
             />
             <button
                onClick={async () => {
                  try {
                    await setDoc(doc(db, "settings", "blogs"), { itemsPerPage: newItemsPerPage }, { merge: true });
                    toast.success("Pagination updated");
                    setItemsPerPage(newItemsPerPage);
                  } catch (e) { toast.error("Update failed"); }
                }}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
             >
                Apply
             </button>
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-gray-200 dark:bg-white/5 animate-pulse" />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-40 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
             <FileText size={64} className="mx-auto text-gray-200 dark:text-white/5 mb-6" />
             <h3 className="text-2xl font-bold mb-2">No entries found</h3>
             <p className="text-gray-400">Start documenting your technical journey by creating your first blog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-white/10 ${
                    blog.status === "published" 
                    ? "bg-green-500/80 text-white" 
                    : "bg-amber-500/80 text-white"
                  }`}>
                    {blog.status === "published" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{blog.status}</span>
                  </div>
                </div>

                {/* Media Section */}
                <div className="relative h-56 overflow-hidden">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                       <BookOpen size={48} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-indigo-500" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-500">
                      <MessageSquare size={12} />
                      {blog.commentCount || 0}
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-500">
                      <Heart size={12} fill="currentColor" />
                      {blog.likeCount || 0}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-4 dark:text-white text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-500 transition-colors">
                    {blog.title}
                  </h2>
                  
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 leading-relaxed">
                    {blog.about}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                       <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          setBlogToDelete(blog.id);
                          setModalOpen(true);
                        }}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                      View Live
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
