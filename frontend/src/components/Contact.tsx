"use client";

import { FormEvent, useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus("Sending...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages",
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
        setStatus("Message sent successfully! ✅");

        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Unable to connect to the server.");
    }
  };

  return (
    <section
      id="contact"
      className="bg-gray-950 text-white px-6 py-24"
    >
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-lg">
            Get In Touch
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Contact{" "}
            <span className="text-cyan-400">
              Me
            </span>
          </h2>

          <p className="text-gray-400 mt-5">
            Have a project or opportunity? Feel free to contact me.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8"
        >

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Subject */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              rows={6}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-400 transition resize-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-cyan-400 text-gray-950 font-semibold hover:bg-cyan-300 transition"
          >
            Send Message
          </button>

          {/* Status */}
          {status && (
            <p className="text-center text-cyan-400 mt-5">
              {status}
            </p>
          )}

        </form>
      </div>
    </section>
  );
}