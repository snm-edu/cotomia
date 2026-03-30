/**
 * チャット型ストーリーデータ
 *
 * type:
 *   "msg"      — キャラの台詞バブル
 *   "narr"     — ナレーション（中央表示）
 *   "choice"   — 読者への質問（学習確認、正解で次に進む）
 *   "highlight" — 重要ポイントカード
 */

const CHARACTERS = {
  narrator: { name: "語り部", emoji: "📜", color: "#C4A882", side: "center" },
  apollo: { name: "アポロン", emoji: "☀️", color: "#E8C872", side: "left" },
  asclepius: { name: "アスクレピオス", emoji: "🐍", color: "#7EBDB4", side: "left" },
  chiron: { name: "ケイロン", emoji: "🏹", color: "#C4A882", side: "left" },
  zeus: { name: "ゼウス", emoji: "⚡", color: "#B5A8D5", side: "right" },
  hades: { name: "ハデス", emoji: "💀", color: "#6B5B95", side: "right" },
  cupid: { name: "エロス", emoji: "💘", color: "#E8B4C8", side: "right" },
  daphne: { name: "ダプネ", emoji: "🌿", color: "#7EBDB4", side: "right" },
  midas: { name: "ミダス王", emoji: "👑", color: "#B5A8D5", side: "right" },
  pan: { name: "パン", emoji: "🎵", color: "#7EBDB4", side: "right" },
  hippocrates: { name: "ヒポクラテス", emoji: "📋", color: "#C4A882", side: "left" },
  coronis: { name: "コロニス", emoji: "🕊️", color: "#E8B4C8", side: "left" },
  student: { name: "あなた", emoji: "🎓", color: "#D4877F", side: "right" },
};

export { CHARACTERS };

