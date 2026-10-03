
"use client";

import { useState } from "react";
import { generateAI } from "@/lib/ai";

type CorrectionQuestion = {
    incorrect: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
};

const topics = {
    Beginner: [
        "subject verb agreement",
        "simple present tense",
        "simple past tense",
        "am is are",
        "has and have",
        "articles",
        "prepositions",
        "common everyday grammar mistakes",
    ],

    Intermediate: [
        "present perfect",
        "past perfect",
        "future tense",
        "conditionals",
        "modal verbs",
        "relative clauses",
        "reported speech",
        "common workplace English mistakes",
    ],

    Advanced: [
        "advanced verb tenses",
        "conditional sentences",
        "passive voice",
        "reported speech",
        "advanced prepositions",
        "relative clauses",
        "formal English",
        "complex sentence structure",
    ],
};

const fallbackQuestions: Record<string, CorrectionQuestion[]> = {
    Beginner: [
        {
            incorrect: "She go to school every day.",
            question: "Which sentence is correct?",
            options: [
                "She go to school every day.",
                "She goes to school every day.",
                "She going to school every day.",
                "She gone to school every day.",
            ],
            answer: "B",
            explanation:
                "With 'she', the simple present verb takes -s, so 'go' becomes 'goes'.",
        },
        {
            incorrect: "They is playing football.",
            question: "Which sentence correctly fixes the mistake?",
            options: [
                "They is playing football.",
                "They am playing football.",
                "They are playing football.",
                "They be playing football.",
            ],
            answer: "C",
            explanation:
                "We use 'are' with the plural subject 'they'.",
        },
    ],

    Intermediate: [
        {
            incorrect: "I have seen him yesterday.",
            question: "Which sentence is correct?",
            options: [
                "I have seen him yesterday.",
                "I saw him yesterday.",
                "I see him yesterday.",
                "I had see him yesterday.",
            ],
            answer: "B",
            explanation:
                "A finished time such as 'yesterday' normally takes the simple past: 'I saw him yesterday.'",
        },
        {
            incorrect: "She has went to the market.",
            question: "Which sentence correctly fixes the mistake?",
            options: [
                "She has went to the market.",
                "She has go to the market.",
                "She has gone to the market.",
                "She have gone to the market.",
            ],
            answer: "C",
            explanation:
                "The present perfect uses 'has/have' followed by the past participle. The past participle of 'go' is 'gone'.",
        },
    ],

    Advanced: [
        {
            incorrect: "If I would have known, I would have helped.",
            question: "Which sentence is grammatically correct?",
            options: [
                "If I would have known, I would have helped.",
                "If I had known, I would have helped.",
                "If I knew, I would have helped.",
                "If I have known, I would help.",
            ],
            answer: "B",
            explanation:
                "The third conditional uses 'if + past perfect' followed by 'would have + past participle'.",
        },
        {
            incorrect:
                "The report has been completed by the team yesterday.",
            question: "Which sentence correctly fixes the mistake?",
            options: [
                "The report has been completed by the team yesterday.",
                "The report was completed by the team yesterday.",
                "The report is completed by the team yesterday.",
                "The report had completed by the team yesterday.",
            ],
            answer: "B",
            explanation:
                "Because 'yesterday' refers to a finished time in the past, the simple past passive 'was completed' is appropriate.",
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

function parseCorrection(
    text: string
): CorrectionQuestion | null {
    const cleaned = cleanAIText(text);

    console.log("CORRECTION AI TEXT:", cleaned);

    const incorrectMatch = cleaned.match(
        /Incorrect\s*:\s*(.*?)(?=\n?\s*Question\s*:)/is
    );

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
        !incorrectMatch ||
        !questionMatch ||
        !optionAMatch ||
        !optionBMatch ||
        !optionCMatch ||
        !optionDMatch ||
        !answerMatch
    ) {
        console.log(
            "Could not parse sentence correction question."
        );

        return null;
    }

    const options = [
        optionAMatch[1].trim(),
        optionBMatch[1].trim(),
        optionCMatch[1].trim(),
        optionDMatch[1].trim(),
    ];

    if (options.some((option) => !option)) {
        return null;
    }

    return {
        incorrect: incorrectMatch[1].trim(),
        question: questionMatch[1].trim(),
        options,
        answer: answerMatch[1].toUpperCase(),
        explanation:
            explanationMatch?.[1]?.trim() ||
            "The selected sentence correctly fixes the grammar mistake.",
    };
}

function getFallbackQuestion(
    level: string,
    number: number
): CorrectionQuestion {
    const questions =
        fallbackQuestions[level] ||
        fallbackQuestions.Beginner;

    return questions[number % questions.length];
}

export default function CorrectionPage() {
    const [level, setLevel] = useState("Beginner");

    const [question, setQuestion] =
        useState<CorrectionQuestion | null>(null);

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
Create ONE NEW English sentence correction exercise.

Learner level: ${level}

Grammar topic:
${randomTopic}

Unique random seed:
${randomSeed}

Return EXACTLY this format:

Incorrect: [one incorrect English sentence]
Question: Which sentence correctly fixes the mistake?
A) [sentence]
B) [sentence]
C) [sentence]
D) [sentence]
Answer: [A, B, C, or D]
Explanation: [one short explanation of the grammar mistake]

