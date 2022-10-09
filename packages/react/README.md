# Iniz

Iniz is a reactive state library.

`npm i @iniz/react`

[![Build Status](https://img.shields.io/github/workflow/status/inizio/iniz/CI/main?style=flat&colorA=28282B&colorB=28282B)](https://github.com/inizio/iniz/actions?query=workflow%3ACI)
[![Test Coverage](https://img.shields.io/codecov/c/github/inizio/iniz/main?token=qiX91NsrLE&label=coverage&flag=react&style=flat&colorA=28282B&colorB=28282B)](https://codecov.io/gh/IniZio/iniz)
[![Build Size](https://img.shields.io/bundlephobia/minzip/@iniz/react?label=bundle%20size&style=flat&colorA=28282B&colorB=28282B)](https://bundlephobia.com/package/@iniz/react)
[![Version](https://img.shields.io/npm/v/@iniz/core?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/react)
[![Downloads](https://img.shields.io/npm/dt/@iniz/core.svg?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/react)

- [Guide](#guide)
  - [React via `useAtom`](#react-via-useatom)
  - [`useComputed` and `useSideEffect`](#usecomputed-and-usesideeffect)

## Guide

### React via `useAtom`

Create a scoped atom that only re-renders when parts of the state accessed in component has changed.

```tsx
import { useAtom } from "@iniz/react";

function MessageInput() {
  const message$ = useAtom("Hello World");

  return (
    <div>
      <input
        value={message$$.value}
        onChange={(evt) => (message$$.value = evt.target.value)}
      />
    </div>
  );
}
```

### `useComputed` and `useSideEffect`

They are equivalent to `computed` and `effect` of `@iniz/core` respectively

```tsx
import { useAtom, useComputed, useSideEffect } from "@iniz/react";

// The component won't re-render when `nestedCounter$.value.obj.array[0].count` is updated

function MessageInput() {
  const nestedCounter$$ = useAtom(nestedCounter$);

  // Equivalent to `computed`
  const computedCounter = useComputed(
    () => `Computed: ${nestedCounter$$.value.obj.message}`
  );

  // Equivalent to `effect`
  useSideEffect(() => {
    console.log("[Latest message] ", computedCounter.value);
  });

  return (
    <div>
      <input
        value={nestedCounter$$.value.obj.message}
        onChange={(evt) =>
          (nestedCounter$$.value.obj.message = evt.target.value)
        }
      />
    </div>
  );
}
```
