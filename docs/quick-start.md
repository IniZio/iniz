---
description: How it feels like using Reim in a starter project
---

# Quick Start

## Quick Start

First you need to start a project with `create-react-app`

```bash
create-react-app reim-demo
```

{% hint style="info" %}
You can use any other ways to create the project.
{% endhint %}

Next install `reim` and `react-reim`

```bash
npm i reim react-reim # or yarn / pnpm
```

And then replace App.jsx content

{% code-tabs %}
{% code-tabs-item title="src/index.js" %}
```jsx
import React from "react";
import ReactDOM from "react-dom";

import {register} from 'reim';
import {createContext} from 'react-reim';

const todoStore = createContext(register({todos: []}));

function App() {
  editTodo(index, todo) {
    todoStore.setState(({ todos }) => {
      todos[index] = todo;
    })
  }

  addTodo() {
    todoStore.setState(({todos}) => {
      todos.push('');
    })
  }

  return (
    <div className="App">
      <todoStore.Provider>
        <todoStore.Consumer>
          {
            ({todos}) => (
              <ul>
                {list.map((todo, index) => (
                  <li key={index}>
                    <input value={todo} onChange={e => editTodo(index, e.target.value)} />
                  </li>
                ))}
                <button onClick={addTodo}>Add todo</button>
              </ul>
            )
          }
        </todoStore.Consumer>
      </todoStore.Provider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now just run `npm run start`

