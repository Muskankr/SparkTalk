
# SparkTalk — From Match to Conversation

**Turn awkward first messages into meaningful conversations.**

SparkTalk is a conversation companion designed to help people move beyond matching and start talking. It offers conversation starters based on shared interests and context, along with tone-based reply suggestions to make starting a conversation feel easier and more natural.

Built for **AFFECIO HACKS ’26** — Problem Statement #2: *From Match to Conversation*.

---

## ✨ Features

- 💬 **Conversation Starters** — Generate suggestions based on interests and conversation context.
- 🎭 **Multiple Tones** — Choose from Playful, Thoughtful, Friendly, and Flirty.
- 💌 **Reply Coach** — Get alternative reply suggestions for a conversation.
- 📋 **One-Click Copy** — Copy suggestions and use them in your conversations.
- ⚡ **Responsive Interface** — Designed to work across desktop and mobile screens.
- 🔒 **No API Key Required** — The current version uses local, rule-based templates instead of an external AI service.

---

## 🎯 The Problem

Getting a match is only the beginning. Starting a conversation can be difficult when you don't know what to say, how to express yourself, or how to keep a chat going.

SparkTalk focuses on that gap between matching and meaningful conversation by providing approachable prompts and tone-based reply ideas.

## 💡 Our Approach

SparkTalk gives users a simple way to:

1. Enter interests or a conversation context.
2. Select the tone that fits their personality.
3. Generate conversation starters.
4. Use Reply Coach to explore alternative responses.
5. Copy a suggestion and personalize it before sending.

The goal is to help users express themselves—not replace their personality or authentic communication.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Interactive user interface |
| TypeScript | Type-safe application code |
| Tailwind CSS | Responsive styling |
| Next.js Route Handlers | Conversation suggestion API |
| JavaScript | Client-side interactions |

## ⚙️ How It Works

The current implementation uses **rule-based templates** selected according to the user's interests, context, and chosen tone. The Reply Coach also provides tone-based reply templates.

It does not currently use a live LLM or perform semantic AI analysis of messages. This keeps the prototype lightweight and usable without a paid API key.

---

## 🚀 Getting Started

### Prerequisites

- Node.js compatible with your installed Next.js version
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Muskankr/SparkTalk.git
cd SparkTalk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build

```bash
npm run build
```

No environment variables are required for the current rule-based implementation.

---

## 📁 Project Structure

```text
SparkTalk/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── public/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

*The structure above describes the expected main files; your repository may contain additional configuration or asset files.*

---

## 🌱 Future Improvements

- Integrate an optional AI model for context-aware suggestions.
- Improve reply suggestions using the meaning and intent of a message.
- Add conversation-context controls and personalization.
- Support additional languages and communication styles.
- Introduce accessibility improvements and user feedback features.

These are planned improvements, not claims about existing functionality.

---

## 🔐 Privacy

Avoid entering sensitive personal information into conversation fields. The current prototype is designed around generating suggestions locally through the application's rule-based logic and does not require an external AI API key.

Review the deployed application's hosting and server behavior before making broader privacy guarantees.

---

## 🏆 Hackathon

**Event:** AFFECIO HACKS '26  
**Problem Statement:** #2 — From Match to Conversation  
**Project:** SparkTalk

---

## 👩‍💻 Author

**Muskan Kumari**

- GitHub: [@Muskankr](https://github.com/Muskankr)

---

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you want to publish the project under an open-source license.

---

<p align="center">
  Made with 💜 to make starting conversations a little easier.
</p>
