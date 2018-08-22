# react-reim

```javascript
import {context, connect, pipeTo} from 'react-reim'
```

react-reim allows you to use **Reim** with **React**.

## Exports

### `context`

The plugin for creating HOC from a **Reim** store.

```javascript
const store = reim({}).plugin(context())
```

### `connect`

`connect(store: Store, [getter: func, setter: func]) => func => React Element`

Connects **Reim** store to a **React** component.

```javascript
const store = reim({name: 'John'})

const User = ({name, changeName})  => (
    <input value={name} onChange={changeName}/>
)

export default connect(
    user,
    // getter
    state => ({name: state.name}),
    // setter
    store => ({
        changeName(ev) {
            store.set({name: ev.target.value})
        }
    })
)(User)
```

### `pipeTo`

`pipeTo(store: Store, [mutation: func]) => React Element`

Creates a component that triggers mutation on prop change to **Reim** store

```jsx
const store = reim({value: 100})

const Piper = pipeTo(store, (state, props) => {
    state.value += props.count
})

<Piper count={10}/>
```

