import { PASTEL } from "../styles/theme";
import { CARDS } from "../data/cards";

export default function CardGallery({ earnedCards, onClose }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: 13, color: PASTEL.textMuted, cursor: "pointer",
        }}>
          ← 戻る
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>
          🃏 {earnedCards.length}/{CARDS.length}
        </div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: PASTEL.text, textAlign: "center", margin: "0 0 16px" }}>
        カード図鑑
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {CARDS.map(card => {
          const owned = earnedCards.includes(card.id);
          return (
            <div key={card.id} style={{
              padding: "16px 8px", borderRadius: 14, textAlign: "center",
              background: owned ? `linear-gradient(135deg, ${card.color}15, ${card.color}30)` : "#f5f0eb",
              border: `1.5px solid ${owned ? card.color + "40" : PASTEL.border}`,
              opacity: owned ? 1 : 0.5,
              transition: "all 0.3s",
            }}>
              <div style={{ filter: owned ? "none" : "grayscale(1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {owned ? (
                  <img src={`/cotomia/images/cards/${card.id}.png`} alt={card.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} />
                ) : <div style={{ fontSize: 32 }}>❓</div>}
              </div>
              <div style={{ fontSize: 10, color: owned ? card.color : PASTEL.textMuted, marginTop: 8, letterSpacing: 1 }}>
                {card.rarity}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, marginTop: 4,
                color: owned ? PASTEL.text : PASTEL.textMuted,
              }}>
                {owned ? card.name : "？？？"}
              </div>
              {owned && (
                <div style={{ fontSize: 9, color: PASTEL.textMuted, marginTop: 4 }}>{card.desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
