import type {
  CaseGridCase,
  CaseLayoutCase,
  LayoutConstraint,
  RuleForgeCase,
  GridMark,
} from "./caseboardTypes";

export function getGridCellId(rowId: string, columnId: string) {
  return `${rowId}::${columnId}`;
}

export function evaluateGridCase(
  puzzle: CaseGridCase,
  marks: Record<string, GridMark>,
) {
  const rowCounts: Record<string, number> = {};
  const colCounts: Record<string, number> = {};
  const contradictions: string[] = [];
  const allCellIds = puzzle.board.rows.flatMap((row) =>
    puzzle.board.columns.map((column) => getGridCellId(row.id, column.id))
  );
  const solutionSet = new Set(puzzle.board.solutionYesCells);

  for (const row of puzzle.board.rows) {
    rowCounts[row.id] = 0;
  }
  for (const column of puzzle.board.columns) {
    colCounts[column.id] = 0;
  }

  for (const cellId of allCellIds) {
    if (marks[cellId] === "yes") {
      const [rowId, columnId] = cellId.split("::");
      rowCounts[rowId] += 1;
      colCounts[columnId] += 1;
    }
  }

  for (const row of puzzle.board.rows) {
    const rowCellIds = puzzle.board.columns.map((column) => getGridCellId(row.id, column.id));
    const yesCount = rowCounts[row.id];
    const unknownCount = rowCellIds.filter((cellId) => marks[cellId] === "unknown").length;

    if (yesCount > row.targetYes) {
      contradictions.push(`${row.label} の ○ が多すぎます。`);
    }
    if (yesCount + unknownCount < row.targetYes) {
      contradictions.push(`${row.label} は必要数の ○ を満たせません。`);
    }
  }

  for (const column of puzzle.board.columns) {
    const columnCellIds = puzzle.board.rows.map((row) => getGridCellId(row.id, column.id));
    const yesCount = colCounts[column.id];
    const unknownCount = columnCellIds.filter((cellId) => marks[cellId] === "unknown").length;

    if (yesCount > column.targetYes) {
      contradictions.push(`${column.label} の ○ が多すぎます。`);
    }
    if (yesCount + unknownCount < column.targetYes) {
      contradictions.push(`${column.label} は必要数の ○ を満たせません。`);
    }
  }

  const solved = contradictions.length === 0 &&
    puzzle.board.solutionYesCells.every((cellId) => marks[cellId] === "yes") &&
    allCellIds.every((cellId) => !(!solutionSet.has(cellId) && marks[cellId] === "yes")) &&
    puzzle.board.rows.every((row) => rowCounts[row.id] === row.targetYes) &&
    puzzle.board.columns.every((column) => colCounts[column.id] === column.targetYes);

  return {
    rowCounts,
    colCounts,
    contradictions,
    solved,
  };
}

type LayoutViolations = {
  id: string;
  text: string;
}[];

export function evaluateLayoutCase(
  puzzle: CaseLayoutCase,
  placements: Record<string, string | null>,
) {
  const violations: LayoutViolations = [];
  const slotIds = puzzle.board.slots.map((slot) => slot.id);
  const pieceToSlot = Object.fromEntries(
    Object.entries(placements)
      .filter(([, pieceId]) => pieceId)
      .map(([slotId, pieceId]) => [pieceId as string, slotId]),
  ) as Record<string, string>;

  for (const constraint of puzzle.board.constraints) {
    if (isConstraintViolated(constraint, slotIds, pieceToSlot)) {
      violations.push({ id: constraint.id, text: constraint.text });
    }
  }

  const allPlaced = puzzle.board.slots.every((slot) => placements[slot.id]);
  const solved = allPlaced &&
    violations.length === 0 &&
    Object.entries(puzzle.board.solution).every(
      ([slotId, pieceId]) => placements[slotId] === pieceId,
    );

  return {
    violations,
    solved,
  };
}

function isConstraintViolated(
  constraint: LayoutConstraint,
  slotIds: string[],
  pieceToSlot: Record<string, string>,
) {
  if (constraint.type === "fixed_slot") {
    const placed = pieceToSlot[constraint.pieceId];
    return placed ? placed !== constraint.slotId : false;
  }

  if (constraint.type === "opposite") {
    const [leftPiece, rightPiece] = constraint.pieceIds;
    const leftSlot = pieceToSlot[leftPiece];
    const rightSlot = pieceToSlot[rightPiece];
    if (!leftSlot || !rightSlot) {
      return false;
    }
    return getOppositeSlot(slotIds, leftSlot) !== rightSlot;
  }

  if (constraint.type === "clockwise_next_to") {
    const [leftPiece, rightPiece] = constraint.pieceIds;
    const leftSlot = pieceToSlot[leftPiece];
    const rightSlot = pieceToSlot[rightPiece];
    if (!leftSlot || !rightSlot) {
      return false;
    }
    return getClockwiseSlot(slotIds, leftSlot) !== rightSlot;
  }

  const centerSlot = pieceToSlot[constraint.centerPieceId];
  const firstNeighborSlot = pieceToSlot[constraint.neighborPieceIds[0]];
  const secondNeighborSlot = pieceToSlot[constraint.neighborPieceIds[1]];

  if (!centerSlot || !firstNeighborSlot || !secondNeighborSlot) {
    return false;
  }

  const leftNeighbor = getCounterClockwiseSlot(slotIds, centerSlot);
  const rightNeighbor = getClockwiseSlot(slotIds, centerSlot);
  const actualNeighbors = new Set([leftNeighbor, rightNeighbor]);
  return !(
    actualNeighbors.has(firstNeighborSlot) &&
    actualNeighbors.has(secondNeighborSlot)
  );
}

function getClockwiseSlot(slotIds: string[], slotId: string) {
  const index = slotIds.indexOf(slotId);
  return slotIds[(index + 1) % slotIds.length];
}

function getCounterClockwiseSlot(slotIds: string[], slotId: string) {
  const index = slotIds.indexOf(slotId);
  return slotIds[(index - 1 + slotIds.length) % slotIds.length];
}

function getOppositeSlot(slotIds: string[], slotId: string) {
  const index = slotIds.indexOf(slotId);
  return slotIds[(index + slotIds.length / 2) % slotIds.length];
}

export function evaluateRuleCase(
  puzzle: RuleForgeCase,
  assignments: Record<string, string>,
) {
  const duplicateValues = findDuplicateValues(assignments);
  const exampleResults = puzzle.board.examples.map((example) => {
    const output = decodeSymbolSequence(example.input, assignments);
    return {
      id: example.id,
      output,
      passed: output === example.output,
    };
  });

  const challengeOutput = decodeSymbolSequence(puzzle.board.challengeInput, assignments);
  const assignmentsComplete = puzzle.board.symbols.every((symbol) => assignments[symbol.id]);
  const solved = assignmentsComplete &&
    duplicateValues.length === 0 &&
    exampleResults.every((example) => example.passed) &&
    challengeOutput === puzzle.board.challengeOutput;

  return {
    duplicateValues,
    exampleResults,
    challengeOutput,
    solved,
  };
}

function findDuplicateValues(assignments: Record<string, string>) {
  const counts = new Map<string, number>();

  for (const value of Object.values(assignments)) {
    if (!value) {
      continue;
    }
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function decodeSymbolSequence(sequence: string[], assignments: Record<string, string>) {
  return sequence.map((token) => assignments[token] ?? "?").join("");
}
