"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import ConfirmModal from "@/components/confirmModal";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Loader, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ name: "", percentage: "" });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newItemsPerPage, setNewItemsPerPage] = useState(6);

  const fetchItemsPerPage = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "skills"));
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
    fetchItemsPerPage();
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
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <h2 className="text-3xl font-semibold mb-8 text-center text-indigo-600">
        Manage Skills
      </h2>

      {/* Items per page setting */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <label
          htmlFor="perPage"
          className="dark:text-gray-300 text-gray-700 font-semibold text-sm whitespace-nowrap"
        >
          Skills per page:
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
          className="w-20 rounded-md dark:bg-gray-900 text-slate-900 font-semibold dark:text-white border border-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 focus:outline-none text-white px-5 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Update
        </button>
      </div>

      {/* Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 dark:bg-gray-900 bg-gray-400 p-4 rounded-lg border border-indigo-500 shadow-md max-w-3xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <input
            type="text"
            placeholder="Skill name"
            className="flex-1 p-3 dark:bg-gray-800 rounded-md dark:text-white bg-gray-200 text-slate-800 font-semibold placeholder-gray-600 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            autoFocus
          />
          <input
            type="number"
            placeholder="%"
            className="w- p-3 dark:bg-gray-800 rounded-md dark:text-white bg-gray-200 text-slate-800 font-semibold placeholder-gray-600 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className={`bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 rounded-md font-semibold text-sm shadow-md transition duration-200 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
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
        <div className="text-center mt-12">
          <Loader className="animate-spin mx-auto h-8 w-8 text-indigo-500" />
        </div>
      ) : skills.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No skills found.</p>
      ) : (
        <ul className="space-y-5 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="dark:bg-gray-900 bg-gray-400 rounded-lg p-3 border border-indigo-600 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition hover:scale-[1.02] duration-150"
            >
              <div className="flex-1 min-w-full">
                <p className="font-semibold w-full text-lg truncate sm:text-base md:text-lg">
                  {skill.name}
                </p>
                <div className="relative mt-1 md:w-full bg-indigo-900 rounded-full h-6 sm:h-5 md:h-6 shadow-inner overflow-hidden">
                  {/* Progress bar fill */}
                  <div
                    className="absolute top-0 left-0 h-6 bg-indigo-500 transition-all duration-400 ease-in"
                    style={{ width: `${skill.percentage}%` }}
                  />
                  {/* Percentage label inside progress bar, aligned left with padding */}
                  <span className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 text-indigo-100 font-medium text-sm select-none sm:text-xs md:text-sm">
                    {skill.percentage}%
                  </span>
                </div>
              </div>

              <div className="flex gap-6 mt-4 sm:mt-0">
                <button
                  onClick={() => handleEdit(skill)}
                  className="text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                  disabled={loading}
                  aria-label="Edit skill"
                  title="Edit skill"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDeleteClick(skill.id)}
                  className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  disabled={loading}
                  aria-label="Delete skill"
                  title="Delete skill"
                >
                  <Trash2 size={20} />
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
