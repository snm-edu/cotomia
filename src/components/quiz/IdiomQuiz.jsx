import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function IdiomQuiz({ question, onComplete }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState([]);
  const item = question.items[step];

  const handleSelect = (idx) => {
    if (result !== null) return;
    setSelected(idx);
    const correct = idx === item.answer;
    setResult(correct);
    if (correct) {
      setScore(s => s + 1);
      setCollected(c => [...c, item.emoji]);
    }
    setTimeout(() => {
      if (step < question.items.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), question.items.length);
      }
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>{step + 1}/{question.items.length}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {collected.map((e, i) => <span key={i} style={{ fontSize: 16 }}>{e}</span>)}
          {Array.from({ length: question.items.length - collected.length }).map((_, i) => (
            <span key={`e${i}`} style={{ fontSize: 16, opacity: 0.2 }}>❓</span>
          ))}
        </div>
      </div>
      <div style={{
        textAlign: "center", padding: "20px 16px", borderRadius: 16,
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", marginBottom: 14
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: PASTEL.text }}>{item.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {item.options.map((opt, idx) => {
          const isCorrect = result !== null && idx === item.answer;
          const isWrong = result === false && idx === selected;
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              padding: "13px 16px", borderRadius: 12, fontSize: 14, textAlign: "left",
              border: `1.5px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "12" : isWrong ? PASTEL.error + "12" : "#fff",
              color: PASTEL.text, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10,
              transform: isCorrect ? "scale(1.02)" : "scale(1)",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border,
                color: isCorrect || isWrong ? "#fff" : PASTEL.text,
              }}>
                {isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
