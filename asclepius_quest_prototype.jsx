import { useState, useEffect, useCallback, useRef } from "react";

const PASTEL = {
  bg: "#FFF8F3",
  bgDark: "#1a1a2e",
  card: "#FFFFFF",
  cardDark: "#242442",
  primary: "#C4A882",
  accent: "#D4877F",
  teal: "#7EBDB4",
  lavender: "#B5A8D5",
  pink: "#E8B4C8",
  gold: "#E8C872",
  goldDark: "#BFA44E",
  text: "#3A3632",
  textDark: "#E8E0D6",
  textMuted: "#9B9490",
  border: "#EDE5DC",
  borderDark: "#3a3a5c",
  success: "#7EBDB4",
  error: "#D4877F",
  xpBar: "linear-gradient(90deg, #B5A8D5, #D4877F, #E8C872)",
};

const CARDS = [
  { id: "apollo", name: "太陽神アポロン", rarity: "★★", color: "#E8C872", emoji: "☀️", desc: "音楽・医術・予言の神" },
  { id: "cupid", name: "愛の神キューピッド", rarity: "★", color: "#E8B4C8", emoji: "💘", desc: "愛の矢を放つ神" },
  { id: "daphne", name: "月桂樹のダプネ", rarity: "★", color: "#7EBDB4", emoji: "🌿", desc: "月桂樹に姿を変えた" },
  { id: "midas", name: "ミダス王", rarity: "★★", color: "#B5A8D5", emoji: "👑", desc: "ロバの耳に変えられた王" },
  { id: "laurel", name: "月桂冠", rarity: "★", color: "#7EBDB4", emoji: "🏆", desc: "アポロンの象徴" },
];

