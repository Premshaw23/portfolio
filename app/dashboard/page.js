// app/dashboard/page.js
"use client";
import { useEffect } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-900/20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
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

  const quickStats = [
    {
      label: "Account Status",
      value: "Active",
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Member Since",
      value: joinDate,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Email Verified",
      value: user.emailVerified ? "Yes" : "No",
      icon: user.emailVerified ? CheckCircle2 : XCircle,
      color: user.emailVerified
        ? "text-green-600 dark:text-green-400"
        : "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <ProtectedRoute>
      <>
        <div className="min-h-[91.5vh] bg-gradient-to-br pt-20 from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-900/20 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.displayName?.split(" ")[0] || "User"}!
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your account today.
              </p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8"
            >
              {/* Gradient Header */}
              <div className="h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Profile Content */}
              <div className="px-6 md:px-8 pb-8 -mt-12">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  {/* Profile Picture */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="relative flex-shrink-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-75"></div>
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="relative rounded-full w-24 h-24 border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="relative">
                        <UserCircle2
                          className="text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                          size={96}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-grow text-center md:text-left md:mt-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {user.displayName || "User"}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                      <Mail size={16} />
                      <p className="text-sm md:text-base">
                        {user?.email ||
                          user?.reloadUserInfo?.providerUserInfo[0]?.email}
                      </p>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {user.emailVerified && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-300 dark:border-green-700"
                    >
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-semibold">Verified</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}
                    >
                      <stat.icon size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Email Verification Notice */}
            {!user.emailVerified && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <XCircle
                    className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-1">
                      Verify Your Email
                    </h3>
                    <p className="text-orange-800 dark:text-orange-300 text-sm">
                      Please check your inbox and verify your email address to
                      unlock all features.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>

              <div className="text-center py-12">
                <Activity
                  className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
                  size={48}
                />
                <p className="text-gray-600 dark:text-gray-400">
                  No recent activity to display
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Your activity will appear here once you start using the
                  platform
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    </ProtectedRoute>
  );
}
