import { useState } from "react";
import { PASTEL } from "../../styles/theme";

// 各問題に対応する参考回答
const REFERENCE_ANSWERS = {
  // q4: 王様の耳はロバの耳 (38字以内)
  "音楽の神アポロンとパンの演奏対決で、ミダス王だけがパンの勝ちと主張。怒ったアポロンはミダス王の耳をロバの耳に変えた。":
    "ミダス王がパンの勝ちと主張しアポロンの怒りを買い、耳をロバの耳に変えられた。",
  // q11: タイトル命名 (15字以内)
  "死者を蘇らせるアスクレピオスの力に怒ったハデスがゼウスに訴え、ゼウスは世界の秩序を守るため雷でアスクレピオスを打った。":
    "医神への雷の裁き",
  // q16: 研究レポート (37字以内)
  "ギリシャ神話のアポロンの息子アスクレピオスは、死者を蘇らせる力を持つ医神となったが、ゼウスに打たれ、やがて星座となった。その精神はヒポクラテスの誓いとして現代医療に受け継がれている。":
    "アポロンの息子アスクレピオスは医神となったがゼウスに打たれ星座となり、その精神は現代医療に受け継がれている。",
};

function getReference(passage) {
  return REFERENCE_ANSWERS[passage] || "（参考回答はありません）";
}

export default function SummaryQuiz({ question, onComplete }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const charCount = [...text].length;
  const isOver = charCount > question.maxChars;

  const handleSubmit = () => {
    if (charCount === 0 || isOver) return;
    setSubmitted(true);
  };

  const handleFinish = () => {
    onComplete(charCount <= question.maxChars ? 1 : 0, 1);
  };

  const referenceAnswer = getReference(question.passage);

  return (
    <div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "16px", marginBottom: 16,
        fontSize: 13, lineHeight: 1.8, color: PASTEL.text, borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>📖 あらすじ</div>
        {question.passage}
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} disabled={submitted}
          placeholder={`${question.maxChars}字以内で要約を書いてください…`} rows={3}
          style={{
            width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, fontSize: 14,
            border: `2px solid ${isOver ? PASTEL.error : submitted ? PASTEL.teal : PASTEL.border}`,
            background: submitted ? PASTEL.teal + "08" : "#fff", color: PASTEL.text,
            fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.7,
          }} />
        <div style={{
          position: "absolute", bottom: 10, right: 14, fontSize: 12, fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: isOver ? PASTEL.error : charCount > question.maxChars - 5 ? PASTEL.gold : PASTEL.textMuted,
        }}>
          {charCount}/{question.maxChars}
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
            textAlign: "center", fontSize: 12, color: PASTEL.textMuted, marginBottom: 12
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
