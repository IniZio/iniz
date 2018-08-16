# Reim.js

[![npm version](https://img.shields.io/npm/v/reim.svg)](https://www.npmjs.com/package/reim) [![npm downloads](https://img.shields.io/npm/dm/reim.svg)](https://www.npmjs.com/package/reim) [![Build Status](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IniZio/reim&amp;utm_campaign=Badge_Grade_Dashboard)

Reim.js is an (im)mutable state management library. Inspired by great libraries like Redux, but without boilerplate.

[See the Documentation](https://reimjs.gitbook.io/reim)

## How it looks

```jsx
import React from 'react'
import {render} from 'react-dom'

// 0. Import Reim :)
import {store} from 'reim'
import {connect} from 'react-reim'

const styles = {
  countainer: {
    display: 'flex'
  },
  counter: {
    fontSize: '2em',
    margin: '0 10px'
  }
}

// 1. Create a store
const counter = store({count: 10})

// 2. Make a normal component
const Counter = ({value, increment, decrement}) => (
  <div style={styles.container}>
    <button onClick={decrement}>-</button>
    <div style={styles.counter}>{value}</div>
    <button onClick={increment}>+</button>
  </div>
)

// 3. Connect the component to store
const ConnectedCounter = connect(
  counter,
  state => ({value: state.count}),
  ({setState}) => ({
    increment: () => setState(state => {
      state.count++
    }),
    decrement: () => setState(state => {
      state.count--
    })
  })
)

render(<ConnectCounter/>, document.getElementById('app'))
```

## Demo

[https://codesandbox.io/s/480xmrxy74](https://codesandbox.io/s/480xmrxy74)

