import type { CaseboardCase } from "./caseboardTypes";
import { getGridCellId } from "./caseboardUtils";

function collectDuplicateIds(items: { id: string }[], label: string) {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.push(`${label} id duplicated: ${item.id}`);
    }
    seen.add(item.id);
  }

  return duplicates;
}

export function validateCaseboardCases(cases: CaseboardCase[]) {
  const issues: string[] = [];
  issues.push(...collectDuplicateIds(cases, "caseboard case"));

  for (const puzzle of cases) {
    if (!puzzle.title || !puzzle.sourceRef || !puzzle.prompt) {
      issues.push(`caseboard case missing required fields: ${puzzle.id}`);
    }

    if (puzzle.hints.length !== 3) {
      issues.push(`caseboard case must have exactly 3 hints: ${puzzle.id}`);
    }

    if (!puzzle.clueCards.length) {
      issues.push(`caseboard case must include clueCards: ${puzzle.id}`);
    }

    if (!puzzle.explanation.length) {
      issues.push(`caseboard case must include explanation: ${puzzle.id}`);
    }

    if (puzzle.mode === "case_grid") {
      const rowIds = new Set(puzzle.board.rows.map((row) => row.id));
      const columnIds = new Set(puzzle.board.columns.map((column) => column.id));
      if (rowIds.size !== puzzle.board.rows.length) {
        issues.push(`case_grid rows duplicated: ${puzzle.id}`);
      }
      if (columnIds.size !== puzzle.board.columns.length) {
        issues.push(`case_grid columns duplicated: ${puzzle.id}`);
      }
      for (const cellId of puzzle.board.solutionYesCells) {
        const [rowId, columnId] = cellId.split("::");
        if (!rowIds.has(rowId) || !columnIds.has(columnId)) {
          issues.push(`case_grid solution cell invalid: ${puzzle.id}/${cellId}`);
        }
      }
      const possibleCells = new Set(
        puzzle.board.rows.flatMap((row) =>
          puzzle.board.columns.map((column) => getGridCellId(row.id, column.id))
        ),
      );
      for (const cellId of puzzle.board.solutionYesCells) {
        if (!possibleCells.has(cellId)) {
          issues.push(`case_grid solution cell out of range: ${puzzle.id}/${cellId}`);
        }
      }
    }

    if (puzzle.mode === "case_layout") {
      const slotIds = new Set(puzzle.board.slots.map((slot) => slot.id));
      const pieceIds = new Set(puzzle.board.pieces.map((piece) => piece.id));
      if (slotIds.size !== puzzle.board.slots.length) {
        issues.push(`case_layout slots duplicated: ${puzzle.id}`);
      }
      if (pieceIds.size !== puzzle.board.pieces.length) {
        issues.push(`case_layout pieces duplicated: ${puzzle.id}`);
      }
      for (const [slotId, pieceId] of Object.entries(puzzle.board.solution)) {
        if (!slotIds.has(slotId) || !pieceIds.has(pieceId)) {
          issues.push(`case_layout solution invalid: ${puzzle.id}/${slotId}`);
        }
      }
    }

    if (puzzle.mode === "rule_forge") {
      const symbolIds = new Set(puzzle.board.symbols.map((symbol) => symbol.id));
      if (symbolIds.size !== puzzle.board.symbols.length) {
        issues.push(`rule_forge symbols duplicated: ${puzzle.id}`);
      }
      for (const example of puzzle.board.examples) {
        for (const token of example.input) {
          if (!symbolIds.has(token)) {
            issues.push(`rule_forge example uses unknown symbol: ${puzzle.id}/${example.id}`);
          }
        }
      }
      for (const token of puzzle.board.challengeInput) {
        if (!symbolIds.has(token)) {
          issues.push(`rule_forge challenge uses unknown symbol: ${puzzle.id}`);
        }
      }
    }
  }

  return issues;
}
