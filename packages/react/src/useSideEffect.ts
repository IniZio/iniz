import { effect } from "@iniz/core";
import { useEffect } from "react";

// NOTE: Under strict mode, effect is called twice
export function useSideEffect(
  action: (() => void) | (() => () => void),
  reactionOrDeps: (() => void) | any[] = [],
  deps: any[] = []
) {
  useEffect(
    () =>
      effect(
        action,
        typeof reactionOrDeps === "function" ? reactionOrDeps : undefined
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(reactionOrDeps) ? reactionOrDeps : deps
  );
}
