export const STEP_MAPS = {
  1: [
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
  ],
  2: [
    { id: 0, x: 15, y: 8, label: "START", type: "start", q: null },
    { id: 1, x: 40, y: 15, label: "問6", type: "quiz", q: "q6" },
    { id: 2, x: 65, y: 10, label: "問7", type: "quiz", q: "q7" },
    { id: 3, x: 80, y: 22, label: "🎁", type: "bonus", q: null },
    { id: 4, x: 60, y: 32, label: "問8", type: "quiz", q: "q8" },
    { id: 5, x: 35, y: 38, label: "問9", type: "quiz", q: "q9" },
    { id: 6, x: 18, y: 48, label: "問10", type: "quiz", q: "q10" },
    { id: 7, x: 40, y: 55, label: "🎁", type: "bonus", q: null },
    { id: 8, x: 62, y: 52, label: "問11", type: "quiz", q: "q11" },
    { id: 9, x: 50, y: 68, label: "BOSS", type: "boss", q: null },
  ],
  3: [
    { id: 0, x: 15, y: 8, label: "START", type: "start", q: null },
    { id: 1, x: 40, y: 14, label: "問12", type: "quiz", q: "q12" },
    { id: 2, x: 68, y: 10, label: "問13", type: "quiz", q: "q13" },
    { id: 3, x: 80, y: 25, label: "🎁", type: "bonus", q: null },
    { id: 4, x: 55, y: 35, label: "問14", type: "quiz", q: "q14" },
    { id: 5, x: 30, y: 42, label: "問15", type: "quiz", q: "q15" },
    { id: 6, x: 50, y: 55, label: "🎁", type: "bonus", q: null },
    { id: 7, x: 70, y: 50, label: "問16", type: "quiz", q: "q16" },
    { id: 8, x: 50, y: 68, label: "BOSS", type: "boss", q: null },
  ],
  4: [
    { id: 0, x: 20, y: 10, label: "START", type: "start", q: null },
    { id: 1, x: 50, y: 18, label: "問17", type: "quiz", q: "q17" },
    { id: 2, x: 75, y: 30, label: "🎁", type: "bonus", q: null },
    { id: 3, x: 50, y: 40, label: "問18", type: "quiz", q: "q18" },
    { id: 4, x: 25, y: 52, label: "問19", type: "quiz", q: "q19" },
    { id: 5, x: 50, y: 65, label: "BOSS", type: "boss", q: null },
  ],
  5: [
    { id: 0, x: 50, y: 15, label: "START", type: "start", q: null },
    { id: 1, x: 50, y: 45, label: "⚡ ゼウス", type: "boss", q: null },
  ],
};

// Backward compat
export const MAP_NODES = STEP_MAPS[1];
