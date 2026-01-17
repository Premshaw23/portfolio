"use client";

import React, { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import { transformerCopyButton } from "@rehype-pretty/transformers";

export default function MarkdownWrapper({ content }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      async function convert() {
        try {
          const processed = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSlug)
            .use(rehypeAutolinkHeadings)
            .use(rehypePrettyCode, {
              theme: "github-dark",
              transformers: [
                transformerCopyButton({
                  visibility: "always",
                  feedbackDuration: 3000,
                }),
              ],
            })
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(content);

          setHtml(processed.toString());
        } catch (error) {
          console.error("Markdown conversion error:", error);
        }
      }
      convert();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div
      className="prose max-w-none bg-slate-500 p-8 mt-10 rounded-lg text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
