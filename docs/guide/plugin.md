# Plugin

Reim can be extended using plugins. An example plugin would be like this:

```javascript
const sayHello(options) {
    const message = options.message
    return (store) => {
        store.subscribe(state => {
            console.log('Hello! ', options.message)
            store.emit('said-hello', options.message)
        })
    }
}
```

Note that it returns a function. This enables us to accept plugin-specific options. Now to use it:

```javascript
// Add plugins on store creation
const someStore = reim({}).plugin(sayBye('Once')).plugin(sayBye('Again!'))

someStore.increment()
// logs 'Hello! World'
// logs 'Bye! Once'
// logs 'Bye! Again!'
```

