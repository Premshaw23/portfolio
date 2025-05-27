import React from "react";

const projects = [
  {
    id: 1,
    title: "FundFlick Crowdfunding Platform",
    description:
      "A crowdfunding and live show platform to connect creators and supporters seamlessly.",
    image:
      "https://dummyimage.com/1201x501/4f46e5/ffffff&text=FundFlick+Project",
    buttonText: "View Project",
    buttonLink: "/projects/fundflick",
  },
  {
    id: 2,
    title: "YouTube Video Marketplace",
    description:
      "A marketplace to buy and sell exclusive YouTube videos securely and easily.",
    image:
      "https://dummyimage.com/1202x502/6366f1/ffffff&text=YouTube+Marketplace",
    buttonText: "View Project",
    buttonLink: "/projects/youtube-marketplace",
  },
  {
    id: 3,
    title: "YouTube Video Marketplace",
    description:
      "A marketplace to buy and sell exclusive YouTube videos securely and easily.",
    image:
      "https://dummyimage.com/1202x502/6366f1/ffffff&text=YouTube+Marketplace",
    buttonText: "View Project",
    buttonLink: "/projects/youtube-marketplace",
  },
  {
    id: 4,
    title: "FundFlick Crowdfunding Platform",
    description:
      "A crowdfunding and live show platform to connect creators and supporters seamlessly.",
    image:
      "https://dummyimage.com/1201x501/4f46e5/ffffff&text=FundFlick+Project",
    buttonText: "View Project",
    buttonLink: "/projects/fundflick",
  }
];

const ProjectPage = () => {
  return (
    <section className="bg-gray-900 text-gray-300 min-h-screen py-16 mt-10 body-font">
      <div className="container mx-auto px-5">
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-12">
          My Projects
        </h1>

        <div className="flex flex-wrap -mx-4">
          {projects.map(
            ({ id, title, description, image, buttonText, buttonLink }) => (
              <div key={id} className="sm:w-1/2 px-4 mb-12">
                <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 hover:shadow-indigo-700 transition-shadow duration-300">
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
                    <a
                      href={buttonLink}
                      className="inline-block mt-6 bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
                    >
                      {buttonText}
                    </a>
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

export default ProjectPage;
