import React from 'react'
import {createEventHandler, mapPropsStream, compose} from 'recompose'
import {merge} from 'rxjs';
import {map, switchMap, scan, startWith, mapTo} from 'rxjs/operators'

const App = ({count, increment, decrement}) => (
  <div>
    <div>Count: {count}</div>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
)

const counter = mapPropsStream(props$ => {
  const { handler: increment, stream: increment$ } = createEventHandler()
  const { handler: decrement, stream: decrement$ } = createEventHandler()

  return props$.pipe(
      switchMap(props =>
        merge(
          increment$.pipe(mapTo(1)),
          decrement$.pipe(mapTo(-1))
        )
          .pipe(
            startWith(props.count),
            scan((count, n) => count + n, 0),
            map(count => ({...props, count, increment, decrement}))
          )
      )
    )
})

export default compose(
  counter
)(App)
