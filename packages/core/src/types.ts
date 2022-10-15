import { Atom } from "./atom";
import { State } from "./state";

export type extractStateValue<T> = T extends Atom<infer V>
  ? V
  : T extends State<infer V>
  ? V
  : T;
