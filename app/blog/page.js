import React from "react";
import Link from "next/link";

const dummyBlogs = [
  {
    id: 1,
    title: "Mastering React Hooks in 2025",
    description:
      "An in-depth guide to understanding and using React Hooks effectively.",
    date: "May 20, 2025",
    author: "Prem Shaw",
    tag: "React",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  {
    id: 2,
    title: "Next.js vs. Traditional React: What to Choose?",
    description:
      "Comparison between Next.js and React for full-stack and front-end development.",
    date: "May 10, 2025",
    author: "Prem Shaw",
    tag: "Next.js",
    cover: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
  },
  {
    id: 3,
    title: "Building Scalable MERN Applications",
    description: "Learn how to design and deploy scalable MERN stack projects.",
    date: "April 28, 2025",
    author: "Prem Shaw",
    tag: "MERN",
    cover:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Mastering React Hooks in 2025",
    description:
      "An in-depth guide to understanding and using React Hooks effectively.",
    date: "May 20, 2025",
    author: "Prem Shaw",
    tag: "React",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  {
    id: 5,
    title: "Next.js vs. Traditional React: What to Choose?",
    description:
      "Comparison between Next.js and React for full-stack and front-end development.",
    date: "May 10, 2025",
    author: "Prem Shaw",
    tag: "Next.js",
    cover: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
  },
  {
    id: 6,
    title: "Building Scalable MERN Applications",
    description: "Learn how to design and deploy scalable MERN stack projects.",
    date: "April 28, 2025",
    author: "Prem Shaw",
    tag: "MERN",
    cover:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  },
];

const BlogPage = () => {
  return (
    <section className="min-h-screen bg-gray-900 mt-10 text-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-12">
          Blog Posts
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-600 transition-shadow duration-300"
            >
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-purple-300 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 mb-1">{post.date}</p>
                <p className="text-base mb-4">{post.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">
                    {post.author}
                  </span>
                  <Link
                    href="#"
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
