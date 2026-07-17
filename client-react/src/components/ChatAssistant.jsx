import { useState, useRef, useEffect } from "react";
import { useData } from "../context/DataContext";
import { api } from "../services/apiService";

/**
 * ChatAssistant — reads all context from useData().
 * No props required. Works standalone on the Visualizations tab.
 */
function ChatAssistant() {
  const { uploadId, stats, columnNames, recommendedTask } = useData();

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI Data Assistant. Ask me about your dataset, cleaning, predictions, or charts." },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    // Fast local answers — no network round trip
    const q            = question.toLowerCase();
    const localAnswer  = resolveLocally(q, stats, columnNames, recommendedTask);

    if (localAnswer) {
      setMessages((prev) => [...prev, { role: "assistant", text: localAnswer }]);
      setLoading(false);
      return;
    }

    // Fall back to backend
    try {
      const data = await api.chat(uploadId, question);
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer ?? "I couldn't process that question." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div>
      <div style={s.titleRow}>
        <div>
          <div style={s.title}>Dataset AI Assistant</div>
          <div style={s.subtitle}>Ask natural-language questions about your data</div>
        </div>
        <div style={s.statusBadge}>
          <span style={s.statusDot} />
          Online
        </div>
      </div>

      {/* Suggested prompts */}
      <div style={s.prompts}>
        {SUGGESTIONS.map((sug) => (
          <button key={sug} onClick={() => setInput(sug)} style={s.promptBtn}>
            {sug}
          </button>
        ))}
      </div>

      {/* Message window */}
      <div style={s.chatWindow}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...s.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && <div style={s.avatar}><BotIcon /></div>}
            <div style={{ ...s.bubble, ...(msg.role === "user" ? s.bubbleUser : s.bubbleBot) }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
            <div style={s.avatar}><BotIcon /></div>
            <div style={{ ...s.bubble, ...s.bubbleBot, ...s.bubbleLoading }}>
              <span style={s.dot} /><span style={s.dot} /><span style={s.dot} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your dataset…"
          style={s.input}
          disabled={loading}
          aria-label="Chat input"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ ...s.sendBtn, ...(loading || !input.trim() ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

// ── Local fast-path resolver ───────────────────────────────────────────────────
function resolveLocally(q, stats, columnNames, recommendedTask) {
  if (q.includes("how many rows") || q.includes("row count") || q.includes("records")) {
    return stats.rows
      ? `Your dataset contains ${stats.rows.toLocaleString()} records.`
      : "No dataset loaded yet. Upload a file first.";
  }
  if (q.includes("columns") || q.includes("features")) {
    return columnNames.length
      ? `Your dataset has ${columnNames.length} columns: ${columnNames.slice(0, 10).join(", ")}${columnNames.length > 10 ? "…" : ""}.`
      : "No dataset loaded yet.";
  }
  if (q.includes("missing") || q.includes("null")) {
    return stats.rows
      ? `There are ${stats.missing_values.toLocaleString()} missing values across the dataset.`
      : "No dataset loaded yet.";
  }
  if (q.includes("duplicates")) {
    return stats.rows
      ? `There are ${stats.duplicates.toLocaleString()} duplicate rows.`
      : "No dataset loaded yet.";
  }
  if (q.includes("recommend") || q.includes("algorithm") || q.includes("ml task")) {
    return recommendedTask
      ? `Recommended task: ${recommendedTask.task}. Suggested algorithms: ${recommendedTask.algorithms.join(", ")}.`
      : "Upload a dataset to get ML recommendations.";
  }
  return null;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const BotIcon = () => (
  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SUGGESTIONS = [
  "How many rows does my dataset have?",
  "What columns are available?",
  "What ML task is recommended?",
  "How many missing values are there?",
];

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  titleRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  title:    { fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-slate-900)" },
  subtitle: { fontSize: "var(--font-size-sm)", color: "var(--color-slate-500)", marginTop: 3 },
  statusBadge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "var(--color-success-bg)", color: "var(--color-success)", borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 700, border: "1px solid rgba(16,185,129,0.25)" },
  statusDot:   { width: 6, height: 6, borderRadius: "50%", background: "var(--color-success)", boxShadow: "0 0 5px var(--color-success)", display: "inline-block" },
  prompts:    { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  promptBtn:  { padding: "6px 13px", background: "rgba(29,78,216,0.06)", color: "var(--color-royal)", border: "1px solid rgba(29,78,216,0.15)", borderRadius: 999, fontSize: "var(--font-size-xs)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-family)", whiteSpace: "nowrap" },
  chatWindow: { background: "var(--color-slate-50)", border: "1px solid var(--color-slate-200)", borderRadius: "var(--border-radius-md)", padding: 16, height: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 },
  msgRow:     { display: "flex", alignItems: "flex-end", gap: 8 },
  avatar:     { width: 28, height: 28, borderRadius: 8, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bubble:     { padding: "10px 14px", borderRadius: 12, fontSize: "var(--font-size-sm)", maxWidth: "75%", lineHeight: 1.6, wordBreak: "break-word" },
  bubbleUser: { background: "var(--gradient-primary)", color: "white", borderBottomRightRadius: 4, fontWeight: 500 },
  bubbleBot:  { background: "white", color: "var(--color-slate-800)", border: "1px solid var(--color-slate-200)", borderBottomLeftRadius: 4 },
  bubbleLoading: { display: "flex", gap: 5, alignItems: "center", padding: "14px 18px" },
  dot: { display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--color-slate-400)", animation: "pulse 1.2s ease-in-out infinite" },
  inputRow: { display: "flex", gap: 10 },
  input:    { flex: 1, padding: "11px 16px", background: "white", border: "1.5px solid var(--color-slate-200)", borderRadius: "var(--border-radius-md)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family)", color: "var(--color-slate-800)", outline: "none" },
  sendBtn:  { width: 44, height: 44, borderRadius: "var(--border-radius-md)", background: "var(--gradient-primary)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(29,78,216,0.30)" },
};

export default ChatAssistant;
