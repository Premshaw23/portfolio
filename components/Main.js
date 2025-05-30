"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Orb from "./Orb";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mx-5 sm:mx-24 mt-30 mb-10 flex flex-col md:flex-row items-center justify-between gap-10"
    >
      {/* LEFT SECTION */}
      <div className="flex-1 text-center md:text-left space-y-6">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Prem Shaw
          </span>
        </h1>

        {/* Dynamic Roles with Typewriter */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-pink-400 mt-2 h-16">
          <Typewriter
            options={{
              strings: [
                "MERN Stack Developer",
                "Open Source Contributor",
                "Frontend Engineer (aspiring)",
                "Tech Enthusiast",
              ],
              autoStart: true,
              loop: true,
              pauseFor: 1600,
            }}
          />
        </h2>

        {/* Info/Bio Section */}
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed mt-2">
          I'm a{" "}
          <span className="text-green-400 font-medium">
            CSE student at IIIT Bhopal
          </span>{" "}
          with a deep passion for building fast, scalable, and user-focused web
          applications. As a dedicated{" "}
          <span className="text-cyan-400 font-medium">
            MERN Stack Developer
          </span>
          , I specialize in crafting sleek, responsive UIs and intuitive user
          experiences using{" "}
          <span className="text-cyan-400 font-medium">React</span>,{" "}
          <span className="text-cyan-400 font-medium">Next.js</span>,{" "}
          <span className="text-cyan-400 font-medium">MongoDB</span>, and{" "}
          <span className="text-cyan-400 font-medium">Tailwind CSS</span>.
          <br />
          <br />I actively contribute to{" "}
          <span className="text-green-400 font-medium">open-source</span>{" "}
          projects and continuously seek new technologies that help elevate my
          development journey. My goal? To solve real-world problems with code
          that’s clean, creative, and impactful.
        </p>

        {/* SOCIAL ICONS */}
        <div className="flex justify-center md:justify-start space-x-6 text-3xl text-gray-700">
          <a
            href="https://github.com/premshaw23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/premshaw2311"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/premshaw23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
        </div>

        {/* RESUME BUTTON */}
        <a
          href="/Prem_Shaw_Resume.pdf"
          download
          className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-full hover:bg-blue-700 transition shadow-md"
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
        <div className="absolute inset-0 z-55">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            // Remove forceHoverState entirely
          />
        </div>

        {/* Circular Image */}
        <div className="relative z-10 sm:w-[65%] sm:h-[65%] w-[65%] h-[65%] rounded-full inset-0 overflow-hidden shadow-xl mx-[4rem] my-[4rem] md:mx-[6rem] md:my-[6rem]">
          <Image
            src="/prem.jpg"
            alt="Prem Shaw"
            placeholder="blur"
            blurDataURL="/prem.jpg"
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
