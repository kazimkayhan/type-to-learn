const INFINITY = 1 / 0;
const MAX_INTEGER = 1.797_693_134_862_315_7e308;

function toFinite(value: number): number {
  if (value === INFINITY || value === -INFINITY) {
    const sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return Number.isNaN(value) ? 0 : value;
}

function baseRange(
  startParam: number,
  endParam: number,
  stepParam: number
): number[] {
  let index = -1;
  let length = Math.max(
    Math.ceil((endParam - startParam) / (stepParam || 1)),
    0
  );
  const result = new Array<number>(length);
  let start = startParam;

  while (length > 0) {
    length -= 1;
    index += 1;
    result[index] = start;
    start += stepParam;
  }
  return result;
}

export default function range(
  start: number,
  end: number,
  step: number
): number[] {
  // Ensure the sign of `-0` is preserved.
  const startVal = toFinite(start);
  const endVal = toFinite(end);
  const stepVal = toFinite(step);
  return baseRange(startVal, endVal, stepVal);
}
