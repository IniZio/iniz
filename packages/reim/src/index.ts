import isPlainObject from 'is-plain-object'
import {produce} from 'immer'

import {isFunction} from './util'

import {
  Actions,
  ReimOptions,
  Action,
  Handler,
  Filter,
  SnapshotFor,
  Mutation
} from './types'

// @ts-ignore
const equal = require('fast-deep-equal')
// @ts-ignore
const autoBind = require('auto-bind')

const isReimFlag = Symbol('reim')

const instances: {[name: string]: any} = {}

// @ts-ignore
const observableSymbol = () =>
  (typeof Symbol === 'function' && Symbol.observable) || '@@observable'

const withDevTools =
  // @ts-ignore
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__

export function isReim(store: any): store is Reim {
  return store.__isReim === isReimFlag
}

export class Reim<T = any> {
  _name?: string

  _initial: T

  _state: T

  _subscribers: Array<{handler: Handler<T>; filter: Filter<T>; cache: any}> = []

  _devTools: any

  get __isReim() {
    return isReimFlag
  }

  get name() {
    return this._name
  }

  constructor(initial?: T, options: ReimOptions<T> = {}) {
    autoBind(this)

    this._name = options.name
    this._state = initial

    if (this.name) {
      if (instances[this.name]) {
        throw new Error(
          `There is already an instance named ${
            this._name
          }, named stores must have unique names`
        )
      }

      instances[this.name] = {}
    }

    if (withDevTools) {
      // @ts-ignore
      this._devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
        instanceId: this.name,
        shouldStringify: false
      })
      this._devTools.subscribe((message: any) => {
        if (message.id !== this._name) {
          return
        }

        if (
          message.type === 'DISPATCH' &&
          (message.payload.type === 'JUMP_TO_STATE' ||
            message.payload.type === 'JUMP_TO_ACTION')
        ) {
          this.reset(
            typeof message.state === 'string' ?
              JSON.parse(message.state) :
              message.state
          )
        }
      })
      this._devTools.init(this.filter())
    }

    Object.assign(this, this.actions(options.actions))
  }

  filter<TF extends Filter<T>>(
    filter?: TF
  ): TF extends (null | undefined) ? T : SnapshotFor<TF, T> {
    if (!filter) {
      return this._state as TF extends (null | undefined)
        ? T
        : SnapshotFor<TF, T>
    }

    if (this._state[filter as keyof T]) {
      return this._state[filter as keyof T] as TF extends (null | undefined)
        ? T
        : SnapshotFor<TF, T>
    }

    if (typeof filter === 'function') {
      return (filter as (s: T) => any)(this._state)
    }

    if (isPlainObject(filter)) {
      return Object.entries(filter as {
        [index: string]: ((s: T) => any);
      }).reduce(
        (acc, [key, f]) => ({
          ...acc,
          [key]: (f as (s: T) => any)(this._state)
        }),
        {} as TF extends (null | undefined) ? T : SnapshotFor<TF, T>
      )
    }

    return this._state as TF extends (null | undefined) ? T : SnapshotFor<TF, T>
  }

  set<T, TR extends Reim<T>, TA extends Action<T> | Mutation<T>>(
    this: TR & {_state: T},
    action: TA,
    ...args: TA extends Action<T> ? Parameters<TA> : []
  ) {
    const _mutation = args && args.length > 0 ? (action as ((...args: any[]) => Mutation<T>))(...args) : action
    let res

    if (isPlainObject(this._state)) {
      this._state = produce(
        this._state,
        isFunction(_mutation) ?
          state => {
            res = _mutation(state)

            if (isFunction(res)) {
              res(state)
            } else {
              Object.assign(state, res)
            }
          } :
          state => {
            Object.assign(state, _mutation)
          }
      )
    } else if (isFunction(_mutation)) {
      console.log('here')
      res = (_mutation(this._state) as T)

      if (isFunction(res)) {
        this._state = res(this._state)
      } else {
        this._state = res
      }
    } else {
      this._state = _mutation as T
    }

    this._notify({action, payload: args})
  }

  _notify = <TA extends Action<T> | Mutation<T>, TP extends any[]>(meta: {
    action: TA;
    payload: TP;
  }) => {
    this._subscribers.forEach(sub => {
      // Notify if cache is updated
      const cache = this.filter(sub.filter)

      if (!equal(cache, sub.cache)) {
        sub.cache = (isFunction(sub.handler) ? sub.handler : sub.handler.next)(cache, meta)
      }
    })
  }

  reset<T, TR extends Reim<T>>(this: TR & {_state: T}, initial: T = null) {
    if (initial) {
      this._initial = initial
    }

    this.set(() => this._initial)
    return this.filter()
  }

  actions<TR extends Reim<T>, T, TA extends Actions<T>>(
    this: TR & {_state: T},
    actions: TA = {} as any as TA
  ): {[Tk in keyof typeof actions]: TA[Tk]} {
    return Object.keys(actions).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (...args: any[]) => {
          this.set(actions[key], ...args)
        }
      }),
      {}
    ) as {[Tk in keyof typeof actions]: TA[Tk]}
  }

  plugin<TR extends Reim<T>, TP extends((a?: TR, b?: TR) => any)>(
    this: TR,
    plugin: TP
  ): ReturnType<TP> extends (null | undefined | void) ? TR : ReturnType<TP> {
    return plugin.call(this, this) || this
  }

  unsubscribe<TR extends Reim<T>, T>(
    this: TR & {_state: T},
    handler: Handler<T>
  ) {
    this._subscribers.splice(
      this._subscribers.findIndex(sub => sub.handler === handler),
      1
    )
  }

  subscribe<TR extends Reim<T>, T>(
    this: TR & {_state: T},
    handler: Handler<T>,
    {immediate = false, filter}: {immediate?: boolean; filter?: Filter<T>} = {}
  ) {
    const cache = this.filter(filter)

    this._subscribers.push({handler, filter, cache})
    if (immediate) {
      (isFunction(handler) ? handler : handler.next)(cache)
    }

    return {unsubscribe: () => this.unsubscribe(handler)}
  }

  [observableSymbol()]() {
    return this
  }
}

const reim = <T, TA>(
  initial: T,
  options: ReimOptions<T> & {actions?: TA} = {}
): Reim<T> & {[Tk in keyof TA]: TA[Tk]} => {
  const instance = new Reim<T | null | undefined>(initial, options)

  return Object.assign(instance, instance.actions(options.actions))
}

export {default as effect} from './effect'

export * from './types'

export default reim
