/**
 * チャット型ストーリーデータ
 *
 * type:
 *   "msg"      — キャラの台詞バブル
 *   "narr"     — ナレーション（中央表示）
 *   "choice"   — 読者への質問（学習確認、正解で次に進む）
 *   "highlight" — 重要ポイントカード
 *
 * ページ番号はPDF原文「医神アスクレピオスの物語」に準拠:
 *   P0 = はじめに（ヒポクラテス）
 *   P2 = アスクレピオスの父アポロン
 *   P3 = 王様の耳はロバの耳
 *   P4 = 愛の神キューピッド（ダプネの話を含む）
 *   P5 = アスクレピオスの母コロニス
 *   P6 = アスクレピオスの師ケイロン
 *   P7 = アスクレピオスへの医学教育
 *   P8 = アスクレピオスの生涯
 *   P9 = メドゥーサ
 *   P10 = ヒッポリュトス
 *   P11 = アスクレピオスの死とその後
 *   P12 = ケイロンの死
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
      { type: "msg", char: "hippocrates", text: "神殿で祈祷をすれば治ると信じられていた。癲癇さえも「神聖病」と呼ばれていたのだ。" },
      { type: "highlight", text: "💡 ヒポクラテスは病気を「自然現象」として科学的に捉えた最初の医師。原始的な医学から迷信や呪術を切り離した「医学の独立宣言」をした人物。" },
      { type: "msg", char: "hippocrates", text: "そして私は医師の倫理を定めた。「ヒポクラテスの誓い」だ。" },
      { type: "msg", char: "hippocrates", text: "「患者のために最善を尽くし、害を与えない」これが基本だ。" },
      { type: "choice", text: "「ヒポクラテスの誓い」は何を定めたもの？", options: ["料理のレシピ", "医師の倫理", "神殿の規則"], answer: 1 },
      { type: "msg", char: "hippocrates", text: "この誓いは、2500年後の今も医療の世界で生きている。" },
      { type: "narr", text: "ヒポクラテスの精神は、あるギリシャの医神から受け継がれたものだった——" },
    ],
  },

  // ===== P.2 アスクレピオスの父アポロン =====
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
      { type: "highlight", text: "☀️ アポロンの能力：音楽・医術・予言・光明・道徳など多数。祖父は全能の神ゼウス、祖母はレト。" },
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
      { type: "msg", char: "pan", text: "いやいや、俺の葦笛の方が素晴らしいさ！" },
      { type: "narr", text: "山の神トモロスを審判とし二人が演奏。アポロンの勝利を認めた。ただ一人を除いて——" },
      { type: "msg", char: "midas", text: "いや、パンの方が上手い！断然パンの勝ちだ！" },
      { type: "msg", char: "apollo", text: "……音楽を理解できぬ耳など、ふさわしい形に変えてやろう。" },
      { type: "choice", text: "怒ったアポロンはミダス王の耳をどう変えた？", options: ["象の耳にした", "ロバの耳にした", "耳を消した"], answer: 1 },
      { type: "msg", char: "midas", text: "こ、これは…誰にも知られてはならぬ…！ターバンで隠さねば…" },
      { type: "narr", text: "しかし床屋に秘密を知られてしまう。我慢できなくなった床屋は地面に穴を掘り叫んだ——" },
      { type: "msg", char: "narrator", text: "「王様の耳はロバの耳！」…やがて穴から葦が生え、その秘密を歌い始めた。" },
      { type: "highlight", text: "👑 ミダス王は改心し寛容さを示したため、アポロンは耳を元に戻した。真実は隠せないという教訓の物語。" },
    ],
  },

  // ===== P.4 愛の神キューピッド（ダプネの話を含む） =====
  {
    id: "p4",
    title: "P.4 愛の神キューピッド",
    emoji: "💘",
    linkedStep: 2,
    messages: [
      { type: "narr", text: "ある日、アポロンは幼いエロス（キューピッド）を見かけた" },
      { type: "msg", char: "apollo", text: "おいエロス、お前のような子供が弓矢で遊ぶんじゃない。" },
      { type: "msg", char: "cupid", text: "子供…だと？ふふ…なら見せてあげよう。私の矢の本当の力を。" },
      { type: "highlight", text: "💘 エロスの矢：黄金の「恋の矢」＝激しい愛情にとりつかれる、鉛の「嫌悪の矢」＝恋を嫌悪する" },
      { type: "msg", char: "cupid", text: "アポロンには金の矢を…そして河の神の娘ダプネには鉛の矢を！" },
      { type: "choice", text: "エロスがアポロンに放った「金の矢」の効果は？", options: ["怒りに燃える", "恋に落ちる", "眠りにつく"], answer: 1 },
      { type: "msg", char: "apollo", text: "ダプネ！待ってくれ！" },
      { type: "msg", char: "daphne", text: "来ないで！私はあなたを嫌悪している！" },
      { type: "narr", text: "川岸まで追い詰められたダプネは、父である河の神に助けを求めた" },
      { type: "msg", char: "daphne", text: "お父様…！この姿を変えて…！" },
      { type: "narr", text: "その瞬間、ダプネの足は根に、腕は枝に、髪は葉に変わっていった——" },
      { type: "choice", text: "ダプネは何に姿を変えた？", options: ["薔薇の花", "月桂樹", "オリーブの木"], answer: 1 },
      { type: "msg", char: "apollo", text: "ダプネ…ならば、せめて君を私の聖樹にさせてくれ。" },
      { type: "narr", text: "ダプネは枝を揺らしてうなずき、月桂樹の冠をアポロンの頭に落とした" },
      { type: "highlight", text: "🌿 月桂冠 — アポロンがダプネを偲んでいつも身につけた冠。勝利と栄光の象徴に。" },
    ],
  },

  // ===== P.5 アスクレピオスの母コロニス =====
  {
    id: "p5",
    title: "P.5 アスクレピオスの母コロニス",
    emoji: "🕊️",
    linkedStep: 2,
    messages: [
      { type: "narr", text: "アスクレピオスの母はプレギュアス王の娘コロニス。「カラスの乙女」という意味の名を持つ美しい女性だった" },
      { type: "msg", char: "coronis", text: "アポロン様と出逢った日のことは忘れられません。" },
      { type: "msg", char: "apollo", text: "俺も一目で恋に落ちた。だが、忙しい身でいつも一緒にはいられなかった。" },
      { type: "msg", char: "apollo", text: "そこで一羽のカラスをコロニスに預けた。当時のカラスは純白の羽で人間の言葉を話せたのだ。" },
      { type: "highlight", text: "🐦 当時のカラスは純白の美しい羽を持ち、人間の言葉を自由自在に話すことができた。アポロンとコロニスの間を一日一往復して想いを伝えていた。" },
      { type: "choice", text: "当時のカラスの羽の色は？", options: ["真っ黒", "純白", "金色"], answer: 1 },
      { type: "narr", text: "ある日、コロニスの元に若い好青年イスキュスが預けられ、家族同然に暮らすようになった" },
      { type: "msg", char: "narrator", text: "コロニスの誕生日パーティーでイスキュスとダンスをするのを目撃したカラスは、慌ててアポロンに報告した。" },
      { type: "msg", char: "apollo", text: "なんだと…！コロニスが他の男と…！" },
      { type: "narr", text: "嫉妬と怒りに燃えるアポロンは、まずカラスの羽を真っ黒に焼き、声もカアカアとしか鳴けないように変えてしまった" },
      { type: "msg", char: "apollo", text: "妹アルテミスよ、コロニスを…" },
      { type: "narr", text: "アルテミスの矢がコロニスの胸を貫いた" },
      { type: "msg", char: "coronis", text: "アポロン様…お腹の子供だけは…助けてください…" },
      { type: "msg", char: "apollo", text: "コロニス…！なんということを…自分の子が母と共に死ぬなど我慢ならない！" },
      { type: "narr", text: "アポロンは温もりの残るコロニスの胎内から胎児を取り出した——世界初の帝王切開である" },
      { type: "highlight", text: "🏥 アスクレピオスは世界で初めて帝王切開で生まれた子供。名前の意味は「常に穏やかな」。" },
    ],
  },

  // ===== P.6 アスクレピオスの師ケイロン =====
  {
    id: "p6",
    title: "P.6 アスクレピオスの師ケイロン",
    emoji: "🏹",
    linkedStep: 3,
    messages: [
      { type: "narr", text: "コロニスを失ったアポロンは、息子アスクレピオスの養育を考えた" },
      { type: "msg", char: "apollo", text: "この子を育てられる者…ペリオン山の賢者ケイロンしかいない。" },
      { type: "msg", char: "chiron", text: "アポロンの息子か。よかろう、私が責任をもって育てよう。" },
      { type: "highlight", text: "🏹 ケンタウロス族（上半身が人間・下半身が馬）の中で、ケイロンは例外的な賢者。薬草の知識に造詣が深く、医師・学者・預言者として有名だった。" },
      { type: "msg", char: "student", text: "ケイロンはヘラクレスやアキレスの先生でもあったんですか？" },
      { type: "msg", char: "chiron", text: "その通り。多くの英雄たちを育てたが、アスクレピオスは最高の弟子だった。" },
      { type: "choice", text: "ケンタウロス族の姿は？", options: ["全身が馬", "上半身が人間・下半身が馬", "翼を持つ人間"], answer: 1 },
      { type: "narr", text: "ケイロンの元を訪れた一族の娘エウイッペが、幼いアスクレピオスに予言をした——" },
      { type: "msg", char: "narrator", text: "「幼児よ、大きくなるのです！お前はやがて全世界に救いをもたらす者となる。一度奪われた生命を取り戻すことさえ許される…」" },
      { type: "highlight", text: "⚠️ エウイッペは秘密を口にした罰で、全身を馬に変えられ「ヒッポ」に改名させられた。" },
    ],
  },

  // ===== P.11 アスクレピオスの死とその後 =====
  {
    id: "p11",
    title: "P.11 アスクレピオスの死とその後",
    emoji: "⚡",
    linkedStep: 4,
    messages: [
      { type: "narr", text: "アスクレピオスの医術は、ついに禁断の領域に達した。死者を六度も蘇らせてしまう——" },
      { type: "msg", char: "hades", text: "死者が蘇れば冥界に誰もいなくなる…！もう六度も続いているのだ！" },
      { type: "msg", char: "hades", text: "ゼウスよ！これは冥界の秩序の問題だ。もはや許せぬ！" },
      { type: "choice", text: "ハデスが怒った理由は？", options: ["アスクレピオスが嫌いだから", "死者の復活が冥界の秩序を乱すから", "医術を独占しようとしたから"], answer: 1 },
      { type: "msg", char: "zeus", text: "アスクレピオスは孫…可愛がってもいた。しかし、事は現世と冥界の秩序の問題だ。" },
      { type: "msg", char: "zeus", text: "冥界に混乱をおこしてはならない。運命を変えてはならない。命令は死守せよ。" },
      { type: "narr", text: "ゼウスは一つ目巨人キュクロプスから贈られた強力な雷をアスクレピオスに直撃した——薬箱もろとも消し去った" },
      { type: "highlight", text: "⚡ 不死のはずの神も、大神ゼウスの雷の前には死すべき運命だった。" },
      { type: "msg", char: "apollo", text: "父上…！なぜ俺の息子を…！" },
      { type: "narr", text: "怒りに駆られたアポロンは、ゼウスの雷を作ったキュクロプスたちを全滅させた" },
      { type: "msg", char: "zeus", text: "アポロンよ…お前も罰を受けねばならぬ。" },
      { type: "narr", text: "アポロンはオリンポスを追放され、テッサリアの王の元で羊飼いとして家畜の世話をさせられた" },
      { type: "highlight", text: "🐑 アポロンは罰としてオリンポスを追放され、人間界で羊飼いとして過ごした。" },
      { type: "msg", char: "zeus", text: "……アポロンよ。アスクレピオスの才能を惜しもう。その姿を蛇遣い座として星座に残す。" },
      { type: "choice", text: "アスクレピオスは天で何になった？", options: ["北極星", "へびつかい座（蛇遣い座）", "オリオン座"], answer: 1 },
      { type: "narr", text: "こうしてアスクレピオスは「へびつかい座」として夜空に輝くことになった" },
      { type: "highlight", text: "⭐ アスクレピオスの杖（蛇が巻きついた杖）は、WHO（世界保健機関）のシンボルとして今も使われている。" },
      { type: "msg", char: "hippocrates", text: "彼の精神は、私たち医療者の中に生き続けている。" },
      { type: "narr", text: "医神アスクレピオスの物語は、現代の医療につながっている——" },
    ],
  },
];
