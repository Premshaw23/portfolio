"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Download, ArrowRight, Code2, Sparkles } from "lucide-react";

export default function PremiumHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "MERN Stack Developer",
    "Next.js Specialist",
    "Firebase Enthusiast",
    "Open Source Contributor",
    "3★ CodeChef Programmer",
    "AI Explorer",
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x * 2,
          y: -mousePosition.y * 2,
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-purple-700 dark:text-purple-300">
                Available for freelance
              </span>
            </motion.div>

            {/* Main Heading */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Hey, I&apos;m{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Prem Shaw
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-16 flex items-center"
              >
                <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-2xl md:text-3xl font-semibold text-purple-700 dark:text-purple-300">
                  {roles[currentRole]}
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl"
            >
              I&apos;m a{" "}
              <span className="text-green-600 dark:text-green-400 font-semibold">
                Computer Science student at IIIT Bhopal
              </span>{" "}
              with a passion for building performant, scalable, and visually
              appealing web applications. I specialize in the{" "}
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                MERN stack
              </span>{" "}
              and{" "}
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                Next.js
              </span>
              , with a strong focus on crafting responsive UIs, architecting
              robust APIs, and solving real-world problems through code.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/contact">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Let&apos;s Build Together
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <a
                href="https://drive.google.com/file/d/1Atm8oarQdBfpt8p9wab4Ob16JclB9Hah/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-white dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Resume
                </button>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <a
                href="https://github.com/premshaw23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/premshaw2311"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/premshaw23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-300 dark:border-white/10"
            >
              {[
                { label: "Projects", value: "20+" },
                { label: "CodeChef", value: "3★" },
                { label: "Experience", value: "1+ Yrs" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse" />

              {/* Profile Circle */}
              <div className="relative aspect-square rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                <Image
                  src="/prem.jpg"
                  alt="Prem Shaw"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -right-8 px-6 py-3 bg-purple-600 text-white rounded-full shadow-xl font-semibold"
              >
                💻 MERN Stack
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-8 -left-8 px-6 py-3 bg-pink-600 text-white rounded-full shadow-xl font-semibold"
              >
                🚀 Next.js
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-gray-600 dark:bg-white/50 rounded-full" />
        </motion.div>
      </motion.div> */}
    </div>
  );
}
