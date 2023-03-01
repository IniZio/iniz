import { store } from "@iniz/core";
import { useState } from "preact/hooks";

export function useStore<TValue>(storeOrInitialValue: TValue) {
  return useState(() => store(storeOrInitialValue))[0];
}
