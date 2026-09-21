export default function clamp(
  number: number,
  lower: number,
  upper: number
): number {
  let num = +number;
  let low = +lower;
  let up = +upper;
  low = Number.isNaN(low) ? 0 : low;
  up = Number.isNaN(up) ? 0 : up;
  if (!Number.isNaN(num)) {
    num = num <= up ? num : up;
    num = num >= low ? num : low;
  }
  return num;
}
