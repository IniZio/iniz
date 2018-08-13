import {produce} from 'immer'
import bind from 'auto-bind'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'

class Store {
  _state = {}

  _subscribers = []

  get __isStore() {
    return true
  }

  get state() {
    return this._state
  }

  constructor(state) {
    this._state = produce(state, () => {})
    bind(this)
  }

  getState() {
    return this.state
  }

  setState(mutation, ...args) {
    if (Array.isArray(mutation)) {
      mutation.map(this.setState)
    } else {
      this._state = produce(this.state, isFunction(mutation) ? mutation : () => merge({}, this.state, mutation), ...args)
    }
    this._notify()
    return this.state
  }

  /**
   * subscribe - Add subscriber
   *
   * @param {Function} handler subscriber callback
   * @param {Object} option Options for subscription
   * @param {boolean} option.immediate Whether to run sub
   * @param {Function} option.getter getters for data subscription
   *
   * @returns {Function} unsubscriber
   */
  subscribe(handler, {immediate = false, getter = state => state} = {}) {
    // TODO: check if the getter is not cachable here
    this._subscribers.push({handler, getter})
    if (immediate) {
      this._notify()
    }
    return () => this.unsubscribe(handler)
  }

  /**
   * unsubscribe - Remove subscriber
   *
   * @param {Function} handler subscriber to remvoe
   *
   */
  unsubscribe(handler) {
    this._subscribers.splice(this._subscribers.findIndex(sub => sub.handler === handler), 1)
  }

  _notify() {
    this._subscribers.forEach(sub => {
      // Notify if getterCache is updated
      const getterCache = sub.getter(this.state)
      if (!isEqual(getterCache, sub.getterCache)) {
        sub.getterCache = getterCache
        sub.handler(getterCache)
      }
    })
  }
}

export const register = (state, {plugins = []} = {}) =>
  plugins.reduce((store, plugin) => (plugin.apply(store) || store), new Store(state))

export const store = register

const observableSymbol = () => ((typeof Symbol === 'function' && Symbol.observable) || '@@observable')

// Returns an observable stream
export const toStream = (store, options = {}) => {
  return {
    subscribe: (observer = () => {}) => ({
      unsubscribe: store.subscribe((
        typeof observer === 'function' ?
          selected => observer(selected) :
          selected => observer.next(selected)
      ), {...options, immediate: true})
    }),
    [observableSymbol()]() {
      return this
    }
  }
}
