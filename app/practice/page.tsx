"use client";

import { useState } from "react";
import { generateReply } from "../../lib/ai";

type Message = {
    role: "user" | "ai";
    text: string;
};

export default function PracticePage() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            text: "Hi! I'm your English practice partner. What would you like to talk about today?",
        },
    ]);

    async function sendMessage() {
        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                text: userMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const result: any = await generateReply(userMessage);

            let reply = "";

            if (Array.isArray(result) && result[0]?.generated_text) {
                reply = result[0].generated_text;
            } else if (result?.generated_text) {
                reply = result.generated_text;
            } else {
                reply = "I'm having trouble generating a response. Please try again.";
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    text: reply,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    text: "Sorry, I couldn't start the AI right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
                <div className="mb-8">
                    <a
                        href="/"
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        ← Back to SpeakMate
                    </a>

                    <h1 className="mt-4 text-3xl font-bold">
                        🗣️ English Practice
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Practice English with your AI conversation partner.
                    </p>
                </div>

                <div className="flex-1 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    {messages.map((item, index) => (
                        <div
                            key={index}
                            className={`flex ${item.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 ${item.role === "user"
                                    ? "bg-white text-slate-950"
                                    : "bg-slate-800 text-slate-200"
                                    }`}
                            >
                                {item.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="text-sm text-slate-400">
                            🤖 SpeakMate is thinking...
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-3">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        disabled={loading}
                        placeholder="Type your English message..."
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-slate-400 disabled:opacity-50"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="rounded-xl bg-white px-6 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>
                </div>
            </div>
        </main>
    );
}