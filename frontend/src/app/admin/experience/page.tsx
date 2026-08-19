"use client";

import { FormEvent, useEffect, useState } from "react";

interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  location: string;
}

export default function AdminExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
  });

  // ==========================================
  // GET EXPERIENCE
  // ==========================================

  const fetchExperience = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/experience"
      );

      const data = await response.json();

      if (data.success) {
        setExperience(data.experience || []);
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
      setMessage("Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD EXPERIENCE
  // ==========================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("Adding experience...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/experience",
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
        setMessage("Experience added successfully! ✅");

        setForm({
          company: "",
          role: "",
          description: "",
          start_date: "",
          end_date: "",
          location: "",
        });

        await fetchExperience();
      } else {
        setMessage(
          data.message || "Failed to add experience."
        );
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  // ==========================================
  // DELETE EXPERIENCE
  // ==========================================

  const deleteExperience = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/experience/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setExperience((previous) =>
          previous.filter((item) => item.id !== id)
        );

        setMessage("Experience deleted successfully.");
      } else {
        setMessage(
          data.message || "Failed to delete experience."
        );
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      setMessage("Unable to delete experience.");
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
              Manage Experience
            </h1>
          </div>

          <a
            href="/admin"
            className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            ← Dashboard
          </a>

        </div>

        {/* Add Experience */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Add New Experience
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >

            {/* Company */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                placeholder="NUX Software Solutions"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Role
              </label>

              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                placeholder="Figma Design Intern"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Coimbatore, Tamil Nadu"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your experience..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
              >
                + Add Experience
              </button>

            </div>

          </form>

          {message && (
            <p className="text-cyan-400 mt-5">
              {message}
            </p>
          )}

        </div>

        {/* Existing Experience */}
        <div>

          <h2 className="text-2xl font-bold mb-6">
            Existing Experience
          </h2>

          {loading ? (
            <p className="text-gray-400">
              Loading experience...
            </p>
          ) : experience.length === 0 ? (
            <p className="text-gray-400">
              No experience found.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {experience.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition"
                >

                  <h3 className="text-xl font-bold">
                    {item.role}
                  </h3>

                  <p className="text-cyan-400 mt-2">
                    {item.company}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    {item.start_date}{" "}
                    —{" "}
                    {item.end_date || "Present"}
                  </p>

                  {item.location && (
                    <p className="text-gray-400 text-sm mt-2">
                      📍 {item.location}
                    </p>
                  )}

                  <p className="text-gray-400 text-sm leading-6 mt-4">
                    {item.description}
                  </p>

                  <button
                    onClick={() =>
                      deleteExperience(item.id)
                    }
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