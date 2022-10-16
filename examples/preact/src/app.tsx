/** @jsxImportSource @iniz/preact */

/* eslint-disable @next/next/no-img-element */

import { atom } from "@iniz/preact";
import { useState } from "preact/hooks";
import "./app.css";
import preactLogo from "./assets/preact.svg";

const count$ = atom(1);

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank" rel="noreferrer">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => count$(count$() + 1)}>
          count is {count$()}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  );
}
