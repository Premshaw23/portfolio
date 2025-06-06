"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  getDoc,
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

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newItemsPerPage, setNewItemsPerPage] = useState(6);

  const fetchItemsPerPage = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "projects"));
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

  useEffect(() => {
    fetchItemsPerPage();
    fetchProjects();
  }, []);

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
    <div className="w-full max-w-5xl mx-auto px-4 py-8 text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
        {editingId ? "Edit Project" : "Add New Project"}
      </h1>

      {/* Items per page setting */}
      <div className="flex items-center gap-3 mb-8">
        <label
          htmlFor="perPage"
          className="dark:text-gray-300 text-gray-800 font-medium text-sm"
        >
          Projects per page:
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
          className="px-3 py-1.5 rounded-md dark:bg-gray-800 dark:text-white text-gray-800 font-semibold border border-gray-600 w-20 text-sm"
        />
        <button
          onClick={async () => {
            try {
              await setDoc(
                doc(db, "settings", "projects"),
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

      {/* Project Form */}
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-900 bg-gray-400 p-6 rounded-xl border border-white/10 shadow-xl mb-12 space-y-4"
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
              className="text-sm font-medium dark:text-gray-300 text-white"
            >
              {label}
            </label>
            <input
              id={field}
              type="text"
              placeholder={label}
              className="w-full px-4 py-2 rounded-lg dark:text-white font-semibold text-slate-900 bg-gray-200 dark:bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
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

      {/* Project List */}
      <h2 className="text-2xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
        Existing Projects
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="dark:bg-gray-900 bg-gray-200 p-5 rounded-xl border border-white/10 shadow-md flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                  {project.description}
                </p>
                {project.buttonText && (
                  <a
                    href={project.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:text-indigo-500 text-indigo-700 hover:underline text-sm"
                  >
                    {project.buttonText}
                  </a>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-auto">
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
