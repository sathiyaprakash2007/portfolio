"use client";

import { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  github: string;
  live_demo: string;
  image: string;
  category: string;
  featured: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/projects"
        );

        const data = await response.json();

        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-lg">
            My Work
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            My{" "}
            <span className="text-cyan-400">
              Projects
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            Some of the projects I have worked on.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400">
            Loading projects...
          </div>
        )}

        {/* No Projects */}
        {!loading && projects.length === 0 && (
          <div className="text-center text-gray-400">
            No projects available.
          </div>
        )}

        {/* Projects */}
        {!loading && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-400 transition-all duration-300"
              >

                {/* Image */}
                <div className="h-48 bg-gray-800 flex items-center justify-center">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">
                      Project Image
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">

                  <p className="text-cyan-400 text-sm mb-2">
                    {project.category}
                  </p>

                  <h3 className="text-xl font-bold mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-6">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.technologies
                      .split(",")
                      .map((technology) => (
                        <span
                          key={technology}
                          className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400"
                        >
                          {technology.trim()}
                        </span>
                      ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 mt-6">

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
                      >
                        GitHub
                      </a>
                    )}

                    {project.live_demo &&
                      project.live_demo !== "#" && (
                        <a
                          href={project.live_demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-cyan-500 text-gray-950 hover:bg-cyan-400 transition"
                        >
                          Live Demo
                        </a>
                      )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}