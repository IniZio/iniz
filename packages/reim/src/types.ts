import {Store} from '.'

type PluginFunction = (store: Store, store1?: Store) => any

interface PluginObject {
  name?: string
  call: PluginFunction
}

export type Plugin = PluginObject | PluginFunction

export interface ReimOptions {
  name?: string;
  plugins: Plugin[]
}

export type State = object
export type Mutation = {(state: State, ...args: any[]): void | State} | State
export type Getter = {(state: State):  any}
