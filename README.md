# 🤖 SpeakMate AI

SpeakMate AI is a browser-based English learning companion built for a real friend who is learning English.

Instead of being a general-purpose chatbot, SpeakMate focuses on active English practice through AI-generated exercises.
<img width="1920" height="1080" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/513c79f2-04d6-457f-b658-39707a0769cf" />
<img width="1920" height="1080" alt="Screenshot (110)" src="https://github.com/user-attachments/assets/14dd0450-cd2d-454e-9155-c0d09d015b3f" />
<img width="1920" height="1080" alt="Screenshot (109)" src="https://github.com/user-attachments/assets/a953e608-441c-4f93-922a-7015cc05ff92" />


## ✨ Features

### 📝 Grammar Practice
- Beginner, Intermediate, and Advanced levels
- AI-generated grammar questions
- Multiple-choice answers
- Instant answer checking
- Grammar explanations
- Score tracking

### 📚 Vocabulary Practice
- Learn new English words
- Word meanings and examples
- AI-generated vocabulary questions
- Multiple-choice quizzes
- Explanations and scoring

### ✍️ Sentence Correction
- Find mistakes in English sentences
- Choose the grammatically correct sentence
- AI-generated correction exercises
- Explanations of grammar mistakes
- Score tracking

## 🧠 AI

SpeakMate uses a local AI model in the browser.

The project uses:

- Transformers.js
- WebGPU
- Qwen2.5-0.5B-Instruct
- Next.js
- TypeScript
- Tailwind CSS

The AI generates practice questions and explanations directly in the browser rather than relying on a paid cloud AI API.

## 🏗️ How It Works

```text
User
  ↓
Choose Practice Mode
  ↓
Choose Difficulty Level
  ↓
Local AI Model
  ↓
Generate Exercise
  ↓
Answer Question
  ↓
Check Answer
  ↓
Explanation + Score

🎯 Why I Built SpeakMate

I built SpeakMate AI for a real friend who is learning English.

While learning, it can be difficult to find simple exercises that match your level and give immediate explanations.

The goal of SpeakMate is to make English practice more interactive and accessible.

Rather than building another general chatbot, I wanted to create a focused learning tool where AI is used for a specific purpose: generating personalized practice exercises.


🌱 Open AI Approach

One of the interesting parts of this project is that the AI runs locally in the browser using Transformers.js and WebGPU.

This makes the project interesting for experimentation because the application can work with a local model instead of depending entirely on a paid hosted AI API.

The model and AI pipeline can also be changed as the project evolves.


🛠️ Tech Stack
Technology=	Purpose
Next.js=	Web application
TypeScript=	Application development
Tailwind CSS=	UI styling
Transformers.js=	Running the AI model
WebGPU=	Browser acceleration
Qwen2.5=	Local language model
