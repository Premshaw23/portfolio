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
import { Loader, Pencil, Trash2, Plus, Sparkles, Settings, Eye, Zap, Search, Check, ListChecks } from "lucide-react";
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

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ name: "", percentage: "", category: "Frontend" });
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
        const docRef = doc(db, "skills", editingId);
        await updateDoc(docRef, skillData);
        toast.success("Skill updated successfully");
      } else {
        await addDoc(collection(db, "skills"), skillData);
        toast.success("New skill added to expertise");
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
      category: skill.category || "Frontend"
    });
    setEditingId(skill.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (isBulkDeleting) {
        const deletePromises = selectedIds.map(id => deleteDoc(doc(db, "skills", id)));
        await Promise.all(deletePromises);
        toast.success(`${selectedIds.length} skills removed`);
        setSelectedIds([]);
        setIsBulkDeleting(false);
      } else {
        await deleteDoc(doc(db, "skills", deleteId));
        toast.success("Skill removed");
      }
      fetchSkills();
    } catch (err) {
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
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredSkills) => {
    if (selectedIds.length === filteredSkills.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSkills.map(s => s.id));
    }
  };

  const filteredSkills = skills.filter((skill) => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (skill.category && skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 space-y-12">
      {/* Admin Title & Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <Zap className="text-indigo-500" />
            Skill Management
          </h1>
          <p className="text-gray-400 font-medium">Manage your technical expertise and proficiency levels.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-white focus:outline-none placeholder:text-gray-500 w-32"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Settings size={16} />
            <span>Items per page:</span>
          </div>
          <input
            type="number"
            value={newItemsPerPage}
            onChange={(e) => setNewItemsPerPage(parseInt(e.target.value) || "")}
            className="w-16 bg-gray-800 border-none rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={async () => {
              try {
                await setDoc(doc(db, "settings", "skills"), { itemsPerPage: parseInt(newItemsPerPage) }, { merge: true });
                setItemsPerPage(newItemsPerPage);
                toast.success("Settings saved");
              } catch {
                toast.error("Failed to save settings");
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black transition-all"
          >
            SAVE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
        {/* Editor Form */}
        <section className="space-y-8 order-2 xl:order-1">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16" />
            
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Plus className="text-indigo-500" />
              {editingId ? "Edit Expertise" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Skill Name</label>
                  <input
                    type="text"
                    placeholder="E.g. React.js"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Proficiency (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="E.g. 95"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
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
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                    className="px-6 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
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
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Eye className="text-purple-500" />
              Live Preview
            </h2>
            <div className="p-2 px-3 bg-indigo-500/10 text-indigo-500 text-[10px] rounded-full uppercase font-black tracking-widest border border-indigo-500/20">
              Interactive Card
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition" />
            <div className="relative p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <Sparkles size={24} className={formData.percentage >= 90 ? "animate-pulse" : ""} />
                </div>
                <span className="text-4xl font-black text-white/10">
                  {formData.percentage || "0"}%
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                  {formData.category || "Select Category"}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {formData.name || "Skill Name"}
                </h3>
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  style={{ width: `${formData.percentage || 0}%` }}
                />
              </div>
              
              <div className="mt-8 flex items-center gap-2 pt-6 border-t border-white/5">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                   Expertise Preview Mode
                 </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Skills History */}
      <section className="max-w-7xl mx-auto space-y-8 pb-32 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-2xl font-bold">Expertise Vault</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isSelectionMode 
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" 
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-indigo-500/50"
              }`}
            >
              <ListChecks size={14} />
              {isSelectionMode ? "Exit Selection" : "Bulk Manage"}
            </button>

            {isSelectionMode && filteredSkills.length > 0 && (
              <button
                onClick={() => toggleSelectAll(filteredSkills)}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
              >
                {selectedIds.length === filteredSkills.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <Loader className="w-12 h-12 text-gray-700 animate-spin mb-4" />
            <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">Syncing Expertise...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 font-medium tracking-tight">
              {searchTerm ? "No results match your search." : "No skills recorded yet. Start by adding one above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={skill.id}
                  onClick={() => isSelectionMode && toggleSelection(skill.id)}
                  className={`relative overflow-hidden bg-white/5 hover:bg-white/[0.08] backdrop-blur-md p-6 rounded-3xl border transition-all group cursor-pointer ${
                    selectedIds.includes(skill.id) ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-500/5" : "border-white/10"
                  }`}
                >
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelectionMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-4 left-4 z-20"
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedIds.includes(skill.id) 
                            ? "bg-indigo-500 border-indigo-500 text-white" 
                            : "bg-black/20 border-white/10 text-transparent"
                        }`}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`flex justify-between items-start gap-4 mb-6 relative z-10 transition-all ${isSelectionMode ? "pl-8" : ""}`}>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                        {skill.category || "General"}
                      </div>
                      <h3 className="text-lg font-bold truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                        {skill.name}
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                       <button
                        onClick={() => handleEdit(skill)}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 backdrop-blur-sm text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-white transition-all border border-white/10 shadow-xl"
                        title="Edit Skill"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(skill.id)}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-white/10 shadow-xl"
                        title="Delete Skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Proficiency</span>
                      <span className="text-xs font-black text-white">{skill.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-indigo-600 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-r border-white/20 pr-6 mr-1">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                {selectedIds.length}
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Selected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedIds([])}
                className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkDeleteClick}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
              >
                <Trash2 size={14} />
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
        title={isBulkDeleting ? `Delete ${selectedIds.length} Skills?` : "Remove Expertise?"}
        description={isBulkDeleting 
          ? `This will permanently delete all ${selectedIds.length} selected items. This action cannot be undone.`
          : "This will permanently delete this skill from your portfolio expertise section."}
      />
    </div>
  );
}
