export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold">
          SP<span className="text-cyan-400">.</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-300">

          <a
            href="#home"
            className="hover:text-cyan-400 transition"
          >
            Home
          </a>

          <a
            href="#about"
            className="hover:text-cyan-400 transition"
          >
            About
          </a>

          <a
            href="#skills"
            className="hover:text-cyan-400 transition"
          >
            Skills
          </a>

          <a
            href="#projects"
            className="hover:text-cyan-400 transition"
          >
            Projects
          </a>

          <a
            href="#experience"
            className="hover:text-cyan-400 transition"
          >
            Experience
          </a>

          <a
            href="#certificates"
            className="hover:text-cyan-400 transition"
          >
            Certificates
          </a>

          <a
            href="#contact"
            className="hover:text-cyan-400 transition"
          >
            Contact
          </a>

        </div>

        {/* Contact Button */}
        <a
          href="#contact"
          className="hidden md:block px-5 py-2 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-950 transition"
        >
          Let's Talk
        </a>

      </div>
    </nav>
  );
}