# Iniz

Iniz is a reactive store library. Try it out on our [website](https://iniz.netlify.app)!

`npm i @iniz/preact`

[![Build Status](https://img.shields.io/github/workflow/status/inizio/iniz/CI/main?style=flat&colorA=28282B&colorB=28282B)](https://github.com/inizio/iniz/actions?query=workflow%3ACI)
[![Test Coverage](https://img.shields.io/codecov/c/github/inizio/iniz/main?token=qiX91NsrLE&label=coverage&flag=react&style=flat&colorA=28282B&colorB=28282B)](https://codecov.io/gh/IniZio/iniz)
[![Build Size](https://img.shields.io/bundlephobia/minzip/@iniz/preact?label=bundle%20size&style=flat&colorA=28282B&colorB=28282B)](https://bundlephobia.com/package/@iniz/preact)
[![Version](https://img.shields.io/npm/v/@iniz/preact?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/preact)
[![Downloads](https://img.shields.io/npm/dt/@iniz/preact.svg?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/preact)

- [Guide](#guide)

## Guide

> `@iniz/preact` already re-exports `@iniz/core`, so don't need to install `@iniz/core` yourself

Simply use `atom()` values in components, they will re-render correctly with custom jsxImportSource.

```tsx
/** @jsxImportSource @iniz/preact */
import { useAtom, useComputed, useSideEffect } from "@iniz/preact";

function MessageInput() {
  // Equivalient to `atom()`
  const counter = useAtom(10);

  // Equivalent to `computed()`
  const computedCounter = useComputed(
    () => `Computed: ${nestedCounter$$().obj.message}`
  );

  // Equivalent to `effect()`
  // NOTE: You can also use `useEffect` with atoms actually
  useSideEffect(() => {
    console.log("[Latest message] ", computedCounter());
  });

  return (
    <div>
      <button onClick={() => counter(counter() + 1)}>{counter()}++</button>
    </div>
  );
}
```
