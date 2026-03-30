import { useState, useEffect } from "react";
import { PASTEL } from "../styles/theme";

export default function BonusScreen({ onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div style={{
      textAlign: "center", padding: "40px 20px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.5s",
    }}>
      <div style={{ fontSize: 56 }}>🎁</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: PASTEL.text, marginTop: 12 }}>ボーナスマス！</div>
      <div style={{ fontSize: 13, color: PASTEL.textMuted, marginTop: 8 }}>+50 XPを獲得しました</div>
      <button onClick={onClose} style={{
        marginTop: 24, padding: "12px 40px", borderRadius: 24, border: "none",
        background: PASTEL.gold, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
      }}>
        続ける
      </button>
    </div>
  );
}
