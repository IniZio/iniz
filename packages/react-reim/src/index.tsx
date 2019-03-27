import React, {PureComponent} from 'react'
import reim, {Store, Mutation, Getter} from 'reim'

import State, {StateProps} from './components/state'

export {default as State} from './components/state'

class ReactStore extends Store {
  get __isReactReim() {return true}
  Consumer: (props: StateProps) => React.ReactElement<StateProps>;
  get: (fn: Getter) => React.ReactElement<StateProps>;
}

// Syncs props to store
export function pipeTo(store: Store, mutation: Mutation = (_: any, p: any) => p): React.ComponentClass {
  class Piper extends PureComponent {
    componentDidUpdate() {
      store.set(mutation, this.props)
    }

    render = () => null
  }
  return Piper
}

export const react = () =>
  ({
    name: 'react',
    call(store: Store) {
      Object.defineProperties(store, {
        __isReactReim: {
          value: true
        },
        Consumer: {
          value: (props: any) => <State store={store} {...props}/>
        },
        get: {
          value: (fn: Getter) => <State store={store} getter={fn}/>
        }
      })
    }
  })

export function connect(store: ReactStore, getter: Getter = s => s, setter: Mutation = () => ({})) {
  const Context = store.__isReactReim ? store : store.plugin(react())
  return (Wrapped: React.ComponentClass) => (p: any) => (
    <Context.Consumer getter={getter} setter={setter}>
      {
        selected => <Wrapped {...selected} {...p}/>
      }
    </Context.Consumer>
  )
}

export function useReim(initial: any, getter: Getter = s => s, dependencies: string[] = []) {
  // @ts-ignore
  if (!React.useState) {
    throw new Error('React@16.7-alpha.2 is required to use Hooks')
  }

  const store = initial.__isReim ? initial : reim(initial)

  // @ts-ignore
  const {useState, useEffect, useRef} = React

  const mountRef = useRef()
  const [state, set] = useState(store.snapshot(getter))

  useEffect(() => {
    if (mountRef.current) {
      set(() => store.snapshot(getter))
    } else {
      mountRef.current = true
    }
  }, dependencies)

  useEffect(() => () => store.unsubscribe(set))

  store.subscribe(set, {getter})

  return [state, store.set]
}

export default react
