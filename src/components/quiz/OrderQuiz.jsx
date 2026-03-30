import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function OrderQuiz({ question, onComplete }) {
  const [items, setItems] = useState(() =>
    [...question.events].sort(() => Math.random() - 0.5)
  );
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const moveItem = (index, direction) => {
    if (submitted) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  const handleSubmit = () => {
    const correctOrder = question.correctOrder;
    const res = items.map((item, i) => item.id === correctOrder[i]);
    setResults(res);
    setSubmitted(true);
    const correct = res.filter(Boolean).length;
    setTimeout(() => onComplete(correct, items.length), 2500);
  };

  return (
    <div>
      <div style={{
        fontSize: 12, color: PASTEL.textMuted, textAlign: "center", marginBottom: 14,
        lineHeight: 1.6,
      }}>
        出来事を正しい時系列順に並べ替えてください
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {items.map((item, i) => {
          const isCorrect = results && results[i];
          const isWrong = results && !results[i];
          return (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 14px", borderRadius: 14,
              background: isCorrect ? PASTEL.success + "12" : isWrong ? PASTEL.error + "12" : "#fff",
              border: `1.5px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              transition: "all 0.3s",
            }}>
              {/* Order number badge */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0,
                background: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.lavender + "30",
                color: isCorrect || isWrong ? "#fff" : PASTEL.lavender,
              }}>
                {i + 1}
              </div>

              {/* Event text */}
              <div style={{ flex: 1, fontSize: 13, color: PASTEL.text, lineHeight: 1.5 }}>
                {item.text}
              </div>

              {/* Move buttons */}
              {!submitted && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button onClick={() => moveItem(i, -1)} disabled={i === 0} style={{
                    width: 28, height: 22, borderRadius: 6, border: `1px solid ${PASTEL.border}`,
                    background: i === 0 ? PASTEL.border + "40" : "#fff",
                    color: i === 0 ? PASTEL.border : PASTEL.text,
                    cursor: i === 0 ? "default" : "pointer", fontSize: 11, fontWeight: 700,
                  }}>
                    ↑
                  </button>
                  <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} style={{
                    width: 28, height: 22, borderRadius: 6, border: `1px solid ${PASTEL.border}`,
                    background: i === items.length - 1 ? PASTEL.border + "40" : "#fff",
                    color: i === items.length - 1 ? PASTEL.border : PASTEL.text,
                    cursor: i === items.length - 1 ? "default" : "pointer", fontSize: 11, fontWeight: 700,
                  }}>
                    ↓
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {submitted ? (
        <div style={{
          textAlign: "center", padding: "12px", borderRadius: 12,
          background: PASTEL.success + "15", border: `1.5px solid ${PASTEL.success}`,
          fontSize: 13, color: PASTEL.success, fontWeight: 600,
        }}>
          {results.filter(Boolean).length}/{items.length} 正解！
        </div>
      ) : (
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 700,
          border: "none", background: PASTEL.accent, color: "#fff", cursor: "pointer",
          transition: "all 0.2s",
        }}>
          確定する
        </button>
      )}
    </div>
  );
}
