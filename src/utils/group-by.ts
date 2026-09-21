import type { Dictionary } from "@/typings";

export default function groupBy<T>(
  elements: T[],
  iteratee: (value: T) => string
) {
  return elements.reduce<Record<string, T[]>>((result, value) => {
    const key = iteratee(value);
    if (Object.hasOwn(result, key)) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
    return result;
  }, {});
}

export function groupByDictTags(dicts: Dictionary[]) {
  return dicts.reduce<Record<string, Dictionary[]>>((result, dict) => {
    for (const tag of dict.tags) {
      if (Object.hasOwn(result, tag)) {
        result[tag].push(dict);
      } else {
        result[tag] = [dict];
      }
    }
    return result;
  }, {});
}
