# Reim &middot; [![](https://img.shields.io/npm/v/reim.svg)](https://npm.im/reim) [![](https://img.shields.io/npm/dm/reim.svg)](https://npm.im/reim) [![](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) ![](https://badgen.net/badge/license/MIT/blue) [![](https://img.shields.io/bundlephobia/minzip/reim.svg)](https://bundlephobia.com/result?p=reim@)

> React state done right™

### Features

* 🤟 Update state by simply mutating it, thanks to [immer](https://github.com/mweststrate/immer)
* 🔐 **Immutable** state
* ⚡ Small, **6kb** gzip + minified
* 🌟 Typing support for **Typescript** & **Flow**
* ⚛ Supports [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-TW)

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

## Contributing

Please read [CONTRIBUTING.md](https://github.com/IniZio/reim/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### License

MIT © [IniZio](https://github.com/IniZio)
