import {produce} from 'immer'
import bind from 'auto-bind'
import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'

export class Store {
  _state = {}

  _subscribers = []

  get state() {
    return this._state
  }

  constructor(state) {
    this._state = produce(state, () => {})
    bind(this)
  }

  setState(mutation) {
    if (Array.isArray(mutation)) {
      mutation.map(this.setState)
    } else {
      this._state = produce(this.state, isFunction(mutation) ? mutation : () => mutation)
    }
    this._notify()
    return this.state
  }

  /**
   * sync - Add subscriber
   *
   * @param {Function} handler subscriber callback
   * @param {Object} option Options for subscription
   * @param {boolean} option.immediate Whether to run sub
   * @param {Function} option.getter getters for data subscription
   *
   * @returns {Function} unsubscriber
   */
  sync(handler, {immediate = true, getter = state => state} = {}) {
    // TODO: check if the getter is not cachable here
    this._subscribers.push({handler, getter})
    if (immediate) {
      this._notify()
    }
    return () => this.unsync(handler)
  }

  /**
   * unsync - Remove subscriber
   *
   * @param {Function} handler subscriber to remvoe
   *
   */
  unsync(handler) {
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

export const register = state => new Store(state)
