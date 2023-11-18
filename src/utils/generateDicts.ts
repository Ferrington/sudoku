import type { RegionDict } from '@/types';

const boxChunks = ['012', '345', '678'];
const rows = [...boxChunks.join('')];
const cols = [...boxChunks.join('')];

export function generateCells() {
  const boxChunks = ['012', '345', '678'];
  const rows = [...boxChunks.join('')];
  const cols = [...boxChunks.join('')];
  return crossProduct(rows, cols);
}

export function generateRegionDict() {
  const cells = generateCells();
  const allRegions = {
    rows: rows.map((r) => crossProduct([r], cols)),
    cols: cols.map((c) => crossProduct(rows, [c])),
    boxes: boxChunks.map((cs) => boxChunks.map((rs) => crossProduct([...rs], [...cs]))).flat(),
  };

  const regionDict: RegionDict = cells.reduce((units, cell) => {
    return {
      ...units,
      [cell]: {
        row: allRegions.rows.find((row) => row.includes(cell)),
        col: allRegions.cols.find((col) => col.includes(cell)),
        box: allRegions.boxes.find((box) => box.includes(cell)),
      },
    };
  }, {});
  return regionDict;
}

function crossProduct(A: string[], B: string[]) {
  const result = [];
  for (const a of A) {
    for (const b of B) {
      result.push(`${a},${b}`);
    }
  }
  return result;
}
