import { computed } from "@iniz/core";
import { useEffect, useState } from "react";

export function useComputed<TValue>(compute: () => TValue, deps: any[] = []) {
  const [snapshot] = useState(() => computed(compute));
  useEffect(
    () => void (snapshot.value = compute()),
    deps // eslint-disable-line react-hooks/exhaustive-deps
  );

  return snapshot;
}
