import { useState, useEffect } from "react";
import { PASTEL } from "../../styles/theme";
import { shuffleArray } from "../../utils/shuffle";

export default function KanjiQuiz({ question, onComplete }) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const word = question.words[step];

  useEffect(() => {
    setShuffledOpts(shuffleArray(word.options));
  }, [step]);

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score, question.words.length); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (opt) => {
    if (result !== null) return;
    const correct = opt === word.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < question.words.length - 1) {
        setStep(s => s + 1);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), question.words.length);
      }
    }, 800);
  };

  const pct = (timeLeft / 60) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>{step + 1}/{question.words.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 100, height: 6, borderRadius: 3, background: PASTEL.border, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, transition: "width 1s linear",
              background: timeLeft > 20 ? PASTEL.teal : timeLeft > 10 ? PASTEL.gold : PASTEL.error }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums",
            color: timeLeft > 10 ? PASTEL.text : PASTEL.error }}>{timeLeft}s</span>
        </div>
      </div>
      <div style={{
        textAlign: "center", padding: "28px 20px", borderRadius: 16,
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>この読みを漢字に変換</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: PASTEL.accent, letterSpacing: 4 }}>{word.hiragana}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {shuffledOpts.map(opt => {
          const isCorrect = result !== null && opt === word.answer;
          const isWrong = result !== null && result === false && opt !== word.answer;
          return (
            <button key={opt} onClick={() => handleSelect(opt)} style={{
              padding: "14px 12px", borderRadius: 14, fontSize: 18, fontWeight: 700,
              letterSpacing: 2, border: `2px solid ${isCorrect ? PASTEL.success : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "15" : "#fff",
              color: isCorrect ? PASTEL.success : PASTEL.text,
              cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", opacity: isWrong ? 0.4 : 1,
              transform: isCorrect ? "scale(1.05)" : "scale(1)",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
