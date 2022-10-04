import { computed } from "@reim/core";
import { useEffect, useState } from "react";
import { useAtom } from "./useAtom";

export function useComputed<TFn extends () => any>(
  callback: TFn,
  deps: any[] = []
) {
  const [cp] = useState(() => computed(callback));
  const instance = useAtom(cp);

  useEffect(
    () => cp.exec(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return instance;
}
