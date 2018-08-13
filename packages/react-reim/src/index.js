import React from 'react'

import createConsumer from './factories/consumer'
import createProvider from './factories/provider'

export function createContext(store) {
  if (store.__isStore) {
    const res = {
      get __isContext() {
        return true
      },
      Consumer: createConsumer(store),
      Provider: createProvider(store)
    }

    Object.assign(store, res)
    return store
  }
  // const options = store

  return {
    name: 'context',
    apply(store) {
      const res = {
        get __isContext() {
          return true
        },
        Consumer: createConsumer(store),
        Provider: createProvider(store)
      }

      Object.assign(store, res)
      return store
    }
  }
}

export function context(register) {
  return (...args) => createContext(register(...args))
}

export function connect(Context, getter = s => s, setter = () => ({})) {
  if (!Context.__isContext) {
    throw new Error('You likely not have decorated `store` with `context`')
  }
  return Wrapped => p => (
    <Context.Consumer getter={getter} setter={setter}>
      {
        (getter, setter) => <Wrapped {...setter} {...getter} {...p}/>
      }
    </Context.Consumer>
  )
}
