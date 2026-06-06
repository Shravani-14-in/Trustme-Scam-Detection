import React, { useState, useRef, useEffect } from "react";
import {
  Shield, Scan, Key, Clock, ChevronRight,
  RotateCcw, Github, Loader2, Clipboard
} from "lucide-react";
import VerdictCard from "./components/VerdictCard.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import ApiKeyModal from "./components/ApiKeyModal.jsx";
import { analyzeMessage } from "./groq.js";
import { useHistory } from "./useHistory.js";

const EXAMPLES = [
  "Congratulations! You've won ₹50,000 in BSNL Lucky Draw. Send your Aadhaar + bank details to claim. Offer valid 24hrs only!",
  "Hi, I'm HR from TCS. We found your resume on Naukri. WFH job, ₹45K/month. No interview needed. Pay ₹2000 registration fee to start.",
  "Your KYC is expired. Your SBI account will be blocked in 24 hours. Update now: bit.ly/sbikycupdate",
  "This is a reminder from your dentist's office that you have an appointment scheduled for tomorrow at 3 PM. Please call us to confirm.",
  "Dear Customer, your Amazon order #405-3829 has been shipped and will arrive by Thursday. Track at amazon.in/orders",
];

export default function App() {
  const [message, setMessage]       = useState("");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [apiKey, setApiKey]         = useState(() => localStorage.getItem("trustme_key") || "");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activeTab, setActiveTab]   = useState("scan"); // scan | history
  const [charCount, setCharCount]   = useState(0);
  const textareaRef = useRef(null);
  const resultRef   = useRef(null);
  const { history, addEntry, clearHistory } = useHistory();

  const MAX_CHARS = 2000;

  useEffect(() => {
    if (!apiKey) setShowKeyModal(true);
  }, []);

  const handleAnalyze = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    if (!apiKey) { setShowKeyModal(true); return; }
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await analyzeMessage(trimmed, apiKey);
      setResult(res);
      addEntry(trimmed, res);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (ex) => {
    setMessage(ex);
    setCharCount(ex.length);
    setResult(null);
    setActiveTab("scan");
    textareaRef.current?.focus();
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
    } catch {}
  };

  const handleSaveKey = (key) => {
    localStorage.setItem("trustme_key", key);
    setApiKey(key);
    setShowKeyModal(false);
  };

  return (
    <>
      {showKeyModal && (
        <ApiKeyModal
          onSave={handleSaveKey}
          onClose={() => setShowKeyModal(false)}
          existingKey={apiKey}
        />
      )}

      {/* Background radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, rgba(129,140,248,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 50% 35% at 80% 80%, rgba(248,113,113,0.05) 0%, transparent 70%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Nav */}
        <nav style={{
          padding: "0 clamp(16px, 4vw, 48px)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 56, backdropFilter: "blur(12px)",
          background: "rgba(9,9,15,0.7)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Shield size={20} color="var(--accent)" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
              Trust<span style={{ color: "var(--accent)" }}>Me</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => setShowKeyModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--font-mono)",
                cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <Key size={12} />
              {apiKey ? "API Key ✓" : "Set Key"}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <header style={{
          padding: "clamp(40px, 8vw, 72px) clamp(16px, 4vw, 48px) 0",
          textAlign: "center", animation: "fadeUp 0.5s ease both",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "4px 14px", borderRadius: 20,
            background: "var(--accent-dim)", border: "1px solid rgba(129,140,248,0.2)",
            fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--accent)",
            letterSpacing: "0.06em", marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            AI-POWERED · INDIAN CONTEXT AWARE
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 60px)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            Detect Scams Before<br />
            <span style={{
              background: "linear-gradient(135deg, var(--danger) 0%, var(--warn) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              They Fool You
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(14px, 2vw, 16px)", color: "var(--text-secondary)",
            maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7,
          }}>
            Paste any suspicious message — fake jobs, loan offers, phishing links, OTP frauds, prize scams — and get an instant AI analysis with red flags and advice.
          </p>
        </header>

        {/* Main content */}
        <main style={{
          flex: 1, padding: "clamp(16px, 4vw, 40px) clamp(16px, 4vw, 48px)",
          maxWidth: 900, width: "100%", margin: "0 auto",
          display: "flex", flexDirection: "column", gap: 24,
          animation: "fadeUp 0.5s 0.1s ease both", opacity: 0,
          animationFillMode: "forwards",
        }}>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, padding: 4,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 12, width: "fit-content",
          }}>
            {[{ id: "scan", label: "Scan Message", Icon: Scan },
              { id: "history", label: `History (${history.length})`, Icon: Clock }
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 9, border: "none",
                background: activeTab === id ? "var(--accent)" : "transparent",
                color: activeTab === id ? "#fff" : "var(--text-muted)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {activeTab === "scan" && (
            <>
              {/* Textarea */}
              <div style={{
                borderRadius: 16, border: "1px solid var(--border)",
                background: "var(--bg-card)", overflow: "hidden",
                transition: "border-color 0.2s",
              }}
                onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(129,140,248,0.3)"}
                onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{
                  padding: "6px 12px", borderBottom: "1px solid var(--border)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "var(--bg-surface)",
                }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    paste message here
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <NavButton onClick={handlePaste} icon={<Clipboard size={11} />} label="Paste" />
                    {message && <NavButton onClick={handleClear} icon={<RotateCcw size={11} />} label="Clear" />}
                  </div>
                </div>

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
                  placeholder="e.g. 'Congratulations! You've won ₹1,00,000. Click here to claim within 2 hours...'"
                  rows={6}
                  style={{
                    width: "100%", padding: "16px 18px",
                    background: "transparent", border: "none", outline: "none",
                    color: "var(--text-primary)", fontFamily: "var(--font-mono)",
                    fontSize: 13.5, lineHeight: 1.7, resize: "vertical",
                    minHeight: 130,
                  }}
                />

                <div style={{
                  padding: "8px 16px", borderTop: "1px solid var(--border)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "var(--bg-surface)",
                }}>
                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    color: charCount > MAX_CHARS * 0.9 ? "var(--warn)" : "var(--text-muted)",
                  }}>
                    {charCount}/{MAX_CHARS}
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!message.trim() || loading}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 22px", borderRadius: 10,
                      background: !message.trim() || loading ? "var(--bg-elevated)" : "var(--accent)",
                      color: !message.trim() || loading ? "var(--text-muted)" : "#fff",
                      border: "none", cursor: !message.trim() || loading ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                      transition: "all 0.2s",
                      boxShadow: message.trim() && !loading ? "0 4px 16px rgba(129,140,248,0.3)" : "none",
                    }}
                    onMouseEnter={e => { if (message.trim() && !loading) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
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
                  padding: "12px 16px", borderRadius: 10,
                  background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
                  color: "var(--danger)", fontFamily: "var(--font-mono)", fontSize: 13,
                  animation: "fadeUp 0.3s ease",
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

              {/* Example prompts */}
              {!result && !loading && (
                <div>
                  <div style={{
                    fontSize: 10.5, fontFamily: "var(--font-mono)", letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10,
                  }}>
                    Try an example
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {EXAMPLES.map((ex, i) => (
                      <button key={i} onClick={() => handleExample(ex)} style={{
                        textAlign: "left", padding: "10px 14px", borderRadius: 10,
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)", fontSize: 12.5,
                        fontFamily: "var(--font-mono)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                        transition: "border-color 0.2s, background 0.2s",
                        whiteSpace: "nowrap", overflow: "hidden",
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "rgba(129,140,248,0.3)";
                          e.currentTarget.style.background = "var(--bg-elevated)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.background = "var(--bg-card)";
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {ex.length > 90 ? ex.slice(0, 90) + "…" : ex}
                        </span>
                        <ChevronRight size={13} style={{ flexShrink: 0, color: "var(--text-muted)" }} />
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
              onRerun={(msg) => { setMessage(msg); setCharCount(msg.length); setActiveTab("scan"); setResult(null); }}
            />
          )}
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "20px",
          borderTop: "1px solid var(--border)",
          fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Shield size={11} color="var(--text-muted)" />
          TrustMe · Built with Groq + Llama 3.1 · Keys stored locally only
        </footer>
      </div>
    </>
  );
}

function NavButton({ onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 5,
      background: "none", border: "1px solid var(--border)",
      color: "var(--text-muted)", fontSize: 10.5,
      fontFamily: "var(--font-mono)", cursor: "pointer",
      transition: "border-color 0.2s, color 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {icon} {label}
    </button>
  );
}