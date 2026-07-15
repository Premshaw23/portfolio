"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Download, ArrowRight, Code2, Server, Zap, Star, Trophy, Cpu, BookOpen } from "lucide-react";

export default function PremiumHeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const [currentRole, setCurrentRole] = useState(0);
  const [mounted, setMounted] = useState(false);

  const roles = [
    "MERN Stack Developer",
    "Next.js Specialist",
    "Firebase Enthusiast",
    "Open Source Contributor",
    "3★ CodeChef Programmer",
    "AI Explorer",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 20 - 10;
      const y = (clientY / window.innerHeight) * 20 - 10;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  const stats = [
    { value: "20+", label: "Projects", icon: <Trophy className="w-4 h-4" />, color: "text-violet-600 dark:text-violet-400" },
    { value: "600+", label: "LeetCode", icon: <BookOpen className="w-4 h-4" />, color: "text-orange-500 dark:text-orange-400" },
    { value: "3★", label: "CodeChef", icon: <Star className="w-4 h-4" />, color: "text-amber-500 dark:text-amber-400" },
    { value: "2+ Yrs", label: "Experience", icon: <Cpu className="w-4 h-4" />, color: "text-fuchsia-600 dark:text-fuchsia-400" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-violet-50/60 to-fuchsia-50/40 dark:from-[#0a0a0f] dark:via-[#0f0a1a] dark:to-[#0a0a0f] overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed0d_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed0d_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#7c3aed18_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/15 dark:bg-violet-500/20 rounded-full blur-3xl"
          style={{ x: springX, y: springY }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/15 dark:bg-fuchsia-500/20 rounded-full blur-3xl"
          style={{ x: springY, y: springX }}
          animate={{ scale: [1.2, 1, 1.2] }}
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
              {/* Availability Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 dark:bg-violet-400/10 border border-violet-400/30 dark:border-violet-500/30 rounded-full backdrop-blur-sm shadow-sm shadow-violet-500/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600 dark:bg-violet-400" />
                </span>
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Available for freelance
                </span>
              </motion.div>

              {/* Main Heading */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
                >
                  Hey, I&apos;m{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
                    Prem Shaw
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="h-16 flex items-center"
                >
                  <Code2 className="w-6 h-6 text-violet-600 dark:text-violet-400 mr-3 flex-shrink-0" />
                  <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    {mounted ? roles[currentRole] : roles[0]}
                  </span>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl"
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
                  <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-violet-500/40 dark:hover:shadow-violet-500/30 transition-all duration-300 hover:scale-[1.03] flex items-center gap-2 relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Let&apos;s Build Together
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>

                <a
                  href="https://drive.google.com/file/d/16W6M5V4hAJ_hh6ye-mZGj4UjRrnalHSr/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-8 py-4 bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
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
                className="flex gap-3"
              >
                {[
                  {
                    href: "https://github.com/premshaw23",
                    icon: <FaGithub className="w-[18px] h-[18px]" />,
                    label: "GitHub",
                    hover: "hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-400",
                  },
                  {
                    href: "https://linkedin.com/in/premshaw2311",
                    icon: <FaLinkedin className="w-[18px] h-[18px]" />,
                    label: "LinkedIn",
                    hover: "hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500",
                  },
                  {
                    href: "https://twitter.com/premshaw23",
                    icon: <FaTwitter className="w-[18px] h-[18px]" />,
                    label: "Twitter",
                    hover: "hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-400 dark:hover:border-sky-500",
                  },
                ].map(({ href, icon, label, hover }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-500 dark:text-gray-400 hover:shadow-lg hover:scale-110 transition-all duration-300 ${hover}`}
                  >
                    {icon}
                  </a>
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
                {/* Ambient Glow */}
                <div className="absolute inset-4 bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 dark:from-violet-600/30 dark:to-fuchsia-600/30 rounded-3xl blur-3xl animate-pulse" />

                {/* Gradient Border Ring */}
                <div className="absolute -inset-[3px] rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 opacity-70 dark:opacity-50 blur-[2px]" />

                {/* Profile Image — Rounded Square */}
                <div className="relative aspect-square rounded-[1.85rem] overflow-hidden border-[3px] border-white/60 dark:border-white/10 shadow-2xl shadow-violet-500/30 dark:shadow-violet-900/50 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 via-transparent to-transparent z-10" />
                  <Image
                    src="/prem.png"
                    alt="Prem Shaw"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Floating Badge — MERN Stack */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-5 -right-5 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-500/30 text-slate-800 dark:text-white rounded-2xl shadow-xl shadow-violet-500/20 dark:shadow-violet-900/40 font-semibold text-sm backdrop-blur-sm"
                >
                  <Server className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-violet-700 dark:text-violet-300">MERN Stack</span>
                </motion.div>

                {/* Floating Badge — Next.js */}
                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-5 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-fuchsia-200 dark:border-fuchsia-500/30 text-slate-800 dark:text-white rounded-2xl shadow-xl shadow-fuchsia-500/20 dark:shadow-fuchsia-900/40 font-semibold text-sm backdrop-blur-sm"
                >
                  <Zap className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
                  <span className="text-fuchsia-700 dark:text-fuchsia-300">Next.js</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Full-Width Stats Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="relative w-full border-t border-b border-slate-200 dark:border-white/8 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl"
      >
        {/* Subtle gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 dark:divide-white/8">
            {stats.map(({ value, label, icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.08 }}
                className="group flex flex-col items-center justify-center gap-3 py-8 px-6 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-300 cursor-default"
              >
                {/* Icon + Value row */}
                <div className="flex items-center gap-2">
                  <span className={`${color} transition-transform duration-300 group-hover:scale-110`}>
                    {icon}
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    {value}
                  </span>
                </div>
                {/* Label */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-[0.15em]">
                    {label}
                  </span>
                  {/* Animated underline on hover */}
                  <span className={`block h-0.5 w-0 group-hover:w-full ${color.replace("text-", "bg-")} transition-all duration-500 rounded-full`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subtle gradient accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />
      </motion.div>
    </div>
  );
}
