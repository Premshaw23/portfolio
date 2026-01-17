// app/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
  UserCircle2,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Activity,
  TrendingUp,
  Heart,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [userLikes, setUserLikes] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [blogsMap, setBlogsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) return;

    const fetchUserActivity = async () => {
      setLoading(true);
      try {
        // Fetch User Likes
        const likesQuery = query(
          collection(db, "likes"),
          where("userId", "==", user.uid)
        );
        const likesSnapshot = await getDocs(likesQuery);
        const likesData = likesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch User Comments
        const commentsQuery = query(
          collection(db, "comments"),
          where("userId", "==", user.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort comments client-side to avoid requiring a composite index
        commentsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });

        // Fetch Blog Info for titles mapping
        const blogIds = [...new Set([
          ...likesData.map(l => l.blogId),
          ...commentsData.map(c => c.blogId)
        ])];

        const blogsData = {};
        if (blogIds.length > 0) {
          // Firebase 'in' query supports up to 10 elements. If more, we might need chunks.
          // For a portfolio, 10 is usually enough for recent activity, but let's be safe.
          const blogsRef = collection(db, "blogs");
          const blogsSnapshot = await getDocs(blogsRef); // Small enough to fetch all blogs usually
          blogsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            blogsData[doc.id] = { title: data.title, slug: data.slug };
          });
        }

        setUserLikes(likesData);
        setUserComments(commentsData);
        setBlogsMap(blogsData);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Synchronizing Profile...</p>
        </div>
      </div>
    );
  }

  const joinDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const totalContributions = userLikes.length + userComments.length;

  const activityFeed = [
    ...userLikes.map(l => ({ ...l, type: 'like', icon: <Heart size={14} className="text-rose-500" /> })),
    ...userComments.map(c => ({ ...c, type: 'comment', icon: <MessageSquare size={14} className="text-indigo-500" /> }))
  ].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
    return dateB - dateA;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-4"
              >
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Personal Hub</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white"
              >
                Welcome, <span className="text-indigo-500">{user.displayName?.split(" ")[0] || "Explorer"}</span>.
              </motion.h1>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm"
            >
              <div className="px-6 py-2 text-center border-r border-gray-100 dark:border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Impact</p>
                <p className="text-xl font-black dark:text-white">{totalContributions}</p>
              </div>
              <div className="px-6 py-2 text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Rank</p>
                <p className="text-xl font-black text-indigo-500">Elite</p>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20" />
                    <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-white/10 overflow-hidden shadow-2xl ring-4 ring-indigo-500/10">
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="Profile" fill sizes="128px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white">
                          <UserCircle2 size={64} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black dark:text-white mb-2">{user.displayName || "User"}</h2>
                  <p className="text-gray-500 text-sm font-medium mb-8">{user.email}</p>

                  <div className="grid grid-cols-1 w-full gap-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Joined</span>
                      </div>
                      <span className="text-sm font-bold dark:text-white">{joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        {user.emailVerified ? <CheckCircle2 size={18} className="text-green-500" /> : <XCircle size={18} className="text-orange-500" />}
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Verified</span>
                      </div>
                      <span className={`text-sm font-bold ${user.emailVerified ? 'text-green-500' : 'text-orange-500'}`}>
                        {user.emailVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {!user.emailVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2rem] relative overflow-hidden group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-orange-900 dark:text-orange-400 font-black uppercase tracking-widest text-xs mb-2">Notice</h4>
                      <p className="text-sm text-orange-800 dark:text-orange-300/80 leading-relaxed">
                        Verify your email to unlock premium interaction features and comments.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Activity Feed */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#0f172a]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col min-h-[500px]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-3">
                    <Activity className="text-indigo-500" />
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Your Interactions</h3>
                  </div>

                  <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                    {["all", "likes", "comments"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeTab === tab 
                          ? "bg-white dark:bg-indigo-500 dark:text-white shadow-sm" 
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-3xl animate-pulse" />
                      ))}
                    </div>
                  ) : activityFeed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-6">
                        <TrendingUp size={32} />
                      </div>
                      <h4 className="text-lg font-black dark:text-white mb-2">No activity yet.</h4>
                      <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Explore the blog and interact with posts to see your history here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {activityFeed
                          .filter(a => activeTab === 'all' || (activeTab === 'likes' && a.type === 'like') || (activeTab === 'comments' && a.type === 'comment'))
                          .map((activity, idx) => {
                            const blog = blogsMap[activity.blogId] || { title: "Archived Post", slug: "#" };
                            return (
                              <motion.div
                                key={`${activity.type}-${activity.id}`}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all hover:translate-x-2"
                              >
                                <div className="flex items-start gap-4">
                                  <div className={`mt-1 p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5`}>
                                    {activity.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                        {activity.type === 'like' ? 'Endorsement' : 'Commentary'}
                                      </p>
                                      <span className="text-[10px] font-bold text-gray-400">
                                        {activity.createdAt?.toDate ? activity.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-black dark:text-white truncate mb-1">
                                      {blog.title}
                                    </h4>
                                    {activity.type === 'comment' && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic mb-3">
                                        &quot;{activity.text}&quot;
                                      </p>
                                    )}
                                    <Link 
                                      href={`/blogs/${blog.slug}`}
                                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-500 transition-colors"
                                    >
                                      View Publication <ArrowRight size={12} />
                                    </Link>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}

