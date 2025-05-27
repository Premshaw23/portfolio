import React from "react";

const skills = [
  "Cloud Firestore",
  "Firebase",
  "SQL",
  "JSON Web Token (JWT)",
  "Next.js",
  "Mongoose",
  "MongoDB",
  "Tailwind CSS",
  "React.js",
  "Redux.js",
  "Generative AI Tools",
  "AI Tools",
  "Representational State Transfer (REST)",
  "Embedded JavaScript (EJS)",
  "Express.js ",
  "Node.js ",
  "API Testing",
  "JavaScript",
  "Responsive Web Design",
  "Cascading Style Sheets (CSS)",
  "Bootstrap (Framework)",
  "HTML5",
  "Microsoft Visual Studio Code",
  "Git BASH",
  "Git",
];

const SkillsPage = () => {
  return (
    <section className="min-h-screen bg-gray-900 mt-10 text-gray-300 py-16 px-4">
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

export default SkillsPage;
