import { useState, useEffect } from "react";
import { PASTEL } from "../styles/theme";

export default function CardReveal({ card, onClose }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100,
      opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.4s",
    }} onClick={onClose}>
      <div style={{
        width: 220, padding: "24px", borderRadius: 20,
        background: `linear-gradient(135deg, ${card.color}22, ${card.color}44)`,
        border: `2px solid ${card.color}`, textAlign: "center",
        transform: phase >= 2 ? "scale(1) rotateY(0deg)" : "scale(0.5) rotateY(90deg)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: `0 0 40px ${card.color}66`,
      }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={`/images/cards/${card.id}.png`} alt={card.name} style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ fontSize: 11, color: card.color, marginTop: 8, letterSpacing: 2 }}>{card.rarity}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: PASTEL.text, marginTop: 6 }}>{card.name}</div>
        <div style={{ fontSize: 12, color: PASTEL.textMuted, marginTop: 6 }}>{card.desc}</div>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 16 }}>タップして閉じる</div>
      </div>
    </div>
  );
}
