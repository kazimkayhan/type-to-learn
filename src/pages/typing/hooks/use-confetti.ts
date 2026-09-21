import { useEffect } from "react";
import { CONFETTI_DEFAULTS } from "@/constants";

const CONFETTI_PARTICLE_COUNT = 50;
const CONFETTI_SPREAD = 100;

const fireConfetti = (angle: number, originX: number) => {
  import("canvas-confetti")
    .then(({ default: confetti }) => {
      confetti({
        ...CONFETTI_DEFAULTS,
        angle,
        origin: { x: originX },
        particleCount: CONFETTI_PARTICLE_COUNT,
        spread: CONFETTI_SPREAD,
      });
    })
    .catch(() => undefined);
};

export function useConfetti(state: boolean) {
  useEffect(() => {
    if (!state) {
      return;
    }

    const leftConfettiTimer = window.setTimeout(() => {
      fireConfetti(60, 0);
    }, 250);
    const rightConfettiTimer = window.setTimeout(() => {
      fireConfetti(120, 1);
    }, 400);

    return () => {
      window.clearTimeout(leftConfettiTimer);
      window.clearTimeout(rightConfettiTimer);
    };
  }, [state]);
}
