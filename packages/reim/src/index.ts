import autoBind = require('auto-bind')
import * as equal from 'fast-deep-equal'
import {isPlainObject, isFunction} from 'lodash'

import {Actions, Effects, ReimOptions, Action} from './types'
import produce from 'immer'

const isReimFlag = Symbol('reim')

const instances: {[name: string]: any} = {}

const withDevTools = (
  // @ts-ignore
  process.env.NODE_ENV === 'development' &&
  // @ts-ignore
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
)

export function isReim(store: any) {
  return store.__isReim === isReimFlag
}

function reim<T>(initial: T, options: ReimOptions = {}) {
  let state = initial
  let _initial: T

  type Filter<TS> = null | undefined | (TS extends {[index: string]: any} ? keyof TS : null) | ((s: TS) => any);
  type SnapshotFor<TF> = (
    // TF extends (null | undefined) ? T :
    TF extends ((s: any) => any) ?
      ReturnType<TF> :
      TF extends keyof T ?
        T[TF] :
        T
  )
  type Meta = {mutation?: string, payload?: any[]}
  type Handler = (s: T, meta?: Meta) => any

  const Reim = class {
    _name?: string = options.name
    get __isReim() { return isReimFlag }
    _subscribers = []
    _devTools: any

    constructor() {
      autoBind(this)

      if (this.name) {
        if (instances[this.name]) {
          throw new Error(`There is already an instance named ${this._name}, named stores must have unique names`)
        }
        instances[name] = {}
      }

      if (withDevTools) {
        // @ts-ignore
        this._devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({instanceId: this.name, shouldStringify: false})
        this._devTools.subscribe((message: any) => {
          if (message.id !== this._name) {
            return
          }

          if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION')) {
            this.reset(typeof message.state === 'string' ? JSON.parse(message.state) : message.state)
          }
        })
        this._devTools.init(this.snapshot())
      }
    }

    get name() { return this._name }

    snapshot<
      TF extends Filter<typeof state>
    >(filter?: TF): TF extends (null | undefined) ? typeof state : SnapshotFor<TF> {
      if (state[filter as keyof T]) {
        return state[filter as keyof T] as TF extends (null | undefined) ? typeof state : SnapshotFor<TF>
      }

      if (typeof filter === 'function') {
        return (filter as (s: T) => any)(state)
      }

      return state as TF extends (null | undefined) ? typeof state : SnapshotFor<TF>
    }

    _set = (action: Action<T>, {mutation, payload}: Meta = {}) => {
      const _mutation = action(...payload)

      state = isPlainObject(state) ? (
        produce(
          state, (
            isFunction(_mutation) ?
              state => _mutation(state) :
              state => void Object.assign(state, _mutation)
          )
        )
      ) : (
        isFunction(_mutation) ?
          _mutation(state) as T :
          _mutation as T
      )

      this._notify({mutation, payload})
    }

    _notify = (meta: {mutation: string, payload: any[]}) => {
      this._subscribers.forEach(sub => {
        // Notify if cache is updated
        const cache = this.snapshot(sub.filter)

        if (!equal(cache, sub.cache)) {
          sub.cache = cache
          sub.handler(cache, meta)
        }
      })
    }

    reset(initial: T = null) {
      if (initial) {
        _initial = initial
      }

      this._set(() => _initial)
      return this.snapshot()
    }

    actions<
      TA extends Actions<T>
    >(actions: TA): this & {[k in keyof typeof actions]: TA[k]} {
      return Object.assign(
        this,
        Object.keys(actions)
          .reduce((acc, key) => ({
            ...acc,
            [key]: (...args: any[]) => void (
              this._set(actions[key], {mutation: key, payload: args})
            )
          }), {})
      ) as this & {[k in keyof typeof actions]: TA[k]}
    }

    effects<
      TR,
      TE extends Effects<TR>
    >(this: TR, effects: TE): this & {[k in keyof typeof effects]: TE[k]} {
      return Object.assign(
        this,
        Object.keys(effects)
          .reduce((acc, key) => ({
            ...acc,
            [key]: (...args: any[]) => effects[key](...args)(this)
          }), {}) as this & {[k in keyof typeof effects]: TE[k]}
      )
    }

    unsubscribe(handler: Handler) {
      this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
    }

    subscribe(handler: Handler, {immediate = false, filter}: {immediate?: boolean; filter?: Filter<T>} = {}) {
      // TODO: check if the filter is not cachable here
      const cache = this.snapshot(filter)

      this._subscribers.push({handler, filter, cache})
      if (immediate) {
        handler(cache)
      }
      return () => this.unsubscribe(handler)
    }
  }

  return new Reim()
}

export default reim

// @ts-ignore
const observableSymbol = () => ((typeof Symbol === 'function' && Symbol.observable) || '@@observable')

// Returns an observable stream
export const toStream = (store: any, options: ReimOptions = {}) => {
  return {
    subscribe: (observer: ((s: any) => any) | {next: (s: any) => any} = () => {}) => ({
      unsubscribe: store.subscribe((
        isFunction(observer) ?
          observer.bind(this) :
          observer.next.bind(this)
      ), {...options, immediate: true})
    }),
    [observableSymbol()]() {
      return this
    }
  }
}
