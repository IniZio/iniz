# Use with Angular / Rxjs

Reim store can be used as an observable by using `toStream`

{% code-tabs %}
{% code-tabs-item title="src/index.js" %}
```jsx
import React from 'react'
import {render} from 'react-dom'

import App from './components/app'

render(
  <App/>,
  document.getElementById('app')
)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="src/components/app.js" %}
```jsx
import React from 'react'
import {toStream} from 'reim'
import {mapPropsStream, compose, withHandlers} from 'recompose'
import {merge, from, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators'

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
    map(([props, {count}]) => ({
      ...props,
      count,
      decrement: () => counterStore.setState(state => {state.count--})
    }))
  )
})

export default compose(
  withHandlers({
    increment: props => e => counterStore.setState(state => {state.count++})
  }),
  counter
)(App)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

