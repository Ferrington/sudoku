import type { RegionDict } from '@/types';

export function generateRegionDict() {
  const boxChunks = ['012', '345', '678'];
  const rows = [...boxChunks.join('')];
  const cols = [...boxChunks.join('')];
  const cells = crossProduct(rows, cols);
  const allRegions = [
    ...cols.map((c) => crossProduct(rows, [c])),
    ...rows.map((r) => crossProduct([r], cols)),
    ...boxChunks.map((cs) => boxChunks.map((rs) => crossProduct([...rs], [...cs]))).flat(),
  ];
  const regionDict: RegionDict = cells.reduce((units, cell) => {
    return {
      ...units,
      [cell]: allRegions.filter((region) => region.includes(cell)),
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
