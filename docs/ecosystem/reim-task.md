# reim-task

```javascript
import task from 'reim-task'
```

reim-task creates a store that updates according to state of an async function

## Exports

### `task`

`task(fn: func) => Store`

Creates a store from passed in **async** function.

The store will be updated with _3_ stages

`{status: 'initialized'}` =&gt; `{status: 'pending'}` =&gt; `{status: 'resolved', result }` / `{status: 'rejected', error}`

To execute the function, you can use `.exec`

```javascript
const aTask = task(() => {
    await fetchSomething()
})

aTask.exec() // starts fetching
```

