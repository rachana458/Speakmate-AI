"use client";

import { useState } from "react";
import { generateAI } from "@/lib/ai";

type AIQuestion = {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
};

const topics = {
    Beginner: [
        "am, is, are",
        "has and have",
        "do and does",
        "simple present",
        "simple past",
        "present continuous",
        "past continuous",
        "prepositions",
        "articles a, an, the",
        "subject verb agreement",
    ],

    Intermediate: [
        "present perfect",
        "past perfect",
        "future tense",
        "first conditional",
        "second conditional",
        "modal verbs",
        "relative clauses",
        "reported speech",
        "gerunds and infinitives",
        "comparatives and superlatives",
    ],

    Advanced: [
        "third conditional",
        "mixed conditionals",
        "passive voice",
        "reported speech",
        "future perfect",
        "past perfect continuous",
        "inversion",
        "modal perfect",
        "advanced relative clauses",
        "subjunctive mood",
    ],
};

const fallbackQuestions: Record<string, AIQuestion[]> = {
    Beginner: [
        {
            question: "My brother ___ breakfast every morning.",
            options: ["eat", "eats", "eating", "eaten"],
            answer: "B",
            explanation:
                "We use 'eats' because 'my brother' is a singular subject.",
        },
        {
            question: "They ___ watching television right now.",
            options: ["is", "are", "am", "be"],
            answer: "B",
            explanation:
                "We use 'are' with 'they' in the present continuous tense.",
        },
        {
            question: "I ___ my homework yesterday.",
            options: ["finish", "finishes", "finished", "finishing"],
            answer: "C",
            explanation:
                "We use the past form 'finished' because the action happened yesterday.",
        },
        {
            question: "There ___ two books on the table.",
            options: ["is", "am", "are", "be"],
            answer: "C",
            explanation:
                "We use 'are' because 'two books' is plural.",
        },
    ],

    Intermediate: [
        {
            question: "She ___ in London since 2022.",
            options: ["lives", "lived", "has lived", "is living"],
            answer: "C",
            explanation:
                "The present perfect is used with 'since' for an action that started in the past and continues.",
        },
        {
            question: "If I had more free time, I ___ another language.",
            options: ["learn", "will learn", "would learn", "learned"],
            answer: "C",
            explanation:
                "The second conditional uses 'would' with the base verb for hypothetical situations.",
        },
        {
            question: "The woman ___ works here is my teacher.",
            options: ["which", "who", "where", "what"],
            answer: "B",
            explanation:
                "We use 'who' when referring to a person in a relative clause.",
        },
        {
            question: "He said that he ___ tired.",
            options: ["is", "was", "will be", "has"],
            answer: "B",
            explanation:
                "In reported speech, 'is' commonly changes to 'was' when reporting a past statement.",
        },
    ],

    Advanced: [
        {
            question:
                "If they had left earlier, they ___ the train.",
            options: [
                "catch",
                "would catch",
                "would have caught",
                "will catch",
            ],
            answer: "C",
            explanation:
                "The third conditional uses 'would have' plus the past participle for an unreal past situation.",
        },
        {
            question:
                "By next June, she ___ at the company for ten years.",
            options: [
                "works",
                "will work",
                "will have worked",
                "has worked",
            ],
            answer: "C",
            explanation:
                "The future perfect shows an action completed or accumulated by a future time.",
        },
        {
            question:
                "The documents ___ before the meeting started.",
            options: [
                "had been prepared",
                "prepare",
                "are preparing",
                "have prepare",
            ],
            answer: "A",
            explanation:
                "Past perfect passive shows that the documents were prepared before another past event.",
        },
        {
            question:
                "Had she known the truth, she ___ differently.",
            options: [
                "would have acted",
                "will act",
                "acts",
                "would act",
            ],
            answer: "A",
            explanation:
                "This is an inverted third conditional describing an unreal past situation.",
        },
    ],
};

