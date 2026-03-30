import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function QuizSelect({ question, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = (optId) => {
    if (result !== null) return;
    setSelected(optId);
    const correct = optId === question.answer;
    setResult(correct);
    setTimeout(() => onComplete(correct ? 1 : 0, 1), 1200);
  };

  return (
    <div>
      <div style={{
        textAlign: "center", padding: "20px 16px", borderRadius: 14,
        background: "#F9F5F0", marginBottom: 14, borderLeft: `3px solid ${PASTEL.lavender}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: PASTEL.text, lineHeight: 1.7 }}>
          {question.question}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map(opt => {
          const isCorrect = result !== null && opt.id === question.answer;
          const isWrong = result === false && opt.id === selected;
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)} style={{
              padding: "13px 16px", borderRadius: 12, fontSize: 14, textAlign: "left",
              border: `1.5px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "12" : isWrong ? PASTEL.error + "12" : "#fff",
              color: PASTEL.text, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s",
              transform: isCorrect ? "scale(1.02)" : "scale(1)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border,
                color: isCorrect || isWrong ? "#fff" : PASTEL.text,
              }}>
                {isCorrect ? "✓" : isWrong ? "✗" : opt.id.toUpperCase()}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
