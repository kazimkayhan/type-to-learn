export default function shuffle<T>(array: T[]): T[] {
  const { length } = array;
  if (!length) {
    return [];
  }
  let index = -1;
  const lastIndex = length - 1;
  const result = Array.from(array);
  while (index < length - 1) {
    index += 1;
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}
