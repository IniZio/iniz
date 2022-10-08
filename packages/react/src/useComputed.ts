import { computed } from "@iniz/core";
import { useEffect, useState } from "react";
import { useAtom } from "./useAtom";

export function useComputed<TFn extends () => any>(
  callback: TFn,
  deps: any[] = []
) {
  const [cp] = useState(() => computed(callback));
  const instance = useAtom(cp);

  // HACK: Don't want callback to keep triggering compute,
  // but also want to ensure latest version of callback on recompute...
  useEffect(
    () => cp.refresh(callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return instance;
}
