import type { Reward } from "./types";

export type CaseboardMode = "case_grid" | "case_layout" | "rule_forge";

export type HintLevel = 1 | 2 | 3;

export type GridMark = "unknown" | "yes" | "no" | "tentative";

export type CaseboardClueCard = {
  id: string;
  title: string;
  text: string;
};

export type CaseboardHint = {
  level: HintLevel;
  text: string;
};

export type CaseboardExplanationStep = {
  id: string;
  title: string;
  text: string;
};

type CaseboardCaseBase = {
  id: string;
  title: string;
  mode: CaseboardMode;
  sourceRef: string;
  estimatedMinutes: number;
  missionText: string;
  goalText: string;
  prompt: string;
  reward: Reward;
  clueCards: CaseboardClueCard[];
  hints: CaseboardHint[];
  explanation: CaseboardExplanationStep[];
};

export type GridRow = {
  id: string;
  label: string;
  targetYes: number;
};

export type GridColumn = {
  id: string;
  label: string;
  targetYes: number;
};

export type CaseGridBoardConfig = {
  rows: GridRow[];
  columns: GridColumn[];
  solutionYesCells: string[];
};

export type CaseGridCase = CaseboardCaseBase & {
  mode: "case_grid";
  board: CaseGridBoardConfig;
};

export type LayoutSlot = {
  id: string;
  label: string;
  topPct: number;
  leftPct: number;
};

export type LayoutPiece = {
  id: string;
  label: string;
};

export type LayoutConstraint =
  | {
      id: string;
      type: "fixed_slot";
      text: string;
      pieceId: string;
      slotId: string;
    }
  | {
      id: string;
      type: "opposite";
      text: string;
      pieceIds: [string, string];
    }
  | {
      id: string;
      type: "clockwise_next_to";
      text: string;
      pieceIds: [string, string];
    }
  | {
      id: string;
      type: "between_neighbors";
      text: string;
      centerPieceId: string;
      neighborPieceIds: [string, string];
    };

export type CaseLayoutBoardConfig = {
  layoutType: "circle";
  slots: LayoutSlot[];
  pieces: LayoutPiece[];
  solution: Record<string, string>;
  constraints: LayoutConstraint[];
};

export type CaseLayoutCase = CaseboardCaseBase & {
  mode: "case_layout";
  board: CaseLayoutBoardConfig;
};

export type RuleSymbol = {
  id: string;
  label: string;
};

export type RuleExample = {
  id: string;
  input: string[];
  output: string;
};

export type CaseRuleForgeBoardConfig = {
  symbols: RuleSymbol[];
  values: string[];
  examples: RuleExample[];
  challengeInput: string[];
  challengeOutput: string;
  solution: Record<string, string>;
};

export type RuleForgeCase = CaseboardCaseBase & {
  mode: "rule_forge";
  board: CaseRuleForgeBoardConfig;
};

export type CaseboardCase = CaseGridCase | CaseLayoutCase | RuleForgeCase;
