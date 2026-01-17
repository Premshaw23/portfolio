"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLoader } from "@/context/LoaderContext";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  // Categorize skills by proficiency level
  const categorizeSkills = () => {
    const categories = {
      expert: skills.filter(s => s.percentage >= 90),
      advanced: skills.filter(s => s.percentage >= 75 && s.percentage < 90),
      intermediate: skills.filter(s => s.percentage < 75),
    };
    return categories;
  };

  const categories = categorizeSkills();

  return (
    <>
      <section className="relative min-h-screen py-24 bg-[#fafafa] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Executive Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl mb-6 shadow-sm">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 dark:text-gray-400 uppercase">
                Technical Expertise
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
                Powering
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Experiences.
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              A curated stack of technologies I've mastered to build scalable, high-performance digital products.
            </p>
          </motion.div>

          {/* Proficiency Sections */}
          <div className="space-y-24">
            {Object.entries(categories).map(([level, items], sectionIndex) => (
              items.length > 0 && (
                <section key={level} className="space-y-10">
                  <div className="flex items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-indigo-500" />
                      {level} Proficiency
                    </h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
                        
                        <div className="relative p-6 bg-white dark:bg-[#0f172a]/40 backdrop-blur-2xl border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm group-hover:border-indigo-500/30 transition-all duration-300">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                               <Sparkles size={20} className={skill.percentage >= 90 ? "animate-pulse" : ""} />
                            </div>
                            <span className="text-3xl font-black text-gray-200 dark:text-white/10 group-hover:text-indigo-500/20 transition-colors duration-500">
                              {skill.percentage}%
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-500 transition-colors">
                            {skill.name}
                          </h3>

                          {/* Refined Progress Bar */}
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>

          {skills.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse">
               <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center mb-6">
                 <Code2 className="text-gray-300 dark:text-white/10" size={32} />
               </div>
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No expertise found yet</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SkillPage;
