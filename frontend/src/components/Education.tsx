"use client";

import { useEffect, useState } from "react";

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field: string;
  description: string;
  start_year: number;
  end_year: number;
  location: string;
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/education"
        );

        const data = await response.json();

        if (data.success) {
          setEducation(data.education);
        }
      } catch (error) {
        console.error("Failed to fetch education:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <section
      id="education"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-lg">
            My Academic Journey
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            My{" "}
            <span className="text-cyan-400">
              Education
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            My academic background and qualifications.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400">
            Loading education...
          </p>
        )}

        {/* Education Cards */}
        {!loading && education.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-7 hover:border-cyan-400 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-cyan-400 text-sm font-medium">
                      {item.start_year} — {item.end_year}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {item.degree}
                    </h3>

                    <h4 className="text-lg text-gray-300 mt-2">
                      {item.institution}
                    </h4>
                  </div>

                  <span className="text-3xl">
                    🎓
                  </span>
                </div>

                {item.field && (
                  <p className="text-cyan-400 mt-4">
                    {item.field}
                  </p>
                )}

                {item.location && (
                  <p className="text-gray-500 text-sm mt-2">
                    📍 {item.location}
                  </p>
                )}

                {item.description && (
                  <p className="text-gray-400 leading-7 mt-4">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && education.length === 0 && (
          <p className="text-center text-gray-400">
            No education details available.
          </p>
        )}

      </div>
    </section>
  );
}