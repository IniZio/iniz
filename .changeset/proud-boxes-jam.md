---
"@iniz/core": patch
"@iniz/react": patch
---

Allow applying scope on a property of scoped atom / root atom.

All of the following usages will not cause re-render in parent when `contacts`'s property changes

```tsx
function Child({ company }) {
  const company$ = useAtom(company)
  const companyContacts$ = useAtom(company$.value.contacts)
}
```

```tsx
function Child({ company }) {
  const companyContacts$ = useAtom(company.value.contacts)
}
```

```tsx
function Child({ companyContacts }) {
  const companyContacts$ = useAtom(compantConctacts)
}
```
