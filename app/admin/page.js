"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, 
  FolderKanban, 
  CodeIcon, 
  MessageSquare, 
  ArrowUpRight,
  TrendingUp,
  Layout,
  Users,
  Terminal,
  ChevronRight,
  Heart
} from "lucide-react";
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState([
    { label: "Total Blogs", value: 0, icon: <FileText className="text-blue-500" />, href: "/admin/blogs", color: "blue" },
    { label: "Projects", value: 0, icon: <FolderKanban className="text-purple-500" />, href: "/admin/projects", color: "purple" },
    { label: "Total Skills", value: 0, icon: <CodeIcon className="text-emerald-500" />, href: "/admin/skills", color: "emerald" },
    { label: "Community", value: 0, icon: <MessageSquare className="text-orange-500" />, href: "/admin/comments", color: "orange" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, projects, skills, comments, likes] = await Promise.all([
          getDocs(collection(db, "blogs")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "comments")),
          getDocs(collection(db, "likes"))
        ]);

        setStats([
          { label: "Total Blogs", value: blogs.size, icon: <FileText />, href: "/admin/blogs" },
          { label: "Projects", value: projects.size, icon: <FolderKanban />, href: "/admin/projects" },
          { label: "Comments", value: comments.size, icon: <MessageSquare />, href: "/admin/comments" },
          { label: "Total Likes", value: likes.size, icon: <Heart className="text-rose-500" />, href: "/admin/comments" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-transparent">
      {/* Welcome Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="relative w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-indigo-500/20 shadow-2xl">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt="Profile" fill priority sizes="80px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white">
                  <span className="text-2xl font-black">Admin</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 border-4 border-white dark:border-[#0f172a] shadow-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">System Administrator</span>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user?.email}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white">
              Welcome Back, <span className="text-indigo-500 italic">{user?.displayName?.split(' ')[0] || "Chief"}</span>.
            </h1>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={stat.href}
              className="group block relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-indigo-500 group-hover:scale-110 transition-transform duration-500`}>
                  {stat.icon}
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black dark:text-white">
                    {loading ? "..." : stat.value}
                  </h3>
                  <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                    <TrendingUp size={10} />
                    Active
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0f172a]/40 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm h-full">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <Terminal size={20} className="text-indigo-500" />
                 <h2 className="text-xl font-bold dark:text-white">Recent Activity <span className="text-gray-400 font-medium text-sm">/ Overview</span></h2>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-500 transition-colors">View Logs</button>
             </div>
             
             <div className="space-y-4">
                {[
                  { label: "Publication Engine", desc: "Write a new research journal or technical blog.", icon: <FileText />, href: "/admin/blogs/new" },
                  { label: "Portfolio Analytics", desc: "Update your latest innovations and codebase.", icon: <FolderKanban />, href: "/admin/projects" },
                  { label: "Moderation Hub", desc: "Review and moderate community conversations.", icon: <MessageSquare />, href: "/admin/comments" },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="group flex items-center justify-between p-4 rounded-xl hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-indigo-500">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold dark:text-white">{item.label}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
             </div>
          </div>
        </section>

        <section>
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white h-full relative overflow-hidden shadow-xl shadow-indigo-600/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <Layout size={24} />
              </div>
              <h3 className="text-2xl font-black mb-4 leading-tight">Build your<br />Digital Legacy.</h3>
              <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed opacity-80">
                Your portfolio is a reflection of your growth. Continue pushing code and documenting your journey.
              </p>
              <Link 
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Launch Post
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
