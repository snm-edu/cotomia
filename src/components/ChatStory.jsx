import { useState, useRef, useEffect } from "react";
import { PASTEL } from "../styles/theme";
import { CHAT_STORIES, CHARACTERS } from "../data/chatStories";

/* ───── 個別メッセージ描画 ───── */

function MsgBubble({ msg, isNew }) {
  const char = CHARACTERS[msg.char];
  const isRight = char?.side === "right";
  return (
    <div style={{
      display: "flex", flexDirection: isRight ? "row-reverse" : "row",
      alignItems: "flex-end", gap: 8, marginBottom: 6,
      animation: isNew ? "fadeSlideUp .35s ease" : "none",
    }}>
      {/* avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 18, flexShrink: 0,
        background: (char?.color || PASTEL.primary) + "20",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, overflow: "hidden"
      }}>
        <img src={`/images/${['narrator', 'student'].includes(msg.char) ? 'avatars' : 'cards'}/${msg.char}.png`} alt={char?.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <span style={{ display: "none" }}>{char?.emoji || "💬"}</span>
      </div>
      {/* bubble */}
      <div style={{ maxWidth: "75%" }}>
        <div style={{
          fontSize: 10, fontWeight: 600, marginBottom: 2,
          color: char?.color || PASTEL.textMuted,
          textAlign: isRight ? "right" : "left",
        }}>
          {char?.name}
        </div>
        <div style={{
          padding: "10px 14px", borderRadius: 16,
          borderTopLeftRadius: isRight ? 16 : 4,
          borderTopRightRadius: isRight ? 4 : 16,
          background: isRight ? (char?.color || PASTEL.accent) + "18" : "#fff",
          border: `1px solid ${(char?.color || PASTEL.border)}30`,
          fontSize: 13.5, lineHeight: 1.75, color: PASTEL.text,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}>
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function NarrBubble({ msg, isNew }) {
  return (
    <div style={{
      textAlign: "center", margin: "12px 0",
      animation: isNew ? "fadeSlideUp .35s ease" : "none",
    }}>
      <span style={{
        display: "inline-block", padding: "6px 16px", borderRadius: 20,
        background: PASTEL.primary + "15", fontSize: 12, color: PASTEL.textMuted,
        fontStyle: "italic", lineHeight: 1.7,
      }}>
        {msg.text}
      </span>
    </div>
  );
}

function HighlightCard({ msg, isNew }) {
  return (
    <div style={{
      margin: "10px 0", padding: "14px 16px", borderRadius: 14,
      background: "linear-gradient(135deg, #FFF8F3, #F3EAFF)",
      border: `1.5px solid ${PASTEL.lavender}40`,
      fontSize: 13, lineHeight: 1.8, color: PASTEL.text, fontWeight: 500,
      boxShadow: "0 2px 8px rgba(181,168,213,0.10)",
      animation: isNew ? "fadeSlideUp .35s ease" : "none",
    }}>
      {msg.text}
    </div>
  );
}

function ChoiceBubble({ msg, onAnswer, isNew }) {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === msg.answer;

  const handlePick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === msg.answer) {
      setTimeout(() => onAnswer(), 800);
    }
  };

  return (
    <div style={{
      margin: "10px 0", padding: "16px", borderRadius: 16,
      background: "#fff", border: `1.5px solid ${PASTEL.accent}30`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      animation: isNew ? "fadeSlideUp .35s ease" : "none",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text, marginBottom: 10, lineHeight: 1.6 }}>
        ❓ {msg.text}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {msg.options.map((opt, i) => {
          let bg = "#fff";
          let borderColor = PASTEL.border;
          let textColor = PASTEL.text;
          if (selected !== null) {
            if (i === msg.answer) {
              bg = PASTEL.teal + "18";
              borderColor = PASTEL.teal;
              textColor = PASTEL.teal;
            } else if (i === selected) {
              bg = PASTEL.error + "12";
              borderColor = PASTEL.error;
              textColor = PASTEL.error;
            }
          }
          return (
            <button key={i} onClick={() => handlePick(i)} style={{
              padding: "10px 14px", borderRadius: 12,
              border: `1.5px solid ${borderColor}`,
              background: bg, color: textColor,
              fontSize: 13, fontWeight: 500, textAlign: "left",
              cursor: selected !== null ? "default" : "pointer",
              transition: "all 0.2s",
            }}>
              {opt}
              {selected !== null && i === msg.answer && " ✓"}
              {selected !== null && i === selected && i !== msg.answer && " ✗"}
            </button>
          );
        })}
      </div>
      {selected !== null && !isCorrect && (
        <div style={{ fontSize: 11, color: PASTEL.error, marginTop: 8, textAlign: "center" }}>
          もう一度タップしてみよう！
        </div>
      )}
      {selected !== null && !isCorrect && (
        <button onClick={() => setSelected(null)} style={{
          marginTop: 6, width: "100%", padding: "8px", borderRadius: 10,
          border: `1px solid ${PASTEL.accent}40`, background: PASTEL.accent + "08",
          fontSize: 12, color: PASTEL.accent, fontWeight: 600, cursor: "pointer",
        }}>
          もう一度挑戦
        </button>
      )}
    </div>
  );
}

/* ───── メインコンポーネント ───── */

export default function ChatStory({ onClose }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const scrollRef = useRef(null);

  // auto-scroll when new message appears
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 60);
    }
  }, [visibleCount]);

  const showNextMessage = () => {
    if (waitingForChoice) return;
    if (activeChapter === null) return;
    const chapter = CHAT_STORIES[activeChapter];
    if (visibleCount >= chapter.messages.length) return;

    const nextIdx = visibleCount;
    const nextMsg = chapter.messages[nextIdx];

    setVisibleCount(nextIdx + 1);

    // if next message is a choice, block tap-to-advance
    if (nextMsg.type === "choice") {
      setWaitingForChoice(true);
    }
  };

  const handleChoiceAnswer = () => {
    setWaitingForChoice(false);
    // auto-show next message after correct answer
    setTimeout(() => {
      setVisibleCount(v => {
        const chapter = CHAT_STORIES[activeChapter];
        if (v < chapter.messages.length) return v + 1;
        return v;
      });
    }, 300);
  };

  const startChapter = (idx) => {
    setActiveChapter(idx);
    setVisibleCount(1); // show first message immediately
    setWaitingForChoice(false);
  };

  /* ───── Chapter reading view ───── */
  if (activeChapter !== null) {
    const chapter = CHAT_STORIES[activeChapter];
    const messages = chapter.messages.slice(0, visibleCount);
    const isFinished = visibleCount >= chapter.messages.length;

    return (
      <div style={{
        display: "flex", flexDirection: "column",
        height: "calc(100vh - 160px)", maxHeight: "calc(100dvh - 160px)",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 0 12px", borderBottom: `1px solid ${PASTEL.border}`,
          marginBottom: 8, flexShrink: 0,
        }}>
          <button onClick={() => setActiveChapter(null)} style={{
            background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
          }}>
            ← 章一覧
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>
            {chapter.emoji} {chapter.title}
          </div>
          <div style={{
            fontSize: 10, color: PASTEL.textMuted, padding: "2px 8px",
            background: PASTEL.border + "60", borderRadius: 8,
          }}>
            {visibleCount}/{chapter.messages.length}
          </div>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} onClick={showNextMessage} style={{
          flex: 1, overflowY: "auto", padding: "4px 0 16px",
          WebkitOverflowScrolling: "touch", cursor: isFinished ? "default" : "pointer",
        }}>
          {messages.map((msg, i) => {
            const isNew = i === visibleCount - 1;
            switch (msg.type) {
              case "msg": return <MsgBubble key={i} msg={msg} isNew={isNew} />;
              case "narr": return <NarrBubble key={i} msg={msg} isNew={isNew} />;
              case "highlight": return <HighlightCard key={i} msg={msg} isNew={isNew} />;
              case "choice": return <ChoiceBubble key={i} msg={msg} onAnswer={handleChoiceAnswer} isNew={isNew} />;
              default: return null;
            }
          })}

          {/* Finished banner */}
          {isFinished && (
            <div style={{
              textAlign: "center", marginTop: 20, padding: "16px",
              background: PASTEL.teal + "12", borderRadius: 14,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📖</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.teal }}>
                {chapter.title} 完了！
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                {activeChapter < CHAT_STORIES.length - 1 && (
                  <button onClick={(e) => { e.stopPropagation(); startChapter(activeChapter + 1); }}
                    style={{
                      padding: "10px 20px", borderRadius: 20, border: "none",
                      background: PASTEL.accent, color: "#fff",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>
                    次の章へ →
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); setActiveChapter(null); }}
                  style={{
                    padding: "10px 20px", borderRadius: 20,
                    border: `1.5px solid ${PASTEL.border}`, background: "#fff",
                    fontSize: 13, fontWeight: 600, color: PASTEL.text, cursor: "pointer",
                  }}>
                  章一覧
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tap hint */}
        {!isFinished && !waitingForChoice && (
          <div style={{
            textAlign: "center", padding: "8px 0 4px", flexShrink: 0,
            fontSize: 11, color: PASTEL.textMuted,
            animation: "pulse 2s infinite",
          }}>
            画面をタップして次へ ▼
          </div>
        )}
        {waitingForChoice && (
          <div style={{
            textAlign: "center", padding: "8px 0 4px", flexShrink: 0,
            fontSize: 11, color: PASTEL.accent, fontWeight: 600,
          }}>
            上の質問に答えてね ☝️
          </div>
        )}

        {/* CSS animations */}
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  /* ───── Chapter list view ───── */
  return (
    <div>
      <button onClick={onClose} style={{
        background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
        marginBottom: 12,
      }}>
        ← マップに戻る
      </button>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: PASTEL.text, textAlign: "center", margin: "0 0 6px" }}>
        📖 物語を読む
      </h2>
      <p style={{ fontSize: 11, color: PASTEL.textMuted, textAlign: "center", marginBottom: 16 }}>
        キャラクターとの会話でストーリーを体験しよう
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHAT_STORIES.map((chapter, i) => (
          <button key={chapter.id} onClick={() => startChapter(i)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${PASTEL.border}`,
            background: "#fff", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 24,
              background: PASTEL.lavender + "18", flexShrink: 0,
            }}>
              {chapter.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>{chapter.title}</div>
              <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 2 }}>
                Step {chapter.linkedStep} · {chapter.messages.length}メッセージ
              </div>
            </div>
            <span style={{ color: PASTEL.textMuted, fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
