"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import ConfirmModal from "@/components/confirmModal";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Loader, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false); // false initially for form
  const [fetching, setFetching] = useState(true); // separate loading for fetch
  const [formData, setFormData] = useState({ name: "", percentage: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSkills = async () => {
    setFetching(true);
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(data);
    } catch (err) {
      toast.error("Failed to fetch skills");
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, percentage } = formData;

    if (!name.trim() || !percentage.trim()) {
      return toast.error("Please fill in all fields");
    }

    const numPercentage = Number(percentage);
    if (isNaN(numPercentage) || numPercentage < 0 || numPercentage > 100) {
      return toast.error("Percentage must be a number between 0 and 100");
    }

    setLoading(true);

    try {
      if (editingId) {
        const docRef = doc(db, "skills", editingId);
        await updateDoc(docRef, {
          name: name.trim(),
          percentage: numPercentage,
        });
        toast.success("Skill updated");
      } else {
        await addDoc(collection(db, "skills"), {
          name: name.trim(),
          percentage: numPercentage,
        });
        toast.success("Skill added");
      }
      setFormData({ name: "", percentage: "" });
      setEditingId(null);
      fetchSkills();
    } catch (err) {
      toast.error("Error saving skill");
    }

    setLoading(false);
  };

  const handleEdit = (skill) => {
    setFormData({ name: skill.name, percentage: skill.percentage.toString() });
    setEditingId(skill.id);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "skills", deleteId));
      toast.success("Skill deleted");
      fetchSkills();
    } catch {
      toast.error("Error deleting skill");
    } finally {
      setDeleteId(null);
      setModalOpen(false);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  return (
    <div className="text-white w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
        Manage Skills
      </h2>

      {/* Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-800 p-4 rounded-lg space-y-4 border border-white/10"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Skill name"
            className="flex-1 p-2 bg-gray-700 rounded text-white text-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            autoFocus
          />
          <input
            type="number"
            placeholder="%"
            className="w-full sm:w-24 p-2 bg-gray-700 rounded text-white text-sm"
            value={formData.percentage}
            onChange={(e) =>
              setFormData({ ...formData, percentage: e.target.value })
            }
            disabled={loading}
            min={0}
            max={100}
          />
          <button
            type="submit"
            className={`bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm text-white w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin mx-auto" />
            ) : editingId ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>

      {/* Skill List */}
      {fetching ? (
        <div className="text-center mt-10">
          <Loader className="animate-spin mx-auto" />
        </div>
      ) : skills.length === 0 ? (
        <p className="text-gray-400 text-center">No skills found.</p>
      ) : (
        <ul className="space-y-4">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-4 rounded-lg border border-white/10"
            >
              <div>
                <p className="font-medium">{skill.name}</p>
                <p className="text-sm text-gray-400">
                  {skill.percentage}% skill level
                </p>
              </div>
              <div className="flex gap-4 mt-3 sm:mt-0">
                <button
                  onClick={() => handleEdit(skill)}
                  className="text-yellow-400 hover:text-yellow-300"
                  disabled={loading}
                  aria-label="Edit skill"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(skill.id)}
                  className="text-red-400 hover:text-red-300"
                  disabled={loading}
                  aria-label="Delete skill"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
      />
    </div>
  );
}
