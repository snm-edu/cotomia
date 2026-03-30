import { useState, useCallback } from "react";
import { PASTEL } from "./styles/theme";
import { CARDS } from "./data/cards";
import { QUESTIONS } from "./data/questions";
import { STEP_MAPS } from "./data/mapNodes";
import { STEPS } from "./data/steps";
import { useLocalStorage } from "./hooks/useLocalStorage";
import CardReveal from "./components/CardReveal";
import SugorokuMap from "./components/SugorokuMap";
import BonusScreen from "./components/BonusScreen";
import CardGallery from "./components/CardGallery";
import ChatStory from "./components/ChatStory";
import BossBattle from "./components/quiz/BossBattle";
import MatchingQuiz from "./components/quiz/MatchingQuiz";
import FillBlankQuiz from "./components/quiz/FillBlankQuiz";
import KanjiQuiz from "./components/quiz/KanjiQuiz";
import SummaryQuiz from "./components/quiz/SummaryQuiz";
import IdiomQuiz from "./components/quiz/IdiomQuiz";
import QuizSelect from "./components/quiz/QuizSelect";
import OrderQuiz from "./components/quiz/OrderQuiz";

function QuizRouter({ qKey, onComplete, quizKey }) {
  const q = QUESTIONS[qKey];
  if (!q) return null;

  switch (q.type) {
    case "matching": return <MatchingQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "fill_blank": return <FillBlankQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "kanji": return <KanjiQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "summary": return <SummaryQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "idiom": return <IdiomQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "order": return <OrderQuiz key={quizKey} question={q} onComplete={onComplete} />;
    case "select": return <QuizSelect key={quizKey} question={q} onComplete={onComplete} />;
    default: return null;
  }
}

