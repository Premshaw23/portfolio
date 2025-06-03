"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLoader } from "@/context/LoaderContext";

const SkillPage = () => {
  const [skills, setSkills] = useState([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        showLoader();

        const skillsCollection = collection(db, "skills");
        const snapshot = await getDocs(skillsCollection);

        const skillsList = snapshot.docs.map((doc) => doc.data().name);
        // if you want just skill names as strings, or
        // snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); for objects

        setSkills(skillsList);
      } catch (error) {
        // console.error("Failed to load skills:", error);
      } finally {
        hideLoader();
      }
    };

    fetchSkills();
  }, []);

  return (
    <section className="min-h-screen mt-10 text-gray-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
          My Skills
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-indigo-600 transition-shadow"
            >
              <p className="text-lg font-medium text-indigo-300">{skill}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillPage;
