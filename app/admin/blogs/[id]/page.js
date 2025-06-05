"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CustomMarkdownEditor from "@/components/CustomMarkdownEditor";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import MarkdownWrapper from "@/components/customConvertor";

const MarkdownEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(
    "### Write your markdown content here..."
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("draft"); // draft or published

  useEffect(() => {
    if (!id || id === "new") return;

    setLoading(true);
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setAbout(data.about || "");
          setAuthor(data.author || "");
          setDate(data.date || "");
          setCoverImage(data.coverImage || "");
          setSlug(data.slug || "");
          setContent(data.content || "");
          setStatus(data.status || "draft");
        } else {
          toast.error("Blog not found");
          router.push("/admin/blogs");
        }
      } catch (error) {
        toast.error("Failed to load blog");
        router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  useEffect(() => {
    if (id === "new") {
      setSlug(slugify(title));
    }
  }, [title, id]);

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString().split("T")[0];
      let docRef;

      if (id === "new") {
        // Create a new doc with a generated ID
        docRef = doc(collection(db, "blogs"));
      } else {
        docRef = doc(db, "blogs", id);
      }

      if (!content) {
        toast.error("Content is empty!");
        return;
      }
      await setDoc(
        docRef,
        {
          title,
          about,
          author,
          date: date || now,
          coverImage,
          slug,
          content,
          status, // save draft or published
          updatedAt: serverTimestamp(),
          ...(id === "new" ? { createdAt: serverTimestamp() } : {}),
        },
        { merge: true }
      );

      if (id === "new") {
        toast.success("Blog created successfully");
        router.push("/admin/blogs");
      } else {
        toast.success("Blog updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save blog");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 mt-20 mb-20">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">
        {id === "new" ? "Create New Blog" : "Edit Blog"}
      </h1>

      {(loading || saving) && (
        <p className="text-indigo-400 mb-4">
          {loading ? "Loading..." : "Saving..."}
        </p>
      )}

      <div className="space-y-6">
        <label htmlFor="title" className="text-white">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={title}
          placeholder="Blog title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="slug" className="text-white">
          URL Name:
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={slug}
          placeholder="url-friendly-slug"
          onChange={(e) => setSlug(e.target.value)}
        />

        <label htmlFor="description" className="text-white">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={about}
          placeholder="Brief summary of the blog"
          onChange={(e) => setAbout(e.target.value)}
        />

        <label htmlFor="author" className="text-white">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={author}
          placeholder="Author name"
          onChange={(e) => setAuthor(e.target.value)}
        />

        <label htmlFor="date" className="text-white">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="coverImage" className="text-white">
          Cover Image URL
        </label>
        <input
          type="url"
          id="coverImage"
          name="coverImage"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          value={coverImage}
          placeholder="https://example.com/image.jpg"
          onChange={(e) => setCoverImage(e.target.value)}
        />

        {coverImage && (
          <div className="mt-4">
            <p className="text-white mb-2">Image Preview:</p>
            <img
              src={coverImage}
              alt="Cover Preview"
              className="max-w-full h-auto rounded-lg border border-gray-600"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div>
          <label htmlFor="status" className="text-white">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-between items-center mb-2 mt-6">
          <h2 className="text-2xl font-bold text-white">Content</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
          >
            {showPreview ? "Edit Markdown" : "Preview Markdown"}
          </button>
        </div>

        {showPreview ? (
          <MarkdownWrapper content={content} />
        ) : (
          <CustomMarkdownEditor content={content} setContent={setContent} />
        )}

        <div className="flex gap-4 justify-end mt-4">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded"
            disabled={loading || saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
            disabled={loading || saving}
          >
            Save Blog
          </button>
        </div>
      </div>
    </div>
  );
}
