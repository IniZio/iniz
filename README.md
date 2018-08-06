# Reim.js

Reim.js is an immutable state management library with immer

[![npm version](https://img.shields.io/npm/v/reim.svg)](https://www.npmjs.com/package/reim) [![npm downloads](https://img.shields.io/npm/dm/reim.svg)](https://www.npmjs.com/package/reim) [![Build Status](https://travis-ci.org/IniZio/reim.svg?branch=master)](https://travis-ci.org/IniZio/reim) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/app/inizio/reim?utm_source=github.com&utm_medium=referral&utm_content=IniZio/reim&utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1560c0832a3a41df8bfe51083fd92c20)](https://www.codacy.com/project/inizio/reim/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IniZio/reim&amp;utm_campaign=Badge_Grade_Dashboard)

## Quick Start

1. Install `reim` and `react-reim`: `npm i reim react-reim`
2. Use `create-react-app` to make a new project
3. {% code-tabs %}
   {% code-tabs-item title="src/App.jsx" %}
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

## Learn Reim

Checkout our documentation at [https://reimjs.gitbook.io/reim](https://reimjs.gitbook.io/reim)

