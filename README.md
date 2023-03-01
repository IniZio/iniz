# Iniz

Iniz is a reactive state library for ReactJS. Try it out on our [website](https://iniz.netlify.app)!

`npm i @iniz/core`

[![Build Status](https://img.shields.io/github/actions/workflow/status/inizio/iniz/ci.yaml?branch=main&style=flat&colorA=28282B&colorB=28282B)](https://github.com/inizio/iniz/actions?query=workflow%3ACI)
[![Test Coverage](https://img.shields.io/codecov/c/github/inizio/iniz/main?token=qiX91NsrLE&label=coverage&style=flat&colorA=28282B&colorB=28282B)](https://codecov.io/gh/IniZio/iniz)
[![Build Size](https://img.shields.io/bundlephobia/minzip/@iniz/core?label=bundle%20size&style=flat&colorA=28282B&colorB=28282B)](https://bundlephobia.com/package/@iniz/core)
[![Version](https://img.shields.io/npm/v/@iniz/core?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/core)
[![Downloads](https://img.shields.io/npm/dt/@iniz/core.svg?style=flat&colorA=28282B&colorB=28282B)](https://www.npmjs.com/package/@iniz/core)

- [Guide](#guide)
  - [Getting started](#getting-started)
    - [Create an atom](#create-an-atom)
    - [Mutate the atom value](#mutate-the-atom-value)
    - [Subscribe to atom](#subscribe-to-atom)
  - [React ⚛](#react-)
- [Credits](#credits)

## Guide

### Getting started

#### Create an atom / store

```ts
import { atom, store } from "@iniz/core";

const timer$ = atom(new Date());

const nested$ = store({
  obj: {
    array: [{ count: 3 }],
    message: "Hello World",
  },
  async reset() {
    this.array = [];
    this.message = "Good bye";
  },
});
```

#### Mutate the atom value

Call the atom to read/write it.

```ts
// Initial value
timer$(); // Returns latest value e.g. `2019-08-31T00:00:00.000Z`

// Mutate the atom / state
setInterval(() => {
  nested$.obj.array[0].count++;
  timer$(new Date());
}, 1000);

// Later on...
timer$(); // Returns latest value e.g. `2022-08-31T00:00:00.000Z`
nested$.obj.array[0].count;

nested$.reset();
```

#### Subscribe to atom

Use `effect()` to subscribe to value change.

```ts
const dispose = effect(() => {
  console.log("Updated timer: ", timer$());
});

// Execute `dispose` to stop effect
dispose();
```

Use `computed()` to get calculated value from multiple atoms.

```ts
const timerAndCounter$ = computed(
  () => `Computed: '${nestedCounter$().obj.array[0]}' '${timer$()}'`
);

timerAndCounter$(); // Returns "Computed: 2022-08-31T00:00:00.000Z 4"
```

### React ⚛

`npm i @iniz/react`

> `@iniz/react` already re-exports `@iniz/core`, so don't need to install `@iniz/core` yourself

Simply use `atom()` values in components, they will re-render correctly thanks to [useSyncExternalStore](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore)

```tsx
import { useAtom, useComputed } from "@iniz/react";

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
        onChange={(evt) => (nestedCounter$().obj.message = evt.target())}
      />
    </div>
  );
}
```

## Credits

- [pmndrs/valtio](https://github.com/pmndrs/valtio): The original snapshot idea
- [tomasklaen/statin](https://github.com/tomasklaen/statin): Use function call to get/set atom value
- [RisingStack/react-easy-state](https://github.com/RisingStack/react-easy-state): Original implementation for `useAtom`
