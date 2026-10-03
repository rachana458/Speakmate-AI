"use client";

import { useState } from "react";
import { generateAI } from "@/lib/ai";

export default function AITestPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    async function testAI() {
        setLoading(true);
        setResult("");

        try {
            const response = await generateAI(
                "Create one simple English grammar fill-in-the-blank question for a beginner. Give four options and the correct answer."
            );

            setResult(JSON.stringify(response, null, 2));
        } catch (error) {
            console.error(error);
            setResult("AI test failed. Check the terminal/browser console.");
        }

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl">
                <a
                    href="/"
                    className="text-sm text-slate-400 hover:text-white"
                >
                    ← Back to SpeakMate
                </a>

                <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-3xl font-bold">
                        🤖 SpeakMate AI Test
                    </h1>

                    <p className="mt-3 text-slate-400">
                        This page checks whether the local AI model can run in your browser.
                    </p>

                    <button
                        onClick={testAI}
                        disabled={loading}
                        className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 disabled:opacity-50"
                    >
                        {loading ? "Loading AI..." : "Test AI"}
                    </button>

                    {result && (
                        <div className="mt-8 rounded-2xl bg-slate-950 p-5">
                            <h2 className="mb-3 font-semibold">AI Response</h2>

                            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-slate-300">
                                {result}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}