# How Reim works

## Components

There are 3 parts in Reim.js:

* [`store` + `context`](how-reim-works.md#create-a-store)\`\`
* [`connect`](motivation.md#connect-store-to-component)
* [`setState`](motivation.md#connect-store-to-component)

### Create a store

{% code-tabs %}
{% code-tabs-item title="stores/todo.js" %}
```jsx
import reim from 'reim'
import {context} from 'react-reim'

const todoStore = reim({
    todos: []
}, {
  plugins: [context()]
})

export default todoStore
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Connect store to component

Just like Redux, Reim recommends you to use container to pump store state and methods to components

{% code-tabs %}
{% code-tabs-item title="containers/todo.js" %}
```jsx
import {connect} from 'react-reim'

import todo from '../stores/todo'

import TodoList from '../components/todo-list'

export default connect(
    todo,
    // getters
    ({todos}) => ({todos}),
    // setters
    ({setState}) => ({
        addTodo: todo =>
            setState(({todos}) => {
                todos.push(todo)
            })
        changeTodo: (index, todo) =>
            setState(({todos}) => {
                todos[index] = todo
            })
    })
)
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="components/todo-list.js" %}
```jsx
import React from 'react'

const TodoList = ({todos, addTodo, changeTodo}) => (
    <div>
        <ul>
        {todos.map((todo, index) => (
            <li>
                <input
                    key={index}
                    value={todo}
                    onChange={e => changeTodo(index, e.target.value)}
                />
            </li>
        ))}
        </ul>
        <button onClick={() => addTodo('')}>+</button>
    </div>
)

export default TodoList
```
{% endcode-tabs-item %}
{% endcode-tabs %}

If you have used Redux before, you should see that quite an amount of it is pretty familiar, except for `setState` .

`setState` looks just like normal React components setting its state, instead of having to call an action and then a reducer.

Reim also provides context Components to make firing up a store even more straight-forward, and will be explained in later section.
