import { useState, useEffect } from "react";
import { PASTEL } from "../../styles/theme";

const BOSS_QUESTIONS = [
  { q: "アスクレピオスの父親は誰？", options: ["ゼウス", "アポロン", "ハデス", "ヘルメス"], answer: 1 },
  { q: "アスクレピオスに医術を教えたのは？", options: ["プロメテウス", "アテナ", "ケイロン", "アポロン"], answer: 2 },
  { q: "ミダス王の耳は何に変えられた？", options: ["猫の耳", "ロバの耳", "狼の耳", "兎の耳"], answer: 1 },
  { q: "ダプネは何に姿を変えた？", options: ["オリーブの木", "月桂樹", "薔薇", "百合"], answer: 1 },
  { q: "ゼウスがアスクレピオスを打った武器は？", options: ["三叉の矛", "黄金の剣", "雷", "弓矢"], answer: 2 },
];

export default function BossBattle({ onComplete }) {
  const [step, setStep] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro | battle | victory | defeat

  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("battle"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleSelect = (idx) => {
    if (result !== null) return;
    const correct = idx === BOSS_QUESTIONS[step].answer;
    setResult(correct);
    if (correct) {
      setScore(s => s + 1);
      setBossHp(hp => Math.max(0, hp - 20));
    }
    setTimeout(() => {
      if (step < BOSS_QUESTIONS.length - 1) {
        setStep(s => s + 1);
        setResult(null);
      } else {
        setPhase(score + (correct ? 1 : 0) >= 3 ? "victory" : "defeat");
      }
    }, 1200);
  };

  if (phase === "intro") {
    return (
      <div style={{
        textAlign: "center", padding: "40px 20px",
        background: "linear-gradient(180deg, #1a1a2e, #242442)", borderRadius: 20,
        minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 64, animation: "pulse 1.5s infinite" }}>⚡</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#E8E0D6", marginTop: 16, letterSpacing: 2 }}>
          ゼウスの試練
        </div>
        <div style={{ fontSize: 13, color: "#9B9490", marginTop: 8 }}>最終ボスに挑む…</div>
      </div>
    );
  }

  if (phase === "victory") {
    return (
      <div style={{
        textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 20,
      }}>
        <div style={{ fontSize: 64 }}>🏆</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: PASTEL.text, marginTop: 12 }}>勝利！</div>
        <div style={{ fontSize: 14, color: PASTEL.textMuted, marginTop: 8, lineHeight: 1.7 }}>
          ゼウスの試練を乗り越えた！<br/>{score}/{BOSS_QUESTIONS.length} 問正解
        </div>
        <button onClick={() => onComplete(score, BOSS_QUESTIONS.length)} style={{
          marginTop: 24, padding: "14px 40px", borderRadius: 24, border: "none",
          background: `linear-gradient(135deg, ${PASTEL.gold}, ${PASTEL.accent})`,
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>
          報酬を受け取る
        </button>
      </div>
    );
  }

  if (phase === "defeat") {
    return (
      <div style={{
        textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 20,
      }}>
        <div style={{ fontSize: 64 }}>💫</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: PASTEL.text, marginTop: 12 }}>惜しい…！</div>
        <div style={{ fontSize: 14, color: PASTEL.textMuted, marginTop: 8, lineHeight: 1.7 }}>
          もう少しでゼウスを倒せた！<br/>{score}/{BOSS_QUESTIONS.length} 問正解
        </div>
        <button onClick={() => onComplete(score, BOSS_QUESTIONS.length)} style={{
          marginTop: 24, padding: "14px 40px", borderRadius: 24, border: "none",
          background: PASTEL.primary, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>
          マップに戻る
        </button>
      </div>
    );
  }

  const q = BOSS_QUESTIONS[step];
  return (
    <div>
      {/* Boss HP Bar */}
      <div style={{
        background: "linear-gradient(180deg, #1a1a2e, #242442)", borderRadius: 16,
        padding: "16px", marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#E8E0D6" }}>ゼウス</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9B9490" }}>HP {bossHp}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "#3a3a5c", overflow: "hidden" }}>
          <div style={{
            width: `${bossHp}%`, height: "100%", borderRadius: 4,
            background: bossHp > 50 ? "linear-gradient(90deg, #D4877F, #E8C872)" :
              bossHp > 25 ? "linear-gradient(90deg, #E8C872, #D4877F)" : PASTEL.error,
            transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
        {step + 1} / {BOSS_QUESTIONS.length}
      </div>
      <div style={{
        textAlign: "center", padding: "20px 16px", borderRadius: 14,
        background: "#F9F5F0", marginBottom: 14,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: PASTEL.text, lineHeight: 1.7 }}>{q.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, idx) => {
          const isCorrect = result !== null && idx === q.answer;
          const isWrong = result === false && idx !== q.answer && result !== null;
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              padding: "13px 16px", borderRadius: 12, fontSize: 14, textAlign: "left",
              border: `1.5px solid ${isCorrect ? PASTEL.success : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "12" : "#fff",
              color: PASTEL.text, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", opacity: isWrong ? 0.5 : 1,
              transform: isCorrect ? "scale(1.02)" : "scale(1)",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
