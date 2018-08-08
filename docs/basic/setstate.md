# setState

Reim `setState` mutates the store state, similar to React

```javascript
store.setState({message: 'Hello world!'})
```

However there is one thing different from React. When you use callback in state, you should not return a value if you mutate the passed in state.

```javascript
// OK
store.setState(state => {
    state.message += ' Reim'
})

// Not OK, do not return state if you mutate it
store.setState(state => {
    state.counter++
    return state
})

// OK, return new state without mutating old state
store.setState(state => ({
    message: state.message + '!!'
}))
```



