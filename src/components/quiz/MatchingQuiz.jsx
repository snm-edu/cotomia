import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function MatchingQuiz({ question, onComplete }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const item = question.items[step];

  const handleSelect = (optId) => {
    if (result !== null) return;
    setSelected(optId);
    const correct = optId === item.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < question.items.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), question.items.length);
      }
    }, 1200);
  };

  return (
    <div style={{ position: "relative" }}>
      {result === true && (
        <img src="/images/ui/effect_correct.png" alt="Correct" style={{ position: "absolute", top: "50%", left: "50%", width: 180, height: 180, transform: "translate(-50%, -50%)", zIndex: 100, pointerEvents: "none", animation: "popInOut 1.2s ease forwards" }} />
      )}
      {result === false && (
        <img src="/images/ui/effect_incorrect.png" alt="Incorrect" style={{ position: "absolute", top: "50%", left: "50%", width: 180, height: 180, transform: "translate(-50%, -50%)", zIndex: 100, pointerEvents: "none", animation: "popInOut 1.2s ease forwards" }} />
      )}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600, letterSpacing: 1 }}>
          {step + 1} / {question.items.length}
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
          {question.items.map((_, i) => (
            <div key={i} style={{ width: 32, height: 4, borderRadius: 2,
              background: i < step ? PASTEL.teal : i === step ? PASTEL.accent : PASTEL.border }} />
          ))}
        </div>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", borderRadius: 16,
        padding: "24px 20px", textAlign: "center", marginBottom: 16
      }}>
        <div style={{ fontSize: 48, marginBottom: 8, display: "flex", justifyContent: "center" }}>
          {item.image ? (
            <img src={item.image} alt={item.scene} style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
          ) : (
            item.emoji
          )}
        </div>
        <div style={{ fontSize: 14, color: PASTEL.text, fontWeight: 500 }}>{item.scene}</div>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 6 }}>
          この絵はどの節の物語にふさわしいですか？
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {question.options.map(opt => {
          const isCorrectAnswer = result !== null && opt.id === item.answer;
          const isWrongSelection = result === false && opt.id === selected;
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)} style={{
              padding: "12px 10px", borderRadius: 12, border: "1.5px solid",
              fontSize: 12, fontWeight: 500, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.3s",
              background: isCorrectAnswer ? PASTEL.success + "20" : isWrongSelection ? PASTEL.error + "20" : "#fff",
              borderColor: isCorrectAnswer ? PASTEL.success : isWrongSelection ? PASTEL.error :
                selected === opt.id ? PASTEL.accent : PASTEL.border,
              color: PASTEL.text,
              transform: isCorrectAnswer ? "scale(1.03)" : "scale(1)",
            }}>
              <span style={{ fontWeight: 700, marginRight: 4 }}>{opt.id}.</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
