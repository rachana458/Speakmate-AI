"use client";

import { useState } from "react";
import { generateAI } from "@/lib/ai";

type VocabularyQuestion = {
    word: string;
    meaning: string;
    example: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
};

const topics = {
    Beginner: [
        "common everyday words",
        "family words",
        "food and drinks",
        "school words",
        "home words",
        "daily activities",
        "common adjectives",
        "common verbs",
    ],

    Intermediate: [
        "workplace vocabulary",
        "travel vocabulary",
        "technology vocabulary",
        "education vocabulary",
        "emotions",
        "environment",
        "communication",
        "personality",
    ],

    Advanced: [
        "academic vocabulary",
        "professional vocabulary",
        "advanced adjectives",
        "advanced verbs",
        "formal English",
        "business English",
        "abstract concepts",
        "advanced communication",
    ],
};

const fallbackQuestions: Record<string, VocabularyQuestion[]> = {
    Beginner: [
        {
            word: "Generous",
            meaning: "Willing to give or share with others.",
            example: "My friend is generous and always helps people.",
            question: 'What does "generous" mean?',
            options: [
                "Willing to give or share",
                "Very angry",
                "Unable to speak",
                "Always late",
            ],
            answer: "A",
            explanation:
                "Generous describes someone who is willing to give or share with others.",
        },
        {
            word: "Brave",
            meaning: "Having courage and not being afraid of difficult situations.",
            example: "The brave girl helped the injured dog.",
            question: 'What does "brave" mean?',
            options: [
                "Being afraid",
                "Having courage",
                "Being tired",
                "Being confused",
            ],
            answer: "B",
            explanation:
                "Brave means having courage when facing something difficult or frightening.",
        },
    ],

    Intermediate: [
        {
            word: "Reliable",
            meaning: "Someone or something that can be trusted.",
            example: "She is a reliable employee who always finishes her work.",
            question: 'What does "reliable" mean?',
            options: [
                "Easy to break",
                "Difficult to understand",
                "Able to be trusted",
                "Very expensive",
            ],
            answer: "C",
            explanation:
                "Reliable describes someone or something that can be trusted to work well or do what is expected.",
        },
        {
            word: "Adapt",
            meaning: "To change in order to deal with a new situation.",
            example: "People must adapt to changes in technology.",
            question: 'What does "adapt" mean?',
            options: [
                "To refuse to change",
                "To change to suit a new situation",
                "To forget something",
                "To make something smaller",
            ],
            answer: "B",
            explanation:
                "Adapt means to change your behavior or approach to deal with a new situation.",
        },
    ],

    Advanced: [
        {
            word: "Ambiguous",
            meaning: "Open to more than one possible meaning or interpretation.",
            example:
                "The instructions were ambiguous and confused the students.",
            question: 'What does "ambiguous" mean?',
            options: [
                "Very clear",
                "Extremely short",
                "Having more than one possible meaning",
                "Completely incorrect",
            ],
            answer: "C",
            explanation:
                "Ambiguous means something can be understood in more than one possible way.",
        },
        {
            word: "Coherent",
            meaning: "Logical, clear, and easy to understand.",
            example:
                "She gave a coherent explanation of the problem.",
            question: 'What does "coherent" mean?',
            options: [
                "Logical and clear",
                "Very expensive",
                "Extremely old",
                "Difficult to pronounce",
            ],
            answer: "A",
            explanation:
                "Coherent describes ideas or speech that are logical, connected, and easy to understand.",
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

function parseVocabulary(
    text: string
): VocabularyQuestion | null {
    const cleaned = cleanAIText(text);

    console.log("VOCABULARY AI TEXT:", cleaned);

    const wordMatch = cleaned.match(
        /Word\s*:\s*(.*?)(?=\n?\s*Meaning\s*:)/is
    );

    const meaningMatch = cleaned.match(
        /Meaning\s*:\s*(.*?)(?=\n?\s*Example\s*:)/is
    );

    const exampleMatch = cleaned.match(
        /Example\s*:\s*(.*?)(?=\n?\s*Question\s*:)/is
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
        !wordMatch ||
        !meaningMatch ||
        !exampleMatch ||
        !questionMatch ||
        !optionAMatch ||
        !optionBMatch ||
        !optionCMatch ||
        !optionDMatch ||
        !answerMatch
    ) {
        console.log("Could not parse vocabulary question.");
        return null;
    }

    return {
        word: wordMatch[1].trim(),
        meaning: meaningMatch[1].trim(),
        example: exampleMatch[1].trim(),
        question: questionMatch[1].trim(),
        options: [
            optionAMatch[1].trim(),
            optionBMatch[1].trim(),
            optionCMatch[1].trim(),
            optionDMatch[1].trim(),
        ],
        answer: answerMatch[1].toUpperCase(),
        explanation:
            explanationMatch?.[1]?.trim() ||
            "This is the correct meaning of the word.",
    };
}

function getFallbackQuestion(
    level: string,
    number: number
): VocabularyQuestion {
    const questions =
        fallbackQuestions[level] || fallbackQuestions.Beginner;

    return questions[number % questions.length];
}

export default function VocabularyPage() {
    const [level, setLevel] = useState("Beginner");

    const [question, setQuestion] =
        useState<VocabularyQuestion | null>(null);

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
Create ONE NEW English vocabulary learning exercise.

Learner level: ${level}

Vocabulary topic:
${randomTopic}

Unique random seed:
${randomSeed}

Return EXACTLY this format:

Word: [one English word]
Meaning: [simple meaning]
Example: [one simple example sentence]
Question: What does "[word]" mean?
A) [meaning]
B) [meaning]
C) [meaning]
D) [meaning]
Answer: [A, B, C, or D]
Explanation: [one short explanation]

