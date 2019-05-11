import * as React from 'react'
import reim, {Reim, Filter, Actions, isReim} from 'reim'

import {ReimOptions} from 'reim';
import State from './components/State'

export {default as State} from './components/State'
export {default as Partial} from './components/Partial'

export function withReim<
  TR extends Reim<any>
>(
  store: TR,
  {filter = s => s, actions = {}}: ReimOptions<TR["_state"]> & {filter?: Filter<TR["_state"]>}
) {
  return (Children: React.ComponentClass | React.SFC) => (p: any) => (
    <State<typeof store, any, typeof filter, typeof actions> store={store} filter={filter} actions={actions}>
      {(selected, actions) => <Children {...selected} {...actions} {...p}/>}
    </State>
  )
}

export function useReim<TS>(initial: TS | Reim<TS>, {filter = s => s, actions = {}}: {filter?: Filter<TS>, actions?: Actions<TS>} = {}, dependencies: any[] = []) {
  // @ts-ignore
  if (!React.useState) {
    throw new Error('At least React@16.7-alpha.2 is required to use Hooks')
  }

  let store = isReim(initial) ? initial : reim(initial)

  // @ts-ignore
  const {useState, useEffect, useRef} = React

  const mountRef = useRef(false)
  const [state, set] = useState(store.filter(filter))

  useEffect(() => {
    if (mountRef.current) {
      set(() => store.filter(filter))
    } else {
      mountRef.current = true
    }
  }, dependencies)

  useEffect(() => () => store.unsubscribe(set))

  store.subscribe(set, {filter})

  return [state, store.actions(actions)]
}
