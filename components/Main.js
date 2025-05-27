import Image from "next/image";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Orb from "./Orb";

export default function HeroSection() {
  return (
    <div className="mx-5 sm:mx-24 mt-30 mb-10 flex flex-col md:flex-row items-center justify-between gap-10 animate-fade-in">
      {/* LEFT SECTION */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight">
          Hi, I'm <span className="text-pink-500">Prem Shaw</span>
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold text-pink-400 mt-4">
          <p className="m-1">MERN Stack Developer,</p>
          <p className="m-1">CSE Student at IIIT Bhopal</p>
        </h2>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed mt-6">
          I'm passionate about crafting beautiful and responsive user interfaces
          using technologies like{" "}
          <span className="text-cyan-400 font-medium">ReactJs</span>,{" "}
          <span className="text-cyan-400 font-medium">NextJs</span> ,{" "}
          <span className="text-cyan-400 font-medium">MongoDb </span>and{" "}
          <span className="text-cyan-400 font-medium">Tailwind CSS</span>. With
          a strong foundation in web development and a growing interest in
          scalable systems, I aim to build products that not only work great but
          feel great to use.
          <br />
          <br />
          I'm also actively contributing to{" "}
          <span className="text-green-400 font-medium">open-source </span>
          and constantly exploring new tools and frameworks to level up my
          skills.
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
          className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-full hover:bg-blue-700 transition"
        >
          Download Resume
        </a>
      </div>
      {/* RIGHT SECTION – CIRCULAR IMAGE */}
      <div className="relative w-[400px] h-[400px] sm:w-[550px] sm:h-[530px] flex-shrink-0">
        {/* Orb background */}
        <div className="absolute inset-0 -z-10">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        {/* Circular Image */}
        <div className="relative z-10 sm:w-[70%] sm:h-[70%] w-[67%] h-[67%] rounded-full inset-0 overflow-hidden shadow-xl mx-[4rem] my-[4rem] md:mx-[5rem] md:my-[5rem]">
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
      </div>
    </div>
  );
}
