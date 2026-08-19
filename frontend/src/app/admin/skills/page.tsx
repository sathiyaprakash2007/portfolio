"use client";

import { FormEvent, useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "",
  });

  // ==========================================
  // GET SKILLS
  // ==========================================

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/skills"
      );

      const data = await response.json();

      if (data.success) {
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setMessage("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("Adding skill...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Skill added successfully! ✅");

        setForm({
          name: "",
          category: "",
          level: "",
        });

        await fetchSkills();
      } else {
        setMessage(
          data.message || "Failed to add skill."
        );
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  // ==========================================
  // DELETE SKILL
  // ==========================================

  const deleteSkill = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSkills((previous) =>
          previous.filter((skill) => skill.id !== id)
        );

        setMessage("Skill deleted successfully.");
      } else {
        setMessage(
          data.message || "Failed to delete skill."
        );
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setMessage("Unable to delete skill.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>
            <p className="text-cyan-400">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Manage Skills
            </h1>
          </div>

          <a
            href="/admin"
            className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            ← Dashboard
          </a>

        </div>

        {/* Add Skill Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Add New Skill
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-5"
          >

            {/* Skill Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Skill Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="C++"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Programming"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Level
              </label>

              <input
                type="text"
                name="level"
                value={form.level}
                onChange={handleChange}
                placeholder="Intermediate"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-3">

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
              >
                + Add Skill
              </button>

            </div>

          </form>

          {message && (
            <p className="text-cyan-400 mt-5">
              {message}
            </p>
          )}

        </div>

        {/* Existing Skills */}
        <div>

          <h2 className="text-2xl font-bold mb-6">
            Existing Skills
          </h2>

          {loading ? (
            <p className="text-gray-400">
              Loading skills...
            </p>
          ) : skills.length === 0 ? (
            <p className="text-gray-400">
              No skills found.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-400 transition"
                >

                  <h3 className="text-xl font-bold">
                    {skill.name}
                  </h3>

                  <p className="text-cyan-400 text-sm mt-2">
                    {skill.category}
                  </p>

                  {skill.level && (
                    <p className="text-gray-400 text-sm mt-2">
                      Level: {skill.level}
                    </p>
                  )}

                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="mt-5 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}