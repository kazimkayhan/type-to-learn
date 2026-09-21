import confetti from "canvas-confetti";
import { useEffect } from "react";
import { CONFETTI_DEFAULTS } from "@/constants";

export function useConfetti(state: boolean) {
  useEffect(() => {
    let leftConfettiTimer: number | undefined;
    let rightConfettiTimer: number | undefined;
    if (state) {
      leftConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          angle: 60,
          origin: { x: 0 },
          particleCount: 50,
          spread: 100,
        });
      }, 250);
      rightConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          angle: 120,
          origin: { x: 1 },
          particleCount: 50,
          spread: 100,
        });
      }, 400);
    }
    return () => {
      window.clearTimeout(leftConfettiTimer);
      window.clearTimeout(rightConfettiTimer);
    };
  }, [state]);
}
