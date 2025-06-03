"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { title, description, image, buttonText, buttonLink } = formData;
    if (!title || !description || !image) {
      toast.error("Title, description, and image are required");
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), {
          title,
          description,
          image,
          buttonText,
          buttonLink,
        });
        toast.success("Project updated");
      } else {
        await addDoc(collection(db, "projects"), {
          title,
          description,
          image,
          buttonText,
          buttonLink,
        });
        toast.success("Project added");
      }

      setFormData({
        title: "",
        description: "",
        image: "",
        buttonText: "",
        buttonLink: "",
      });
      setEditingId(null);
      fetchProjects();
    } catch {
      toast.error("Error saving project");
    } finally {
      setSubmitting(false);
    }
  };
  

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      buttonText: project.buttonText || "",
      buttonLink: project.buttonLink || "",
    });
    setEditingId(project.id);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", deleteId));
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Error deleting project");
    } finally {
      setDeleteId(null);
      setModalOpen(false);
    }
  };

  return (
    <div className="text-white w-full max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">
        {editingId ? "Edit Project" : "Add New Project"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl border border-white/10 shadow-xl mb-12 space-y-4"
      >
        {[
          ["title", "Project Title"],
          ["description", "Short Description"],
          ["image", "Image URL"],
          ["buttonText", "Button Text"],
          ["buttonLink", "Button Link URL"],
        ].map(([field, label]) => (
          <div key={field} className="flex flex-col space-y-1">
            <label
              htmlFor={field}
              className="text-sm font-medium text-gray-300"
            >
              {label}
            </label>
            <input
              id={field}
              type="text"
              placeholder={label}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          disabled={submitting}
        >
          {submitting
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Project"
            : "Add Project"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-6">Existing Projects</h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 p-5 rounded-xl border border-white/10 shadow-md flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-indigo-300 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {project.description}
                </p>
                {project.buttonText && (
                  <a
                    href={project.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    {project.buttonText}
                  </a>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(project.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
