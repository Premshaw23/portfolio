// Loader.js
"use client";
import React from "react";
import { useLoader } from "@/context/LoaderContext";

const Loader = () => {
  const { loading } = useLoader();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-700 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex gap-3">
        <div className="w-4 h-4 bg-[#d991c2] rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-4 h-4 bg-[#9869b8] rounded-full animate-bounce [animation-delay:200ms]" />
        <div className="w-4 h-4 bg-[#6756cc] rounded-full animate-bounce [animation-delay:400ms]" />
      </div>
    </div>
  );
};

export default Loader;
