import { useEffect, useState } from "react";

const isClient = typeof window === "object";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    isClient ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

const _useIsNarrow = () => useMediaQuery("(max-width: 767px)");
export const useIsTouch = () => useMediaQuery("(pointer: coarse)");
