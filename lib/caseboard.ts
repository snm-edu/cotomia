import { logicQuizData } from "./content";
import type { LogicQuiz } from "./types";

export type CaseboardModeId = "case_grid" | "case_layout" | "rule_forge";

type CaseboardModeMeta = {
  id: CaseboardModeId;
  label: string;
  eyebrow: string;
  shortLabel: string;
  description: string;
};

export const caseboardModes: CaseboardModeMeta[] = [
  {
    id: "case_grid",
    label: "Case Grid",
    eyebrow: "GRID",
    shortLabel: "消去",
    description: "発言や条件を表にして、候補を消し込みながら確定へ進める。",
  },
  {
    id: "case_layout",
    label: "Case Layout",
    eyebrow: "LAYOUT",
    shortLabel: "配置",
    description: "席順や部屋割りを置き換え、位置関係から正しい配置を見抜く。",
  },
  {
    id: "rule_forge",
    label: "Rule Forge",
    eyebrow: "RULE",
    shortLabel: "規則",
    description: "断片を並べたり対応を見抜いたりして、成立するルールを発見する。",
  },
];

const modeMetaById = Object.fromEntries(caseboardModes.map((mode) => [mode.id, mode])) as Record<
  CaseboardModeId,
  CaseboardModeMeta
>;

export function getCaseboardModeId(type: LogicQuiz["type"]): CaseboardModeId {
  if (type === "truth_logic") {
    return "case_grid";
  }
  if (type === "seat_puzzle") {
    return "case_layout";
  }
  return "rule_forge";
}

export function getCaseboardModeMeta(target: LogicQuiz | LogicQuiz["type"] | CaseboardModeId) {
  if (typeof target === "string") {
    if (target in modeMetaById) {
      return modeMetaById[target as CaseboardModeId];
    }
    return modeMetaById[getCaseboardModeId(target as LogicQuiz["type"])];
  }

  return modeMetaById[getCaseboardModeId(target.type)];
}

export function getCaseboardCasesByMode(modeId: CaseboardModeId) {
  return logicQuizData.filter((quiz) => getCaseboardModeId(quiz.type) === modeId);
}

