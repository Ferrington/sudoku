export type SudokuGrid = {
  [key: string]: Cell;
};

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

export type RegionDict = {
  [key: string]: {
    [key in Region]: string[];
  };
};

export type Region = 'row' | 'col' | 'box';

export type Hint = {
  primaryCells: string[];
  secondaryCells: string[];
  message: string;
};
