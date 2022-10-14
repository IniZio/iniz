import { State } from "./state";

export type extractStateValue<T> = T extends State<infer V> ? V : T;
