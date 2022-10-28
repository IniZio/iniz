import { computed, COMPUTED_FN, ref } from "@iniz/core";
import { useEffect, useState } from "react";

export function useComputed<TValue>(compute: () => TValue, deps: any[] = []) {
  const [snapshot] = useState(() => computed(compute));
  useEffect(
    () => {
      snapshot[COMPUTED_FN] = ref(compute);
      snapshot(compute() as any);
    },
    deps // eslint-disable-line react-hooks/exhaustive-deps
  );

  return snapshot;
}
