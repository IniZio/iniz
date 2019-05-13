# Reim.js
### Makes state dead simple

<p align="center">
  <img src="https://i.imgur.com/C8AklnO.png" width="50px">
</p>

 [![](https://img.shields.io/npm/v/reim.svg)](https://npm.im/reim) [![](https://img.shields.io/npm/dm/reim.svg)](https://npm.im/reim) [![](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Grade_Dashboard) ![](https://badgen.net/badge/license/MIT/blue) [![](https://img.shields.io/bundlephobia/minzip/reim.svg)](https://bundlephobia.com/result?p=reim@)

### Features

* 🤟 Update state by simply mutating it, thanks to [immer](https://github.com/mweststrate/immer)
* 📏 All possible ways to use state in one: **Unstated**, **React Hook**, **Redux**, **React-Values**...
* 🔐 **Immutable** state
* ⚡ Small, **6kb** gzip + minified
* 🌟 Typing support for **Typescript** & **Flow**
* ⚛ Supports [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW)

### Installation

```bash
$ yarn add reim react-reim
```

### How Reim looks

#### "Hook" \(React 16.7.0-alpha2+\)

```jsx
import React from 'react'
import reim from 'reim'
import {useReim} from 'react-reim'

function Counter() {
  const [count, {increment}] = useReim(10, {
    increment: () => state => state++,
    decrement: () => state => state--
  })

  return (
    <div>
      <button onClick={increment}>+</button>
      <div id="count">{count}</div>
    </div>
  )
}
```

#### "Unstated"

```jsx
import React from 'react'
import reim from 'reim'
import {State} from 'react-reim'

const Toggle = () => (
  <State
    initial={false}
    actions={{toggle: () => state => !state}}
    onChange={console.log}
  >
    {(visible, {toggle}) => (
      <button onClick={toggle}>{visible}</button>
    )}
  </State>
)
```

#### "Redux"-like

```jsx
import React from 'react'
import reim from 'reim'
import {withReim} from 'react-reim'

// create a store
const counter = reim({count: 10})

// create a presentational component
const Counter = ({visible, increment, decrement}) => (
  <div>
    <button onClick={decrement}>-</button>
    <div>{value}</div>
    <button onClick={increment}>+</button>
  </div>
)

// create a container component
const ConnectedCounter = witReim(
    store
    /* Filter */({first, last}) => ({full: `${first} ${last}`}),
    /* Actions */ {increment: amount => state => void (state.count += amount)}
)(Counter)

export default ConnectedCounter
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/IniZio/reim/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### License

MIT © [IniZio](https://github.com/IniZio)

