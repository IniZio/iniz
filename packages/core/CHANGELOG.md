# @iniz/core

## 0.2.0

### Minor Changes

- [#149](https://github.com/IniZio/iniz/pull/149) [`1dc6b50`](https://github.com/IniZio/iniz/commit/1dc6b5081b66d15db9c9e9c150ef2be495d111c1) Thanks [@IniZio](https://github.com/IniZio)! - Support marking property as untracked

### Patch Changes

- [#151](https://github.com/IniZio/iniz/pull/151) [`fff064b`](https://github.com/IniZio/iniz/commit/fff064bfc4c58633d94ee9a3c2c73a6a1b6e1d9d) Thanks [@IniZio](https://github.com/IniZio)! - Should trigger effect if reassign ref itself

## 0.1.4

### Patch Changes

- [#140](https://github.com/IniZio/iniz/pull/140) [`d4f10d1`](https://github.com/IniZio/iniz/commit/d4f10d16ee1d17858e32188727acd0e98680f004) Thanks [@IniZio](https://github.com/IniZio)! - Add README files

## 0.1.3

### Patch Changes

- [#133](https://github.com/IniZio/iniz/pull/133) [`ea60fa7`](https://github.com/IniZio/iniz/commit/ea60fa778951de897d1d9f8e72eeb2b79b9dfec4) Thanks [@IniZio](https://github.com/IniZio)! - Allow applying scope on a property of scoped atom / root atom.

  All of the following usages will not cause re-render in parent when `contacts`'s property changes

  ```tsx
  function Child({ company }) {
    const company$ = useAtom(company);
    const companyContacts$ = useAtom(company$.value.contacts);
  }
  ```

  ```tsx
  function Child({ company }) {
    const companyContacts$ = useAtom(company.value.contacts);
  }
  ```

  ```tsx
  function Child({ companyContacts }) {
    const companyContacts$ = useAtom(compantConctacts);
  }
  ```

## 0.1.2

### Patch Changes

- [#131](https://github.com/IniZio/iniz/pull/131) [`a5b9bd9`](https://github.com/IniZio/iniz/commit/a5b9bd9f8cbd223ef15b09c4c152fe1b6fe811da) Thanks [@IniZio](https://github.com/IniZio)! - Make computed value readonly

## 0.1.1

### Patch Changes

- [`a1694a8`](https://github.com/IniZio/iniz/commit/a1694a8b17549a8aafce0a4657edbb29b9a762ff) Thanks [@IniZio](https://github.com/IniZio)! - Fix effect never triggered for scopedAtom
