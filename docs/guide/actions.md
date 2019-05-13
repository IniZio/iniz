# Actions

**Actions** in Reim is like better **Reducer** in Redux, but with **immer**

```javascript
const actions = {
  increment: amount => state => void (state.count += amount)
}

const store = reim({}, {actions})

// later...
store.increment(10)
```

