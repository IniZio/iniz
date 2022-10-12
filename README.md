# Iniz

Iniz is a reactive state library.

> Currently Iniz is still at **alpha** stage

`npm i @iniz/core`

[![Build Status](https://img.shields.io/github/workflow/status/inizio/iniz/CI/main?style=flat&colorA=28282B&colorB=28282B)](https://github.com/inizio/iniz/actions?query=workflow%3ACI)
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

## Guide

### Getting started

#### Create an atom

Atom is the smallets unit of reactive state.

```ts
import { atom } from "@iniz/core";

const timer$ = atom(new Date());

// It can be a complex nested object/array as well...
const nestedCounter$ = atom({
  obj: {
    array: [{ count: 3 }],
    message: "Hello World",
  },
});
```

#### Mutate the atom value

The `value` property can be read/written to.

```ts
timer$.value; // Returns latest value e.g. `2019-08-31T00:00:00.000Z`

setInterval(() => {
  timer$.value = new Date();
  nestedCounter$.value.obj.array[0].count++;
}, 1000);

// Later on...
timer$.value; // Returns latest value e.g. `2022-08-31T00:00:00.000Z`
```

#### Subscribe to atom

Use `effect` to subscribe to value change.

```ts
const dispose = effect(() => {
  console.log("Updated timer: ", timer$.value);
});

// Execute `dispose` to stop effect
dispose();
```

Use `computed` to get calculated value from multiple atoms

```ts
const timerAndCounter$ = computed(
  () => `Computed: '${nestedCounter$.value.obj.array[0]}' '${timer$.value}'`
);

timerAndCounter$.value; // Returns "Computed: 2022-08-31T00:00:00.000Z 4"
```

### React ⚛

`npm i @iniz/react`

> `@iniz/react` already re-exports `@iniz/core`

Simply use `atom()` values in components, they will re-render correctly thanks to [useSyncExternalStore](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore)

```tsx
// The component won't re-render when `nestedCounter$.value.obj.array[0].count` is updated

function MessageInput() {
  // Equivalient to `atom()`
  const counter = useAtom(10);

  // Equivalent to `computed()`
  const computedCounter = useComputed(
    () => `Computed: ${nestedCounter$$.value.obj.message}`
  );

  // Equivalent to `effect()`
  // NOTE: You can also use `useEffect` with atoms actually
  useSideEffect(() => {
    console.log("[Latest message] ", computedCounter.value);
  });

  return (
    <div>
      <button onClick={() => counter.value++}>{counter.value}++</button>
      <input
        value={nestedCounter$.value.obj.message}
        onChange={(evt) =>
          (nestedCounter$.value.obj.message = evt.target.value)
        }
      />
    </div>
  );
}
```
