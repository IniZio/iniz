import { computed } from "@iniz/core";
import { useEffect, useState } from "preact/hooks";

export function useComputed<TValue>(compute: () => TValue, deps: any[] = []) {
  const [snapshot] = useState(() => computed(compute));
  useEffect(
    () => void snapshot(compute() as any),
    deps // eslint-disable-line react-hooks/exhaustive-deps
  );

  return snapshot;
}
