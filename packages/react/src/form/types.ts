import { Atom, State } from "@iniz/core";

export type extractStateValue<T> = T extends Atom<infer V>
  ? extractStateValue<V>
  : T extends State<infer V>
  ? V
  : T extends { [k in keyof T]: any }
  ? { [k in keyof T]: extractStateValue<T[k]> }
  : T;
