// app/not-found.js
"use client";

import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 px-4">
      <div className="bg-gray-900 border border-white/10 p-8 rounded-xl shadow-lg text-center text-white max-w-md">
        <div className="flex justify-center mb-4">
          <ShieldOff size={48} className="text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">
          This route doesn't exist or you don't have access.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
