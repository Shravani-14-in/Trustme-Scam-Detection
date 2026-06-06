import React, { useEffect, useRef } from "react";
import {
  ShieldAlert, ShieldCheck, ShieldQuestion,
  AlertTriangle, CheckCircle2, Info, Zap, Tag, Brain
} from "lucide-react";

const VERDICT_CONFIG = {
  SCAM: {
    icon: ShieldAlert,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    label: "Scam Detected",
    headerBg: "#fff5f5",
    glow: "rgba(220,38,38,0.08)",
  },
  LEGITIMATE: {
    icon: ShieldCheck,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Looks Legitimate",
    headerBg: "#f0fdf8",
    glow: "rgba(5,150,105,0.06)",
  },
  SUSPICIOUS: {
    icon: ShieldQuestion,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Suspicious",
    headerBg: "#fffdf0",
    glow: "rgba(217,119,6,0.07)",
  },
};

function ConfidenceMeter({ value, color }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = "0%";
      setTimeout(() => { if (barRef.current) barRef.current.style.width = `${value}%`; }, 80);
    }
  }, [value]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Confidence
        </span>
        <span style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color, fontWeight: 600 }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
        <div ref={barRef} style={{
          height: "100%", background: color, borderRadius: 3,
          transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }} />
      </div>
    </div>
  );
}

function Chip({ children, color, bg, border }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600,
      letterSpacing: "0.03em", color, background: bg,
      border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  );
}

function HighlightedMessage({ original, phrases }) {
  if (!phrases || phrases.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.75 }}>
        {original}
      </p>
    );
  }
  let parts = [{ text: original, highlight: false }];
  phrases.forEach((phrase) => {
    if (!phrase) return;
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    parts = parts.flatMap((part) => {
      if (part.highlight) return [part];
      return part.text.split(regex).map((chunk) => ({
        text: chunk,
        highlight: regex.test(chunk),
      }));
    });
  });

  return (
    <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.8, color: "var(--text-secondary)" }}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark key={i} style={{
            background: "#fee2e2", color: "#dc2626",
            borderRadius: 3, padding: "0 2px",
            border: "1px solid #fca5a5",
          }}>
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, fontFamily: "var(--font-mono)", letterSpacing: "0.1em",
      textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export default function VerdictCard({ result, originalMessage }) {
  const cfg = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.SUSPICIOUS;
  const Icon = cfg.icon;

  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${cfg.border}`,
      background: cfg.bg,
      boxShadow: `var(--shadow-md), 0 0 0 4px ${cfg.glow}`,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding: "20px 24px 18px",
        borderBottom: `1px solid ${cfg.border}`,
        background: cfg.headerBg,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: result.verdict === "SCAM" ? "pulse-ring 2s infinite" : undefined,
            boxShadow: "var(--shadow-sm)",
          }}>
            <Icon size={22} color={cfg.color} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800,
              color: cfg.color, letterSpacing: "-0.02em",
            }}>
              {cfg.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1, fontFamily: "var(--font-mono)" }}>
              {result.category || "Unknown Category"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Chip color={cfg.color} bg={cfg.bg} border={cfg.border}>
            <Tag size={10} /> {result.risk_level} RISK
          </Chip>
          {result.scam_technique && result.verdict !== "LEGITIMATE" && (
            <Chip color="#4f46e5" bg="#eef2ff" border="#c7d2fe">
              <Brain size={10} /> {result.scam_technique}
            </Chip>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

        <ConfidenceMeter value={result.confidence} color={cfg.color} />

        {/* Summary */}
        <div style={{
          padding: "13px 15px", borderRadius: 9,
          background: "#fff", border: "1px solid #e5e7eb",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Info size={14} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {result.summary}
            </p>
          </div>
        </div>

        {/* Highlighted phrases */}
        {result.highlighted_phrases?.length > 0 && (
          <div>
            <SectionLabel>Suspicious phrases highlighted</SectionLabel>
            <div style={{
              padding: "13px 15px", borderRadius: 9,
              background: "#fff", border: "1px solid #e5e7eb",
              boxShadow: "var(--shadow-sm)",
            }}>
              <HighlightedMessage original={originalMessage} phrases={result.highlighted_phrases} />
            </div>
          </div>
        )}

        {/* Red flags */}
        {result.red_flags?.length > 0 && (
          <div>
            <SectionLabel>Red Flags</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {result.red_flags.map((flag, i) => (
                <div key={i} style={{
                  display: "flex", gap: 9, alignItems: "flex-start",
                  padding: "9px 12px", borderRadius: 8,
                  background: "#fff", border: "1px solid #fca5a5",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <AlertTriangle size={13} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe signals */}
        {result.safe_signals?.length > 0 && (
          <div>
            <SectionLabel>Safe Signals</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {result.safe_signals.map((sig, i) => (
                <div key={i} style={{
                  display: "flex", gap: 9, alignItems: "flex-start",
                  padding: "9px 12px", borderRadius: 8,
                  background: "#fff", border: "1px solid #a7f3d0",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <CheckCircle2 size={13} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{sig}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        {result.advice && (
          <div style={{
            display: "flex", gap: 9, alignItems: "flex-start",
            padding: "12px 15px", borderRadius: 9,
            background: "#eef2ff", border: "1px solid #c7d2fe",
            boxShadow: "var(--shadow-sm)",
          }}>
            <Zap size={14} color="#4f46e5" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              <strong style={{ color: "#4f46e5", fontWeight: 600 }}>What to do: </strong>
              {result.advice}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}