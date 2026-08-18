import Navbar from "../components/Navbar";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import Education from "../components/Education";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center">

          <p className="text-cyan-400 text-lg mb-4">
            Welcome to my portfolio
          </p>

          <h1 className="text-5xl md:text-7xl font-bold">
            Hi, I'm{" "}
            <span className="text-cyan-400">
              Sathiyaprakash M
            </span>{" "}
            👋
          </h1>

          <p className="mt-6 text-xl text-gray-300">
            CSE (AI & ML) Student | Aspiring Full Stack Developer
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <a
              href="#projects"
              className="px-6 py-3 bg-cyan-500 text-gray-950 font-semibold rounded-full hover:bg-cyan-400 transition"
            >
              View My Work
            </a>

            <a
              href="#contact"
              className="px-6 py-3 border border-gray-600 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              Contact Me
            </a>

          </div>

        </div>
      </section>

      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certificates />
      <Education />
      <Contact />
      

    </main>
  );
}