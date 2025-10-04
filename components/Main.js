"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Orb from "./Orb";
import Link from "next/link";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mx-5 sm:mx-20 mt-28 mb-10 flex flex-col md:flex-row items-center justify-between gap-10"
    >
      {/* LEFT SECTION */}
      <div className="flex-1 text-center md:text-left space-y-6">
        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold leading-tight 
                       text-gray-900 dark:text-white"
        >
          Hey, I&apos;m{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 
                           bg-clip-text text-transparent"
          >
            Prem Shaw
          </span>
        </h1>

        <h2
          className="text-2xl sm:text-3xl font-semibold mt-2 min-h-[3.5rem] font-mono antialiased
                       text-gray-700 dark:text-fuchsia-400"
        >
          <Typewriter
            options={{
              strings: [
                "MERN Stack Developer",
                "Next.js Developer",
                "Firebase Enthusiast",
                "Open Source Contributor",
                "AI & C++ Explorer",
                "CodeChef 2★ Competitive Programmer",
              ],
              autoStart: true,
              loop: true,
              pauseFor: 1300,
            }}
          />
        </h2>

        <p
          className="text-sm sm:text-base max-w-2xl leading-7 mt-4
                      text-gray-700 dark:text-gray-300"
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
          , with a strong focus on crafting responsive UIs, architecting robust
          APIs, and solving real-world problems through code.
          <br /> <br />
          As an{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            open-source contributor
          </span>{" "}
          and a{" "}
          <span className="text-pink-600 dark:text-pink-400 font-semibold">
            2★ CodeChef coder
          </span>{" "}
          with a peak rating of 1574, I’m always
          striving to level up my skills through challenging projects, coding
          contests, and hands-on exploration of AI tools.
        </p>

        <button
          type="button"
          className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600
                     text-white font-semibold hover:scale-105 transition-transform"
        >
          <Link href="/contact">Let’s Build Together →</Link>
        </button>

        {/* SOCIAL ICONS */}
        <div
          className="flex justify-center md:justify-start space-x-6 text-2xl 
                        text-gray-600 dark:text-gray-400 mt-4"
        >
          <a
            href="https://github.com/premshaw23"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-900 dark:hover:text-white transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/premshaw2311"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/premshaw23"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition"
          >
            <FaTwitter />
          </a>
        </div>

        {/* RESUME BUTTON */}
        <a
          href="/Prem_Shaw_Resume.pdf"
          download="Prem_Shaw_Resume.pdf"
          className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-700 to-fuchsia-600
                     text-white text-lg font-semibold rounded-full hover:scale-105 transition transform
                     shadow-md shadow-fuchsia-600/40 mt-1"
        >
          Download Resume
        </a>
      </div>

      {/* RIGHT SECTION – CIRCULAR IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="relative w-[400px] h-[400px] sm:w-[550px] sm:h-[530px] flex-shrink-0"
      >
        {/* Orb background */}
        <div className="absolute inset-0 z-10 shadow-[0_0_40px_rgba(137,97,255,0.25)]">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={270} />
        </div>

        {/* Circular Image */}
        <div
          className="relative z-20 sm:w-[65%] sm:h-[65%] w-[65%] h-[65%] rounded-full overflow-hidden
                        shadow-2xl mx-[4.5rem] my-[4.5rem] md:mx-[6rem] md:my-[6rem]
                        ring-2 ring-fuchsia-600/20"
        >
          <Image
            src="/prem.jpg"
            alt="Prem Shaw"
            placeholder="blur"
            blurDataURL="/prem.jpg"
            priority
            width={300}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
