import React from 'react'
import {componentFromStream} from 'recompose'
import { interval } from 'rxjs';
import {map} from 'rxjs/operators'

const App = componentFromStream(props$ =>
  props$.pipe(
    map(({count}) => (
      <div>{count}</div>
    ))
  )
)

export default App
