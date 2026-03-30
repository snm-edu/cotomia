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
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, paddingBottom: 60,
      opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.4s",
    }} onClick={onClose}>
      <style>{`
        @keyframes cardPop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {/* 煌めきエフェクト */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)", transform: "translate(-50%, -50%)", pointerEvents: "none", animation: "spin 20s linear infinite" }} />
      
      {/* カード本体 */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: 24, borderRadius: 24, display: "flex", flexDirection: "column",
        alignItems: "center", animation: phase >= 2 ? "cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : "none",
        opacity: 0, position: "relative",
        boxShadow: "0 16px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
      }} onClick={(e) => e.stopPropagation()}>
        <img src={`/cotomia/images/cards/${card.id}.png`} alt={card.name} style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }} />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ color: "#FDE047", fontSize: 18, letterSpacing: 2 }}>
            {"★".repeat(card.rarity)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF", marginTop: 8, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            {card.name}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 8, fontWeight: 500 }}>
            {card.desc}
          </div>
        </div>
        
        <div style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
          -- タップして閉じる --
        </div>
      </div>
    </div>
  );
}
