import {Store} from '.'

type PluginFunction<S extends Store> = (store: S, store1?: S) => any

interface PluginObject {
  name?: string;
  call: PluginFunction<Store>;
}

export type Plugin = PluginObject | PluginFunction<Store>

export interface ReimOptions {
  name?: string;
  plugins?: Plugin[];
  actions?: {[index: string]: (s: State) => (...args: any[]) => void | Partial<State>};
}

export type State = {[index: string]: any}
export type Mutation = {(state: State, ...args: any[]): void | State} | State
export type Getter = {(state: State):  any}