export default function App() {
  const [screen, setScreen] = useState("title");
  const [currentStep, setCurrentStep] = useLocalStorage("aq_step", 1);
  const [currentNode, setCurrentNode] = useLocalStorage("aq_node", 1);
  const [completedNodes, setCompletedNodes] = useLocalStorage("aq_completed", { 1: [0], 2: [0], 3: [0], 4: [0], 5: [0] });
  const [xp, setXp] = useLocalStorage("aq_xp", 0);
  const [streak, setStreak] = useLocalStorage("aq_streak", 1);
  const [earnedCards, setEarnedCards] = useLocalStorage("aq_cards", []);
  const [showCard, setShowCard] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizKey, setQuizKey] = useState(0);

  const totalXpNeeded = 500 * currentStep;
  const stepInfo = STEPS[currentStep - 1];
  const mapNodes = STEP_MAPS[currentStep] || STEP_MAPS[1];
  const stepCompleted = completedNodes[currentStep] || [0];

  // Check last play date for streak
  const [lastPlayDate, setLastPlayDate] = useLocalStorage("aq_lastPlay", null);
  const today = new Date().toDateString();
  if (lastPlayDate !== today) {
    if (lastPlayDate) {
      const diff = Math.floor((new Date(today) - new Date(lastPlayDate)) / 86400000);
      if (diff > 1 && streak > 0) {
        // streak broken — but don't reset mid-render, will handle on next action
      }
    }
  }

  const recordPlay = useCallback(() => {
    const now = new Date().toDateString();
    if (lastPlayDate !== now) {
      if (lastPlayDate) {
        const diff = Math.floor((new Date(now) - new Date(lastPlayDate)) / 86400000);
        if (diff === 1) setStreak(s => s + 1);
        else if (diff > 1) setStreak(1);
      }
      setLastPlayDate(now);
    }
  }, [lastPlayDate, setLastPlayDate, setStreak]);

  const completeNode = (nodeId) => {
    setCompletedNodes(prev => {
      const stepNodes = prev[currentStep] || [0];
      if (stepNodes.includes(nodeId)) return prev;
      return { ...prev, [currentStep]: [...stepNodes, nodeId] };
    });
    const nextId = Math.min(nodeId + 1, mapNodes.length - 1);
    setCurrentNode(nextId);
  };

  const handleQuizComplete = (correct, total, nodeId) => {
    const earnedXp = correct * 30 + (correct === total ? 50 : 0);
    setXp(x => x + earnedXp);
    completeNode(nodeId);
    recordPlay();

    // Award card
    if (correct >= total * 0.7) {
      const stepCards = CARDS.filter(c => c.step === currentStep);
      const nextCard = stepCards.find(c => !earnedCards.includes(c.id));
      if (nextCard) {
        setEarnedCards(prev => [...prev, nextCard.id]);
        setTimeout(() => setShowCard(nextCard), 600);
      }
    }
    setTimeout(() => {
      setActiveQuiz(null);
      setScreen("map");
    }, 500);
  };

  const handleBossComplete = (correct, total) => {
    const earnedXp = correct * 50 + (correct >= 3 ? 200 : 0);
    setXp(x => x + earnedXp);
    recordPlay();

    // Award boss card
    if (correct >= 3) {
      const bossCard = CARDS.find(c => c.step === 5 || (c.step === currentStep && !earnedCards.includes(c.id)));
      if (bossCard && !earnedCards.includes(bossCard.id)) {
        setEarnedCards(prev => [...prev, bossCard.id]);
        setTimeout(() => setShowCard(bossCard), 600);
      }
    }
    setTimeout(() => {
      setScreen("map");
    }, 500);
  };

  const handleNodeClick = (node) => {
    if (node.type === "start") return;
    if (node.type === "bonus") {
      setXp(x => x + 50);
      completeNode(node.id);
      setActiveQuiz("bonus");
      setScreen("quiz");
      return;
    }
    if (node.type === "boss") {
      setScreen("boss");
      return;
    }
    const qMap = {
      "q1_1": "q1", "q1_2": "q1", "q1_3": "q1",
      "q2": "q2", "q3": "q3", "q4": "q4", "q5": "q5",
      "q6": "q6", "q7": "q7", "q8": "q8", "q9": "q9", "q10": "q10", "q11": "q11",
      "q12": "q12", "q13": "q13", "q14": "q14", "q15": "q15", "q16": "q16",
      "q17": "q17", "q18": "q18", "q19": "q19",
    };
    setActiveQuiz({ qKey: qMap[node.q] || node.q, nodeId: node.id });
    setQuizKey(k => k + 1);
    setScreen("quiz");
  };

  const canUnlockStep = (stepId) => {
    const step = STEPS[stepId - 1];
    return step && xp >= step.requiredXp;
  };

  const renderQuiz = () => {
    if (activeQuiz === "bonus") return <BonusScreen onClose={() => { setActiveQuiz(null); setScreen("map"); }} />;
    if (!activeQuiz) return null;
    const { qKey, nodeId } = activeQuiz;
    const onDone = (c, t) => handleQuizComplete(c, t, nodeId);
    return <QuizRouter qKey={qKey} onComplete={onDone} quizKey={quizKey} />;
  };

  // ===== TITLE SCREEN =====
  if (screen === "title") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", background: "url(/images/ui/title_screen.png) center/cover no-repeat",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif", padding: 24, textAlign: "center",
      }}>
        <div style={{
          background: "rgba(255, 248, 243, 0.85)", backdropFilter: "blur(4px)", padding: "32px 20px",
          borderRadius: 24, width: "100%", maxWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: PASTEL.text, margin: 0, letterSpacing: 1 }}>
            医神アスクレピオス
          </h1>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: PASTEL.accent, marginTop: 4, letterSpacing: 2 }}>
            読解力クエスト
          </h2>
        <div style={{
          marginTop: 24, padding: "16px 20px", borderRadius: 16,
          background: "#ffffff88", backdropFilter: "blur(8px)",
          maxWidth: 300, fontSize: 12, lineHeight: 1.8, color: PASTEL.textMuted,
        }}>
          ギリシャ神話の世界を冒険しながら<br/>
          読解力を鍛えよう！<br/>
          <span style={{ color: PASTEL.accent, fontWeight: 600 }}>
            {earnedCards.length > 0 ? `Step ${currentStep} — ${stepInfo.title}` : "Step 1 — アポロンの章"}
          </span>
        </div>
        <button onClick={() => setScreen("map")} style={{
          marginTop: 28, padding: "16px 48px", borderRadius: 28, border: "none",
          background: `linear-gradient(135deg, ${PASTEL.accent}, ${PASTEL.lavender})`,
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 2,
          boxShadow: `0 8px 24px ${PASTEL.accent}44`,
        }}>
          {earnedCards.length > 0 ? "続きから" : "冒険を始める"}
        </button>
          <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
            {["スワイプ", "パズル", "バトル", "収集"].map((m, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18,
                  background: [PASTEL.teal, PASTEL.lavender, PASTEL.accent, PASTEL.gold][i] + "20",
                }}>
                  {["👆", "🧩", "⚔️", "🃏"][i]}
                </div>
                <div style={{ fontSize: 9, color: PASTEL.textMuted, marginTop: 4, fontWeight: 600 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN GAME =====
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FFF8F3 0%, #F5EDE4 100%)",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      <style>{`
        @keyframes popInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
      {showCard && <CardReveal card={showCard} onClose={() => setShowCard(null)} />}

      {/* Header */}
      <div style={{
        padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#ffffffcc", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${PASTEL.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{stepInfo?.emoji || "🏛️"}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: PASTEL.text }}>Step {currentStep}</div>
            <div style={{ fontSize: 10, color: PASTEL.textMuted }}>{stepInfo?.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: PASTEL.textMuted }}>ストリーク</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: PASTEL.accent }}>🔥 {streak}日</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: PASTEL.textMuted }}>カード</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: PASTEL.gold }}>🃏 {earnedCards.length}/{CARDS.length}</div>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div style={{ padding: "8px 16px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: PASTEL.textMuted, marginBottom: 4 }}>
          <span>XP</span>
          <span>{xp}/{totalXpNeeded}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: PASTEL.border, overflow: "hidden" }}>
          <div style={{
            width: `${Math.min((xp / totalXpNeeded) * 100, 100)}%`, height: "100%", borderRadius: 3,
            background: PASTEL.xpBar, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "8px 16px 24px" }}>
        {screen === "map" && (
          <>
            {/* Step Banner */}
            <div style={{
              width: "100%", height: 130, borderRadius: 20, marginBottom: 16,
              background: `url(/images/steps/step${currentStep}.png) center/cover no-repeat`,
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)", display: "flex", alignItems: "flex-end", padding: "12px 16px"
            }}>
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", padding: "8px 14px", borderRadius: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: PASTEL.text }}>Step {currentStep}: {stepInfo?.title}</div>
                <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 2, fontWeight: 500 }}>{stepInfo?.subtitle}</div>
              </div>
            </div>

            <SugorokuMap currentNode={currentNode} completedNodes={stepCompleted} onNodeClick={handleNodeClick}
              mapNodes={mapNodes} stepTitle="" />

            {/* Step Tabs */}
            <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
              {STEPS.map(step => {
                const unlocked = canUnlockStep(step.id);
                const active = step.id === currentStep;
                return (
                  <button key={step.id} onClick={() => {
                    if (unlocked) {
                      setCurrentStep(step.id);
                      setCurrentNode(0);
                    }
                  }} style={{
                    padding: "8px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
                    fontSize: 11, fontWeight: 600, cursor: unlocked ? "pointer" : "default",
                    background: active ? PASTEL.accent : unlocked ? "#fff" : PASTEL.border + "60",
                    color: active ? "#fff" : unlocked ? PASTEL.text : PASTEL.textMuted,
                    opacity: unlocked ? 1 : 0.5,
                    transition: "all 0.2s",
                  }}>
                    {step.emoji} Step {step.id}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12,
            }}>
              {[
                { icon: "📖", label: "物語を読む", color: PASTEL.lavender, action: () => setScreen("story") },
                { icon: "🃏", label: "カード図鑑", color: PASTEL.gold, action: () => setScreen("gallery") },
                { icon: "📊", label: "ランキング", color: PASTEL.teal, action: () => {} },
              ].map((item, i) => (
                <button key={i} onClick={item.action} style={{
                  padding: "12px 8px", borderRadius: 14, border: `1.5px solid ${item.color}30`,
                  background: `${item.color}08`, cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: PASTEL.text, marginTop: 4 }}>{item.label}</div>
                </button>
              ))}
            </div>

            {/* Current Node Prompt */}
            {currentNode > 0 && currentNode < mapNodes.length - 1 && (
              <div style={{
                marginTop: 12, padding: "14px 16px", borderRadius: 14,
                background: "#fff", border: `1.5px solid ${PASTEL.accent}30`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: PASTEL.accent + "15",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                  {mapNodes[currentNode]?.type === "bonus" ? "🎁" : "📝"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>
                    {mapNodes[currentNode]?.label}に挑戦しよう！
                  </div>
                  <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 2 }}>
                    マップのマスをタップして問題を開始
                  </div>
                </div>
                <span style={{ fontSize: 18 }}>→</span>
              </div>
            )}
          </>
        )}

        {screen === "quiz" && (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "20px 16px", marginTop: 4,
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}>
            {activeQuiz !== "bonus" && activeQuiz && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => { setActiveQuiz(null); setScreen("map"); }} style={{
                    background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    ← マップ
                  </button>
                  <div style={{
                    fontSize: 10, padding: "4px 10px", borderRadius: 8,
                    background: PASTEL.lavender + "20", color: PASTEL.lavender, fontWeight: 600,
                  }}>
                    {QUESTIONS[activeQuiz.qKey]?.mechanic}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: PASTEL.text, marginTop: 8 }}>
                  {QUESTIONS[activeQuiz.qKey]?.title}
                </div>
                <div style={{ fontSize: 12, color: PASTEL.textMuted, marginTop: 2 }}>
                  {QUESTIONS[activeQuiz.qKey]?.subtitle}
                </div>
              </div>
            )}
            {renderQuiz()}
          </div>
        )}

        {screen === "boss" && (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "20px 16px", marginTop: 4,
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}>
            <button onClick={() => setScreen("map")} style={{
              background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
              marginBottom: 12,
            }}>
              ← マップ
            </button>
            <BossBattle onComplete={handleBossComplete} />
          </div>
        )}

        {screen === "story" && (
          <ChatStory onClose={() => setScreen("map")} />
        )}

        {screen === "gallery" && (
          <CardGallery earnedCards={earnedCards} onClose={() => setScreen("map")} />
        )}
      </div>
    </div>
  );
}
