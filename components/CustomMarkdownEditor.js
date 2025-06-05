"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const customCodeBlockCommand = {
  name: "codeBlockC",
  keyCommand: "Ctrl-Shift-c",
  buttonProps: { "aria-label": "Insert C code block" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2Zm-3.9 13.5a5 5 0 110-9 1 1 0 010 2 3 3 0 100 5 1 1 0 010 2Z"
      />
    </svg>
  ),
  execute: (state, api) => {
    const selected = state.selectedText || "your code here";
    const insert = `\`\`\`c\n${selected}\n\`\`\``;
    api.replaceSelection(insert);
  },
};

const textHighlightCommand = {
  name: "textHighlight",
  keyCommand: "Ctrl-Shift-h",
  buttonProps: { "aria-label": "Highlight text with /slashes/" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h7v2H4v-2z"
      />
    </svg>
  ),
  execute: (state, api) => {
    const selected = state.selectedText || "text";
    const insert = ` /${selected}/`;
    api.replaceSelection(insert);
  },
};

const lineHighlightCommand = {
  name: "lineHighlight",
  keyCommand: "Ctrl-Shift-l",
  buttonProps: { "aria-label": "Insert line-highlight block" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M3 6h18v2H3V6Zm0 4h18v2H3v-2Zm0 4h10v2H3v-2Z"
      />
    </svg>
  ),
  execute: (state, api) => {
    const selected = state.selectedText || "";
    const insert = `{1-3}${selected}`;
    api.replaceSelection(insert);
  },
};

const showLineNumbersCommand = {
  name: "showLineNumbers",
  keyCommand: "Ctrl-Shift-n",
  buttonProps: { "aria-label": "Insert code block with line numbers" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M4 4h2v16H4V4Zm4 0h12v2H8V4Zm0 5h12v2H8V9Zm0 5h12v2H8v-2Zm0 5h12v2H8v-2Z"
      />
    </svg>
  ),
  execute: (state, api) => {
    const selected = state.selectedText || "your code here";
    const insert = `showLineNumbers`;
    api.replaceSelection(insert);
  },
};

export default function CustomMarkdownEditor({ content, setContent }) {
  return (
    <div className="max-w-6xl mx-auto p-4 mt-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <MDEditor
        value={content}
        onChange={(v) => setContent(v || "")}
        textareaProps={{ placeholder: "Please enter markdown content" }}
        commands={[
          // Keep only default commands here (or a minimal set)
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.title,
          commands.divider,
          commands.link, // your custom command added here
          commands.quote,
          commands.code,
          commands.codeBlock,
          commands.divider,
          customCodeBlockCommand,
          showLineNumbersCommand,
          lineHighlightCommand,
          textHighlightCommand,
          commands.divider,
          commands.comment,
          commands.image,
          commands.table,
          commands.divider,
          commands.checkedListCommand,
          commands.orderedListCommand,
          commands.unorderedListCommand,
          commands.divider,
          commands.help,
        ]}
        height={500}
      />
    </div>
  );
}
