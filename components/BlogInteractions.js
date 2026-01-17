"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Heart, MessageSquare, Send, Trash2, User, Sparkles, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";

export default function BlogInteractions({ blogId, blogSlug }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    // Listen for likes
    const likesQuery = query(collection(db, "likes"), where("blogId", "==", blogId));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      const likesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLikes(likesData);
      if (user) {
        setIsLiked(likesData.some(like => like.userId === user.uid));
      }
    }, (error) => {
      console.error("Likes listener error:", error);
      setLoading(false);
    });

    // Listen for comments
    const commentsQuery = query(
      collection(db, "comments"), 
      where("blogId", "==", blogId)
    );
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commentsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
        return dateB - dateA;
      });
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error("Comments listener error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [blogId, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Sign in to like this post!", {
        icon: '❤️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    try {
      if (isLiked) {
        const q = query(
          collection(db, "likes"), 
          where("blogId", "==", blogId), 
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "likes", document.id));
        });
      } else {
        await addDoc(collection(db, "likes"), {
          blogId,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newComment.trim()) return;

    const toastId = toast.loading("Posting your thought...");

    try {
      await addDoc(collection(db, "comments"), {
        blogId,
        userId: user.uid,
        userName: user.displayName || "Explorer",
        userImage: user.photoURL || null,
        text: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment("");
      toast.success("Comment shared!", { id: toastId });
    } catch (error) {
      toast.error("Could not post comment", { id: toastId });
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      toast.success("Removed successfully");
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="mt-16 space-y-10 max-w-4xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-3 sm:gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold transition-all duration-300 ${
              isLiked 
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
            <span className="text-sm sm:text-base">{likes.length} <span className="hidden xs:inline">Likes</span></span>
          </motion.button>

          <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border border-transparent dark:border-white/5">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="text-sm sm:text-base">{comments.length} <span className="hidden xs:inline">Comments</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
          Join the conversation
        </div>
      </div>

      {/* Comment section */}
      <div className="grid grid-cols-1 gap-8 sm:gap-10">
        {/* Write Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <div className="relative bg-white dark:bg-gray-950 rounded-[2rem] p-5 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 sm:w-2 sm:h-8 bg-purple-600 rounded-full" />
              Write a Comment
            </h3>

            {user ? (
              <form onSubmit={handleComment} className="space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 hidden xs:block">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-purple-500/20">
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="Profile" width={48} height={48} priority className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your technical insights..."
                      className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-white/5 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none min-h-[120px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-500/20 disabled:opacity-50 transition-all font-outfit"
                  >
                    <span>Post Comment</span>
                    <Send size={18} />
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 space-y-4 text-center px-4">
                <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <LogIn className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Sign in to join the discussion</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Connect with others in the community</p>
                </div>
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="w-full px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl border border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                    Login / Signup
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Display List */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Comments</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col sm:flex-row gap-4 p-5 sm:p-6 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-indigo-500/20 transition-all shadow-sm"
                >
                  {/* User Meta (Top on mobile, Left on desktop) */}
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shrink-0">
                      {comment.userImage ? (
                        <Image src={comment.userImage} alt={comment.userName} width={48} height={48} priority={index < 3} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* On Desktop, handle name under image? Usually side is better for comments. Let's keep side for name but improve header. */}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-sm sm:text-[15px] text-gray-900 dark:text-white truncate tracking-tight">
                            {comment.userName}
                          </h4>
                          {(comment.userId === process.env.NEXT_PUBLIC_ADMIN_UID || comment.userName === "Prem Shaw") && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[8px] uppercase font-black border border-indigo-500/20 tracking-[0.1em]">Author</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                          {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : "Just Now"}
                        </span>
                      </div>

                      {user && (user.uid === comment.userId || user.uid === process.env.NEXT_PUBLIC_ADMIN_UID) && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-white/5 rounded-xl transition-all shrink-0"
                          title="Delete Comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base break-words font-medium">
                      {comment.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {comments.length === 0 && !loading && (
            <div className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl">
                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold mb-1">No comments yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Spark the conversation! Be the first to post.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
