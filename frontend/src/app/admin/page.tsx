"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

interface Experience {
  id: number;
  company: string;
  role: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // STEP 87 - CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [router]);

  // ==========================================
  // GET DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      const [
        projectsResponse,
        skillsResponse,
        experienceResponse,
        educationResponse,
        certificatesResponse,
        messagesResponse,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/projects"),
        fetch("http://localhost:5000/api/skills"),
        fetch("http://localhost:5000/api/experience"),
        fetch("http://localhost:5000/api/education"),
        fetch("http://localhost:5000/api/certificates"),
        fetch("http://localhost:5000/api/messages"),
      ]);

      const projectsData = await projectsResponse.json();
      const skillsData = await skillsResponse.json();
      const experienceData = await experienceResponse.json();
      const educationData = await educationResponse.json();
      const certificatesData =
        await certificatesResponse.json();
      const messagesData = await messagesResponse.json();

      setProjects(projectsData.projects || []);
      setSkills(skillsData.skills || []);
      setExperience(experienceData.experience || []);
      setEducation(educationData.education || []);
      setCertificates(
        certificatesData.certificates || []
      );
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");

    router.push("/admin/login");
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const stats = [
    {
      title: "Projects",
      count: projects.length,
      icon: "💻",
    },
    {
      title: "Skills",
      count: skills.length,
      icon: "⚡",
    },
    {
      title: "Experience",
      count: experience.length,
      icon: "💼",
    },
    {
      title: "Education",
      count: education.length,
      icon: "🎓",
    },
    {
      title: "Certificates",
      count: certificates.length,
      icon: "🏆",
    },
    {
      title: "Messages",
      count: messages.length,
      icon: "📩",
    },
  ];

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <header className="border-b border-gray-800 bg-gray-900">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Logo / Title */}
          <div>
            <h1 className="text-2xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Sathiyaprakash M Portfolio
            </p>
          </div>

          {/* Header Buttons */}
          <div className="flex flex-wrap gap-3">

            {/* View Portfolio */}
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              View Portfolio
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* WELCOME */}
        <div className="mb-10">

          <h2 className="text-3xl font-bold">
            Dashboard Overview
          </h2>

          <p className="text-gray-400 mt-2">
            Manage your portfolio content from one place.
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="text-center text-gray-400 py-20">
            Loading dashboard...
          </div>

        ) : (

          <>

            {/* STATISTICS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

              {stats.map((stat) => (

                <div
                  key={stat.title}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-400 transition"
                >

                  <div className="text-3xl">
                    {stat.icon}
                  </div>

                  <p className="text-gray-400 text-sm mt-4">
                    {stat.title}
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {stat.count}
                  </p>

                </div>

              ))}

            </div>

            {/* MANAGEMENT */}
            <div className="mt-12">

              <h2 className="text-2xl font-bold mb-6">
                Manage Portfolio
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* PROJECTS */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    💻
                  </div>

                  <h3 className="text-xl font-bold">
                    Projects
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Add and manage your portfolio projects.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/projects")
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Manage Projects
                  </button>

                </div>

                {/* SKILLS */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    ⚡
                  </div>

                  <h3 className="text-xl font-bold">
                    Skills
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Manage your technical skills.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/skills")
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Manage Skills
                  </button>

                </div>

                {/* EXPERIENCE */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    💼
                  </div>

                  <h3 className="text-xl font-bold">
                    Experience
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Manage internships and experience.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/experience")
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Manage Experience
                  </button>

                </div>

                {/* EDUCATION */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    🎓
                  </div>

                  <h3 className="text-xl font-bold">
                    Education
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Manage your education details.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/education")
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Manage Education
                  </button>

                </div>

                {/* CERTIFICATES */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    🏆
                  </div>

                  <h3 className="text-xl font-bold">
                    Certificates
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Manage your certificates.
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        "/admin/certificates"
                      )
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Manage Certificates
                  </button>

                </div>

                {/* MESSAGES */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

                  <div className="text-3xl mb-4">
                    📩
                  </div>

                  <h3 className="text-xl font-bold">
                    Messages
                  </h3>

                  <p className="text-gray-400 mt-2">
                    View messages received from visitors.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/messages")
                    }
                    className="mt-5 px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    View Messages
                  </button>

                </div>

              </div>

            </div>

          </>

        )}

      </div>

    </main>
  );
}