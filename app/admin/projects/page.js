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
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Pencil,
  Trash2,
  Plus,
  Layout,
  ExternalLink,
  Settings,
  Eye,
  Code,
  GripVertical,
  ArrowUpDown,
  Save,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

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
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
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
        const newOrder = projects.length;
        await addDoc(collection(db, "projects"), { ...formData, order: newOrder });
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
      liveLink: project.liveLink || project.buttonLink || "",
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

  // Drag and Drop handler
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setProjects(reordered);
    setOrderChanged(true);
  };

  // Save order to Firestore
  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const batch = writeBatch(db);
      projects.forEach((project, index) => {
        batch.update(doc(db, "projects", project.id), { order: index });
      });
      await batch.commit();
      setOrderChanged(false);
      toast.success("Project order saved!");
    } catch (err) {
      toast.error("Failed to save order");
      console.error(err);
    } finally {
      setSavingOrder(false);
    }
  };

  // Input base classes (theme-aware)
  const inputClass =
    "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl p-4 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white p-4 sm:p-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3">
            <Layout className="text-violet-500" />
            Project Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Curate and showcase your best work to the world.
          </p>
        </div>

        {/* Items Per Page Setting */}
        <div className="flex items-center gap-4 bg-white dark:bg-white/5 backdrop-blur-md p-2 pl-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Settings size={16} />
            <span>Items per page:</span>
          </div>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="w-16 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl text-center font-bold focus:ring-2 focus:ring-violet-500 outline-none p-1"
          />
          <button
            onClick={async () => {
              await setDoc(doc(db, "settings", "projects"), { itemsPerPage: parseInt(itemsPerPage) }, { merge: true });
              toast.success("Settings saved");
            }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all"
          >
            SAVE
          </button>
        </div>
      </div>

      {/* Form + Preview grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
        {/* Editor Form */}
        <section className="space-y-8 order-2 xl:order-1">
          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl -mr-16 -mt-16" />

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
              <Plus className="text-violet-500" />
              {editingId ? "Edit Project Details" : "Launch New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <CloudinaryUpload
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Nexus AI Platform"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                  Live Deployment URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://your-app.com"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="What makes this project special?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white p-4 rounded-2xl font-black shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-50"
                >
                  {submitting ? "PROCESSING..." : editingId ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
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
              Desktop Mockup
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition" />
            <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
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
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400">
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
                <h3 className="text-3xl font-black text-gray-900 dark:text-white truncate">
                  {formData.title || "Project Title Placeholder"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-lg leading-relaxed">
                  {formData.description || "As you type your narrative, it will appear here in real-time."}
                </p>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {formData.liveLink && (
                    <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                      LIVE DEMO <ExternalLink size={16} />
                    </button>
                  )}
                  {formData.githubLink && (
                    <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm border border-gray-200 dark:border-white/10">
                      SOURCE CODE
                      <Image
                        src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                        alt="github"
                        width={18}
                        height={18}
                        className="rounded-full"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Reorder Section ─── */}
      <section className="max-w-7xl mx-auto space-y-6 pb-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowUpDown className="text-violet-500" size={22} />
              Project Order
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-violet-500/40 to-transparent" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setReorderMode(!reorderMode);
                if (reorderMode && orderChanged) setOrderChanged(false);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                reorderMode
                  ? "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white"
                  : "bg-violet-600 hover:bg-violet-700 border-transparent text-white shadow-lg shadow-violet-500/20"
              }`}
            >
              {reorderMode ? "Cancel" : "Reorder Mode"}
            </button>
            {reorderMode && orderChanged && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={saveOrder}
                disabled={savingOrder}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 disabled:opacity-60"
              >
                {savingOrder ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Save size={14} />
                )}
                {savingOrder ? "Saving..." : "Save Order"}
              </motion.button>
            )}
          </div>
        </div>

        {reorderMode && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-violet-600 dark:text-violet-400 flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-500/20"
          >
            <GripVertical size={16} className="flex-shrink-0" />
            Drag the cards to reorder. Click &ldquo;Save Order&rdquo; to publish changes to the live site.
          </motion.p>
        )}

        {/* Project Cards Grid (static) or Drag List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : reorderMode ? (
          /* ── Drag & Drop List ── */
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {projects.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                            snapshot.isDragging
                              ? "bg-violet-50 dark:bg-violet-500/10 border-violet-400 dark:border-violet-400/50 shadow-2xl shadow-violet-500/20 scale-[1.02]"
                              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30"
                          }`}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-grab active:cursor-grabbing transition-colors"
                          >
                            <GripVertical size={20} />
                          </div>

                          {/* Order Badge */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-black text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </div>

                          {/* Thumbnail */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 relative">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{project.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex-shrink-0 flex gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors border border-amber-200 dark:border-amber-500/20"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => { setDeleteId(project.id); setModalOpen(true); }}
                              className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-500/20"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          /* ── Static Grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={project.id}
                  className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.08] backdrop-blur-md p-6 rounded-3xl border border-gray-200 dark:border-white/10 group transition-all shadow-sm hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl relative overflow-hidden border border-gray-200 dark:border-white/10">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 bg-amber-50 dark:bg-gray-800 text-amber-500 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all border border-amber-200 dark:border-transparent"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => { setDeleteId(project.id); setModalOpen(true); }}
                        className="p-2 bg-red-50 dark:bg-gray-800 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black mb-2 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-violet-500" />
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      CLOUD STORAGE
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
