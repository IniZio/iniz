import { effect } from "@iniz/core";
import { useEffect } from "preact/hooks";

export function useSideEffect(
  callback: (() => void) | (() => () => void),
  deps: any[] = []
) {
  useEffect(
    () => effect(callback),
    deps // eslint-disable-line react-hooks/exhaustive-deps
  );
}