export const CHAT_STORIES = [
  // ===== P.0 ヒポクラテスの誓い =====
  {
    id: "p0",
    title: "P.0 ヒポクラテスの誓い",
    emoji: "📜",
    linkedStep: 1,
    messages: [
      { type: "narr", text: "古代ギリシャ — 医学が生まれた時代" },
      { type: "msg", char: "hippocrates", text: "私はヒポクラテス。人々は私を「医学の父」と呼ぶ。" },
      { type: "msg", char: "hippocrates", text: "病気は神の罰ではない。自然現象として捉えるべきだ。" },
      { type: "msg", char: "student", text: "それまではどう考えられていたんですか？" },
      { type: "msg", char: "hippocrates", text: "神殿で祈祷をすれば治ると信じられていた。私はそれを変えた。" },
      { type: "highlight", text: "💡 ヒポクラテスは病気を「自然現象」として科学的に捉えた最初の医師" },
      { type: "msg", char: "hippocrates", text: "そして私は医師の倫理を定めた。「ヒポクラテスの誓い」だ。" },
      { type: "msg", char: "hippocrates", text: "「患者のために最善を尽くし、害を与えない」これが基本だ。" },
      { type: "choice", text: "「ヒポクラテスの誓い」は何を定めたもの？", options: ["料理のレシピ", "医師の倫理", "神殿の規則"], answer: 1 },
      { type: "msg", char: "hippocrates", text: "この誓いは、2500年後の今も医療の世界で生きている。" },
      { type: "narr", text: "ヒポクラテスの精神は、あるギリシャの医神から受け継がれたものだった——" },
    ],
  },

  // ===== P.1 医神アスクレピオス =====
  {
    id: "p1",
    title: "P.1 医神アスクレピオス",
    emoji: "🐍",
    linkedStep: 1,
    messages: [
      { type: "narr", text: "神話の時代、一人の医神がいた" },
      { type: "msg", char: "chiron", text: "アスクレピオスよ。お前は私の最高の弟子だ。" },
      { type: "msg", char: "asclepius", text: "ケイロン先生。あなたのおかげで医術を学べました。" },
      { type: "msg", char: "chiron", text: "お前の父アポロンから預かった時、お前はまだ赤子だった。" },
      { type: "choice", text: "アスクレピオスに医術を教えたのは誰？", options: ["アポロン", "ゼウス", "ケイロン"], answer: 2 },
      { type: "msg", char: "asclepius", text: "先生、私はもっと力を磨きたい。すべての病を治したい。" },
      { type: "msg", char: "chiron", text: "志は立派だ。だが…死の領域には踏み込むな。" },
      { type: "msg", char: "asclepius", text: "……はい。" },
      { type: "narr", text: "しかし、アスクレピオスの医術はやがて死者すら蘇らせるほどに——" },
      { type: "highlight", text: "🐍 アスクレピオスの杖（蛇が巻きついた杖）は、現代の医療シンボルの起源" },
    ],
  },

  // ===== P.2 父アポロン =====
  {
    id: "p2",
    title: "P.2 父アポロン",
    emoji: "☀️",
    linkedStep: 1,
    messages: [
      { type: "narr", text: "オリュンポスの神々の中でも、ひときわ輝く存在がいた" },
      { type: "msg", char: "apollo", text: "俺はアポロン。太陽の神だ。" },
      { type: "msg", char: "student", text: "太陽だけの神なんですか？" },
      { type: "msg", char: "apollo", text: "まさか！音楽、医術、予言…多芸の神と呼ばれている。" },
      { type: "highlight", text: "☀️ アポロンの能力：音楽・医術・予言・光明・道徳など多数" },
      { type: "msg", char: "apollo", text: "ギリシャの神々には、それぞれ決められた職分があった。" },
      { type: "msg", char: "apollo", text: "だが、神と人間を分かつ点がたった一つだけあった。" },
      { type: "choice", text: "神と人間の最大の違いは？", options: ["姿形が違う", "神は絶対に死なない", "神は食事をしない"], answer: 1 },
      { type: "msg", char: "apollo", text: "そう。神は不死だが、人間はどんなに優れていても必ず死ぬ。" },
      { type: "msg", char: "apollo", text: "ただし…神でも永遠の傷を負うことはある。" },
      { type: "narr", text: "アポロンもまた、恋という傷を負うことになる——" },
    ],
  },

  // ===== P.3 王様の耳はロバの耳 =====
  {
    id: "p3",
    title: "P.3 王様の耳はロバの耳",
    emoji: "👑",
    linkedStep: 1,
    messages: [
      { type: "narr", text: "ある日、音楽の神アポロンと牧神パンの演奏対決が行われた" },
      { type: "msg", char: "apollo", text: "俺の竪琴の音色を聴くがいい。" },
      { type: "msg", char: "pan", text: "いやいや、俺の笛の方が素晴らしいさ！" },
      { type: "narr", text: "審判たち全員がアポロンの勝利を認めた。ただ一人を除いて——" },
      { type: "msg", char: "midas", text: "いや、パンの方が上手い！断然パンの勝ちだ！" },
      { type: "msg", char: "apollo", text: "……音楽を理解できぬ耳など、ふさわしい形に変えてやろう。" },
      { type: "choice", text: "怒ったアポロンはミダス王の耳をどう変えた？", options: ["象の耳にした", "ロバの耳にした", "耳を消した"], answer: 1 },
      { type: "msg", char: "midas", text: "こ、これは…誰にも知られてはならぬ…！" },
      { type: "highlight", text: "👑 「王様の耳はロバの耳」— 真実は隠せないという教訓の物語" },
      { type: "narr", text: "神を侮ると報いを受ける。それがギリシャ神話の世界——" },
    ],
  },

  // ===== P.4 愛の神キューピッド =====
  {
    id: "p4",
    title: "P.4 愛の神キューピッド",
    emoji: "💘",
    linkedStep: 2,
    messages: [
      { type: "narr", text: "ある日、アポロンは幼いエロスを見かけた" },
      { type: "msg", char: "apollo", text: "おいエロス、お前のような子供が弓矢で遊ぶんじゃない。" },
      { type: "msg", char: "cupid", text: "子供…だと？" },
      { type: "msg", char: "apollo", text: "弓は俺のような戦士が使うものだ。" },
      { type: "msg", char: "cupid", text: "ふふ…なら見せてあげよう。私の矢の本当の力を。" },
      { type: "highlight", text: "💘 エロスの矢：金の矢＝恋に落ちる、鉛の矢＝恋を拒む" },
      { type: "msg", char: "cupid", text: "アポロンには金の矢を…そしてダプネには鉛の矢を！" },
      { type: "choice", text: "エロスがアポロンに放った「金の矢」の効果は？", options: ["怒りに燃える", "恋に落ちる", "眠りにつく"], answer: 1 },
      { type: "msg", char: "apollo", text: "な…なんだこの気持ちは…！ダプネ、美しい…！" },
      { type: "narr", text: "こうしてアポロンの報われぬ恋が始まった——" },
    ],
  },

  // ===== P.5 月桂樹のダプネ =====
  {
    id: "p5",
    title: "P.5 月桂樹のダプネ",
    emoji: "🌿",
    linkedStep: 2,
    messages: [
      { type: "msg", char: "apollo", text: "ダプネ！待ってくれ！" },
      { type: "msg", char: "daphne", text: "来ないで！私はあなたの気持ちに応えられない！" },
      { type: "msg", char: "apollo", text: "なぜだ…！俺は太陽の神だぞ！" },
      { type: "msg", char: "daphne", text: "それでも。この心は変えられない。" },
      { type: "narr", text: "追い詰められたダプネは、父である河の神に助けを求めた" },
      { type: "msg", char: "daphne", text: "お父様…！この姿を変えて…！" },
      { type: "narr", text: "その瞬間、ダプネの足は根に、腕は枝に、髪は葉に変わっていった——" },
      { type: "choice", text: "ダプネは何に姿を変えた？", options: ["薔薇の花", "月桂樹", "オリーブの木"], answer: 1 },
      { type: "msg", char: "apollo", text: "ダプネ…ならば、せめて君を私の聖樹にさせてくれ。" },
      { type: "narr", text: "ダプネは枝を揺らして頷いた" },
      { type: "highlight", text: "🌿 月桂冠 — アポロンがダプネを偲んで身につけた冠。勝利の象徴に" },
    ],
  },

  // ===== P.6 ゼウスの裁き =====
  {
    id: "p6",
    title: "P.6 ゼウスの裁き",
    emoji: "⚡",
    linkedStep: 3,
    messages: [
      { type: "narr", text: "アスクレピオスの医術は、ついに禁断の領域に達した" },
      { type: "msg", char: "asclepius", text: "私の力があれば…死者すら蘇らせることができる。" },
      { type: "msg", char: "hades", text: "待て。死者を蘇らせるだと？冥界の秩序が崩れるではないか！" },
      { type: "msg", char: "hades", text: "ゼウスよ！この者を止めねば、世界の均衡が崩れる！" },
      { type: "choice", text: "ハデスが怒った理由は？", options: ["アスクレピオスが嫌いだから", "死者の復活が冥界の秩序を乱すから", "医術を独占しようとしたから"], answer: 1 },
      { type: "msg", char: "zeus", text: "……世界の秩序を乱す者は、神であろうと許さぬ。" },
      { type: "narr", text: "ゼウスは雷を手に取った——" },
      { type: "msg", char: "zeus", text: "アスクレピオスよ。お前の志は立派だった。だが…" },
      { type: "highlight", text: "⚡ ゼウスは世界の秩序を守るため、雷でアスクレピオスを打った" },
      { type: "msg", char: "apollo", text: "父上…！なぜ俺の息子を…！" },
      { type: "narr", text: "アポロンの悲しみは、天を揺るがすほどだった——" },
    ],
  },

  // ===== P.7 星座になった医神 =====
  {
    id: "p7",
    title: "P.7 星座になった医神",
    emoji: "⭐",
    linkedStep: 4,
    messages: [
      { type: "msg", char: "apollo", text: "ゼウスよ。息子の命を奪うとは…許せない。" },
      { type: "narr", text: "怒りに駆られたアポロンは、ゼウスの雷を作ったキュクロプスたちを殺してしまう" },
      { type: "msg", char: "zeus", text: "アポロン…お前も罰を受けねばならぬ。" },
      { type: "narr", text: "しかし母レトの懇願により、罰は軽減された" },
      { type: "msg", char: "apollo", text: "1年間…人間の羊飼いとして奉仕する、と…" },
      { type: "highlight", text: "🐑 アポロンは罰として1年間、人間界で羊飼いとして過ごした" },
      { type: "msg", char: "apollo", text: "この経験で分かった。人間は弱く、はかない。だからこそ医術が必要なのだ。" },
      { type: "msg", char: "zeus", text: "……アポロンよ。お前の願いを一つ聞こう。" },
      { type: "msg", char: "apollo", text: "アスクレピオスを天に上げてほしい。星として永遠に輝かせてほしい。" },
      { type: "choice", text: "アスクレピオスは天で何になった？", options: ["北極星", "へびつかい座", "オリオン座"], answer: 1 },
      { type: "narr", text: "こうしてアスクレピオスは「へびつかい座」として夜空に輝くことになった" },
      { type: "highlight", text: "⭐ アスクレピオスの杖 — 蛇が巻きついた杖は、WHO（世界保健機関）のシンボルとして今も使われている" },
      { type: "msg", char: "hippocrates", text: "彼の精神は、私たち医療者の中に生き続けている。" },
      { type: "narr", text: "医神アスクレピオスの物語は、現代の医療につながっている——" },
    ],
  },
];
