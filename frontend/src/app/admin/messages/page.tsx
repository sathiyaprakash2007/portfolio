"use client";

import { useEffect, useState } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // GET MESSAGES
  // ==========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/messages"
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setMessage(
          data.message || "Failed to load messages."
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ==========================================
  // DELETE MESSAGE
  // ==========================================

  const deleteMessage = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((previous) =>
          previous.filter((item) => item.id !== id)
        );

        setMessage("Message deleted successfully.");
      } else {
        setMessage(
          data.message || "Failed to delete message."
        );
      }
    } catch (error) {
      console.error("Error deleting message:", error);

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

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
              Messages
            </h1>

            <p className="text-gray-400 mt-2">
              Messages received from your portfolio.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchMessages}
              className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              ↻ Refresh
            </button>

            <a
              href="/admin"
              className="px-5 py-2 rounded-lg border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              ← Dashboard
            </a>

          </div>

        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 px-5 py-3 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400">
            {message}
          </div>
        )}

        {/* Count */}
        <div className="mb-6">
          <span className="text-gray-400">
            Total Messages:{" "}
          </span>

          <span className="font-bold text-cyan-400">
            {messages.length}
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📭
            </div>

            <h2 className="text-2xl font-bold">
              No Messages
            </h2>

            <p className="text-gray-400 mt-2">
              You haven't received any messages yet.
            </p>

          </div>
        ) : (
          <div className="space-y-6">

            {messages.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition"
              >

                {/* Top */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold">
                      {item.subject || "No Subject"}
                    </h2>

                    <div className="mt-3 space-y-1">

                      <p className="text-gray-300">
                        <span className="text-gray-500">
                          From:
                        </span>{" "}
                        {item.name}
                      </p>

                      <p className="text-cyan-400">
                        {item.email}
                      </p>

                    </div>

                  </div>

                  <p className="text-gray-500 text-sm">
                    {formatDate(item.created_at)}
                  </p>

                </div>

                {/* Message */}
                <div className="mt-6 bg-gray-950 border border-gray-800 rounded-xl p-5">

                  <p className="text-gray-300 whitespace-pre-wrap leading-7">
                    {item.message}
                  </p>

                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">

                  <a
                    href={`mailto:${item.email}`}
                    className="px-4 py-2 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Reply
                  </a>

                  <button
                    onClick={() =>
                      deleteMessage(item.id)
                    }
                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}