function cleanAIText(text: string): string {
    return text
        .replace(/```text/gi, "")
        .replace(/```txt/gi, "")
        .replace(/```/g, "")
        .replace(/\r/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .trim();
}

function parseAIQuestion(text: string): AIQuestion | null {
    const cleaned = cleanAIText(text);

    console.log("AI TEXT:", cleaned);

    const questionMatch = cleaned.match(
        /Question\s*:\s*(.*?)(?=\n?\s*A[\)\.])/is
    );

    const optionAMatch = cleaned.match(
        /A[\)\.]\s*(.*?)(?=\n?\s*B[\)\.])/is
    );

    const optionBMatch = cleaned.match(
        /B[\)\.]\s*(.*?)(?=\n?\s*C[\)\.])/is
    );

    const optionCMatch = cleaned.match(
        /C[\)\.]\s*(.*?)(?=\n?\s*D[\)\.])/is
    );

    const optionDMatch = cleaned.match(
        /D[\)\.]\s*(.*?)(?=\n?\s*Answer\s*:)/is
    );

    const answerMatch = cleaned.match(
        /Answer\s*:\s*([ABCD])/i
    );

    const explanationMatch = cleaned.match(
        /Explanation\s*:\s*(.*)$/is
    );

    if (
        !questionMatch ||
        !optionAMatch ||
        !optionBMatch ||
        !optionCMatch ||
        !optionDMatch ||
        !answerMatch
    ) {
        console.log("Could not parse AI question.");
        return null;
    }

    const question = questionMatch[1].trim();

    const options = [
        optionAMatch[1].trim(),
        optionBMatch[1].trim(),
        optionCMatch[1].trim(),
        optionDMatch[1].trim(),
    ];

    const answer = answerMatch[1].toUpperCase();

    const explanation =
        explanationMatch?.[1]?.trim() ||
        `The correct answer is option ${answer}.`;

    if (!question.includes("___")) {
        console.log("AI question does not contain a blank.");
        return null;
    }

    if (options.some((option) => !option)) {
        console.log("One or more AI options are empty.");
        return null;
    }

    return {
        question,
        options,
        answer,
        explanation,
    };
}

function getFallbackQuestion(
    level: string,
    number: number
): AIQuestion {
    const questions =
        fallbackQuestions[level] || fallbackQuestions.Beginner;

    return questions[number % questions.length];
}

export default function GrammarPage() {
    const [level, setLevel] = useState("Beginner");

    const [question, setQuestion] =
        useState<AIQuestion | null>(null);

    const [selectedAnswer, setSelectedAnswer] =
        useState("");

    const [showResult, setShowResult] =
        useState(false);

    const [score, setScore] = useState(0);

    const [questionsAnswered, setQuestionsAnswered] =
        useState(0);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [questionNumber, setQuestionNumber] =
        useState(0);

    async function generateQuestion() {
        setLoading(true);
        setQuestion(null);
        setSelectedAnswer("");
        setShowResult(false);
        setMessage("");

        const levelTopics =
            topics[level as keyof typeof topics];

        const randomTopic =
            levelTopics[
            Math.floor(Math.random() * levelTopics.length)
            ];

        const randomSeed =
            Math.floor(Math.random() * 1000000);

        const prompt = `
Create ONE NEW English grammar multiple-choice question.

Learner level: ${level}

Grammar topic:
${randomTopic}

Unique random seed:
${randomSeed}

The question MUST be a fill-in-the-blank question.

Return EXACTLY this format:

Question: [sentence containing exactly one ___]
A) [option]
B) [option]
C) [option]
D) [option]
Answer: [A, B, C, or D]
Explanation: [one short grammar explanation]

IMPORTANT RULES:

