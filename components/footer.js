"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="
        relative 
        bg-gradient-to-r 
        from-gray-100 via-gray-50 to-indigo-100 
        dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 
        text-gray-700 
        dark:text-gray-300 
        border-t border-gray-300 
        dark:border-gray-700 
        shadow-inner
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Branding */}
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prem Shaw
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Full-stack Developer & Designer
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Prem Shaw. Built with Next.js &
            passion.
          </p>
        </div>

        {/* Main Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Main
          </h3>
          <ul className="space-y-2 text-sm">
            {["/", "/about", "/contact", "/skills"].map((path, index) => (
              <li key={index}>
                <Link
                  href={path}
                  className="
                    hover:text-pink-600 dark:hover:text-pink-400 
                    transition duration-200 
                    focus:outline-none 
                    focus:text-pink-600 dark:focus:text-pink-400
                  "
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

        {/* Learn Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Learn
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/blogs"
                className="
                  hover:text-pink-600 dark:hover:text-pink-400 
                  transition duration-200 
                  focus:outline-none 
                  focus:text-pink-600 dark:focus:text-pink-400
                "
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="
                  hover:text-pink-600 dark:hover:text-pink-400 
                  transition duration-200 
                  focus:outline-none 
                  focus:text-pink-600 dark:focus:text-pink-400
                "
              >
                Projects
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Connect
          </h3>
          <div className="flex space-x-4">
            {[
              {
                href: "https://github.com/premshaw23",
                icon: <Github size={20} />,
                label: "GitHub",
              },
              {
                href: "https://linkedin.com/in/premshaw2311",
                icon: <Linkedin size={20} />,
                label: "LinkedIn",
              },
              {
                href: "https://x.com/premshaw23",
                icon: <Twitter size={20} />,
                label: "Twitter",
              },
              {
                href: "https://www.instagram.com/its__prem__174/",
                icon: <Instagram size={20} />,
                label: "Instagram",
              },
              {
                href: "mailto:shawprem217@gmail.com",
                icon: <Mail size={20} />,
                label: "Email",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="
                  hover:text-pink-600 dark:hover:text-pink-400 
                  transition 
                  focus:outline-none 
                  focus:text-pink-600 dark:focus:text-pink-400
                "
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6 p-3 bg-pink-600 hover:bg-pink-700 
            dark:bg-pink-500 dark:hover:bg-pink-600 
            text-white rounded-full shadow-lg transition-all duration-300 group z-50
          "
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
          <span
            className="
            absolute bottom-full left-0 w-[70px] mb-2 p-0.5 text-xs bg-gray-800 text-white 
            rounded opacity-0 group-hover:opacity-100 transition-opacity
          "
          >
            Back to Top
          </span>
        </button>
      )}
    </footer>
  );
};

export default Footer;
