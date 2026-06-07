# TrustMe - AI Scam Detector

**TrustMe** is an AI-powered scam detection web app built for the Indian digital context. Paste any suspicious message and get an instant verdict with red flags, confidence score, highlighted phrases, and actionable advice.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) 
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-F55036?style=flat)

---

## What It Detects

- Fake job & internship offers
- Fake loan schemes and financial fraud
- Phishing attacks and OTP scams
- Lottery and prize scams
- Investment fraud — crypto, MLM, stock tips
- Government impersonation — TRAI, Income Tax, PM schemes
- KYC / account suspension scams
- Courier and delivery scams
- Romance scams
- Fake NGO / charity appeals

---

## Features

- **Instant verdict** — SCAM / SUSPICIOUS / LEGITIMATE with confidence score
- **Red flag breakdown** — every suspicious element listed clearly
- **Phrase highlighting** — dangerous parts of the original message marked in red
- **Scam technique tag** — identifies psychological tricks like Urgency, Fear, Greed, Authority
- **Actionable advice** — one clear step on what to do next
- **Scan history** — last 20 checks saved locally in the browser
- **Ctrl+Enter** shortcut to analyze
- **Clean professional UI** — light theme, works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI Model | Llama 3.1 8B via Groq API |
| Styling | CSS variables + inline styles (no CSS framework) |
| Fonts | Plus Jakarta Sans + JetBrains Mono |
| Storage | localStorage (history, no backend needed) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A free [Groq API key](https://console.groq.com/keys)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/trustme.git
cd trustme

# 2. Install dependencies
npm install

# 3. Set up your environment variable
cp .env.example .env
# Open .env and paste your Groq API key
```

### Environment Setup

Create a `.env` file in the root of the project:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> Your key is only used to call the Groq API directly from your browser. It is never stored on any server.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
trustme/
├── .env                        # Your API key (never commit this)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Main layout, scan UI, routing between tabs
    ├── groq.js                 # Groq API call + prompt logic
    ├── useHistory.js           # localStorage history hook
    ├── index.css               # Global styles and design tokens
    └── components/
        ├── VerdictCard.jsx     # Result card with confidence meter and flags
        └── HistoryPanel.jsx    # Past scans tab
```

---

## How It Works

1. User pastes a suspicious message into the textarea
2. The message is sent to the **Groq API** with a structured system prompt
3. The model (`llama-3.1-8b-instant`) returns a **JSON object** with verdict, confidence, red flags, highlighted phrases, and advice
4. The UI renders the result in a verdict card with color-coded sections
5. Each scan is saved to `localStorage` for quick re-access from the History tab

---




---

*Built with Groq + Llama 3.1 · Made for India 🇮🇳*
