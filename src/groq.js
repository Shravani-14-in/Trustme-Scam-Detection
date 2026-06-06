
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export async function analyzeMessage(message, apiKey) {
  const systemPrompt = `You are TrustMe, a cybersecurity expert specializing in detecting scams, fraud, and deceptive messages in the Indian digital context. You analyze messages with deep expertise in:
- Fake job/internship offers
- Fake loan offers and financial fraud
- Phishing attacks and OTP scams
- Lottery/prize scams
- Investment fraud (crypto, stock market, MLM)
- Government impersonation (TRAI, Income Tax, PM schemes)
- KYC update scams
- Delivery/courier scams
- Romance scams
- Fake NGO/charity scams

Analyze the given message and respond ONLY with a valid JSON object. No explanation outside the JSON. No markdown fences.

JSON format:
{
  "verdict": "SCAM" | "LEGITIMATE" | "SUSPICIOUS",
  "confidence": <number 0-100>,
  "category": "<short category name, e.g. Fake Job Offer, Phishing, etc.>",
  "risk_level": "HIGH" | "MEDIUM" | "LOW",
  "summary": "<2-3 sentence human-readable summary of why this verdict was reached>",
  "red_flags": ["<flag 1>", "<flag 2>", ...],
  "safe_signals": ["<signal 1>", ...],
  "highlighted_phrases": ["<suspicious phrase from original text>", ...],
  "advice": "<1 actionable sentence on what to do>",
  "scam_technique": "<name of psychological trick used, e.g. Urgency, Authority, Fear, Greed, etc.>"
}

If the message appears legitimate, red_flags can be an empty array. Be precise, contextual, and realistic. Do not over-flag obvious legitimate messages.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this message:\n\n"${message}"` },
      ],
      temperature: 0.1,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Failed to parse analysis response. Please try again.");
  }
}