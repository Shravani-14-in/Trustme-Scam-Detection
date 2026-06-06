import React from "react";
import { Clock, Trash2, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

const VERDICT_STYLE = {
  SCAM:       { color: "var(--danger)", Icon: ShieldAlert },
  LEGITIMATE: { color: "var(--safe)",   Icon: ShieldCheck },
  SUSPICIOUS: { color: "var(--warn)",   Icon: ShieldQuestion },
};

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryPanel({ history, onClear, onRerun }) {
  if (history.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "40px 20px",
        color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 13,
      }}>
        <Clock size={28} style={{ marginBottom: 10, opacity: 0.3, display: "block", margin: "0 auto 10px" }} />
        No checks yet
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14,
      }}>
        <span style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)", letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          Recent checks ({history.length})
        </span>
        <button
          onClick={onClear}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer", padding: "3px 6px",
            borderRadius: 5, transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <Trash2 size={11} /> Clear
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {history.map((entry) => {
          const vs = VERDICT_STYLE[entry.verdict] || VERDICT_STYLE.SUSPICIOUS;
          const VIcon = vs.Icon;
          return (
            <button
              key={entry.id}
              onClick={() => onRerun(entry.message)}
              style={{
                width: "100%", textAlign: "left",
                padding: "10px 14px", borderRadius: 10,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                display: "flex", gap: 12, alignItems: "center",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = vs.color + "55";
                e.currentTarget.style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-card)";
              }}
            >
              <VIcon size={15} color={vs.color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12.5, color: "var(--text-secondary)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  fontFamily: "var(--font-mono)",
                }}>
                  {entry.message}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
                  <span style={{ fontSize: 10.5, color: vs.color, fontFamily: "var(--font-mono)" }}>
                    {entry.verdict}
                  </span>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    · {entry.category} · {entry.confidence}%
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                {timeAgo(entry.timestamp)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}