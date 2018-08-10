# Store

The **Store** is holds the state, and is responsible for change of state. You can also subscribe to a store for changes.

## Creating a store

{% code-tabs %}
{% code-tabs-item title="stores/todo.js" %}
```javascript
import {store} from 'reim'

const todoStore = store({
    todos: []
})

export default todoStore
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Subscribe and change the state

```javascript
import todoStore from './stores.js'

// Change state
todoStore.setState(state => {
    state.todos.push('a todo here')
})

// Subscribe to state
todoStore.subscribe(state => {
    console.log('state changed!', state)
})
```

