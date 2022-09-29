import { useState } from "react";
import { useSideEffect } from "./useSideEffect";

export function useCompute<TFn extends () => any>(
  callback: TFn,
  deps: any[] = []
) {
  const [state, setState] = useState<ReturnType<TFn>>(callback());

  useSideEffect(() => {
    setState(callback());
  }, deps);

  return state;
}
