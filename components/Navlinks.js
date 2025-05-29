"use client";

import Link from "next/link";


export default function NavLinks({ onClick, className = "" }) {
  return (
    <div className={`space-x-6 md:flex ${className}`}>
      <Link href="/" className="hover:text-green-200 ">
        Home
      </Link>
      <Link href="/projects" className="hover:text-green-200 ">
        Projects
      </Link>
      <Link href="/skills" className="hover:text-green-200 ">
        Skills
      </Link>
      <Link href="/about" className="hover:text-green-200 ">
        About
      </Link>
      <Link href="/contact" className="hover:text-green-200 ">
        Contact
      </Link>
      <Link href="/blogs" className="hover:text-green-200">
        Blog
      </Link>
    </div>
  );
}
