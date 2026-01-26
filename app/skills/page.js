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
  Trophy 
} from "lucide-react";

const CATEGORY_ICONS = {
  Frontend: <Layout size={20} />,
  Backend: <Terminal size={20} />,
  Database: <Database size={20} />,
  "DevOps & Tools": <Cpu size={20} />,
  Languages: <Code2 size={20} />,
  Mobile: <Box size={20} />,
  "UI/UX": <PenTool size={20} />,
  Other: <Layers size={20} />,
  General: <Layers size={20} />,
};

const getSkillLevel = (percent) => {
  if (percent >= 90) return "Expert";
  if (percent >= 75) return "Advanced";
  if (percent >= 60) return "Intermediate";
  return "Proficient";
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
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(skill);
    });
    return categories;
  }, [skills]);

  const categories = useMemo(() => ["All", ...Object.keys(categorizedSkills)], [categorizedSkills]);

  return (
    <>
      <section className="relative min-h-screen py-24 bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
        {/* Advanced Background Assets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[140px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Presidential Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-indigo-100 dark:border-white/10 backdrop-blur-2xl mb-8 shadow-xl shadow-indigo-500/5">
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 dark:text-gray-400 uppercase">
                Technical Mastery
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-400 dark:to-gray-600 bg-clip-text text-transparent">
                Powering
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent italic">
                Experiences.
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Curating high-performance digital architectures with a precise technical stack designed for scalability and impact.
            </p>
          </motion.div>

          {/* Luxury Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-3 mb-24">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                  activeTab === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-500/30 scale-105"
                    : "bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-indigo-500/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dynamic Sections Grid */}
          <div className="space-y-32">
            <AnimatePresence mode="wait">
              {Object.entries(categorizedSkills)
                .filter(([cat]) => activeTab === "All" || activeTab === cat)
                .map(([level, items], sectionIndex) => (
                <motion.section
                  key={level}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 backdrop-blur-xl">
                          {CATEGORY_ICONS[level] || CATEGORY_ICONS.General}
                       </div>
                       <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400">
                        {level}
                      </h2>
                    </div>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-indigo-500/50 via-gray-200 to-transparent dark:from-indigo-500/50 dark:via-white/5 dark:to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {items.sort((a, b) => b.percentage - a.percentage).map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                      >
                        {/* Glow Backdrop */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[1.5rem] blur-lg opacity-0 group-hover:opacity-10 transition duration-500" />
                        
                        <div className="relative p-5 bg-white/70 dark:bg-[#0f172a]/30 backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[1.5rem] shadow-xl shadow-gray-200/30 dark:shadow-none group-hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                          
                          <div className="flex justify-between items-start mb-5 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 ring-1 ring-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300">
                               <Sparkles size={18} className={skill.percentage >= 90 ? "animate-pulse" : ""} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">
                                  {getSkillLevel(skill.percentage)}
                               </span>
                            </div>
                          </div>

                          <div className="space-y-4 relative z-10">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors truncate">
                              {skill.name}
                            </h3>

                            <div className="space-y-1.5">
                               <div className="flex justify-between items-center text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                  <span>Expertise</span>
                                  <span className="text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{skill.percentage}%</span>
                               </div>
                               <div className="w-full h-1.5 bg-gray-200/50 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.percentage}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.3 }}
                                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all"
                                />
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>

          {skills.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-40">
               <div className="relative group">
                 <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                 <div className="relative w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center mb-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl">
                   <Code2 className="text-gray-300 dark:text-white/20 animate-pulse" size={40} />
                 </div>
               </div>
               <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Awaiting Technical Input</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SkillPage;
