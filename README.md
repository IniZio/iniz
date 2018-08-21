# Reim.js

[![npm version](https://img.shields.io/npm/v/reim.svg)](https://www.npmjs.com/package/reim) [![npm downloads](https://img.shields.io/npm/dm/reim.svg)](https://www.npmjs.com/package/reim) [![Build Status](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IniZio/reim&amp;utm_campaign=Badge_Grade_Dashboard)

Reim.js is an \(im\)mutable state management library. Inspired by great libraries like Redux, but without boilerplate.

[See the Documentation](https://reimjs.gitbook.io/reim)

## How it looks

### Unstated-like way

```jsx
import React from 'react'
import reim from 'reim'
import {context} from 'react-reim'

// 1. Create a store
const {get, set} = reim({name: 'Peter'}).plugin(context())

// 2. Get it already :)
const User = () => (
  <div>{get(s => s.name)}</div>
)

// 3. Also setting state :D
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

### Redux-like way

```jsx
import React from 'react'
import reim from 'reim'
import {connect} from 'react-reim'

// 1. Create a store
const counter = reim({count: 10})

// 2. Create a presentational component
const Counter = ({value, increment, decrement}) => (
  <div style={styles.container}>
    <button onClick={decrement}>-</button>
    <div style={styles.counter}>{value}</div>
    <button onClick={increment}>+</button>
  </div>
)

// 3. Create a container component
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