const QUESTIONS = {
  q1: {
    title: "問1 イメージ理解",
    subtitle: "物語の内容をイメージ的に把握しよう",
    type: "matching",
    mechanic: "スワイプマッチング",
    items: [
      { id: 1, emoji: "💘", scene: "天使が弓を引いている", answer: "e", answerText: "P.4 愛の神キューピッド" },
      { id: 2, emoji: "👑", scene: "王様がロバの耳を隠す", answer: "d", answerText: "P.3 王様の耳はロバの耳" },
      { id: 3, emoji: "❓", scene: "関係のない風景画", answer: "f", answerText: "いずれも関係しない" },
      { id: 4, emoji: "🐍", scene: "蛇と杖のシンボル", answer: "b", answerText: "P.1 医神アスクレピオス" },
    ],
    options: [
      { id: "a", label: "P.0 ヒポクラテスの誓い" },
      { id: "b", label: "P.1 医神アスクレピオス" },
      { id: "c", label: "P.2 父アポロン" },
      { id: "d", label: "P.3 王様の耳はロバの耳" },
      { id: "e", label: "P.4 愛の神キューピッド" },
      { id: "f", label: "いずれも関係しない" },
    ],
  },
  q2: {
    title: "問2 文脈理解",
    subtitle: "接続詞パズルを完成させよう",
    type: "fill_blank",
    mechanic: "パズルピース",
    blanks: [
      { id: "ア", context: "それぞれに決められた職分がありました。(　)ギリシア神話では…", answer: "また、", hint: "追加の情報を付け加える" },
      { id: "イ", context: "神々と人間を分かつ点がたった一つだけありました。(　)神々は絶対に死なないし…", answer: "それは、", hint: "前文の内容を説明する" },
      { id: "ウ", context: "人間はどんなに優れていても必ず死ぬという、この一点です。(　)神々の場合には…", answer: "ただし、", hint: "条件・例外を追加する" },
      { id: "エ", context: "美しいダプネの心だけは射なかった。(　)ダプネの心には…", answer: "しかし、", hint: "前文と逆の内容が続く" },
      { id: "オ", context: "エロスがアポロンの恋心を嘲った。(　)怒ったエロスは…", answer: "すると、", hint: "前の出来事の結果として" },
      { id: "カ", context: "「せめて私の聖樹になって欲しい」と頼みました。(　)ダプネは枝を揺らして…", answer: "すると、", hint: "前の行動に対する反応" },
    ],
    choices: ["すると、", "また、", "しかし、", "ただし、", "それは、"],
  },
  q3: {
    title: "問3 漢字バトル",
    subtitle: "ひらがなを正しい漢字に変換せよ！",
    type: "kanji",
    mechanic: "タイムアタック",
    words: [
      { hiragana: "すがたかたち", answer: "姿形", options: ["姿形", "姿方", "容形", "姿態"] },
      { hiragana: "のうりょく", answer: "能力", options: ["能力", "脳力", "農力", "能利"] },
      { hiragana: "たげい", answer: "多芸", options: ["多芸", "多技", "多藝", "多礼"] },
      { hiragana: "おんがく", answer: "音楽", options: ["音楽", "音学", "恩楽", "穏楽"] },
      { hiragana: "どうとく", answer: "道徳", options: ["道徳", "動特", "導得", "同徳"] },
      { hiragana: "いがく", answer: "医学", options: ["医学", "異学", "衣学", "意学"] },
      { hiragana: "こうめい", answer: "光明", options: ["光明", "公明", "功名", "巧明"] },
      { hiragana: "たいよう", answer: "太陽", options: ["太陽", "大洋", "大要", "体用"] },
    ],
  },
  q4: {
    title: "問4 要約チャレンジ",
    subtitle: "「王様の耳はロバの耳」を38字以内で要約",
    type: "summary",
    mechanic: "凝縮チャレンジ",
    maxChars: 38,
    passage: "音楽の神アポロンとパンの演奏対決で、ミダス王だけがパンの勝ちと主張。怒ったアポロンはミダス王の耳をロバの耳に変えた。",
  },
  q5: {
    title: "問5 知恵カード収集",
    subtitle: "医療・身体の慣用句を攻略しよう",
    type: "idiom",
    mechanic: "カードコレクション",
    items: [
      { q: "「こめかみ」とはどこを指しますか？", options: ["① 額の中央", "② 目と耳の間", "③ 顎の下", "④ 首の後ろ"], answer: 1, emoji: "🧠" },
      { q: "「腑に落ちない」の意味は？", options: ["胃が痛い", "納得できない", "忘れてしまう", "興味がない"], answer: 1, emoji: "🤔" },
      { q: "「歯に衣着せぬ」の読み方は？", options: ["はにきぬきせぬ", "はにころもきせぬ", "しにいきせぬ", "はにきぬつけぬ"], answer: 0, emoji: "💬" },
      { q: "「歯に衣着せぬ」の意味は？", options: ["物を大切にする", "遠慮なくものを言う", "嘘をつく", "黙っている"], answer: 1, emoji: "💬" },
      { q: "「匙を投げる」の意味は？", options: ["料理が下手", "諦める", "怒る", "驚く"], answer: 1, emoji: "🥄" },
      { q: "「過ぎたるは及ばざるが如し」の意味は？", options: ["努力は必ず報われる", "やりすぎもやらなすぎと同じ", "時は金なり", "急がば回れ"], answer: 1, emoji: "⚖️" },
      { q: "「案ずるより生むが易し」の意味は？", options: ["出産は簡単だ", "計画が大切", "心配するより実行する方が簡単", "考えすぎは良くない"], answer: 2, emoji: "💡" },
    ],
  },
};

