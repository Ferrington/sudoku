export function allContainDigit(arr: number[] | number[][], digit: number): boolean {
  return !arr.some((v) => (Array.isArray(v) ? !v.includes(digit) : v !== digit));
}
