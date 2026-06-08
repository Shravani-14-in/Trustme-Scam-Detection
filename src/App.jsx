import React, { useState, useRef } from "react";
import {
  Shield, Scan, Clock, ChevronRight,
  RotateCcw, Loader2, Clipboard
} from "lucide-react";
import VerdictCard from "./components/VerdictCard.jsx";
import HistoryPanel from "./components/ HistoryPanel.jsx";
import { analyzeMessage } from "./groq.js";
import { useHistory } from "./Usehistory.js";

const EXAMPLES = [
  "Congratulations! You've won ₹50,000 in BSNL Lucky Draw. Send your Aadhaar + bank details to claim. Offer valid 24hrs only!",
  "Hi, I'm HR from TCS. We found your resume on Naukri. WFH job, ₹45K/month. No interview needed. Pay ₹2000 registration fee to start.",
  "Your KYC is expired. Your SBI account will be blocked in 24 hours. Update now: bit.ly/sbikycupdate",
  "This is a reminder from your dentist's office that you have an appointment scheduled for tomorrow at 3 PM. Please call us to confirm.",
  "Dear Customer, your Amazon order #405-3829 has been shipped and will arrive by Thursday. Track at amazon.in/orders",
];

export default function App() {
  const [message, setMessage]     = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("scan");
  const [charCount, setCharCount] = useState(0);

  const textareaRef = useRef(null);
  const resultRef   = useRef(null);
  const { history, addEntry, clearHistory } = useHistory();

  const MAX_CHARS = 2000;

  const handleAnalyze = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await analyzeMessage(trimmed);
      setResult(res);
      addEntry(trimmed, res);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (ex) => {
    setMessage(ex);
    setCharCount(ex.length);
    setResult(null);
    setError("");
    setActiveTab("scan");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleClear = () => {
    setMessage("");
    setCharCount(0);
    setResult(null);
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const clamped = text.slice(0, MAX_CHARS);
      setMessage(clamped);
      setCharCount(clamped.length);
      setResult(null);
      setError("");
    } catch {}
  };

  const isAnalyzeDisabled = !message.trim() || loading;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>

      {/* Nav */}
      <nav style={{
        padding: "0 clamp(16px, 4vw, 48px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 58,
        background: "rgba(175, 83, 255, 0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
          }}>
            <Shield size={16} color="#fff" />
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 17, letterSpacing: "-0.02em", color: "var(--text-primary)",
          }}>
            Trust<span style={{ color: "var(--accent)" }}>Me</span>
          </span>
        </div>
        <span style={{
          fontSize: 12, fontFamily: "var(--font-mono)",
          color: "white", letterSpacing: "0.02em",
        }}>
          Scam Detection
        </span>
      </nav>
      {/* Hero */}
      <header style={{
        padding: "clamp(40px, 7vw, 68px) clamp(16px, 4vw, 48px) 0",
        textAlign: "center",
        animation: "fadeUp 0.45s ease both",
      }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5.5vw, 54px)",
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          marginBottom: 14,
        }}>
          Is this message safe{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            or a scam?
          </span>
        </h1>
        <p style={{
          fontSize: "clamp(14px, 1.8vw, 16px)",
          color: "var(--text-secondary)",
          maxWidth: 500, margin: "0 auto 36px",
          lineHeight: 1.75, fontWeight: 400,
        }}>
          Paste any message: job offers, loan deals, prize alerts, OTP requests and get an instant AI verdict with red flags and advice.
        </p>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        padding: "clamp(16px, 4vw, 36px) clamp(16px, 4vw, 48px)",
        maxWidth: 860, width: "100%", margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 20,
      }}>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 2, padding: 3,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 10, width: "fit-content",
        }}>
          {[
            { id: "scan",    label: "Scan Message", Icon: Scan },
            { id: "history", label: `History (${history.length})`, Icon: Clock },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 15px", borderRadius: 8, border: "none",
                background: activeTab === id ? "#fff" : "transparent",
                color: activeTab === id ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
                cursor: "pointer", transition: "all 0.18s",
                boxShadow: activeTab === id ? "var(--shadow-sm)" : "none",
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {activeTab === "scan" && (
          <>
            {/* Input card */}
            <div
              style={{
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocusCapture={e => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
                e.currentTarget.style.boxShadow = "var(--shadow-md), 0 0 0 3px rgba(79,70,229,0.08)";
              }}
              onBlurCapture={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Toolbar */}
              <div style={{
                padding: "8px 14px",
                borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#fafafa",
              }}>
                <span style={{
                  fontSize: 11.5, fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)", letterSpacing: "0.03em",
                }}>
                  Paste your message below
                </span>
                <div style={{ display: "flex", gap: 5 }}>
                  <ToolBtn onClick={handlePaste} icon={<Clipboard size={11} />} label="Paste" />
                  {message && <ToolBtn onClick={handleClear} icon={<RotateCcw size={11} />} label="Clear" />}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={e => {
                  const v = e.target.value.slice(0, MAX_CHARS);
                  setMessage(v);
                  setCharCount(v.length);
                  setResult(null);
                  setError("");
                }}
                onKeyDown={e => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAnalyze();
                }}
                placeholder="e.g. 'Congratulations! You've won ₹1,00,000. Click here to claim within 2 hours...'"
                rows={6}
                style={{
                  width: "100%", padding: "16px 18px",
                  background: "transparent", border: "none", outline: "none",
                  color: "var(--text-primary)", fontFamily: "var(--font-mono)",
                  fontSize: 13.5, lineHeight: 1.75, resize: "vertical", minHeight: 130,
                }}
              />

              {/* Footer bar */}
              <div style={{
                padding: "8px 14px",
                borderTop: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#fafafa",
              }}>
                <span style={{
                  fontSize: 11.5, fontFamily: "var(--font-mono)",
                  color: charCount > MAX_CHARS * 0.9 ? "var(--warn)" : "var(--text-muted)",
                }}>
                  {charCount} / {MAX_CHARS} · Ctrl+Enter to analyze
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzeDisabled}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 22px", borderRadius: 9,
                    background: isAnalyzeDisabled ? "#e5e7eb" : "var(--accent)",
                    color: isAnalyzeDisabled ? "#9ca3af" : "#fff",
                    border: "none",
                    cursor: isAnalyzeDisabled ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13.5,
                    transition: "all 0.18s",
                    boxShadow: !isAnalyzeDisabled ? "0 3px 12px rgba(79,70,229,0.35)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!isAnalyzeDisabled) {
                      e.currentTarget.style.background = "#4338ca";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.45)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isAnalyzeDisabled) {
                      e.currentTarget.style.background = "var(--accent)";
                      e.currentTarget.style.boxShadow = "0 3px 12px rgba(79,70,229,0.35)";
                    }
                  }}
                >
                  {loading
                    ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing…</>
                    : <><Scan size={14} /> Analyze</>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "11px 16px", borderRadius: 10,
                background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
                color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 13,
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div ref={resultRef}>
                <VerdictCard result={result} originalMessage={message} />
              </div>
            )}

            {/* Examples — only shown when no result and not loading */}
            {!result && !loading && (
              <div>
                <p style={{
                  fontSize: 11, fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", marginBottom: 10, fontWeight: 500,
                }}>
                  Try an example
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleExample(ex)}
                      style={{
                        textAlign: "left", padding: "10px 14px", borderRadius: 9,
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)", fontSize: 12.5,
                        fontFamily: "var(--font-mono)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                        transition: "border-color 0.18s, background 0.18s, color 0.18s",
                        whiteSpace: "nowrap", overflow: "hidden",
                        boxShadow: "var(--shadow-sm)",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "var(--accent-border)";
                        e.currentTarget.style.background = "var(--accent-light)";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ex.length > 90 ? ex.slice(0, 90) + "…" : ex}
                      </span>
                      <ChevronRight size={13} style={{ flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "history" && (
          <HistoryPanel
            history={history}
            onClear={clearHistory}
            onRerun={(msg) => {
              setMessage(msg);
              setCharCount(msg.length);
              setActiveTab("scan");
              setResult(null);
              setError("");
            }}
          />
        )}
      </main>

      {/* Footer */}
    </div>
  );
}

function ToolBtn({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "3px 9px", borderRadius: 6,
        background: "#fff", border: "1px solid var(--border)",
        color: "var(--text-muted)", fontSize: 11,
        fontFamily: "var(--font-mono)", cursor: "pointer",
        transition: "border-color 0.18s, color 0.18s",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--accent-border)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      {icon} {label}
    </button>
  );
}