const MAP_NODES = [
  { id: 0, x: 15, y: 8, label: "START", type: "start", q: null },
  { id: 1, x: 38, y: 12, label: "問1-①", type: "quiz", q: "q1_1" },
  { id: 2, x: 60, y: 8, label: "問1-②", type: "quiz", q: "q1_2" },
  { id: 3, x: 78, y: 15, label: "問1-③④", type: "quiz", q: "q1_3" },
  { id: 4, x: 65, y: 28, label: "🎁", type: "bonus", q: null },
  { id: 5, x: 40, y: 30, label: "問2", type: "quiz", q: "q2" },
  { id: 6, x: 18, y: 35, label: "問3", type: "quiz", q: "q3" },
  { id: 7, x: 35, y: 48, label: "🎁", type: "bonus", q: null },
  { id: 8, x: 58, y: 50, label: "問4", type: "quiz", q: "q4" },
  { id: 9, x: 78, y: 45, label: "問5", type: "quiz", q: "q5" },
  { id: 10, x: 60, y: 65, label: "BOSS", type: "boss", q: null },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CardReveal({ card, onClose }) {
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
        width: 220, padding: "32px 24px", borderRadius: 20,
        background: `linear-gradient(135deg, ${card.color}22, ${card.color}44)`,
        border: `2px solid ${card.color}`, textAlign: "center",
        transform: phase >= 2 ? "scale(1) rotateY(0deg)" : "scale(0.5) rotateY(90deg)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: `0 0 40px ${card.color}66`,
      }}>
        <div style={{ fontSize: 48 }}>{card.emoji}</div>
        <div style={{ fontSize: 11, color: card.color, marginTop: 8, letterSpacing: 2 }}>{card.rarity}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: PASTEL.text, marginTop: 6 }}>{card.name}</div>
        <div style={{ fontSize: 12, color: PASTEL.textMuted, marginTop: 6 }}>{card.desc}</div>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 16 }}>タップして閉じる</div>
      </div>
    </div>
  );
}

