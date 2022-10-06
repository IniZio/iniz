import { scopedAtom } from "@iniz/core";
import { useEffect, useReducer, useState } from "react";

export function useAtom<TValue>(atomOrInitialValue: TValue) {
  const [, forceUpdate] = useReducer((f) => f + 1, 0);

  const [snapshot] = useState(() =>
    scopedAtom(atomOrInitialValue, {
      onNotify: forceUpdate,
      tilNextTick: true,
    })
  );

  // HACK: useEffect is triggered twice under strict mode
  // Currently our effect's final status become disposed after mount strict mode is active,
  // so we force update after dispose to ensure effect collects again if the component is not actually unmounted
  useEffect(
    () => () => {
      snapshot.dispose();
      forceUpdate();
    },
    [snapshot]
  );

  return snapshot;
}
