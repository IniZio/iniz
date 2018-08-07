---
description: What and why Reim.js?
---

# Motivation

## State management

#### Between Browser and App

Modern view frameworks like Vue and React are built on the fact that maintaining state between browser and app itself is hard and clumsy. These frameworks solves the pain by breaking the website down into components.

#### Between Components

But then the new problem kicks in: How do I maintain state between components?

Libraries like Redux, Mobx came to the rescue. Redux organises state changes with actions and reducers from Flux, whereas Mobx makes everything reactive according to their decorators.

They are on two ends of the spectrum: One does not have any magic, only strict architecture. Another seems to make the states magically reactive. 

Redux makes projects very scalable, but it is also complained to introduce boilerplate code. Mobx makes starting out projects really a breeze, but when things get pretty hard to clean up once side-effects are everywhere.

### Why setState is awesome... and why not sometimes

React is very well known for its `setState` function, and libraries like unstated mocks it to make mutating store states feel more natural. 

In fact, since people are already used to only changing state data instead of making side-effects in `setState`, it really does make sense to do the same thing to global state management as well.

But there is still a problem where when you `setState`, you will eventually meet the 'spread hell':

{% code-tabs %}
{% code-tabs-item title="spread-hell.js" %}
```jsx
setState(state => ({
    deep: {
        ...state.deep,
        evenDeeper: {
            ...state.deep.evenDeeper,
            literally: 'hell' 
        }
    }
}))
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Reim.js tries to solve these issues that make state management uncomfortable

### How Reim.js works

There are 3 parts in Reim.js:

* \`\`[`store` + `context`](motivation.md#create-a-store)\`\`
* \`\`[`connect`](motivation.md#connect-store-to-component)\`\`
* \`\`[`setState`](motivation.md#connect-store-to-component)\`\`

#### Create a store

{% code-tabs %}
{% code-tabs-item title="stores/todo.js" %}
```jsx
import {store} from 'reim'
import {context} from 'react-reim'

const todoStore = context(store)({
    todos: []
})

export default todoStore
```
{% endcode-tabs-item %}
{% endcode-tabs %}

#### Connect store to component

Just like Redux, Reim recommends you to use container to pump store state and methods to components

{% code-tabs %}
{% code-tabs-item title="containers/todo.js" %}
```jsx
import {connect} from 'react-reim'

import TodoStore from '../stores/todo'
import TodoList from '../components/todo-list'

const TodoContainer = connect(
    TodoStore,
    // getters
    ({todods}) => ({todos}),
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
        {
            todos.map((todo, index) => (
                <li>
                    <input
                        key={index}
                        value={todo}
                        onChange={e => changeTodo(index, e.target.value)}
                    />
                </li>
            ))
        }
        </ul>
        <button onClick={() => addTodo('')}>+</button>
    </div>
)

export default TodoList
```
{% endcode-tabs-item %}
{% endcode-tabs %}

If you have used Redux before, you should see that quite an amount of it is pretty familiar, except for `setState` .

`setState`  looks just like normal React components setting its state, instead of having to call an action and then a reducer.

Reim also provides context Components to make firing up a store even more straight-forward, and will be explained in later section