function SugorokuMap({ currentNode, completedNodes, onNodeClick }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 320, borderRadius: 20, overflow: "hidden",
      background: "linear-gradient(180deg, #F5EDE4 0%, #EDE3D8 50%, #E8DDD0 100%)" }}>
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: 13, fontWeight: 600, color: PASTEL.primary }}>
        🏛️ Step 1 — アポロンの章
      </div>
      <svg viewBox="0 0 100 80" style={{ width: "100%", height: "100%" }}>
        {MAP_NODES.slice(0, -1).map((node, i) => {
          const next = MAP_NODES[i + 1];
          return (
            <line key={`l${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y}
              stroke={completedNodes.includes(next.id) ? PASTEL.teal : "#D5CBC0"}
              strokeWidth={completedNodes.includes(next.id) ? 0.8 : 0.5}
              strokeDasharray={completedNodes.includes(next.id) ? "none" : "1.5 1"} />
          );
        })}
        {MAP_NODES.map(node => {
          const isCompleted = completedNodes.includes(node.id);
          const isCurrent = currentNode === node.id;
          const isLocked = !isCompleted && !isCurrent;
          const nodeColor = node.type === "boss" ? PASTEL.accent :
            node.type === "bonus" ? PASTEL.gold :
            node.type === "start" ? PASTEL.lavender :
            isCompleted ? PASTEL.teal : isCurrent ? PASTEL.accent : "#D5CBC0";
          return (
            <g key={node.id} onClick={() => !isLocked && onNodeClick(node)}
              style={{ cursor: isLocked ? "default" : "pointer" }}>
              {isCurrent && (
                <circle cx={node.x} cy={node.y} r={4.5} fill="none"
                  stroke={PASTEL.accent} strokeWidth={0.4} opacity={0.5}>
                  <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={node.x} cy={node.y} r={3.5}
                fill={isLocked ? "#EDE5DC" : nodeColor}
                stroke={isLocked ? "#D5CBC0" : nodeColor}
                strokeWidth={0.5} />
              {isCompleted && (
                <text x={node.x} y={node.y + 1} textAnchor="middle" fontSize={3.5} fill="white">✓</text>
              )}
              {!isCompleted && !isLocked && node.type !== "start" && (
                <text x={node.x} y={node.y + 1} textAnchor="middle" fontSize={2.5} fill="white" fontWeight="bold">
                  {node.type === "bonus" ? "!" : node.type === "boss" ? "⚡" : "?"}
                </text>
              )}
              <text x={node.x} y={node.y + 7} textAnchor="middle" fontSize={2.2}
                fill={isLocked ? "#C5BBB0" : PASTEL.text} fontWeight={isCurrent ? "bold" : "normal"}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function QuizQ1({ onComplete }) {
  const q = QUESTIONS.q1;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const item = q.items[step];

  const handleSelect = (optId) => {
    if (result !== null) return;
    setSelected(optId);
    const correct = optId === item.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < q.items.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), q.items.length);
      }
    }, 1200);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600, letterSpacing: 1 }}>
          {step + 1} / {q.items.length}
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
          {q.items.map((_, i) => (
            <div key={i} style={{ width: 32, height: 4, borderRadius: 2,
              background: i < step ? PASTEL.teal : i === step ? PASTEL.accent : PASTEL.border }} />
          ))}
        </div>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", borderRadius: 16,
        padding: "24px 20px", textAlign: "center", marginBottom: 16
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 14, color: PASTEL.text, fontWeight: 500 }}>{item.scene}</div>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 6 }}>
          この絵はどの節の物語にふさわしいですか？
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {q.options.map(opt => {
          const isCorrectAnswer = result !== null && opt.id === item.answer;
          const isWrongSelection = result === false && opt.id === selected;
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)} style={{
              padding: "12px 10px", borderRadius: 12, border: "1.5px solid",
              fontSize: 12, fontWeight: 500, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.3s",
              background: isCorrectAnswer ? PASTEL.success + "20" : isWrongSelection ? PASTEL.error + "20" : "#fff",
              borderColor: isCorrectAnswer ? PASTEL.success : isWrongSelection ? PASTEL.error :
                selected === opt.id ? PASTEL.accent : PASTEL.border,
              color: PASTEL.text,
              transform: isCorrectAnswer ? "scale(1.03)" : "scale(1)",
            }}>
              <span style={{ fontWeight: 700, marginRight: 4 }}>{opt.id}.</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizQ2({ onComplete }) {
  const q = QUESTIONS.q2;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const blank = q.blanks[step];

  const handleSelect = (choice) => {
    if (result !== null) return;
    setSelected(choice);
    const correct = choice === blank.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < q.blanks.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), q.blanks.length);
      }
    }, 1200);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>
          空欄（{blank.id}）を埋めよう — {step + 1}/{q.blanks.length}
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6 }}>
          {q.blanks.map((_, i) => (
            <div key={i} style={{ width: 24, height: 4, borderRadius: 2,
              background: i < step ? PASTEL.teal : i === step ? PASTEL.accent : PASTEL.border }} />
          ))}
        </div>
      </div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "18px 16px", marginBottom: 14,
        fontSize: 13, lineHeight: 1.9, color: PASTEL.text, position: "relative",
        borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        {blank.context.split("(　)").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span style={{
                display: "inline-block", minWidth: 64, padding: "2px 10px", margin: "0 2px",
                background: result !== null ? (result ? PASTEL.success + "30" : PASTEL.error + "30") : PASTEL.lavender + "30",
                borderRadius: 6, border: `1.5px dashed ${result !== null ? (result ? PASTEL.success : PASTEL.error) : PASTEL.lavender}`,
                textAlign: "center", fontWeight: 600, fontSize: 13,
                color: result !== null ? (result ? PASTEL.success : PASTEL.error) : PASTEL.lavender,
              }}>
                {selected || "？"}
              </span>
            )}
          </span>
        ))}
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginTop: 8 }}>💡 ヒント: {blank.hint}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {q.choices.map(choice => {
          const isCorrect = result !== null && choice === blank.answer;
          const isWrong = result === false && choice === selected;
          return (
            <button key={choice} onClick={() => handleSelect(choice)} style={{
              padding: "10px 18px", borderRadius: 24, fontSize: 14, fontWeight: 600,
              border: `2px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "18" : isWrong ? PASTEL.error + "18" : "#fff",
              color: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.text,
              cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", transform: isCorrect ? "scale(1.08)" : "scale(1)",
            }}>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizQ3({ onComplete }) {
  const q = QUESTIONS.q3;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const word = q.words[step];

  useEffect(() => {
    setShuffledOpts(shuffleArray(word.options));
  }, [step]);

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score, q.words.length); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (opt) => {
    if (result !== null) return;
    const correct = opt === word.answer;
    setResult(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step < q.words.length - 1) {
        setStep(s => s + 1);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), q.words.length);
      }
    }, 800);
  };

  const pct = (timeLeft / 60) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>{step + 1}/{q.words.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 100, height: 6, borderRadius: 3, background: PASTEL.border, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, transition: "width 1s linear",
              background: timeLeft > 20 ? PASTEL.teal : timeLeft > 10 ? PASTEL.gold : PASTEL.error }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums",
            color: timeLeft > 10 ? PASTEL.text : PASTEL.error }}>{timeLeft}s</span>
        </div>
      </div>
      <div style={{
        textAlign: "center", padding: "28px 20px", borderRadius: 16,
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>この読みを漢字に変換</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: PASTEL.accent, letterSpacing: 4 }}>{word.hiragana}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {shuffledOpts.map(opt => {
          const isCorrect = result !== null && opt === word.answer;
          const isWrong = result !== null && result === false && opt !== word.answer;
          return (
            <button key={opt} onClick={() => handleSelect(opt)} style={{
              padding: "14px 12px", borderRadius: 14, fontSize: 18, fontWeight: 700,
              letterSpacing: 2, border: `2px solid ${isCorrect ? PASTEL.success : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "15" : "#fff",
              color: isCorrect ? PASTEL.success : PASTEL.text,
              cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", opacity: isWrong ? 0.4 : 1,
              transform: isCorrect ? "scale(1.05)" : "scale(1)",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizQ4({ onComplete }) {
  const q = QUESTIONS.q4;
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const charCount = [...text].length;
  const isOver = charCount > q.maxChars;

  const handleSubmit = () => {
    if (charCount === 0 || isOver) return;
    setSubmitted(true);
    setTimeout(() => onComplete(charCount <= q.maxChars ? 1 : 0, 1), 2000);
  };

  return (
    <div>
      <div style={{
        background: "#F9F5F0", borderRadius: 14, padding: "16px", marginBottom: 16,
        fontSize: 13, lineHeight: 1.8, color: PASTEL.text, borderLeft: `3px solid ${PASTEL.lavender}`
      }}>
        <div style={{ fontSize: 11, color: PASTEL.textMuted, marginBottom: 6 }}>📖 P.3「王様の耳はロバの耳」のあらすじ</div>
        {q.passage}
      </div>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} disabled={submitted}
          placeholder="38字以内で要約を書いてください…" rows={3}
          style={{
            width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, fontSize: 14,
            border: `2px solid ${isOver ? PASTEL.error : submitted ? PASTEL.success : PASTEL.border}`,
            background: submitted ? PASTEL.success + "08" : "#fff", color: PASTEL.text,
            fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.7,
          }} />
        <div style={{
          position: "absolute", bottom: 10, right: 14, fontSize: 12, fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: isOver ? PASTEL.error : charCount > q.maxChars - 5 ? PASTEL.gold : PASTEL.textMuted,
        }}>
          {charCount}/{q.maxChars}
        </div>
      </div>
      {submitted ? (
        <div style={{
          background: PASTEL.success + "15", border: `1.5px solid ${PASTEL.success}`,
          borderRadius: 12, padding: "12px 16px", fontSize: 13, color: PASTEL.success, textAlign: "center"
        }}>
          ✨ 要約完了！{charCount}字でまとめました
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

function QuizQ5({ onComplete }) {
  const q = QUESTIONS.q5;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState([]);
  const item = q.items[step];

  const handleSelect = (idx) => {
    if (result !== null) return;
    setSelected(idx);
    const correct = idx === item.answer;
    setResult(correct);
    if (correct) {
      setScore(s => s + 1);
      setCollected(c => [...c, item.emoji]);
    }
    setTimeout(() => {
      if (step < q.items.length - 1) {
        setStep(s => s + 1);
        setSelected(null);
        setResult(null);
      } else {
        onComplete(score + (correct ? 1 : 0), q.items.length);
      }
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: PASTEL.accent, fontWeight: 600 }}>{step + 1}/{q.items.length}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {collected.map((e, i) => <span key={i} style={{ fontSize: 16 }}>{e}</span>)}
          {Array.from({ length: q.items.length - collected.length }).map((_, i) => (
            <span key={`e${i}`} style={{ fontSize: 16, opacity: 0.2 }}>❓</span>
          ))}
        </div>
      </div>
      <div style={{
        textAlign: "center", padding: "20px 16px", borderRadius: 16,
        background: "linear-gradient(135deg, #F5EDE4, #EDE3D8)", marginBottom: 14
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: PASTEL.text }}>{item.q}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {item.options.map((opt, idx) => {
          const isCorrect = result !== null && idx === item.answer;
          const isWrong = result === false && idx === selected;
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              padding: "13px 16px", borderRadius: 12, fontSize: 14, textAlign: "left",
              border: `1.5px solid ${isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border}`,
              background: isCorrect ? PASTEL.success + "12" : isWrong ? PASTEL.error + "12" : "#fff",
              color: PASTEL.text, cursor: result !== null ? "default" : "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10,
              transform: isCorrect ? "scale(1.02)" : "scale(1)",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: isCorrect ? PASTEL.success : isWrong ? PASTEL.error : PASTEL.border,
                color: isCorrect || isWrong ? "#fff" : PASTEL.text,
              }}>
                {isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BonusScreen({ onClose }) {
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

export default function AsclepiusQuest() {
  const [screen, setScreen] = useState("title");
  const [currentNode, setCurrentNode] = useState(0);
  const [completedNodes, setCompletedNodes] = useState([0]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(3);
  const [earnedCards, setEarnedCards] = useState([]);
  const [showCard, setShowCard] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizKey, setQuizKey] = useState(0);

  const totalXpNeeded = 500;

  const completeNode = (nodeId) => {
    if (!completedNodes.includes(nodeId)) {
      setCompletedNodes(prev => [...prev, nodeId]);
    }
    const nextId = Math.min(nodeId + 1, MAP_NODES.length - 1);
    setCurrentNode(nextId);
  };

  const handleQuizComplete = (correct, total, nodeId) => {
    const earnedXp = correct * 30 + (correct === total ? 50 : 0);
    setXp(x => x + earnedXp);
    completeNode(nodeId);
    if (correct >= total * 0.7 && earnedCards.length < CARDS.length) {
      const nextCard = CARDS.find(c => !earnedCards.includes(c.id));
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
    const qMap = { "q1_1": "q1", "q1_2": "q1", "q1_3": "q1", "q2": "q2", "q3": "q3", "q4": "q4", "q5": "q5" };
    setActiveQuiz({ qKey: qMap[node.q] || "q1", nodeId: node.id });
    setQuizKey(k => k + 1);
    setScreen("quiz");
  };

  const renderQuiz = () => {
    if (activeQuiz === "bonus") return <BonusScreen onClose={() => { setActiveQuiz(null); setScreen("map"); }} />;
    if (!activeQuiz) return null;
    const { qKey, nodeId } = activeQuiz;
    const onDone = (c, t) => handleQuizComplete(c, t, nodeId);
    switch (qKey) {
      case "q1": return <QuizQ1 key={quizKey} onComplete={onDone} />;
      case "q2": return <QuizQ2 key={quizKey} onComplete={onDone} />;
      case "q3": return <QuizQ3 key={quizKey} onComplete={onDone} />;
      case "q4": return <QuizQ4 key={quizKey} onComplete={onDone} />;
      case "q5": return <QuizQ5 key={quizKey} onComplete={onDone} />;
      default: return <QuizQ1 key={quizKey} onComplete={onDone} />;
    }
  };

  if (screen === "title") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", background: "linear-gradient(180deg, #FFF8F3 0%, #F5EDE4 50%, #EDE3D8 100%)",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif", padding: 24, textAlign: "center",
      }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏛️</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: PASTEL.text, margin: 0, letterSpacing: 1 }}>
          医神アスクレピオス
        </h1>
        <h2 style={{ fontSize: 15, fontWeight: 500, color: PASTEL.accent, marginTop: 6, letterSpacing: 2 }}>
          読解力クエスト
        </h2>
        <div style={{
          marginTop: 24, padding: "16px 20px", borderRadius: 16,
          background: "#ffffff88", backdropFilter: "blur(8px)",
          maxWidth: 300, fontSize: 12, lineHeight: 1.8, color: PASTEL.textMuted,
        }}>
          ギリシャ神話の世界を冒険しながら<br/>
          読解力を鍛えよう！<br/>
          <span style={{ color: PASTEL.accent, fontWeight: 600 }}>Step 1 — アポロンの章</span>
        </div>
        <button onClick={() => setScreen("map")} style={{
          marginTop: 28, padding: "16px 48px", borderRadius: 28, border: "none",
          background: `linear-gradient(135deg, ${PASTEL.accent}, ${PASTEL.lavender})`,
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 2,
          boxShadow: `0 8px 24px ${PASTEL.accent}44`,
        }}>
          冒険を始める
        </button>
        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          {["スワイプ", "パズル", "バトル", "収集"].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20,
                background: [PASTEL.teal, PASTEL.lavender, PASTEL.accent, PASTEL.gold][i] + "20",
              }}>
                {["👆", "🧩", "⚔️", "🃏"][i]}
              </div>
              <div style={{ fontSize: 10, color: PASTEL.textMuted, marginTop: 4 }}>{m}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FFF8F3 0%, #F5EDE4 100%)",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      {showCard && <CardReveal card={showCard} onClose={() => setShowCard(null)} />}

      {/* Header */}
      <div style={{
        padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#ffffffcc", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${PASTEL.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏛️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: PASTEL.text }}>Step 1</div>
            <div style={{ fontSize: 10, color: PASTEL.textMuted }}>アポロンの章</div>
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
            <SugorokuMap currentNode={currentNode} completedNodes={completedNodes} onNodeClick={handleNodeClick} />
            {/* Quick Action Bar */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12,
            }}>
              {[
                { icon: "📖", label: "物語を読む", color: PASTEL.lavender },
                { icon: "🃏", label: "カード図鑑", color: PASTEL.gold },
                { icon: "📊", label: "ランキング", color: PASTEL.teal },
              ].map((item, i) => (
                <button key={i} style={{
                  padding: "12px 8px", borderRadius: 14, border: `1.5px solid ${item.color}30`,
                  background: `${item.color}08`, cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: PASTEL.text, marginTop: 4 }}>{item.label}</div>
                </button>
              ))}
            </div>
            {/* Current Node Prompt */}
            {currentNode > 0 && currentNode < MAP_NODES.length - 1 && (
              <div style={{
                marginTop: 12, padding: "14px 16px", borderRadius: 14,
                background: "#fff", border: `1.5px solid ${PASTEL.accent}30`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: PASTEL.accent + "15",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                  {MAP_NODES[currentNode]?.type === "bonus" ? "🎁" : "📝"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: PASTEL.text }}>
                    {MAP_NODES[currentNode]?.label}に挑戦しよう！
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
            textAlign: "center", padding: "40px 20px", background: "#fff",
            borderRadius: 20, marginTop: 4,
          }}>
            <div style={{ fontSize: 56 }}>⚡</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: PASTEL.text, marginTop: 12 }}>
              最終試練：ゼウスの裁き
            </div>
            <div style={{ fontSize: 13, color: PASTEL.textMuted, marginTop: 8, lineHeight: 1.7 }}>
              すべてのクイズマスをクリアすると<br/>最終ボスに挑戦できます
            </div>
            <div style={{
              marginTop: 20, padding: "12px 16px", borderRadius: 12,
              background: PASTEL.accent + "10", fontSize: 12, color: PASTEL.accent, fontWeight: 600,
            }}>
              残り {MAP_NODES.filter(n => n.type === "quiz" && !completedNodes.includes(n.id)).length} マス未クリア
            </div>
            <button onClick={() => setScreen("map")} style={{
              marginTop: 20, padding: "12px 36px", borderRadius: 24, border: "none",
              background: PASTEL.primary, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              マップに戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
