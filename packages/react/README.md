# Iniz

Iniz is a reactive state library.

`npm i @iniz/react`

[![Build Status](https://img.shields.io/github/workflow/status/inizio/iniz/CI/main?style=flat&colorA=28282B&colorB=28282B)](https://github.com/inizio/iniz/actions?query=workflow%3ACI)
[![Test Coverage](https://img.shields.io/codecov/c/github/inizio/iniz/main?token=qiX91NsrLE&label=coverage&flag=react&style=flat&colorA=28282B&colorB=28282B)](https://codecov.io/gh/IniZio/iniz)
[![Build Size](https://img.shields.io/bundlephobia/minzip/@iniz/react?label=bundle%20size&style=flat&colorA=28282B&colorB=28282B)](https://bundlephobia.com/package/@iniz/react)
[![Version](https://img.shields.io/npm/v/@iniz/react?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/react)
[![Downloads](https://img.shields.io/npm/dt/@iniz/react.svg?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/react)

- [Guide](#guide)

## Guide

> `@iniz/react` already re-exports `@iniz/core`, so don't need to install `@iniz/core` yourself

Simply use `atom()` values in components, they will re-render correctly thanks to [useSyncExternalStore](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore)

```tsx
import { useAtom, useComputed, useSideEffect } from "@iniz/react";

// The component won't re-render when `nestedCounter$().obj.array[0].count` is updated
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
      <input
        value={nestedCounter$().obj.message}
        onChange={(evt) => (nestedCounter$().obj.message = evt.target.value)}
      />
    </div>
  );
}
```
