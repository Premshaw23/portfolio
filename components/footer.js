"use client";

import React from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer
      className="
        relative 
        bg-white dark:bg-slate-950
        text-gray-700 
        dark:text-gray-300 
        border-t border-gray-200 
        dark:border-white/5
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Branding */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Prem Shaw
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Full-stack Developer & Next.js Specialist. Crafting high-performance web experiences with speed and precision.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Prem Shaw. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm">
            {["/", "/about", "/projects", "/skills", "/blogs", "/contact"].map((path) => (
              <li key={path}>
                <Link
                  href={path}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {path === "/"
                    ? "Home"
                    : path.replace("/", "").charAt(0).toUpperCase() +
                      path.slice(2)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Professional */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/blogs" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Technical Blog
              </Link>
            </li>
            <li>
              <a href="https://github.com/premshaw23" target="_blank" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Open Source
              </a>
            </li>
            <li>
              <a href="mailto:shawprem217@gmail.com" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Freelance Inquiries
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Connect
          </h3>
          <div className="flex space-x-3 justify-center md:justify-start">
            {[
              {
                href: "https://github.com/premshaw23",
                icon: <Github size={18} />,
                label: "GitHub",
                color: "hover:bg-gray-800",
              },
              {
                href: "https://linkedin.com/in/premshaw2311",
                icon: <Linkedin size={18} />,
                label: "LinkedIn",
                color: "hover:bg-blue-600",
              },
              {
                href: "https://x.com/premshaw23",
                icon: <Twitter size={18} />,
                label: "Twitter",
                color: "hover:bg-sky-500",
              },
              {
                href: "https://www.instagram.com/its__prem__174/",
                icon: <Instagram size={18} />,
                label: "Instagram",
                color: "hover:bg-pink-600",
              },
              {
                href: "mailto:shawprem217@gmail.com",
                icon: <Mail size={18} />,
                label: "Email",
                color: "hover:bg-purple-600",
              },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                whileHover={{ y: -4 }}
                className={`
                  p-2 rounded-lg bg-gray-100 dark:bg-white/5 
                  text-gray-600 dark:text-gray-400 
                  ${item.color} hover:text-white
                  transition-all duration-300
                `}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
