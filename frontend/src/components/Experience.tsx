"use client";

import { useEffect, useState } from "react";

interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  location: string;
  certificate: string | null;
}

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/experience"
        );

        const data = await response.json();

        if (data.success) {
          setExperience(data.experience);
        }
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "Present";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      id="experience"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-lg">
            My Journey
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            My{" "}
            <span className="text-cyan-400">
              Experience
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            My internship and professional experience.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400">
            Loading experience...
          </div>
        )}

        {/* Experience */}
        {!loading && experience.length > 0 && (
          <div className="relative">

            {/* Timeline Line */}
            <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gray-800" />

            <div className="space-y-12">
              {experience.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative flex ${
                    index % 2 === 0
                      ? "md:justify-start"
                      : "md:justify-end"
                  }`}
                >

                  {/* Timeline Dot */}
                  <div className="absolute left-3 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 border-4 border-gray-950 shadow-lg shadow-cyan-400/30" />

                  {/* Card */}
                  <div className="ml-10 md:ml-0 md:w-[45%] bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300">

                    <p className="text-cyan-400 text-sm font-medium">
                      {formatDate(item.start_date)} —{" "}
                      {formatDate(item.end_date)}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {item.role}
                    </h3>

                    <h4 className="text-lg text-gray-300 mt-1">
                      {item.company}
                    </h4>

                    {item.location && (
                      <p className="text-gray-500 text-sm mt-2">
                        📍 {item.location}
                      </p>
                    )}

                    <p className="text-gray-400 leading-7 mt-4">
                      {item.description}
                    </p>

                    {item.certificate && (
                      <a
                        href={item.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-5 text-cyan-400 hover:text-cyan-300 transition"
                      >
                        View Certificate →
                      </a>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && experience.length === 0 && (
          <p className="text-center text-gray-400">
            No experience available.
          </p>
        )}

      </div>
    </section>
  );
}