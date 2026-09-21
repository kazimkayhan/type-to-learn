import { useEffect, useState } from "react";

const isClient = typeof window === "object";

const useWindowSize = (
  initialWidth = Number.POSITIVE_INFINITY,
  initialHeight = Number.POSITIVE_INFINITY
) => {
  const [state, setState] = useState<{ width: number; height: number }>({
    height: isClient ? window.innerHeight : initialHeight,
    width: isClient ? window.innerWidth : initialWidth,
  });

  useEffect(() => {
    if (isClient) {
      const handler = () => {
        setState({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      };
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }
  }, []);

  return state;
};

export default useWindowSize;