IMPORTANT RULES:

- Create a NEW sentence every time.
- The original sentence MUST contain a grammar mistake.
- The question must test English grammar.
- Exactly ONE option must be grammatically correct.
- The other three options must contain realistic grammar mistakes.
- The correct option must be A, B, C, or D.
- Keep the difficulty appropriate for ${level}.
- Do NOT create a vocabulary question.
- Do NOT ask what a word means.
- Do NOT create a reading comprehension question.
- Do NOT add an introduction.
- Do NOT add a conclusion.
- Do NOT use Markdown.
- Do NOT use code blocks.
- Do NOT copy the examples.
- Generate a completely new sentence.

Return ONLY the required format.
`;

        try {
            const aiText = await generateAI(prompt);

            console.log(
                "CORRECTION GENERATED:",
                aiText
            );

            const parsed = parseCorrection(aiText);

            if (parsed) {
                setQuestion(parsed);

                setMessage(
                    "🤖 New sentence correction exercise generated by AI."
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
            console.error(
                "Correction AI generation error:",
                error
            );

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

                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                        SpeakMate AI
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        ✍️ AI Sentence Correction
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Find grammar mistakes, choose the correct
                        sentence, and learn why it is correct.
                    </p>

                </div>

                {/* LEVEL */}

                <div className="mt-8 flex flex-wrap gap-3">

                    {[
                        "Beginner",
                        "Intermediate",
                        "Advanced",
                    ].map((item) => (
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
                    ))}

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
                                ? "✨ Generate New Correction"
                                : "✨ Generate AI Correction"}
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

                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                                {level}
                            </span>

                            <span className="text-sm text-slate-500">
                                🤖 AI Generated
                            </span>

                        </div>

                        {/* INCORRECT SENTENCE */}

                        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

                            <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
                                Find the mistake
                            </p>

                            <p className="mt-3 text-xl font-semibold leading-relaxed">
                                {question.incorrect}
                            </p>

                        </div>

                        {/* OPTIONS */}

                        <h2 className="mt-8 text-xl font-semibold">
                            {question.question}
                        </h2>

                        <div className="mt-5 grid gap-4">

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

                        {/* CHECK */}

                        {!showResult && (
                            <button
                                onClick={checkAnswer}
                                disabled={!selectedAnswer}
                                className="mt-8 w-full rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
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

                                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">

                                    <div className="flex items-center gap-2">

                                        <span className="text-xl">
                                            🤖
                                        </span>

                                        <h3 className="font-bold text-emerald-300">
                                            Grammar Explanation
                                        </h3>

                                    </div>

                                    <p className="mt-3 leading-relaxed text-slate-300">
                                        {question.explanation}
                                    </p>

                                </div>

                                <button
                                    onClick={nextQuestion}
                                    className="mt-6 w-full rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-200"
                                >
                                    ✨ Generate Next Correction
                                </button>

                            </div>
                        )}

                    </div>
                )}

                {/* EMPTY STATE */}

                {!question && !loading && (
                    <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">

                        <div className="text-5xl">
                            ✍️
                        </div>

                        <h2 className="mt-4 text-xl font-bold">
                            Ready to improve your English?
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Choose your level and generate an AI
                            sentence correction exercise.
                        </p>

                    </div>
                )}

            </div>
        </main>
    );
}
