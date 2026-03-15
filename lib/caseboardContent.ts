import rawCases from "../data/caseboardCases.json";
import { validateCaseboardCases } from "./caseboardValidation";
import type { CaseboardCase } from "./caseboardTypes";

export const caseboardCaseData = rawCases as CaseboardCase[];
export const caseboardCaseById = Object.fromEntries(
  caseboardCaseData.map((puzzle) => [puzzle.id, puzzle]),
) as Record<string, CaseboardCase>;
export const caseboardContentIssues = validateCaseboardCases(caseboardCaseData);

export function getNextUnclearedCaseboardCase(completedIds: string[]) {
  return caseboardCaseData.find((puzzle) => !completedIds.includes(puzzle.id)) ?? null;
}
