import React, { useEffect, useRef } from "react";
import {
  ShieldAlert, ShieldCheck, ShieldQuestion,
  AlertTriangle, CheckCircle2, Info, Zap, Tag, Brain
} from "lucide-react";

const VERDICT_CONFIG = {
  SCAM: {
    icon: ShieldAlert,
    color: "var(--danger)",
    bg: "var(--danger-bg)",
    border: "var(--danger-border)",
    label: "SCAM DETECTED",
    glow: "rgba(248,113,113,0.15)",
  },
  LEGITIMATE: {
    icon: ShieldCheck,
    color: "var(--safe)",
    bg: "var(--safe-bg)",
    border: "var(--safe-border)",
    label: "LOOKS SAFE",
    glow: "rgba(52,211,153,0.12)",
  },
  SUSPICIOUS: {
    icon: ShieldQuestion,
    color: "var(--warn)",
    bg: "var(--warn-bg)",
    border: "var(--warn-border)",
    label: "SUSPICIOUS",
    glow: "rgba(251,191,36,0.12)",
  },
};

function ConfidenceMeter({ value, color }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (barRef.current) barRef.current.style.width = `${value}%`;
        }, 100);
      });
    }
  }, [value]);

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Confidence
        </span>
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color }}>
          {value}%
        </span>
      </div>
      <div style={{
        height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden"
      }}>
        <div ref={barRef} style={{
          height: "100%", background: color, borderRadius: 2,
          transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function Chip({ children, color, bg, border }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontFamily: "var(--font-mono)",
      letterSpacing: "0.04em", fontWeight: 500,
      color, background: bg,
      border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  );
}

function HighlightedMessage({ original, phrases }) {
  if (!phrases || phrases.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
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
            background: "rgba(248,113,113,0.18)",
            color: "var(--danger)",
            borderRadius: 3,
            padding: "0 2px",
            border: "1px solid rgba(248,113,113,0.3)",
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

export default function VerdictCard({ result, originalMessage }) {
  const cfg = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.SUSPICIOUS;
  const Icon = cfg.icon;

  return (
    <div style={{
      animation: "fadeUp 0.4s ease both",
      borderRadius: 16,
      border: `1px solid ${cfg.border}`,
      background: `linear-gradient(145deg, ${cfg.bg}, var(--bg-card))`,
      boxShadow: `0 0 40px ${cfg.glow}, 0 1px 0 ${cfg.border} inset`,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding: "24px 28px 20px",
        borderBottom: `1px solid ${cfg.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: result.verdict === "SCAM" ? "pulse-ring 2s infinite" : undefined,
          }}>
            <Icon size={24} color={cfg.color} />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
              color: cfg.color, letterSpacing: "-0.02em",
            }}>
              {cfg.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
              {result.category || "Unknown Category"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip color={cfg.color} bg={cfg.bg} border={cfg.border}>
            <Tag size={10} /> {result.risk_level} RISK
          </Chip>
          {result.scam_technique && result.verdict !== "LEGITIMATE" && (
            <Chip color="var(--accent)" bg="var(--accent-dim)" border="rgba(129,140,248,0.2)">
              <Brain size={10} /> {result.scam_technique}
            </Chip>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Confidence */}
        <ConfidenceMeter value={result.confidence} color={cfg.color} />

        {/* Summary */}
        <div style={{
          padding: "14px 16px", borderRadius: 10,
          background: "var(--bg-base)", border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Info size={14} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {result.summary}
            </p>
          </div>
        </div>

        {/* Highlighted message */}
        {result.highlighted_phrases?.length > 0 && (
          <div>
            <SectionLabel>Suspicious phrases highlighted</SectionLabel>
            <div style={{
              marginTop: 8, padding: "14px 16px", borderRadius: 10,
              background: "var(--bg-base)", border: "1px solid var(--border)",
            }}>
              <HighlightedMessage original={originalMessage} phrases={result.highlighted_phrases} />
            </div>
          </div>
        )}

        {/* Red flags */}
        {result.red_flags?.length > 0 && (
          <div>
            <SectionLabel>Red Flags</SectionLabel>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {result.red_flags.map((flag, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "9px 12px", borderRadius: 8,
                  background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
                }}>
                  <AlertTriangle size={13} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
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
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {result.safe_signals.map((sig, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "9px 12px", borderRadius: 8,
                  background: "var(--safe-bg)", border: "1px solid var(--safe-border)",
                }}>
                  <CheckCircle2 size={13} color="var(--safe)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{sig}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        {result.advice && (
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "12px 16px", borderRadius: 10,
            background: "rgba(129,140,248,0.06)",
            border: "1px solid rgba(129,140,248,0.15)",
          }}>
            <Zap size={14} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--accent)", fontWeight: 600 }}>What to do: </strong>
              {result.advice}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, fontFamily: "var(--font-mono)", letterSpacing: "0.12em",
      textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500,
    }}>
      {children}
    </div>
  );
}