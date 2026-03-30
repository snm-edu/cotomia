import { useState } from "react";
import { PASTEL } from "../styles/theme";
import { STORIES } from "../data/stories";

export default function StoryMode({ onClose }) {
  const [activeStory, setActiveStory] = useState(null);

  if (activeStory !== null) {
    const story = STORIES[activeStory];
    return (
      <div>
        <button onClick={() => setActiveStory(null)} style={{
          background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
          marginBottom: 12,
        }}>
          ← 章一覧に戻る
        </button>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "24px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 48 }}>{story.emoji}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: PASTEL.text, marginTop: 8 }}>{story.title}</h3>
          </div>
          <div style={{
            fontSize: 14, lineHeight: 2, color: PASTEL.text,
            padding: "16px", background: "#F9F5F0", borderRadius: 12,
            borderLeft: `3px solid ${PASTEL.lavender}`,
          }}>
            {story.text}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={() => setActiveStory(Math.max(0, activeStory - 1))}
              disabled={activeStory === 0}
              style={{
                padding: "10px 20px", borderRadius: 20, border: `1.5px solid ${PASTEL.border}`,
                background: "#fff", color: activeStory === 0 ? PASTEL.border : PASTEL.text,
                fontSize: 13, fontWeight: 600, cursor: activeStory === 0 ? "default" : "pointer",
              }}>
              ← 前の章
            </button>
            <button onClick={() => setActiveStory(Math.min(STORIES.length - 1, activeStory + 1))}
              disabled={activeStory === STORIES.length - 1}
              style={{
                padding: "10px 20px", borderRadius: 20, border: "none",
                background: activeStory === STORIES.length - 1 ? PASTEL.border : PASTEL.accent,
                color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: activeStory === STORIES.length - 1 ? "default" : "pointer",
              }}>
              次の章 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onClose} style={{
        background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
        marginBottom: 12,
      }}>
        ← マップに戻る
      </button>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: PASTEL.text, textAlign: "center", margin: "0 0 16px" }}>
        📖 物語を読む
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {STORIES.map((story, i) => (
          <button key={story.id} onClick={() => setActiveStory(i)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${PASTEL.border}`,
            background: "#fff", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, background: PASTEL.lavender + "20", flexShrink: 0,
            }}>
              {story.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>{story.title}</div>
              <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 2 }}>
                {story.text.slice(0, 30)}…
              </div>
            </div>
            <span style={{ color: PASTEL.textMuted }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
