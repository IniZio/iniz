import type { Atom, Store } from "@iniz/core";

export type extractStoreValue<T> = T extends Atom<infer V>
  ? extractStoreValue<V>
  : T extends Store<infer V>
  ? V
  : T extends { [k in keyof T]: any }
  ? { [k in keyof T]: extractStoreValue<T[k]> }
  : T;
