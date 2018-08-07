# Store

Reim tries to keep the store as simple as possible. 

This is how you create a store

{% code-tabs %}
{% code-tabs-item title="stores/todo.js" %}
```javascript
import {store} from 'reim'

const todoStore = store({
    todos: []
})
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now you can subscribe and 

