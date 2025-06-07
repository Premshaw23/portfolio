"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";
import Footer from "@/components/footer";
import Image from "next/image";

export default function AdminBlogsPage() {
  // ----- State -----
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newItemsPerPage, setNewItemsPerPage] = useState(6);

  // ----- Fetch Settings -----
  const fetchItemsPerPage = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "blogs"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setItemsPerPage(data.itemsPerPage || 6);
        setNewItemsPerPage(data.itemsPerPage || 6);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  // ----- Fetch Blogs -----
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsRef = collection(db, "blogs");
      let q;

      if (filter === "all") {
        q = query(blogsRef, orderBy("date", "desc"));
      } else {
        q = query(
          blogsRef,
          where("status", "==", filter),
          orderBy("date", "desc")
        );
      }

      const snapshot = await getDocs(q);
      const blogsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsList);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // ----- Delete Blog -----
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogToDelete));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete blog");
    }
    setModalOpen(false);
    setBlogToDelete(null);
  };

  // ----- Effects -----
  useEffect(() => {
    fetchItemsPerPage();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  // ----- Render -----
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-14 mb-20">
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete?"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-5xl text-3xl font-extrabold text-indigo-600">
          Manage Blogs
        </h1>
        <Link
          href="/admin/blogs/new"
          className="bg-indigo-600 hover:bg-indigo-700 transition md:px-6 md:py-3 px-3 py-2 rounded-md text-white font-bold shadow-md"
        >
          + New Blog
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        {/* Filter Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {["all", "published", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-indigo-500 hover:text-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Items Per Page Setting */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="perPage"
            className="dark:text-gray-300 text-gray-700 font-medium text-sm"
          >
            Blogs per page:
          </label>
          <input
            id="perPage"
            type="number"
            min={1}
            value={Number.isNaN(newItemsPerPage) ? "" : String(newItemsPerPage)}
            onChange={(e) => {
              const parsed = parseInt(e.target.value);
              setNewItemsPerPage(isNaN(parsed) ? "" : parsed);
            }}
            className="px-3 py-1.5 rounded-md dark:bg-gray-800 dark:text-white border border-gray-600 w-20 text-sm"
          />

          <button
            onClick={async () => {
              try {
                await setDoc(
                  doc(db, "settings", "blogs"),
                  { itemsPerPage: newItemsPerPage },
                  { merge: true }
                );
                toast.success("Items per page updated");
                setItemsPerPage(newItemsPerPage);
              } catch (error) {
                console.error("Update failed:", error);
                toast.error("Failed to update setting");
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
          >
            Update
          </button>
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <p className="text-center text-indigo-400 mt-20 text-xl font-semibold">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No blogs found for "{filter}" status. Click "New Blog" to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(({ id, title, author, date, coverImage, status }) => (
            <div
              key={id}
              className="dark:bg-gray-900 bg-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={title}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold dark:text-indigo-400 text-indigo-600 mb-2 truncate">
                  {title}
                </h2>
                <p className="dark:text-gray-400 text-gray-900 italic mb-1 flex-grow">
                  By <span className="dark:text-pink-400 text-pink-600 font-semibold">{author}</span>
                </p>
                <p className="dark:text-gray-500 text-gray-900 text-sm mb-1">{date}</p>
                <p
                  className={`text-sm font-semibold ${
                    status === "published"
                      ? "text-green-500"
                      : "text-yellow-400"
                  }`}
                >
                  {status?.toUpperCase()}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <Link
                    href={`/admin/blogs/${id}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setBlogToDelete(id);
                      setModalOpen(true);
                    }}
                    className="text-red-500 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   
  );
}
