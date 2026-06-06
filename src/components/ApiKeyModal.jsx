import React, { useState } from "react";
import { Key, Eye, EyeOff, ExternalLink, X } from "lucide-react";

export default function ApiKeyModal({ onSave, onClose, existingKey }) {
  const [val, setVal]       = useState(existingKey || "");
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState("");

  const handleSave = () => {
    const trimmed = val.trim();
    if (!trimmed.startsWith("gsk_")) {
      setError("Groq API keys start with 'gsk_'. Check and try again.");
      return;
    }
    onSave(trimmed);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(9,9,15,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        width: "100%", maxWidth: 440,
        background: "var(--bg-card)", borderRadius: 18,
        border: "1px solid var(--border)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        padding: "28px 28px 24px",
        animation: "fadeUp 0.3s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "var(--accent-dim)", border: "1px solid rgba(129,140,248,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Key size={16} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
                Groq API Key
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Required to run analysis
              </div>
            </div>
          </div>
          {existingKey && (
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 4, borderRadius: 6,
            }}>
              <X size={16} />
            </button>
          )}
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
          Your key is stored locally in your browser and never sent to any server other than Groq directly.
        </p>

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            type={show ? "text" : "password"}
            value={val}
            onChange={e => { setVal(e.target.value); setError(""); }}
            placeholder="gsk_..."
            onKeyDown={e => e.key === "Enter" && handleSave()}
            style={{
              width: "100%", padding: "11px 44px 11px 14px",
              background: "var(--bg-base)", border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
              borderRadius: 10, color: "var(--text-primary)",
              fontFamily: "var(--font-mono)", fontSize: 13,
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = "rgba(129,140,248,0.4)"; }}
            onBlur={e => { if (!error) e.target.style.borderColor = "var(--border)"; }}
          />
          <button
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", display: "flex",
            }}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {error && (
          <div style={{ fontSize: 12, color: "var(--danger)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: "11px",
            background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 10,
            fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
            cursor: "pointer", transition: "opacity 0.2s",
            marginBottom: 14,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Save Key
        </button>

        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            fontSize: 12, color: "var(--text-muted)", textDecoration: "none",
            fontFamily: "var(--font-mono)",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          Get a free key at console.groq.com <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}