# setState

## What is setState?

**Reim** `set` / `setState` mutates the store state, similar to **React**:

```javascript
store.setState({message: 'Hello world!'})
```

## Difference from React

Since **Reim** uses [**Immer**](https://github.com/mweststrate/immer), you can also create next immutable state by directly mutating it in `setState`

```javascript
const example = reim({
    message: 'Forever'
})

// OK, merges with old state just like React
// Result: {message: 'Forever', count: 12}
store.setState({
    count: 12
})

// OK, `set` is same as `setState`
// Result: {message: 'Forever Reim', count: 12}
store.set(state => {
    state.message = ' Reim'
})

// Not OK, do not return state if you mutate it
store.setState(state => {
    state.count++
    return state
})

// OK, creates a completely new state
// Result: {message: 'Forever Reim!!'}
store.setState(state => ({
    message: state.message + '!!'
}))
```

