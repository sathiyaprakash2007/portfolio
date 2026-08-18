"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
  icon: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/skills"
        );

        const data = await response.json();

        if (data.success) {
          setSkills(data.skills);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-lg">
            My Expertise
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            My{" "}
            <span className="text-cyan-400">
              Skills
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            Technologies and areas I am learning and working with.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400">
            Loading skills...
          </p>
        )}

        {/* Skills */}
        {!loading && skills.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition">
                    {skill.name}
                  </h3>

                  {skill.level && (
                    <span className="text-xs text-gray-500">
                      {skill.level}
                    </span>
                  )}
                </div>

                <p className="text-cyan-400 text-sm mt-2">
                  {skill.category}
                </p>

                <div className="mt-5 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-cyan-400 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && skills.length === 0 && (
          <p className="text-center text-gray-400">
            No skills available.
          </p>
        )}

      </div>
    </section>
  );
}