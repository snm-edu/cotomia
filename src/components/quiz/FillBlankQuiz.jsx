import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function FillBlankQuiz({ question, onComplete }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const blank = question.blanks[step];

  const handleSelect = (choice) => {
    if (result !== null) return;
    setSelected(choice);
    const correct = choice === blank.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < question.blanks.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), question.blanks.length);
      }
    }, 1200);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>
          空欄（{blank.id}）を埋めよう — {step + 1}/{question.blanks.length}
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
          {question.blanks.map((_, i) => (
            <div key={i} style={{ width: 24, height: 4, borderRadius: 2,
              background: i < step ? PASTEL.teal : i === step ? PASTEL.accent : PASTEL.border }} />
          ))}
        </div>
      </div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "18px 16px", marginBottom: 14,
        fontSize: 13, lineHeight: 1.9, color: PASTEL.text, position: "relative",
        borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        {blank.context.split("(　)").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span style={{
                display: "inline-block", minWidth: 64, padding: "2px 10px", margin: "0 2px",
                background: result !== null ? (result ? PASTEL.success + "30" : PASTEL.error + "30") : PASTEL.lavender + "30",
                borderRadius: 6, border: `1.5px dashed ${result !== null ? (result ? PASTEL.success : PASTEL.error) : PASTEL.lavender}`,
                textAlign: "center", fontWeight: 600, fontSize: 13,
                color: result !== null ? (result ? PASTEL.success : PASTEL.error) : PASTEL.lavender,
              }}>
                {selected || "？"}
              </span>
            )}
          </span>
        ))}
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 8 }}>💡 ヒント: {blank.hint}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {question.choices.map(choice => {
          const isCorrect = result !== null && choice === blank.answer;
          const isWrong = result === false && choice === selected;
          return (
            <button key={choice} onClick={() => handleSelect(choice)} style={{
              padding: "10px 18px", borderRadius: 24, fontSize: 14, fontWeight: 600,
              border: `2px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "18" : isWrong ? PASTEL.error + "18" : "#fff",
              color: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.text,
              cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", transform: isCorrect ? "scale(1.08)" : "scale(1)",
            }}>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
