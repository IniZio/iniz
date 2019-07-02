# Reim &middot; [![](https://img.shields.io/npm/v/reim.svg)](https://npm.im/reim) [![](https://img.shields.io/npm/dm/reim.svg)](https://npm.im/reim) [![](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) ![](https://badgen.net/badge/license/MIT/blue) [![](https://img.shields.io/bundlephobia/minzip/reim.svg)](https://bundlephobia.com/result?p=reim@)

### :thinking: Why Reim?

* :metal: Update state by simply mutating it, thanks to [immer](https://github.com/mweststrate/immer)
* :closed_lock_with_key: **Immutable** state
* :zap: Small, **6kb** gzip + minified
* :star2: Typing support for **Typescript** & **Flow**
* :atom_symbol: Supports [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW)

### :book: How to use

```bash
$ yarn add reim react-reim
```

Then use `useReim` just like other React hooks :

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

or use `<State/>` for some cases:

```jsx
import React from 'react'
import reim from 'reim'
import {State} from 'react-reim'

const Toggle = () => (
  <State
    initial={false}
    actions={{toggle: () => state => !state}}
  >
    {(visible, {toggle}) => (
      <button onClick={toggle}>{visible ? 'On' : 'Off'}</button>
    )}
  </State>
)
```

#### Table of Contents

- [`reim`](#reim)
- [`react-reim`](#react-reim)

## `reim`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

### `reim(state | store, {actions?: Actions, name?: string})`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Returns a new `Reim` store.

An action is simple a function that returns a state updater.

For example: 

```js
const store = reim({count: 10}, {
  actions: {
    add: amount => state => {state.count += amount}
  }
})
```

Then just use it as a method:

```js
// before: {count: 10}

store.add(5)

// after: {count: 15}
```

#### `filter(getter: {[name]: state => any} | state => any | keyof typeof state)`

Gets current snapshot of store

#### `subscribe(fn, {filter})`

`fn` gets called on change. You can `unsubscribe(fn)` to stop subscription.

## `react-reim`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

### `<State/>`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

#### `initial`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

This is the initial value of the store. The store is resets if initial value is changed.

#### `store`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Receives a `Reim` store, `initial` is ignored if `store` is provided

#### `actions`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Same as `actions` in `reim()`

#### `filter`

Same as `filter` in `reim()`

### `useReim(store | state, {filter, actions})`

Returns `[snapshot, actions]`

### :heart: Contributing

Please read [CONTRIBUTING.md](https://github.com/IniZio/reim/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### :page_with_curl: License

MIT © [IniZio](https://github.com/IniZio)