- Test grammar only.
- The sentence MUST contain ___.
- Exactly four options.
- Exactly one correct answer.
- Answer must be A, B, C, or D.
- Do NOT ask what a sentence means.
- Do NOT ask a vocabulary question.
- Do NOT ask reading comprehension.
- Do NOT explain vocabulary.
- Do NOT add an introduction.
- Do NOT add a conclusion.
- Do NOT use Markdown.
- Do NOT use code blocks.
- Do NOT copy the example.
- Generate a NEW sentence.
- Try to use a different sentence structure from previous questions.
- Keep the question appropriate for ${level}.
- Return ONLY the required format.

Do not use this example:
She ___ to school every day.

Generate a completely different question now.
`;

        try {
            const aiText = await generateAI(prompt);

            console.log("AI GENERATED TEXT:", aiText);

            const parsed = parseAIQuestion(aiText);

            if (parsed) {
                setQuestion(parsed);
                setMessage(
                    "🤖 New question generated by local AI."
                );
            } else {
                const fallback = getFallbackQuestion(
                    level,
                    questionNumber
                );

                setQuestion(fallback);

                setMessage(
                    "AI returned an unusual format, so a practice question was loaded."
                );
            }
        } catch (error) {
            console.error("AI generation error:", error);

            const fallback = getFallbackQuestion(
                level,
                questionNumber
            );

            setQuestion(fallback);

            setMessage(
                "AI could not generate this time, so a practice question was loaded."
            );
        } finally {
            setLoading(false);
        }
    }

    function selectAnswer(answer: string) {
        if (showResult) return;

        setSelectedAnswer(answer);
    }

    function checkAnswer() {
        if (!question || !selectedAnswer) return;

        setShowResult(true);

        setQuestionsAnswered(
            (previous) => previous + 1
        );

        if (selectedAnswer === question.answer) {
            setScore((previous) => previous + 1);
        }
    }

    function nextQuestion() {
        setQuestionNumber(
            (previous) => previous + 1
        );

        generateQuestion();
    }

    function changeLevel(newLevel: string) {
        setLevel(newLevel);

        setQuestion(null);
        setSelectedAnswer("");
        setShowResult(false);
        setMessage("");

        setScore(0);
        setQuestionsAnswered(0);
        setQuestionNumber(0);
    }

    function getOptionClass(letter: string) {
        if (!showResult) {
            if (selectedAnswer === letter) {
                return "border-blue-500 bg-blue-500/10";
            }

            return "border-slate-700 bg-slate-950 hover:border-slate-500";
        }

        if (letter === question?.answer) {
            return "border-green-500 bg-green-500/10";
        }

        if (
            letter === selectedAnswer &&
            selectedAnswer !== question?.answer
        ) {
            return "border-red-500 bg-red-500/10";
        }

        return "border-slate-700 bg-slate-950";
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
            <div className="mx-auto max-w-4xl">

                <a
                    href="/"
                    className="text-sm text-slate-400 hover:text-white"
                >
                    ← Back to SpeakMate
                </a>

                <div className="mt-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                        SpeakMate AI
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        📝 AI Grammar Practice
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Generate a new grammar question with AI
                        and practice your English.
                    </p>

                </div>

                {/* LEVEL */}

                <div className="mt-8 flex flex-wrap gap-3">

                    {["Beginner", "Intermediate", "Advanced"].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => changeLevel(item)}
                                className={`rounded-xl px-5 py-3 font-semibold transition ${level === item
                                    ? "bg-white text-slate-950"
                                    : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                {item}
                            </button>
                        )
                    )}

                </div>

                {/* GENERATE */}

                <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

                    <button
                        onClick={generateQuestion}
                        disabled={loading}
                        className="w-full rounded-2xl bg-white px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "🤖 AI is generating..."
                            : question
                                ? "✨ Generate New AI Question"
                                : "✨ Generate AI Grammar Question"}
                    </button>

                    {message && (
                        <p className="mt-4 text-center text-sm text-slate-400">
                            {message}
                        </p>
                    )}

                </div>

                {/* SCORE */}

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

                    <div>
                        <p className="text-sm text-slate-400">
                            Questions answered
                        </p>

                        <p className="text-xl font-bold">
                            {questionsAnswered}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-slate-400">
                            Score
                        </p>

                        <p className="text-xl font-bold">
                            {score}
                        </p>
                    </div>

                </div>

                {/* QUESTION */}

                {question && !loading && (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

                        <div className="flex items-center justify-between">

                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400">
                                {level}
                            </span>

                            <span className="text-sm text-slate-500">
                                🤖 AI Generated
                            </span>

                        </div>

                        <h2 className="mt-8 text-2xl font-semibold leading-relaxed">
                            {question.question}
                        </h2>

                        {/* OPTIONS */}

                        <div className="mt-8 grid gap-4">

                            {question.options.map(
                                (option, index) => {

                                    const letter =
                                        ["A", "B", "C", "D"][index];

                                    return (
                                        <button
                                            key={letter}
                                            onClick={() =>
                                                selectAnswer(letter)
                                            }
                                            disabled={showResult}
                                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${getOptionClass(
                                                letter
                                            )}`}
                                        >

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 font-bold">
                                                {letter}
                                            </span>

                                            <span className="text-lg">
                                                {option}
                                            </span>

                                            {showResult &&
                                                letter === question.answer && (
                                                    <span className="ml-auto text-green-400">
                                                        ✓
                                                    </span>
                                                )}

                                            {showResult &&
                                                letter === selectedAnswer &&
                                                letter !== question.answer && (
                                                    <span className="ml-auto text-red-400">
                                                        ✗
                                                    </span>
                                                )}

                                        </button>
                                    );
                                }
                            )}

                        </div>

                        {/* CHECK ANSWER */}

                        {!showResult && (
                            <button
                                onClick={checkAnswer}
                                disabled={!selectedAnswer}
                                className="mt-8 w-full rounded-2xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Check Answer
                            </button>
                        )}

                        {/* RESULT */}

                        {showResult && (
                            <div className="mt-8">

                                <div
                                    className={`rounded-2xl border p-5 ${selectedAnswer === question.answer
                                        ? "border-green-500/30 bg-green-500/10"
                                        : "border-red-500/30 bg-red-500/10"
                                        }`}
                                >

                                    <h3 className="text-xl font-bold">
                                        {selectedAnswer === question.answer
                                            ? "🎉 Correct!"
                                            : "❌ Not quite"}
                                    </h3>

                                    <p className="mt-2 text-slate-300">
                                        Correct answer:{" "}
                                        <strong className="text-white">
                                            {question.answer}
                                        </strong>
                                        {" — "}
                                        {
                                            question.options[
                                            ["A", "B", "C", "D"].indexOf(
                                                question.answer
                                            )
                                            ]
                                        }
                                    </p>

                                </div>

                                {/* EXPLANATION */}

                                <div className="mt-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5">

                                    <div className="flex items-center gap-2">

                                        <span className="text-xl">
                                            🤖
                                        </span>

                                        <h3 className="font-bold text-purple-300">
                                            Grammar Explanation
                                        </h3>

                                    </div>

                                    <p className="mt-3 leading-relaxed text-slate-300">
                                        {question.explanation}
                                    </p>

                                </div>

                                {/* NEXT */}

                                <button
                                    onClick={nextQuestion}
                                    className="mt-6 w-full rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-200"
                                >
                                    ✨ Generate Next AI Question
                                </button>

                            </div>
                        )}

                    </div>
                )}

                {/* EMPTY STATE */}

                {!question && !loading && (
                    <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">

                        <div className="text-5xl">
                            🤖
                        </div>

                        <h2 className="mt-4 text-xl font-bold">
                            Ready to practice?
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Choose your level and click the button
                            above to generate a new AI grammar question.
                        </p>

                    </div>
                )}

            </div>
        </main>
    );
}