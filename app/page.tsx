"use client";

const modes = [
  {
    title: "Grammar Practice",
    description:
      "Practice grammar with AI-generated questions, answer checking, and explanations.",
    emoji: "📝",
    href: "/grammar",
  },
  {
    title: "Vocabulary Practice",
    description:
      "Learn English words through meanings, examples, quizzes, and explanations.",
    emoji: "📚",
    href: "/vocabulary",
  },
  {
    title: "Sentence Correction",
    description:
      "Find grammar mistakes in sentences and learn how to correct them.",
    emoji: "✍️",
    href: "/correction",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
            🤖 AI-powered English practice
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            SpeakMate AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            A simple AI practice companion for learning English through
            grammar, vocabulary, and sentence correction.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
            Built as a focused learning tool for a real friend who is
            improving their English.
          </p>
        </div>
      </section>

      {/* Practice modes */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Choose a practice mode
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Practice at your own level
            </h2>

            <p className="mt-3 text-slate-400">
              Choose a topic and let SpeakMate generate an exercise for you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {modes.map((mode) => (
              <a
                key={mode.title}
                href={mode.href}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-800"
              >
                <div className="text-4xl">{mode.emoji}</div>

                <h3 className="mt-5 text-xl font-bold">
                  {mode.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                  {mode.description}
                </p>

                <div className="mt-6 font-semibold text-emerald-400 transition group-hover:text-emerald-300">
                  Start practicing →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-900/50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              How it works
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Learn by practicing
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">1️⃣</div>
              <h3 className="mt-4 font-bold">
                Choose your level
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Start with Beginner, Intermediate, or Advanced exercises.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">2️⃣</div>
              <h3 className="mt-4 font-bold">
                Practice with AI
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                AI generates exercises and explanations for your practice.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="text-3xl">3️⃣</div>
              <h3 className="mt-4 font-bold">
                Check and learn
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Check your answer, see your score, and understand the mistake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-12">
          <div className="text-4xl">🧠</div>

          <h2 className="mt-5 text-3xl font-bold">
            AI that runs locally in the browser
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            SpeakMate uses a local AI model through Transformers.js and
            WebGPU to generate English practice exercises directly in the
            browser.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
              Transformers.js
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
              WebGPU
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
              Qwen2.5
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300">
              Next.js
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
          <p>SpeakMate AI — Built for learning through practice.</p>
          <p className="mt-2">
            Hacktoberfest 2026 · DEV Weekend Challenge
          </p>
        </div>
      </footer>
    </main>
  );
}