<p align="center">
  <img src="https://i.imgur.com/C8AklnO.png">
</p>

<p align="center">
  Managing your state cannot be easier, trust me :smirk:
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/reim.svg">
  <img src="https://img.shields.io/npm/dm/reim.svg">
  <img src="https://travis-ci.org/IniZio/reim.svg?branch=master">
  <img src="https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20">
  <img src="https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20">
</p>

## Why me? :yum:

<ul>
  <li>:sunglasses: &nbsp; No ALL_CAPS_ACTION_TYPE needed</li>
  <li>:muscle: &nbsp; Can scale from simple HOC to Redux-level</li>
  <li>:zap: &nbsp; Small, just 8kb minified</li>
  <li>:book: &nbsp; <a href="https://reimjs.gitbook.io/reim">Goodest Documentation?</a></li>
</ul>

## :computer: Install

```sh
$ yarn add reim react-reim
```

## :ghost: Usage

### Minimal way

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

### Unstated-like way

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
        <button onClick={store.set({visibile: s.visible})}>Toggle</button>
      </div>
    ))}
  </store.Consumer>
)
```

### Redux-like way

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

## Demo

[https://codesandbox.io/s/480xmrxy74](https://codesandbox.io/s/480xmrxy74)
