# Subscribe

with `subscribe` function you will be notified whenever there is a change by simply

```javascript
const unsubscribe = store.subscribe(state => {
    console.log('state updated!')
})
```

And when you want to stop it just use the returned function

```javascript
unsubscribe()
```

## Getter

Sometimes you want to only be notified if some of the properties changed, you can use the `getter` option, which returns a derived state from store.

```javascript
const countStore = store({
    count: 2,
    message: ''
})

countStore.subscribe(state => {
    console.log('state count changed!')
    console.log(state.count) // 12
    console.log(state.messsage) // undefined
}, {
    getter: state => ({count: state.count})
})

// Will not trigger subscriber
countStore.setState({message: 'should not trigger'})

// 'state count changed'
countStore.setState(state => {
    state.count += 10
})
```

