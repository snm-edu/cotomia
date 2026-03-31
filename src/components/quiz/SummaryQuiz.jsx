import { useState } from "react";
import { PASTEL } from "../../styles/theme";

export default function SummaryQuiz({ question, onComplete }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const charCount = [...text].length;
  const maxChars = question.maxChars || 150;
  const isOver = charCount > maxChars;

  const handleSubmit = () => {
    if (charCount === 0 || isOver) return;
    setSubmitted(true);
  };

  const handleFinish = () => {
    onComplete(charCount <= maxChars ? 1 : 0, 1);
  };

  const referenceAnswer = question.referenceAnswer || "（参考回答は設定されていません）";

  return (
    <div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "16px", marginBottom: 16,
        fontSize: 13, lineHeight: 1.8, color: PASTEL.text, borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>📖 設問</div>
        {question.q || question.passage}
        {question.hint && (
          <div style={{ marginTop: 8, fontSize: 11, color: PASTEL.accent }}>
            {question.hint}
          </div>
        )}
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          disabled={submitted}
          placeholder={`回答を入力してください${maxChars ? `（${maxChars}字以内）` : ''}…`} 
          rows={4}
          style={{
            width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, fontSize: 14,
            border: `2px solid ${isOver ? PASTEL.error : submitted ? PASTEL.teal : PASTEL.border}`,
            background: submitted ? PASTEL.teal + "08" : "#fff", color: PASTEL.text,
            fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.7,
          }} 
        />
        <div style={{
          position: "absolute", bottom: 10, right: 14, fontSize: 12, fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: isOver ? PASTEL.error : charCount > maxChars - 5 ? PASTEL.gold : PASTEL.textMuted,
        }}>
          {charCount}/{maxChars}
        </div>
      </div>

      {submitted ? (
        <div>
          {/* あなたの回答 */}
          <div style={{
            background: PASTEL.teal + "10", border: `1.5px solid ${PASTEL.teal}40`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PASTEL.teal, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              ✍️ あなたの回答（{charCount}字）
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: PASTEL.text }}>
              {text}
            </div>
          </div>

          {/* 参考回答 */}
          <div style={{
            background: PASTEL.lavender + "10", border: `1.5px solid ${PASTEL.lavender}40`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PASTEL.lavender, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              📝 参考回答
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: PASTEL.text }}>
              {referenceAnswer}
            </div>
          </div>

          {/* 完了メッセージ */}
          <div style={{
            textAlign: "center", fontSize: 12, color: PASTEL.textMuted, margin: "16px 0 16px 0"
          }}>
            参考回答と見比べてみましょう。自分の表現との違いを確認してみてください。
          </div>

          {/* 次へ進むボタン */}
          <button onClick={handleFinish} style={{
            width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: "none", background: PASTEL.accent, color: "#fff", cursor: "pointer",
            transition: "all 0.2s",
          }}>
            次へ進む →
          </button>
        </div>
      ) : (
        <button onClick={handleSubmit} disabled={charCount === 0 || isOver} style={{
          width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 700,
          border: "none", background: charCount > 0 && !isOver ? PASTEL.accent : PASTEL.border,
          color: "#fff", cursor: charCount > 0 && !isOver ? "pointer" : "default",
          transition: "all 0.2s",
        }}>
          提出する
        </button>
      )}
    </div>
  );
}
