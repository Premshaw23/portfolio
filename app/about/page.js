"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 mt-8 py-16 text-gray-900 dark:text-gray-200 bg-white dark:bg-transparent"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-pink-600 dark:text-pink-400">
          About Me
        </h1>

        <div className="space-y-6 text-lg sm:text-xl leading-relaxed">
          <p>
            Hey, I'm{" "}
            <strong className="text-gray-900 dark:text-white">Prem Shaw</strong>{" "}
            — a passionate <strong>MERN Stack Developer</strong> and Computer
            Science student at <strong>IIIT Bhopal</strong>. I build robust
            full-stack applications, blending clean UIs with high-performance
            backends.
          </p>

          <p>
            My current toolbox includes{" "}
            <strong>MongoDB, Express, React, Node.js,</strong> and{" "}
            <strong>Next.js</strong>. I love crafting responsive, accessible,
            and scalable web apps. Styling? Tailwind CSS is my go-to.
          </p>

          <p>
            I’m an active <strong>open-source contributor</strong> (like GSSoC
            Extended 2024 💻), and my contributions earned me badges like{" "}
            <em>Champion</em>, <em>Trailblazer</em>, and <em>Summit Seeker</em>{" "}
            🏅 — proof of my consistency and growth.
          </p>

          <p>
            Outside code, I’m driven by curiosity — exploring AI tools, learning
            from real-world projects, and growing every day. I’ve also sharpened
            my skills through coding competitions on platforms like CodeChef
            (Max rating: 1457, Highest Rank: 141 Div-4).
          </p>

          <p>
            This portfolio is a live reflection of my journey — through
            projects, blogs, and experiments. Whether you're a dev, designer, or
            collaborator — you're welcome here.
          </p>

          <p>
            Check out my{" "}
            <Link
              href="/projects"
              className="text-pink-600 dark:text-pink-400 hover:underline"
            >
              Projects
            </Link>
            , read my{" "}
            <Link
              href="/blogs"
              className="text-pink-600 dark:text-pink-400 hover:underline"
            >
              Blog
            </Link>
            , or{" "}
            <Link
              href="/contact"
              className="text-pink-600 dark:text-pink-400 hover:underline"
            >
              Contact Me
            </Link>{" "}
            to say hello or collab.
          </p>
        </div>

        <div className="mt-10 flex gap-6 text-xl text-gray-900 dark:text-gray-200">
          <Link
            href="https://github.com/Premshaw23"
            target="_blank"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://linkedin.com/in/premshaw2311"
            target="_blank"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </Link>
          <Link
            href="mailto:shawprem217@gmail.com"
            className="hover:text-pink-600 dark:hover:text-pink-400 transition"
            aria-label="Email"
          >
            <FaEnvelope />
          </Link>
        </div>
      </motion.section>
      <Footer />
    </>
  );
}

