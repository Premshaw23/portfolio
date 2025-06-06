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
    <aside
      className="hidden lg:block sticky top-28 max-h-[80vh] overflow-y-auto ml-6 w-60 text-sm 
      text-gray-700 dark:text-gray-300 
      bg-gray-100/40 dark:bg-gray-800/40 
      border border-black/10 dark:border-white/10 
      rounded-lg p-4 shadow-md transition-colors duration-300"
    >
      <h2
        className="font-semibold text-xl 
        text-indigo-600 dark:text-indigo-400 
        mb-3 border-b border-indigo-500 pb-1"
      >
        On This Page
      </h2>

      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className="block truncate 
                hover:text-indigo-600 dark:hover:text-indigo-400 
                transition-colors duration-200"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default OnThisPage;