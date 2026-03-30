import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function SummaryQuiz({ question, onComplete }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const charCount = [...text].length;
  const isOver = charCount > question.maxChars;

  const handleSubmit = () => {
    if (charCount === 0 || isOver) return;
    setSubmitted(true);
    setTimeout(() => onComplete(charCount <= question.maxChars ? 1 : 0, 1), 2000);
  };

  return (
    <div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "16px", marginBottom: 16,
        fontSize: 13, lineHeight: 1.8, color: PASTEL.text, borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>📖 あらすじ</div>
        {question.passage}
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} disabled={submitted}
          placeholder={`${question.maxChars}字以内で要約を書いてください…`} rows={3}
          style={{
            width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, fontSize: 14,
            border: `2px solid ${isOver ? PASTEL.error : submitted ? PASTEL.success : PASTEL.border}`,
            background: submitted ? PASTEL.success + "08" : "#fff", color: PASTEL.text,
            fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.7,
          }} />
        <div style={{
          position: "absolute", bottom: 10, right: 14, fontSize: 12, fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: isOver ? PASTEL.error : charCount > question.maxChars - 5 ? PASTEL.gold : PASTEL.textMuted,
        }}>
          {charCount}/{question.maxChars}
        </div>
      </div>
      {submitted ? (
        <div style={{
          background: PASTEL.success + "15", border: `1.5px solid ${PASTEL.success}`,
          borderRadius: 12, padding: "12px 16px", fontSize: 13, color: PASTEL.success, textAlign: "center"
        }}>
          ✨ 完了！{charCount}字でまとめました
        </div>
      ) : (
        <button onClick={handleSubmit} disabled={charCount === 0 || isOver} style={{
          width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 700,
          border: "none", background: charCount > 0 && !isOver ? PASTEL.accent : PASTEL.border,
          color: "#fff", cursor: charCount > 0 && !isOver ? "pointer" : "default",
          transition: "all 0.2s",
        }}>
          提出する
        </button>
      )}
    </div>
  );
}
