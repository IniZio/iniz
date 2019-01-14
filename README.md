<p align="center">
  <img src="https://i.imgur.com/C8AklnO.png" width="50px">
</p>

<h3 align="center">Make state easy with <a href="https://reimjs.gitbook.io/">Reim</a></h3>

<p align="center">
  <a href="https://npm.im/reim"><img src="https://img.shields.io/npm/v/reim.svg"></a>
  <a href="https://npm.im/reim"><img src="https://img.shields.io/npm/dm/reim.svg"></a>
  <a href="https://travis-ci.org/IniZio/reim"><img src="https://travis-ci.org/IniZio/reim.svg?branch=master"></a>
  <a href="https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage"><img src="https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20"></a>
  <a href="https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IniZio/reim&amp;utm_campaign=Badge_Grade_Dashboard"><img src="https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20"></a>
  <img src="https://badgen.net/badge/license/MIT/blue" />
  <a href="https://bundlephobia.com/result?p=reim@"><img src="https://img.shields.io/bundlephobia/minzip/reim.svg"></a>
</p>

<p align="center">
  <img src="https://i.imgur.com/iblGzsu.png" width="80%">
</p>

### Features

<ul>
  <li>🤟 Update state by simply mutating it, thanks to <a href="https://github.com/mweststrate/immer">immer</a></li>
  <li>📏 All possible ways to use state in one: <b>Unstated</b>, <b>React Hook</b>, <b>Redux</b>, <b>React-Values</b>...</li>
  <li>🔐 <b>Immutable</b> state</li>
  <li>⚡ Small, <b> < 9kb</b> gzip + minified</li>
  <li>🌟 Typing support for <b>Typescript</b> & <b>Flow</b></li>
  <li>⚛ Supports <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW">Redux Dev Tools</a></li>
</ul>

### Installation

```sh
$ yarn add reim react-reim
```

<table>
  <thead>
    <tr>
      <th colspan="5"><center>🕹 CodeSandbox demos 🕹</center></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><a href="https://codesandbox.io/s/480xmrxy74">Todo List</a></td>
    </tr>
  </tbody>
</table>

### How Reim looks

#### "Hook" (React 16.7.0-alpha2+)

```jsx
import React from 'react'
import reim from 'reim'
import {useReim} from 'react-reim'

const store = reim({count: 8})

function Counter() {
  const [state, setState] = useReim(store, /* getter */)
  const increment = () => setState(s => {s.count++})

  return (
    <div>
      <button onClick={increment}>+</button>
      <div id="count">{state.count}</div>
    </div>
  )
}
```

#### "Minimal"

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

#### "React-Values"

```jsx
import React from 'react'
import reim from 'reim'
import {State} from 'react-reim'

const Toggle = () => (
  <State initial={{visible: false}} onChange={console.log}>
    {({visible}, {set}) => (
      <button onClick={() => set({visible: !visible})}>{visible.toString()}</button>
    )}
  </State>
)
```

#### "Unstated"-like

```jsx
import React from 'react'
import reim from 'reim'
import {State} from 'react-reim'

// create a store
const store = reim({visible: true})

// use our component 8)
const App = () => (
  <State store={store}>
    {s => (
      <div>
        <h1>{s.visible ? 'ON' : 'OFF'}</h1>
        <button onClick={() => store.set({visible: !s.visible})}>Toggle</button>
      </div>
    )}
  </State>
)
```

#### "Redux"-like

```jsx
import React from 'react'
import reim from 'reim'
import {connect} from 'react-reim'

// create a store
const counter = reim({count: 10})

// create a presentational component
const Counter = ({visible, increment, decrement}) => (
    {({visible}, {set}) => (
      <button onClick={() => set({visible: !visible})}>{visible.toString()}</button>
    )}
  <div>
    <button onClick={decrement}>-</button>
    <div>{value}</div>
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

