export type SudokuGrid = Record<string, Cell>;

export type Cell = {
  coords: string;
  value: number;
  given: boolean;
  pencilMarks: number[];
  pencilMarkType: PencilMark;
  candidates: Set<number>;
};

export type PencilMark = 'center' | 'side';

export type Menu = 'digit' | PencilMark;

export type Coords = [number, number];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type RegionDict = Record<string, Record<Region, string[]>>;

export type Region = 'row' | 'col' | 'box';

export type Hint = {
  primaryCells: string[];
  secondaryCells: string[];
  incorrectCells: string[];
  heading: string;
  message: string;
};

export type CellsForNumber = Record<number, string[]>;

export type CellsForNumberEntry = [number, string[]];
