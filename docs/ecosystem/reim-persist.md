# reim-persist

```javascript
import persist from 'react-persist'
```

reim-persist saves a **Reim** store's state to localstorage

## Exports

### `persist`

`persist(options: Object) => func`

#### Usage

```javascript
const store = reim({}).plugin(persist())
```

Will get state from localstorage on initialization, and on state change it will write to localstorage.

You can use custom storage by providing `storage` option:

```javascript
persist({
    storage: customStorage // your custom storage
})
```

Note the `customStorage` must have `setItem` and `removeItem` options

