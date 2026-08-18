export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen bg-gray-900 text-white flex items-center px-6 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-lg">
            Get To Know Me
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            About <span className="text-cyan-400">Me</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <div className="w-64 h-64 mx-auto md:mx-0 rounded-2xl border border-cyan-400/30 bg-gray-800 flex items-center justify-center">
              <span className="text-7xl font-bold text-cyan-400">
                SP
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">
              CSE (AI & ML) Student
            </h3>

            <p className="text-gray-300 leading-8">
              I'm Sathiyaprakash M, a Computer Science and Engineering
              student specializing in Artificial Intelligence and Machine
              Learning. I'm passionate about building useful applications
              and exploring modern technologies.
            </p>

            <p className="text-gray-300 leading-8 mt-5">
              I'm currently developing my skills in full-stack development,
              artificial intelligence, machine learning, UI/UX design,
              and problem solving.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <p className="text-cyan-400 font-semibold">
                  Education
                </p>
                <p className="text-gray-300 mt-2">
                  CSE (AI & ML)
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <p className="text-cyan-400 font-semibold">
                  Focus
                </p>
                <p className="text-gray-300 mt-2">
                  Full Stack & AI
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}