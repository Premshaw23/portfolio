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
import { Pencil, Trash2, Plus, Layout, ExternalLink, Settings, Eye, Code } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    liveLink: "",
    githubLink: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "projects"));
      if (settingsDoc.exists()) {
        setItemsPerPage(settingsDoc.data()?.itemsPerPage || 6);
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image) {
      return toast.error("Please fill in the title, description, and upload an image.");
    }

    if (!formData.liveLink && !formData.githubLink) {
      return toast.error("Provide at least one link (Live or GitHub).");
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), formData);
        toast.success("Project updated successfully");
      } else {
        await addDoc(collection(db, "projects"), formData);
        toast.success("New project added to gallery");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error("Process failed. Check console.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", image: "", liveLink: "", githubLink: "" });
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      liveLink: project.liveLink || project.buttonLink || "", // Backward compatibility
      githubLink: project.githubLink || "",
    });
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", deleteId));
      toast.success("Project removed");
      fetchProjects();
    } catch {
      toast.error("Deletion failed");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 space-y-12">
      {/* Admin Title & Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
            <Layout className="text-purple-500" />
            Project Management
          </h1>
          <p className="text-gray-400 font-medium">Curate and showcase your best work to the world.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Settings size={16} />
            <span>Items per page:</span>
          </div>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="w-16 bg-gray-800 border-none rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={async () => {
              await setDoc(doc(db, "settings", "projects"), { itemsPerPage: parseInt(itemsPerPage) }, { merge: true });
              toast.success("Settings saved");
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-black transition-all"
          >
            SAVE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
        {/* Editor Form */}
        <section className="space-y-8 order-2 xl:order-1">
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16" />
            
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Plus className="text-purple-500" />
              {editingId ? "Edit Project Details" : "Launch New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CloudinaryUpload 
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Nexus AI Platform"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">GitHub Repository</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Live Deployment URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://your-app.com"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Narrative / Description</label>
                <textarea
                  rows={4}
                  placeholder="What makes this project special?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl font-black shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
                >
                  {submitting ? "PROCESSING..." : editingId ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
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
              <Eye className="text-pink-500" />
              Live Preview
            </h2>
            <div className="p-2 px-3 bg-pink-500/10 text-pink-500 text-[10px] rounded-full uppercase font-black tracking-widest border border-pink-500/20">
              Desktop Mockup
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                {formData.image ? (
                  <Image 
                    src={formData.image} 
                    alt="Preview" 
                    fill 
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-gray-600">
                    <Layout size={64} className="mb-4 animate-pulse" />
                    <span className="font-bold text-sm tracking-tighter">WAITING FOR GALLERY UPLOAD</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                     <Code size={20} />
                   </div>
                   <span className="text-xs font-black tracking-widest text-white/70 uppercase">PROJECT SHOWCASE</span>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                <h3 className="text-3xl font-black text-white truncate">
                  {formData.title || "Project Title Placeholder"}
                </h3>
                  <p className="text-gray-400 line-clamp-3 text-lg leading-relaxed">
                  {formData.description || "As you type your narrative, it will appear here in real-time. This preview mimics how visitors will see your work on the portfolio showcase page."}
                </p>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {formData.liveLink && (
                    <button className="px-6 py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                      LIVE DEMO
                      <ExternalLink size={16} />
                    </button>
                  )}
                  {formData.githubLink && (
                    <button className="px-6 py-3 bg-gray-800 text-white font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm border border-white/10">
                      SOURCE CODE
                      <Image src="https://avatars.githubusercontent.com/u/9919?s=200&v=4" alt="github" width={18} height={18} className="rounded-full invert dark:invert-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Database View */}
      <section className="max-w-7xl mx-auto space-y-8 pb-20 mt-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Launch History</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <Layout className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-600 font-bold tracking-widest">SYNCING WITH FIRESTORE...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={project.id}
                  className="bg-white/5 hover:bg-white/[0.08] backdrop-blur-md p-6 rounded-3xl border border-white/10 group transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-2xl relative overflow-hidden border border-white/10">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        sizes="60px"
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex gap-2">
                       <button
                        onClick={() => handleEdit(project)}
                        className="p-2 bg-gray-800 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-white transition-all shadow-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => { setDeleteId(project.id); setModalOpen(true); }}
                        className="p-2 bg-gray-800 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-2 truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                     <div className="w-1 h-1 rounded-full bg-purple-500" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                       SECURED CLOUD STORAGE
                     </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        title="Remove Project Permanently?"
        description="This action will instantly delete your project data from Firebase. This cannot be recovered."
      />
    </div>
  );
}
