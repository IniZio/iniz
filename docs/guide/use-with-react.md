# Use with React / Preact

There are 3 ways to use **Reim** with **React**, and you can choose depending on scenerios.

## 1. Minimal way

`react-reim` 's `context` plugin adds `get` function so that you can use derive component from store state

```jsx
import React from 'react'
import reim from 'reim'
import {context} from 'react-reim'

// create a store
const {get, set} = reim({name: 'Peter'}).plugin(context())

// get state already :)
const User = () => (
  <div>{get(s => s.name)}</div>
)

// oh and setting state :D
const App = () => (
  <div>
    <User/>
    {get(s => (
      <input
        value={s.name}
        onChange={ev => set({name: ev.target.value})}
      />
    ))}
  </div>
)
```

## 2. Unstated way

`react-reim` 's `context` plugin also adds `Consumer` component so that you can use store right in components

{% code-tabs %}
{% code-tabs-item title="stores/counter.js" %}
```javascript
import reim from 'reim'
import {context} from 'react-reim'

const counterStore = reim({
    count: 0
}, {
  plugins: [context()]
})

export const mutations = {
    decrement(state) {
        state.count--
    },
    increment(state) {
        state.count++
    },
    add: amount => state => {
        state.count += amount
    }
}


export default counterStore
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now to use it:

{% code-tabs %}
{% code-tabs-item title="index.js" %}
```jsx
import React from 'react'
import {render} from 'react-dom'

import counterStore, {mutations} from 'stores/counter'

const App = () => {
    return (
        <counterStore.Consumer>
        {
            ({count}, {setState: setTodoState}) => (
                <div>
                    <h1>{count}</h1>
                    <button
                        onClick={() => setTodoState(mutations.decrement)}
                    >-</button>
                    <button
                        onClick={() => setTodoState(mutations.increment)}
                    >+</button>
                </div>
            )
        }
        </counterStore.Consumer>
    )
}

render(<App/>, document.getElementById('app'))
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## 3. Redux way

The **Unstated** way is convenient, but sometimes we want to make sure to separate **Container Component** and **Presentation Component**.

This is why Reim also provides the `connect` function

{% code-tabs %}
{% code-tabs-item title="containers/counter.js" %}
```javascript
import {connect} from 'react-reim'

import counterStore, {mutations} from '../stores/counter'
import Counter from '../components/counter'

export default connect(
    counterStore,

    // Getter: extracts state from store
    ({count}) => ({total: count}),

    // Setter: extracts methods to mutate state
    ({setState}) => ({
        addTwo: () =>
            setState(mutations.add(2))
    })
)(Counter)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="components/counter.js" %}
```jsx
import React from 'react'

export default ({addTwo, count}) => (
    <div>
        <h2>{count}</h2>
        <button onClick={addTwo}>+2</button>
    </div>
)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

# Sync with react-router

Just need to use pipeTo...

```jsx
import {BrowserRouter, Route} from 'react-router-dom'
import reim from 'reim'

const store = reim({})

const App = () => (
  <BrowserRouter>
    <Route component={pipeTo(store)}/>
  </BrowserRouter>
)
```
