# reim-reporter

```javascript
import reporter from 'reim-reporter'
```

reim-reporter is a **Reim** plugin that executes on `setState` / `set`

It is useful for updating analytics data e.g. Google analytics

## Exports

### `reporter`

`reporter(callback: func) => func`

#### Usage

```javascript
const store = reim({}).plugin(reporter(meta => {
    console.log('will report meta!')
    // pass to analytics
}))
```

It subscribes to `setState` event, and will call `callback` as

```javascript
callback(
    {
        name, // mutation name
        snapshot, // current state snapshot
        payload, // args passed into mutation
    },
    store // Reim store
)
```