IMPORTANT RULES:

- Generate a NEW word.
- Do not use the word "generous".
- Do not use the word "brave".
- Do not repeat common words from the examples.
- The word must match the ${level} level.
- Give exactly four options.
- Only one option can be correct.
- The correct answer must be A, B, C, or D.
- The meaning must be simple and accurate.
- The example must use the vocabulary word naturally.
- Do not create a grammar question.
- Do not create a reading comprehension question.
- Do not add an introduction.
- Do not add a conclusion.
- Do not use Markdown.
- Return ONLY the required format.

Generate a completely new vocabulary word now.
`;

        try {
            const aiText = await generateAI(prompt);

            console.log("VOCABULARY GENERATED:", aiText);

            const parsed = parseVocabulary(aiText);

            if (parsed) {
                setQuestion(parsed);
                setMessage(
                    "🤖 New vocabulary exercise generated by AI."
                );
            } else {
                const fallback = getFallbackQuestion(
                    level,
                    questionNumber
                );

                setQuestion(fallback);

                setMessage(
                    "AI returned an unusual format, so a practice word was loaded."
                );
            }
        } catch (error) {
            console.error(
                "Vocabulary AI generation error:",
                error
            );

            const fallback = getFallbackQuestion(
                level,
                questionNumber
            );

            setQuestion(fallback);

            setMessage(
                "AI could not generate this time, so a practice word was loaded."
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

                    <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
                        SpeakMate AI
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        📚 AI Vocabulary Practice
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Learn new English words with AI-generated
                        meanings, examples, and quizzes.
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
                                ? "✨ Generate New AI Word"
                                : "✨ Generate AI Vocabulary"}
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

                {/* WORD */}

                {question && !loading && (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

                        <div className="flex items-center justify-between">

                            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-400">
                                {level}
                            </span>

                            <span className="text-sm text-slate-500">
                                🤖 AI Generated
                            </span>

                        </div>

                        {/* WORD */}

                        <div className="mt-8 rounded-2xl bg-slate-950 p-6">

                            <p className="text-sm uppercase tracking-wider text-slate-500">
                                New Word
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-purple-400">
                                {question.word}
                            </h2>

                            <p className="mt-5 text-lg text-slate-300">
                                <strong className="text-white">
                                    Meaning:
                                </strong>{" "}
                                {question.meaning}
                            </p>

                            <p className="mt-4 text-slate-400">
                                <strong className="text-slate-300">
                                    Example:
                                </strong>{" "}
                                {question.example}
                            </p>

                        </div>

                        {/* QUIZ */}

                        <h3 className="mt-8 text-xl font-semibold">
                            {question.question}
                        </h3>

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
                                className="mt-8 w-full rounded-2xl bg-purple-500 px-6 py-4 font-bold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
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

                                <div className="mt-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5">

                                    <div className="flex items-center gap-2">

                                        <span className="text-xl">
                                            🤖
                                        </span>

                                        <h3 className="font-bold text-purple-300">
                                            Vocabulary Explanation
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
                                    ✨ Generate Next AI Word
                                </button>

                            </div>
                        )}

                    </div>
                )}

                {/* EMPTY STATE */}

                {!question && !loading && (
                    <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">

                        <div className="text-5xl">
                            📚
                        </div>

                        <h2 className="mt-4 text-xl font-bold">
                            Ready to learn?
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Choose your level and generate a new AI
                            vocabulary exercise.
                        </p>

                    </div>
                )}

            </div>
        </main>
    );
}