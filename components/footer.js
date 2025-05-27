import React from "react";
import Link from "next/link";
import { Copy, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bottom-0 left-0 w-full z-[55] bg-blend-color-burn text-gray-300 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left: Name + Copyright */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold">Prem Shaw</p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="flex space-x-6 text-sm">
          <Link href="/" className="hover:text-pink-400">
            Home
          </Link>
          <Link href="/projects" className="hover:text-pink-400">
            Projects
          </Link>
          <Link href="/skills" className="hover:text-pink-400">
            Skills
          </Link>
          <Link href="/about" className="hover:text-pink-400">
            About
          </Link>
          <Link href="/contact" className="hover:text-pink-400">
            Contact
          </Link>
          <Link href="/blog" className="hover:text-pink-400">
            Blog
          </Link>
        </div>

        {/* Right: Socials */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/premshaw23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/premshaw2311"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400"
          >
            <Linkedin size={20} />
          </a>

          <a
            href="mailto:shawprem217@gmail.com"
            className="hover:text-pink-400 text-white"
            aria-label="Send Email"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
