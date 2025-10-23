"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Footer from "@/components/footer";
import { Award, Code2, Heart, Rocket, Sparkles, Trophy } from "lucide-react";

export default function AboutPage() {
  const achievements = [
    { icon: Trophy, text: "GSSoC Extended 2024 Contributor" },
    { icon: Award, text: "Champion, Trailblazer & Summit Seeker Badges" },
    { icon: Code2, text: "CodeChef Max Rating: 1600+" },
    { icon: Rocket, text: "Open Source Enthusiast" },
  ];

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 dark:from-slate-950 dark:via-pink-950 dark:to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-6xl mx-auto px-6 py-20"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                Get to Know Me
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About Me
              </span>
            </h1>
          </div>

          {/* Main Content Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
              {/* Bio Section */}
              <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Hey, I&apos;m{" "}
                  <strong className="text-pink-600 dark:text-pink-400">
                    Prem Shaw
                  </strong>{" "}
                  — a passionate{" "}
                  <strong className="text-gray-900 dark:text-white">
                    MERN Stack Developer
                  </strong>{" "}
                  and Computer Science student at{" "}
                  <strong className="text-gray-900 dark:text-white">
                    IIIT Bhopal
                  </strong>
                  . I build robust full-stack applications, blending clean UIs
                  with high-performance backends.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  My current toolbox includes{" "}
                  <strong className="text-pink-600 dark:text-pink-400">
                    MongoDB, Express, React, Node.js,
                  </strong>{" "}
                  and{" "}
                  <strong className="text-pink-600 dark:text-pink-400">
                    Next.js
                  </strong>
                  . I love crafting responsive, accessible, and scalable web
                  apps. Styling? Tailwind CSS is my go-to.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  I&apos;m an active{" "}
                  <strong className="text-gray-900 dark:text-white">
                    open-source contributor
                  </strong>{" "}
                  (like GSSoC Extended 2024 💻), and my contributions earned me
                  badges like{" "}
                  <em className="text-pink-600 dark:text-pink-400">Champion</em>
                  ,{" "}
                  <em className="text-pink-600 dark:text-pink-400">
                    Trailblazer
                  </em>
                  , and{" "}
                  <em className="text-pink-600 dark:text-pink-400">
                    Summit Seeker
                  </em>{" "}
                  🏅 — proof of my consistency and growth.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Outside code, I&apos;m driven by curiosity — exploring AI
                  tools, learning from real-world projects, and growing every
                  day. I&apos;ve also sharpened my skills through coding
                  competitions on platforms like CodeChef (Max rating: 1600+,
                  Highest Rank: 141 Div-4).
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  This portfolio is a live reflection of my journey — through
                  projects, blogs, and experiments. Whether you&apos;re a dev,
                  designer, or collaborator — you&apos;re welcome here.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Check out my{" "}
                  <Link
                    href="/projects"
                    className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
                  >
                    Projects
                  </Link>
                  , read my{" "}
                  <Link
                    href="/blogs"
                    className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
                  >
                    Blog
                  </Link>
                  , or{" "}
                  <Link
                    href="/contact"
                    className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
                  >
                    Contact Me
                  </Link>{" "}
                  to say hello or collab.
                </motion.p>
              </div>

              {/* Achievements Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  Achievements
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl border border-pink-200 dark:border-pink-800/30 hover:border-pink-400 dark:hover:border-pink-600 transition-colors"
                    >
                      <div className="w-10 h-10 bg-pink-600 dark:bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="pt-8 border-t border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Let&apos;s Connect
                </h3>
                <div className="flex gap-4">
                  <Link
                    href="https://github.com/Premshaw23"
                    target="_blank"
                    className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500 hover:scale-110 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-xl" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/premshaw2311"
                    target="_blank"
                    className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500 hover:scale-110 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-xl" />
                  </Link>
                  <Link
                    href="mailto:shawprem217@gmail.com"
                    className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500 hover:scale-110 transition-all duration-300"
                    aria-label="Email"
                  >
                    <FaEnvelope className="text-xl" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
}
