export type SudokuGrid = Cell[][];

export type Cell = {
  value: number;
  given: boolean;
  pencilMarks: number[];
  pencilMarkType: PencilMark;
};

export type PencilMark = 'center' | 'side';

export type Menu = 'digit' | PencilMark;

export type Coords = [number, number];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Region = 'row' | 'col' | 'box';
