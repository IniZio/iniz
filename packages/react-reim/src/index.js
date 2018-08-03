import React from 'react'

import createConsumer from './factories/consumer'
import createProvider from './factories/provider'

export function createContext(store) {
  const Context = React.createContext()

  const res = {
    get __hasContext() {
      return true
    },
    Consumer: createConsumer(Context.Consumer),
    Provider: createProvider(Context.Provider, store)
  }

  Object.assign(store, res)
  return store
}

export function connect(store, selector) {
  const Context = store.__hasContext ? store : createContext(store)
  return Wrapped => p => (
    <Context.Consumer store={store} selector={selector}>
      {
        selected => <Wrapped {...selected} {...p}/>
      }
    </Context.Consumer>
  )
}
