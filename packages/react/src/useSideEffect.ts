import { effect } from "@iniz/core";
import { useEffect } from "react";

// NOTE: Under strict mode, effect is called twice
export function useSideEffect(
  callback: (() => void) | (() => () => void),
  deps: any[] = []
) {
  useEffect(
    () => effect(callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]
  );
}
