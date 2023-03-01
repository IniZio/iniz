import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";

const style = `
button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

body {
  font: 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  color: #4d4d4d;
  max-width: 550px;
  padding: 20px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
}

:focus {
  outline: 0;
}

.hidden {
  display: none;
}

.todoapp {
  background: #fff;
  margin: 20px 0 20px 0;
  position: relative;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
    0 25px 50px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

.todoapp input::-webkit-input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::-moz-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.new-todo,
.edit {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  -webkit-box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  -webkit-box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li .toggle {
  text-align: center;
  width: 40px;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.todo-list li .toggle {
  opacity: 0;
}

.todo-list li .toggle + label {
  background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center left;
}

.todo-list li .toggle:checked + label {
  background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
}

.todo-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 60px;
  display: block;
  line-height: 1.2;
  -webkit-transition: color 0.4s;
  transition: color 0.4s;
}

.todo-list li.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}

.todo-list li .destroy {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
}

.todo-list li .destroy:hover {
  color: #af5b5e;
}

.todo-list li .destroy:after {
  content: "x";
}

.todo-list li:hover .destroy {
  display: block;
}
`;

const store = `import { atom, store } from "@iniz/react";

interface Todo {
  completed: boolean;
  title: string;
}

export const newTodo = atom("");
export const todos = store<Todo[]>([]);

export function addTodo(title: string) {
  newTodo("");
  todos.unshift({ title, completed: false });
}
export function removeTodo(todo: Todo) {
  todos.splice(todos.indexOf(todo));
}`;

const code = `import { newTodo, todos, addTodo, removeTodo } from "./todo"

function TodoApp() {
  return (
    <div className="todoapp">
      <input
        className="new-todo"
        value={newTodo()}
        onChange={(evt) => newTodo(evt.target.value)}
        onKeyUp={(evt) => evt.key === "Enter" && addTodo(newTodo())}
        placeholder="What are you trying to get done?"
      />

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li
            key={index}
            className={todo.completed ? "todo completed" : "todo"}
          >
            <div className="view">
              <input
                type="checkbox"
                className="toggle"
                checked={todo.completed}
                onChange={() => (todo.completed = !todo.completed)}
              />
              <label>{todo.title}</label>
              <button
                className="destroy"
                onClick={() => removeTodo(todo)}
              ></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp`;

function TodoApp() {
  return (
    <Sandpack
      template="react-ts"
      options={{
        editorHeight: 400,
      }}
      customSetup={{
        dependencies: { "@iniz/react": "*" },
      }}
      files={{
        "/styles.css": {
          code: style,
          hidden: true,
        },
        "/index.tsx": {
          code: `
          /** @jsxRuntime classic */

            import React from 'react';
            import { render } from 'react-dom';

            import "./styles.css";

            import App from './App';

            const rootElement = document.getElementById('root');
            render(<App />, rootElement);
          `,
          hidden: true,
        },
        "/todo.ts": {
          code: store,
          active: true,
        },
        "/App.tsx": code,
      }}
    />
  );
}

export default TodoApp;
