import React from 'react'

import createConsumer from './factories/consumer'
import createProvider from './factories/provider'

export function createContext(store) {
  const Context = React.createContext()

  const res = {
    get __isContext() {
      return true
    },
    Consumer: createConsumer(Context.Consumer, store),
    Provider: createProvider(Context.Provider, store)
  }

  Object.assign(store, res)
  return store
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
        cache => <Wrapped {...cache} {...p}/>
      }
    </Context.Consumer>
  )
}
