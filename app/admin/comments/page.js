"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  MessageSquare, 
  Trash2, 
  User, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter,
  ArrowLeft,
  BookOpen,
  UserCheck2,
  AlertCircle,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";

export default function AdminCommentsPage() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Fetch Blogs
    const fetchBlogs = async () => {
      try {
        const blogsSnapshot = await getDocs(collection(db, "blogs"));
        const blogsData = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs");
      }
    };

    // Listen for Comments across all blogs
    const qComments = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribeComments = onSnapshot(qComments, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    // Listen for Likes across all blogs
    const qLikes = query(collection(db, "likes"));
    const unsubscribeLikes = onSnapshot(qLikes, (snapshot) => {
      const likesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLikes(likesData);
      setLoading(false);
    });

    fetchBlogs();
    return () => {
      unsubscribeComments();
      unsubscribeLikes();
    };
  }, []);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await deleteDoc(doc(db, "comments", commentToDelete));
      toast.success("Comment removed");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setModalOpen(false);
      setCommentToDelete(null);
    }
  };

  // Group comments and likes by blog
  const groupedData = blogs.map(blog => {
    const blogComments = comments.filter(c => c.blogId === blog.id);
    const blogLikes = likes.filter(l => l.blogId === blog.id);
    return {
      ...blog,
      comments: blogComments,
      commentCount: blogComments.length,
      likeCount: blogLikes.length
    };
  }).filter(blog => blog.commentCount > 0 || blog.likeCount > 0 || searchTerm === ""); 

  const filteredBlogs = groupedData.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white pb-20">
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleDeleteComment}
        onCancel={() => setModalOpen(false)}
        title="Delete Comment"
        description="Are you sure you want to remove this comment? This action is permanent."
      />

      <div className="max-w-[1400px] mx-auto pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-4">
              <MessageSquare size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Moderation Suite</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Community <span className="text-indigo-500">Feedback.</span>
            </h1>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by publication title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold placeholder-gray-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-40 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <AlertCircle size={64} className="mx-auto text-gray-200 dark:text-white/5 mb-6" />
            <h3 className="text-2xl font-bold mb-2">No conversations found</h3>
            <p className="text-gray-400">Search for a blog or wait for the community to engage.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group border transition-all duration-500 overflow-hidden ${
                  expandedBlog === blog.id 
                  ? "bg-white dark:bg-white/5 border-indigo-500/50 rounded-[2rem] shadow-2xl" 
                  : "bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl hover:border-indigo-500/30 shadow-sm"
                }`}
              >
                {/* Blog Header Card */}
                <div 
                  onClick={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
                  className="p-6 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                      {blog.coverImage ? (
                        <Image src={blog.coverImage} alt={blog.title} fill sizes="64px" priority={index < 4} className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-black dark:text-white truncate mb-1">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-1.5 text-indigo-500">
                          <MessageSquare size={12} />
                          {blog.commentCount} Comments
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-500">
                          <Heart size={12} fill="currentColor" />
                          {blog.likeCount} Likes
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {blog.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedBlog === blog.id ? 90 : 0 }}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all"
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </div>

                {/* Comments List */}
                <AnimatePresence>
                  {expandedBlog === blog.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 dark:border-white/10"
                    >
                      <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {blog.comments.length === 0 ? (
                          <p className="text-center text-gray-500 py-10 font-bold italic">No comments yet in this discussion.</p>
                        ) : (
                          blog.comments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="relative flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group/comment"
                            >
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                                {comment.userImage ? (
                                  <Image src={comment.userImage} alt={comment.userName} width={40} height={40} className="rounded-xl" />
                                ) : (
                                  <User size={20} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-black dark:text-white">
                                      {comment.userName}
                                    </span>
                                    {comment.userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[8px] font-black uppercase tracking-tighter border border-indigo-500/20">
                                        <UserCheck2 size={8} />
                                        Author
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {comment.createdAt?.toDate?.() ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                                  {comment.text}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  setCommentToDelete(comment.id);
                                  setModalOpen(true);
                                }}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover/comment:opacity-100 transition-all shadow-sm"
                                title="Remove Comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
