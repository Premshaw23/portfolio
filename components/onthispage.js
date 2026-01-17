"use client";

import React, { useEffect, useState } from "react";

const OnThisPage = ({ htmlContent }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const h2Elements = tempDiv.querySelectorAll("h2");
    const h2Data = Array.from(h2Elements).map((h2) => ({
      text: h2.textContent,
      id: h2.id,
    }));
    setHeadings(h2Data);
  }, [htmlContent]);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-4">
      {headings.map((heading, index) => (
        <li key={index}>
          <a
            href={`#${heading.id}`}
            className="group flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 group-hover:bg-indigo-500 transition-colors" />
            <span className="truncate">{heading.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default OnThisPage;