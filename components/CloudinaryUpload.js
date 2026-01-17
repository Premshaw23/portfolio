"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";

export default function CloudinaryUpload({ 
  onUploadSuccess, 
  currentImage, 
  label = "Cover Image", 
  description = "Drag & drop or click to upload your showcase" 
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openWidget = () => {
    if (!loaded) return;

    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        theme: "minimal",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium dark:text-gray-300 text-white">
        {label}
      </label>
      
      <div 
        onClick={openWidget}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] overflow-hidden ${
          currentImage 
            ? "border-purple-500/50 bg-purple-500/5" 
            : "border-gray-300 dark:border-white/10 hover:border-purple-500 bg-gray-50/50 dark:bg-white/5"
        }`}
      >
        {currentImage ? (
          <>
            <Image 
              src={currentImage} 
              alt="Preview" 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center text-white">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">Change Image</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon size={32} />
            </div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-1">Upload Image</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
              {description}
            </p>
          </div>
        )}
      </div>

      {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
          ⚠️ Missing Cloudinary ENV Variables
        </p>
      )}
    </div>
  );
}
