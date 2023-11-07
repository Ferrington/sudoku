import type { Coords } from '@/types';

export function allContainDigit(arr: number[] | number[][], digit: number): boolean {
  return !arr.some((v) => (Array.isArray(v) ? !v.includes(digit) : v !== digit));
}

export function coordsToString(y: number, x: number) {
  return `${y},${x}`;
}

export function stringToCoords(str: string): Coords {
  const coords = str.split(',').map((val) => Number(val));
  if (coords.length !== 2) throw new Error('Invalid input.');

  return [coords[0], coords[1]];
}
