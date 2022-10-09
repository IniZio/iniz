# Iniz

Iniz is a reactive state library.

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
  - [React via `useAtom`](#react-via-useatom)
    - [Going one step furthur...](#going-one-step-furthur)

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

### React via `useAtom`

Create a scoped atom that only re-renders when parts of the state accessed in component has changed.

`npm i @iniz/react`

> `@iniz/react` already installs and exports `@iniz/core`

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

#### Going one step furthur...

`useAtom` can be applied on a property of atom as well

```tsx
// CompanyForm won't be re-rendered when `company$.value.contacts` is updated

function CompanyForm() {
  const company$ = useAtom(company);
  const companyBasic$ = useAtom(company.value.basic);

  return (
    <div>
      <input
        onChange={(e) => (companyBasic$.value.name = e.target.value)}
        value={company$.value.basic.name}
      />

      <ContactPersonSubForm companyContacts={company$.value.contacts} />
    </div>
  );
}

function ContactPersonSubForm({ companyContacts }) {
  const companyContacts$ = useAtom(companyContacts);

  return (
    <div>
      <div data-testid="contact-name-display">
        {companyContacts$.value[0].name}
      </div>
      <input
        data-testid="contact-name-input"
        onChange={(e) => (companyContacts$.value[0].name = e.target.value)}
        value={companyContacts$.value[0].name}
      />
    </div>
  );
}
```
