import React from 'react'
import {toStream} from 'reim'
import {createEventHandler, mapPropsStream, compose, withHandlers} from 'recompose'
import {merge, from, combineLatest} from 'rxjs';
import {map, switchMap, scan, startWith, mapTo} from 'rxjs/operators'

import counterStore from '../stores/counter'

const App = ({count, increment, decrement}) => (
  <div>
    <div>Count: {count}</div>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
)

const counter = mapPropsStream(props$ => {
  return combineLatest(
    props$,
    from(toStream(counterStore))
  ).pipe(
    map(([props, {count}]) => ({...props, count, decrement: () => counterStore.setState(state => {state.count--})}))
  )
})

export default compose(
  withHandlers({
    increment: props => e => counterStore.setState(state => {state.count++})
  }),
  counter
)(App)
