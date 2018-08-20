# Store

The **Store** is holds the state, and is responsible for change of state. You can also subscribe to a store for changes.

## Creating a store

{% code-tabs %}
{% code-tabs-item title="stores/todo.js" %}
```javascript
import reim from 'reim'

const todoStore = reim({
    todos: []
})

export default todoStore
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Creating a named store

A store is anonymous by default. You can make a named store for use with plugins e.g. reim-reporter. 

```javascript
const todoStore = reim({
    todos: []
}, {
    name: 'Todo-Store'
})
```

