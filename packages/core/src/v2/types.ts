import { StateV2 } from "./state";

export type extractStateV2Value<T> = T extends StateV2<infer V> ? V : T;
