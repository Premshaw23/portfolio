"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import NavLinks from "./Navlinks";
import Image from "next/image";
import Button from "./Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/project" },
    { name: "Skills", href: "/skills" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blogs" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-5">
              <div className="relative w-10 h-10">
                {/* Glow Background */}
                <div className="absolute -inset-1 rounded-full bg-purple-500 opacity-40 blur-sm animate-pulse z-0" />

                {/* Logo with border */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-2 ring-white/20 z-10">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    placeholder="blur"
                    blurDataURL="/logo.png"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-2xl text-gray-100 font-bold tracking-wide">
                Portfolio
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavLinks className="hidden md:flex" />

          {/* Right Controls */}
          <div className="flex items-center space-x-4 text-white">
            <button
              onClick={toggleTheme}
              className="p-1 rounded hover:text-pink-400 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-white" />
              ) : (
                <Moon size={20} className="text-white" />
              )}
            </button>
            <Button name="Login" />
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                {isOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
            isOpen ? "max-h-96 py-3" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-pink-400 transition px-2"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
