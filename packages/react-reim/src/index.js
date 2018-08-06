import React from 'react'

import createConsumer from './factories/consumer'
import createProvider from './factories/provider'

export function createContext(store) {
  const Context = React.createContext()

  const res = {
    get __isContext() {
      return true
    },
    Consumer: createConsumer(Context.Consumer),
    Provider: createProvider(Context.Provider, store)
  }

  Object.assign(store, res)
  return store
}

export function connect(store, getter = s => s, setter = () => ({})) {
  const Context = store.__isContext ? store : createContext(store)
  return Wrapped => p => (
    <Context.Consumer store={store} getter={getter} setter={setter}>
      {
        cache => <Wrapped {...cache} {...p}/>
      }
    </Context.Consumer>
  )
}
