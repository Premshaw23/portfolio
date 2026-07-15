"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLoader } from "@/context/LoaderContext";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Sparkles,
  Box,
  Layout,
  Database,
  Terminal,
  Cpu,
  PenTool,
  Layers,
  Zap,
} from "lucide-react";

const CATEGORY_ICONS = {
  Frontend: <Layout size={18} />,
  Backend: <Terminal size={18} />,
  Database: <Database size={18} />,
  "DevOps & Tools": <Cpu size={18} />,
  Languages: <Code2 size={18} />,
  Mobile: <Box size={18} />,
  "UI/UX": <PenTool size={18} />,
  Other: <Layers size={18} />,
  General: <Layers size={18} />,
};

const getSkillLevel = (percent) => {
  if (percent >= 90) return { label: "Expert", color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20" };
  if (percent >= 75) return { label: "Advanced", color: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20" };
  if (percent >= 60) return { label: "Intermediate", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" };
  return { label: "Proficient", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" };
};

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        showLoader();
        const snapshot = await getDocs(collection(db, "skills"));
        const skillsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        hideLoader();
        setLoading(false);
      }
    };
    fetchSkills();
  }, [showLoader, hideLoader]);

  const categorizedSkills = useMemo(() => {
    const categories = {};
    skills.forEach((skill) => {
      const cat = skill.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(skill);
    });
    return categories;
  }, [skills]);

  const categories = useMemo(
    () => ["All", ...Object.keys(categorizedSkills)],
    [categorizedSkills]
  );

  return (
    <>
      <section className="relative min-h-screen py-24 bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 dark:bg-fuchsia-500/15 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed0a_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed0a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#7c3aed12_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed12_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-violet-200 dark:border-violet-500/20 backdrop-blur-xl mb-8 shadow-sm shadow-violet-500/10">
              <Zap className="w-4 h-4 text-violet-500 fill-violet-500" />
              <span className="text-[10px] font-black tracking-[0.4em] text-violet-600 dark:text-violet-400 uppercase">
                Technical Mastery
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-400 dark:from-white dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
                Powering
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent italic font-serif">
                Experiences.
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Curating high-performance digital architectures with a precise
              technical stack designed for scalability and impact.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2.5 mb-20"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                  activeTab === cat
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-lg shadow-violet-500/30 scale-105"
                    : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-violet-400/40 dark:hover:border-violet-500/30 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Skills Grid by Category */}
          <div className="space-y-24">
            <AnimatePresence mode="wait">
              {Object.entries(categorizedSkills)
                .filter(([cat]) => activeTab === "All" || activeTab === cat)
                .map(([level, items]) => (
                  <motion.section
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-10"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200 dark:border-violet-500/20">
                          {CATEGORY_ICONS[level] || CATEGORY_ICONS.General}
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">
                          {level}
                        </h2>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-violet-400/30 via-slate-200 dark:via-white/5 to-transparent" />
                      <span className="text-xs font-bold text-slate-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                        {items.length} skill{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Skill Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                      {items
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((skill, index) => {
                          const level_ = getSkillLevel(skill.percentage);
                          return (
                            <motion.div
                              key={skill.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ duration: 0.4, delay: index * 0.04 }}
                              whileHover={{ y: -6, scale: 1.02 }}
                              className="group relative"
                            >
                              {/* Hover glow */}
                              <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-[1.75rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                              <div className="relative p-5 bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/[0.07] rounded-[1.5rem] shadow-sm shadow-slate-200/50 dark:shadow-none group-hover:border-violet-400/40 dark:group-hover:border-violet-500/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
                                {/* Top row */}
                                <div className="flex justify-between items-start mb-5">
                                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-100 dark:border-violet-500/10 group-hover:bg-violet-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300 flex-shrink-0">
                                    <Sparkles
                                      size={16}
                                      className={skill.percentage >= 90 ? "animate-pulse" : ""}
                                    />
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${level_.color}`}>
                                    {level_.label}
                                  </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-4 flex-1">
                                  {skill.name}
                                </h3>

                                {/* Progress */}
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                                    <span>Expertise</span>
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                      {skill.percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${skill.percentage}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                                      className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_14px_rgba(124,58,237,0.6)] transition-shadow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </motion.section>
                ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {skills.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-violet-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center bg-white dark:bg-white/5 backdrop-blur-xl">
                  <Code2 className="text-slate-300 dark:text-white/20 animate-pulse" size={40} />
                </div>
              </div>
              <p className="text-slate-400 dark:text-gray-500 font-black uppercase tracking-[0.4em] text-xs">
                Awaiting Technical Input
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SkillPage;
