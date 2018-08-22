# Reim.js

![](https://i.imgur.com/C8AklnO.png)

 **Make state easy with** [**Reim**](https://reimjs.gitbook.io/)

 [![](https://img.shields.io/npm/v/reim.svg)](https://npm.im/reim) [![](https://img.shields.io/npm/dm/reim.svg)](https://npm.im/reim) [![](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Grade_Dashboard) ![](https://badgen.net/badge/license/MIT/blue)

![](https://i.imgur.com/iblGzsu.png)

## Why Reim?

* :muscle:   Can scale from HOC to Redux-level
* :snowflake:   Immutable state
* :zap:   Small, just 8kb minified
* :book:   [Nice Documentation](https://reimjs.gitbook.io/reim)

## Installation

```bash
$ yarn add reim react-reim
```

## How Reim looks

### "Minimal"

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

### "Unstated"-like

```jsx
import React from 'react'
import reim from 'reim'
import {context} from 'react-reim'

// create a store
const store = reim({visible: true}).plugin(context())

// use our component 8)
const App = () => (
  <store.Consumer>
    {s => (
      <div>
        <h1>{s.visible ? 'ON' : 'OFF'}</h1>
        <button onClick={() => store.set({visible: !s.visible})}>Toggle</button>
      </div>
    )}
  </store.Consumer>
)
```

### "Redux"-like

```jsx
import React from 'react'
import reim from 'reim'
import {connect} from 'react-reim'

// create a store
const counter = reim({count: 10})

// create a presentational component
const Counter = ({value, increment, decrement}) => (
  <div style={styles.container}>
    <button onClick={decrement}>-</button>
    <div style={styles.counter}>{value}</div>
    <button onClick={increment}>+</button>
  </div>
)

// create a container component
const ConnectedCounter = connect(
  counter,
  ({count}) => ({value: count}),
  ({set}) => ({
    increment: () => set(state => {
      state.count++
    }),
    decrement: () => set(state => {
      state.count--
    })
  })
)(Counter)

export default ConnectedCounter
```

### Demo

[https://codesandbox.io/s/480xmrxy74](https://codesandbox.io/s/480xmrxy74)

