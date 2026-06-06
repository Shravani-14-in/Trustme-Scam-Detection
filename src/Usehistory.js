import { useState, useEffect } from "react";
const STORAGE_KEY = "trustme_history";
const MAX_HISTORY = 20;
export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);
  const addEntry = (message, result) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: message.slice(0, 200),
      verdict: result.verdict,
      confidence: result.confidence,
      category: result.category,
      risk_level: result.risk_level,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  };
  const clearHistory = () => setHistory([]);
  return { history, addEntry, clearHistory };
}