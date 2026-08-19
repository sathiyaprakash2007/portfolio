"use client";

import { FormEvent, useEffect, useState } from "react";

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
  created_at: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    live_demo: "",
    image: "",
    category: "",
    featured: false,
  });

  // ==========================================
  // GET PROJECTS
  // PUBLIC API - NO TOKEN REQUIRED
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setMessage(
          data.message || "Failed to load projects."
        );
      }
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error
      );

      setMessage(
        "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // FEATURED CHECKBOX
  // ==========================================

  const handleFeaturedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((previous) => ({
      ...previous,
      featured: e.target.checked,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      technologies: "",
      github: "",
      live_demo: "",
      image: "",
      category: "",
      featured: false,
    });

    setEditingId(null);
  };

  // ==========================================
  // ADD / UPDATE PROJECT
  // JWT REQUIRED
  // ==========================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      setMessage(
        "Your login session has expired. Please login again."
      );

      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/projects/${editingId}`
        : "http://localhost:5000/api/projects";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          // JWT
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      // ==========================================
      // TOKEN EXPIRED / INVALID
      // ==========================================

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem(
          "adminLoggedIn"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      if (data.success) {
        setMessage(
          editingId
            ? "Project updated successfully! ✅"
            : "Project added successfully! ✅"
        );

        resetForm();

        await fetchProjects();
      } else {
        setMessage(
          data.message ||
            "Failed to save project."
        );
      }
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      setMessage(
        "Unable to connect to backend."
      );
    }
  };

  // ==========================================
  // EDIT PROJECT
  // ==========================================

  const editProject = (project: Project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies:
        project.technologies || "",
      github: project.github || "",
      live_demo: project.live_demo || "",
      image: project.image || "",
      category: project.category || "",
      featured: Boolean(project.featured),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE PROJECT
  // JWT REQUIRED
  // ==========================================

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      setMessage(
        "Your login session has expired. Please login again."
      );

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // ==========================================
      // TOKEN EXPIRED / INVALID
      // ==========================================

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem(
          "adminLoggedIn"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      if (data.success) {
        setProjects((previous) =>
          previous.filter(
            (project) => project.id !== id
          )
        );

        setMessage(
          "Project deleted successfully."
        );

        if (editingId === id) {
          resetForm();
        }
      } else {
        setMessage(
          data.message ||
            "Failed to delete project."
        );
      }
    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      setMessage(
        "Unable to connect to backend."
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>

            <p className="text-cyan-400">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Manage Projects
            </h1>

          </div>

          <a
            href="/admin"
            className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            ← Dashboard
          </a>

        </div>

        {/* ================================== */}
        {/* MESSAGE */}
        {/* ================================== */}

        {message && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-lg px-5 py-3 text-cyan-400">
            {message}
          </div>
        )}

        {/* ================================== */}
        {/* ADD / EDIT FORM */}
        {/* ================================== */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              {editingId
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5"
          >

            {/* TITLE */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Project Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Portfolio Website"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Web Development"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* TECHNOLOGIES */}
            <div className="md:col-span-2">

              <label className="block text-sm text-gray-300 mb-2">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="C++, MySQL, Python"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* GITHUB */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                GitHub URL
              </label>

              <input
                type="url"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* LIVE DEMO */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Live Demo URL
              </label>

              <input
                type="url"
                name="live_demo"
                value={form.live_demo}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* IMAGE */}
            <div className="md:col-span-2">

              <label className="block text-sm text-gray-300 mb-2">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/project.jpg"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* DESCRIPTION */}
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
                placeholder="Describe your project..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 resize-none"
              />

            </div>

            {/* FEATURED */}
            <div className="md:col-span-2">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleFeaturedChange}
                  className="w-5 h-5 accent-cyan-400"
                />

                <span className="text-gray-300">
                  Featured Project
                </span>

              </label>

            </div>

            {/* BUTTON */}
            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
              >
                {editingId
                  ? "Update Project"
                  : "+ Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* ================================== */}
        {/* EXISTING PROJECTS */}
        {/* ================================== */}

        <div>

          <h2 className="text-2xl font-bold mb-6">
            Existing Projects
          </h2>

          {loading ? (

            <p className="text-gray-400">
              Loading projects...
            </p>

          ) : projects.length === 0 ? (

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

              <p className="text-gray-400">
                No projects found.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {projects.map((project) => (

                <div
                  key={project.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-400 transition"
                >

                  {/* IMAGE */}

                  <div className="h-40 bg-gray-800 flex items-center justify-center">

                    {project.image ? (

                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <span className="text-5xl">
                        💻
                      </span>

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="text-xl font-bold">
                        {project.title}
                      </h3>

                      {project.featured === 1 && (
                        <span className="text-xs bg-cyan-400 text-gray-950 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}

                    </div>

                    {project.category && (
                      <p className="text-cyan-400 text-sm mt-2">
                        {project.category}
                      </p>
                    )}

                    <p className="text-gray-400 text-sm leading-6 mt-4">
                      {project.description}
                    </p>

                    {project.technologies && (
                      <p className="text-gray-500 text-sm mt-4">
                        <span className="text-gray-300">
                          Technologies:
                        </span>{" "}
                        {project.technologies}
                      </p>
                    )}

                    <p className="text-gray-600 text-xs mt-4">
                      Added:{" "}
                      {formatDate(
                        project.created_at
                      )}
                    </p>

                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() =>
                          editProject(project)
                        }
                        className="px-4 py-2 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-950 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteProject(project.id)
                        }
                        className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}