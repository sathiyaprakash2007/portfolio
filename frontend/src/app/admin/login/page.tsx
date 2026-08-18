"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Invalid username or password"
        );

        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Keep login state
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      // Go to dashboard
      router.replace("/admin");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="text-5xl mb-4">
              🔐
            </div>

            <h1 className="text-3xl font-bold">
              Admin Login
            </h1>

            <p className="text-gray-400 mt-2">
              Login to manage your portfolio
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Username */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                autoComplete="username"
                placeholder="Enter username"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-gray-950 font-semibold py-3 rounded-lg hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}