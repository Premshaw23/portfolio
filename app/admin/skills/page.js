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
import {
  Loader,
  Pencil,
  Trash2,
  Plus,
  Sparkles,
  Settings,
  Eye,
  Zap,
  Search,
  Check,
  ListChecks,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps & Tools",
  "Languages",
  "Mobile",
  "UI/UX",
  "Other",
];

const getSkillLevel = (percent) => {
  if (percent >= 90) return "Expert";
  if (percent >= 75) return "Advanced";
  if (percent >= 60) return "Intermediate";
  return "Proficient";
};

// Shared input class — fully theme-aware
const inputClass =
  "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl p-4 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    category: "Frontend",
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
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
    } catch {
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
    const { name, percentage, category } = formData;
    if (!name.trim() || !percentage.toString().trim()) {
      return toast.error("Please fill in name and percentage");
    }
    const numPercentage = Number(percentage);
    if (isNaN(numPercentage) || numPercentage < 0 || numPercentage > 100) {
      return toast.error("Percentage must be a number between 0 and 100");
    }
    setLoading(true);
    try {
      const skillData = {
        name: name.trim(),
        percentage: numPercentage,
        category: category || "Other",
      };
      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), skillData);
        toast.success("Skill updated successfully");
      } else {
        await addDoc(collection(db, "skills"), skillData);
        toast.success("New skill added");
      }
      resetForm();
      fetchSkills();
    } catch (err) {
      toast.error("Process failed. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: "", percentage: "", category: "Frontend" });
    setEditingId(null);
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      percentage: skill.percentage.toString(),
      category: skill.category || "Frontend",
    });
    setEditingId(skill.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (isBulkDeleting) {
        await Promise.all(
          selectedIds.map((id) => deleteDoc(doc(db, "skills", id)))
        );
        toast.success(`${selectedIds.length} skills removed`);
        setSelectedIds([]);
        setIsBulkDeleting(false);
      } else {
        await deleteDoc(doc(db, "skills", deleteId));
        toast.success("Skill removed");
      }
      fetchSkills();
    } catch {
      toast.error("Error deleting skill(s)");
    } finally {
      setDeleteId(null);
      setModalOpen(false);
      setLoading(false);
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsBulkDeleting(false);
    setModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setIsBulkDeleting(true);
    setModalOpen(true);
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredSkills) => {
    if (selectedIds.length === filteredSkills.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSkills.map((s) => s.id));
    }
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.category &&
        skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const progressBarColor = (pct) => {
    if (pct >= 90) return "from-violet-500 to-fuchsia-500";
    if (pct >= 75) return "from-fuchsia-500 to-pink-500";
    if (pct >= 60) return "from-blue-500 to-violet-500";
    return "from-emerald-500 to-teal-500";
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white p-4 sm:p-8 space-y-12">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="text-violet-500" />
            Skill Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Manage your technical expertise and proficiency levels.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-white/5 backdrop-blur-md p-2 pl-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          {/* Search */}
          <div className="flex items-center gap-2 border-r border-gray-200 dark:border-white/10 pr-3 mr-1">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-gray-700 dark:text-white focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 w-28"
            />
          </div>
          {/* Items per page */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Settings size={15} />
            <span className="text-xs">Per page:</span>
          </div>
          <input
            type="number"
            value={newItemsPerPage}
            onChange={(e) => setNewItemsPerPage(parseInt(e.target.value) || "")}
            className="w-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl text-center font-bold text-sm focus:ring-2 focus:ring-violet-500 outline-none p-1"
          />
          <button
            onClick={async () => {
              try {
                await setDoc(
                  doc(db, "settings", "skills"),
                  { itemsPerPage: parseInt(newItemsPerPage) },
                  { merge: true }
                );
                setItemsPerPage(newItemsPerPage);
                toast.success("Settings saved");
              } catch {
                toast.error("Failed to save settings");
              }
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all"
          >
            SAVE
          </button>
        </div>
      </div>

      {/* ── Form + Preview ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">

        {/* Editor Form */}
        <section className="space-y-8 order-2 xl:order-1">
          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl -mr-16 -mt-16" />

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
              <Plus className="text-violet-500" />
              {editingId ? "Edit Expertise" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. React.js"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                    Proficiency (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="E.g. 95"
                    value={formData.percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, percentage: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white p-4 rounded-2xl font-black shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : editingId ? (
                    "UPDATE SKILL"
                  ) : (
                    "PUBLISH SKILL"
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-2xl font-bold transition-all"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Live Preview */}
        <section className="space-y-8 order-1 xl:order-2 sticky top-8">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Eye className="text-fuchsia-500" />
              Live Preview
            </h2>
            <div className="p-2 px-3 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] rounded-full uppercase font-black tracking-widest border border-fuchsia-500/20">
              Interactive Card
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition" />
            <div className="relative p-8 bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-lg transition-all duration-300">

              {/* Preview card top */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-100 dark:border-violet-500/20">
                  <Sparkles
                    size={24}
                    className={
                      Number(formData.percentage) >= 90 ? "animate-pulse" : ""
                    }
                  />
                </div>
                <span className="text-4xl font-black text-gray-200 dark:text-white/10 tabular-nums">
                  {formData.percentage || "0"}%
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                  {formData.category || "Select Category"}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formData.name || "Skill Name"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {getSkillLevel(Number(formData.percentage))} · {formData.percentage || 0}% Proficiency
                </p>
              </div>

              {/* Progress bar preview */}
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${progressBarColor(Number(formData.percentage))} rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(124,58,237,0.4)]`}
                  style={{ width: `${formData.percentage || 0}%` }}
                />
              </div>

              <div className="mt-8 flex items-center gap-2 pt-5 border-t border-gray-100 dark:border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Expertise Preview Mode
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Expertise Vault ── */}
      <section className="max-w-7xl mx-auto space-y-8 pb-32 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Expertise Vault
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-400/30 dark:from-white/10 to-transparent" />
            <span className="text-xs font-bold text-gray-400 tabular-nums whitespace-nowrap">
              {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bulk manage toggle */}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isSelectionMode
                  ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                  : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-violet-400/50 dark:hover:border-violet-500/50"
              }`}
            >
              <ListChecks size={14} />
              {isSelectionMode ? "Exit Selection" : "Bulk Manage"}
            </button>

            {isSelectionMode && filteredSkills.length > 0 && (
              <button
                onClick={() => toggleSelectAll(filteredSkills)}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-white"
              >
                {selectedIds.length === filteredSkills.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        {fetching ? (
          <div className="flex flex-col items-center py-20">
            <Loader className="w-10 h-10 text-violet-500 animate-spin mb-4" />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
              Syncing Expertise...
            </p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-400 dark:text-gray-500 font-medium">
              {searchTerm
                ? "No results match your search."
                : "No skills recorded yet. Start by adding one above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={skill.id}
                  onClick={() => isSelectionMode && toggleSelection(skill.id)}
                  className={`relative overflow-hidden bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] backdrop-blur-md p-6 rounded-3xl border transition-all duration-200 group ${
                    selectedIds.includes(skill.id)
                      ? "border-violet-500 ring-2 ring-violet-500/30 bg-violet-50 dark:bg-violet-500/5"
                      : "border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                  } ${isSelectionMode ? "cursor-pointer" : ""}`}
                >
                  {/* Selection checkbox */}
                  <AnimatePresence>
                    {isSelectionMode && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-4 left-4 z-20"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedIds.includes(skill.id)
                              ? "bg-violet-500 border-violet-500 text-white"
                              : "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/20"
                          }`}
                        >
                          <Check size={13} strokeWidth={4} className={selectedIds.includes(skill.id) ? "opacity-100" : "opacity-0"} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Header row */}
                  <div
                    className={`flex justify-between items-start gap-3 mb-5 transition-all ${
                      isSelectionMode ? "pl-8" : ""
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-[8px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">
                        {skill.category || "General"}
                      </div>
                      <h3 className="text-base font-bold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-gray-900 dark:text-white">
                        {skill.name}
                      </h3>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(skill);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all border border-amber-200 dark:border-amber-500/20"
                        title="Edit Skill"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(skill.id);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20"
                        title="Delete Skill"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        Proficiency
                      </span>
                      <span className="text-xs font-black text-gray-700 dark:text-white tabular-nums">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${progressBarColor(skill.percentage)} rounded-full`}
                      />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 pt-0.5">
                      {getSkillLevel(skill.percentage)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ── Bulk Action Floating Bar ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-500/30 px-6 py-4 rounded-3xl shadow-2xl shadow-violet-500/20 flex items-center gap-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-r border-gray-200 dark:border-white/10 pr-5 mr-1">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-black">
                {selectedIds.length}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-white">
                Selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds([])}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Trash2 size={13} />
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        title={
          isBulkDeleting
            ? `Delete ${selectedIds.length} Skills?`
            : "Remove Expertise?"
        }
        description={
          isBulkDeleting
            ? `This will permanently delete all ${selectedIds.length} selected items. This cannot be undone.`
            : "This will permanently delete this skill from your portfolio expertise section."
        }
      />
    </div>
  );
}
