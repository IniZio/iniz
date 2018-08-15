# Reim.js

Reim.js is an immutable state management library with immer

[![npm version](https://img.shields.io/npm/v/reim.svg)](https://www.npmjs.com/package/reim) [![npm downloads](https://img.shields.io/npm/dm/reim.svg)](https://www.npmjs.com/package/reim) [![Build Status](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IniZio/reim&amp;utm_campaign=Badge_Grade_Dashboard)

```jsx
import React from 'react'
import {render} from 'react-dom'
import {store} from 'reim'
import {connect} from 'react-reim'

const counter = store({count: 10})

const styles = {
  counter: {
    fontSize: '2em',
    margin: '0 10px'
  }
}

const Counter = ({value, increment, decrement}) => (
  <div style={styles.counter}>
    <button onClick={decrement}>-</button>
    <div>{value}</div>
    <button onClick={increment}>+</button>
  </div>
)

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

## Documentation

Checkout our documentation at [https://reimjs.gitbook.io/reim](https://reimjs.gitbook.io/reim)

