export type Reward = {
  affection?: number;
  coins?: number;
  seeds?: number;
};

export type StoryLine = {
  speaker: string;
  text: string;
  tone?: "guide" | "narration" | "quote";
};

export type StoryEpisode = {
  id: string;
  title: string;
  summary: string;
  sourceRef: string;
  featuredCharacterId: string;
  glossaryUnlockIds: string[];
  quizIds: string[];
  lines: StoryLine[];
};

export type StoryChapter = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  sourceRef: string;
  featuredCharacterId: string;
  episodes: StoryEpisode[];
};

export type StoryData = {
  chapters: StoryChapter[];
};

export type ImageChoiceOption = {
  id: string;
  title: string;
  caption: string;
  symbol: string;
};

export type ContextBlank = {
  id: string;
  excerpt: string;
  answer: string;
};

export type SummaryFragment = {
  id: string;
  text: string;
};

export type ReadingQuizBase = {
  id: string;
  episodeId: string;
  title: string;
  prompt: string;
  sourceRef: string;
  hint: string;
  explanation: string;
  reward: Reward;
};

export type ImageChoiceQuiz = ReadingQuizBase & {
  type: "image_choice";
  choices: ImageChoiceOption[];
  answerId: string;
};

export type ContextInsertQuiz = ReadingQuizBase & {
  type: "context_insert";
  options: string[];
  blanks: ContextBlank[];
};

export type SummaryBuilderQuiz = ReadingQuizBase & {
  type: "summary_builder";
  fragments: SummaryFragment[];
  answerOrder: string[];
  target: string;
};

export type ReadingQuiz =
  | ImageChoiceQuiz
  | ContextInsertQuiz
  | SummaryBuilderQuiz;

export type LogicQuizBase = {
  id: string;
  title: string;
  type: "order_sort" | "truth_logic" | "seat_puzzle";
  prompt: string;
  sourceRef: string;
  hint: string;
  explanation: string;
  reward: Reward;
};

export type OrderSortQuiz = LogicQuizBase & {
  type: "order_sort";
  clues: string[];
  items: {
    id: string;
    label: string;
    text: string;
  }[];
  answerOrder: string[];
};

export type MultipleChoiceQuiz = LogicQuizBase & {
  type: "truth_logic" | "seat_puzzle";
  clues: string[];
  choices: string[];
  answerIndex: number;
};

export type LogicQuiz = OrderSortQuiz | MultipleChoiceQuiz;

export type Character = {
  id: string;
  name: string;
  role: string;
  bio: string;
  motif: string;
  accent: string;
  sourceRef: string;
};

export type GlossaryEntry = {
  id: string;
  term: string;
  reading: string;
  description: string;
  sourceRef: string;
};

export type GameProgressV1 = {
  schemaVersion: 1;
  readEpisodeIds: string[];
  completedReadingQuizIds: string[];
  completedLogicQuizIds: string[];
  unlockedGlossaryIds: string[];
  characterAffection: Record<string, number>;
  coins: number;
  seeds: number;
  lastLoginDate: string | null;
};

export type ContentBundle = {
  story: StoryData;
  readingQuizzes: ReadingQuiz[];
  logicQuizzes: LogicQuiz[];
  characters: Character[];
  glossary: GlossaryEntry[];
};
