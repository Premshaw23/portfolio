"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto px-6 py-12 mt-10 text-gray-800 dark:text-gray-200"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-600 dark:text-pink-400">
        About Me
      </h1>

      <p className="text-lg sm:text-xl mb-6 leading-relaxed">
        Hello! I'm <span className="font-semibold">Prem Shaw</span>, a dedicated
        MERN-Stack Developer and a Computer Science Engineering student at{" "}
        <span className="font-semibold">IIIT Bhopal</span>. My passion lies in
        developing scalable and engaging web applications with clean UI and
        intuitive UX.
      </p>

      <p className="text-lg sm:text-xl mb-6 leading-relaxed">
        I specialize in <strong>MongoDB, Express, React, and Node.js</strong>,
        building full-stack applications that are both robust and responsive.
        I'm also proficient with tools like <strong>Tailwind CSS</strong> and{" "}
        <strong>Next.js</strong> to create polished user interfaces and
        efficient workflows.
      </p>

      <p className="text-lg sm:text-xl mb-6 leading-relaxed">
        As an active open-source contributor (notably through{" "}
        <strong>GSSoC Extended 2024</strong> 🌟), I’ve developed practical
        problem-solving skills and gained valuable experience collaborating with
        global communities. My efforts have been recognized with badges like{" "}
        <em>Champion</em>, <em>Trailblazer</em>, and <em>Summit Seeker</em>,
        symbolizing my commitment and growth.
      </p>

      <p className="text-lg sm:text-xl mb-6 leading-relaxed">
        I care deeply about code quality, performance, accessibility, and user
        satisfaction. I'm constantly learning, iterating, and striving to build
        solutions that create real impact.
      </p>

      <p className="text-lg sm:text-xl mb-6 leading-relaxed">
        This portfolio showcases my journey — from projects and blogs to
        experiments and thoughts. It serves as a space to reflect my technical
        evolution and personal development.
      </p>

      <p className="text-lg sm:text-xl leading-relaxed">
        Explore my{" "}
        <Link href="/projects" className="text-pink-500 hover:underline">
          Projects
        </Link>
        , check out my{" "}
        <Link href="/blog" className="text-pink-500 hover:underline">
          Blog
        </Link>
        , or{" "}
        <Link href="/contact" className="text-pink-500 hover:underline">
          Connect with Me
        </Link>{" "}
        to collaborate or just say hello!
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="https://github.com/premshaw23"
          target="_blank"
          className="text-blue-600 hover:text-pink-500 transition"
        >
          GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/premshaw2311"
          target="_blank"
          className="text-blue-600 hover:text-pink-500 transition"
        >
          LinkedIn
        </Link>
        <Link
          href="mailto:shawprem217@gmail.com"
          className="text-blue-600 hover:text-pink-500 transition"
        >
          Email Me
        </Link>
      </div>
    </motion.section>
  );
}
