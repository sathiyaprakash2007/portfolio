"use client";

import { FormEvent, useEffect, useState } from "react";

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  description: string;
  start_year: number;
  end_year: number;
  location: string;
}

export default function AdminEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    field: "",
    description: "",
    start_year: "",
    end_year: "",
    location: "",
  });

  // ==========================================
  // GET EDUCATION
  // ==========================================

  const fetchEducation = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/education"
      );

      const data = await response.json();

      if (data.success) {
        setEducation(data.education || []);
      }
    } catch (error) {
      console.error("Error fetching education:", error);
      setMessage("Failed to load education.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
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
  // ADD EDUCATION
  // ==========================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("Adding education...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/education",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            start_year: Number(form.start_year),
            end_year: Number(form.end_year),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Education added successfully! ✅");

        setForm({
          institution: "",
          degree: "",
          field: "",
          description: "",
          start_year: "",
          end_year: "",
          location: "",
        });

        await fetchEducation();
      } else {
        setMessage(
          data.message || "Failed to add education."
        );
      }
    } catch (error) {
      console.error("Error adding education:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  // ==========================================
  // DELETE EDUCATION
  // ==========================================

  const deleteEducation = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/education/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setEducation((previous) =>
          previous.filter((item) => item.id !== id)
        );

        setMessage("Education deleted successfully.");
      } else {
        setMessage(
          data.message || "Failed to delete education."
        );
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      setMessage("Unable to delete education.");
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
              Manage Education
            </h1>
          </div>

          <a
            href="/admin"
            className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            ← Dashboard
          </a>

        </div>

        {/* Add Education */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Add New Education
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >

            {/* Institution */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Institution
              </label>

              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                required
                placeholder="College / University"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                required
                placeholder="B.E / B.Tech"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Field of Study
              </label>

              <input
                type="text"
                name="field"
                value={form.field}
                onChange={handleChange}
                placeholder="Computer Science and Engineering"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Location */}
            <div>
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

            {/* Start Year */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Start Year
              </label>

              <input
                type="number"
                name="start_year"
                value={form.start_year}
                onChange={handleChange}
                required
                placeholder="2023"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* End Year */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                End Year
              </label>

              <input
                type="number"
                name="end_year"
                value={form.end_year}
                onChange={handleChange}
                required
                placeholder="2027"
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
                rows={5}
                placeholder="Describe your education..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
              >
                + Add Education
              </button>

            </div>

          </form>

          {message && (
            <p className="text-cyan-400 mt-5">
              {message}
            </p>
          )}

        </div>

        {/* Existing Education */}
        <div>

          <h2 className="text-2xl font-bold mb-6">
            Existing Education
          </h2>

          {loading ? (
            <p className="text-gray-400">
              Loading education...
            </p>
          ) : education.length === 0 ? (
            <p className="text-gray-400">
              No education records found.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {education.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="text-xl font-bold">
                        {item.degree}
                      </h3>

                      <p className="text-cyan-400 mt-2">
                        {item.institution}
                      </p>
                    </div>

                    <span className="text-3xl">
                      🎓
                    </span>

                  </div>

                  {item.field && (
                    <p className="text-gray-300 mt-4">
                      {item.field}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm mt-2">
                    {item.start_year} — {item.end_year}
                  </p>

                  {item.location && (
                    <p className="text-gray-400 text-sm mt-2">
                      📍 {item.location}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-gray-400 text-sm leading-6 mt-4">
                      {item.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      deleteEducation(item.id)
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