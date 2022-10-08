import { scopedAtom } from "@iniz/core";
import { useReducer, useState } from "react";

export function useAtom<TValue>(atomOrInitialValue: TValue) {
  const [, forceUpdate] = useReducer((f) => f + 1, 0);

  const [snapshot] = useState(() =>
    scopedAtom(atomOrInitialValue, {
      onNotify: forceUpdate,
    })
  );

  return snapshot;
}
