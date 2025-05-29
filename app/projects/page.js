"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button2";
import { useFetchWithLoader } from "@/hooks/useFetchWithLoader";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const fetchWithLoader = useFetchWithLoader();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchWithLoader("/api/projects");
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-transparent text-gray-300 min-h-screen py-16 mx-10 mt-10 body-font">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
          My Projects
        </h1>
        <div className="flex flex-wrap -mx-4">
          {projects.map(
            ({ _id, title, description, image, buttonText, buttonLink }) => (
              <div key={_id} className="sm:w-1/2 px-4 mb-12">
                <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 hover:shadow-indigo-700 transition-shadow ease-out duration-200">
                  <img
                    src={image}
                    alt={title}
                    className="object-cover object-center h-64 w-full"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                      {title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      {description}
                    </p>
                    <div className="inline-block mt-6">
                      <a
                        href={buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button name={buttonText} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
