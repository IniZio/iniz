# @iniz/react

## 0.2.0

### Minor Changes

- [#155](https://github.com/IniZio/iniz/pull/155) [`478aa31`](https://github.com/IniZio/iniz/commit/478aa31f3b61c3e1fece2b43bd4d5812cba775f2) Thanks [@IniZio](https://github.com/IniZio)! - Change to use useSyncExtenalStore.

### Patch Changes

- Updated dependencies [[`478aa31`](https://github.com/IniZio/iniz/commit/478aa31f3b61c3e1fece2b43bd4d5812cba775f2)]:
  - @iniz/core@0.3.0

## 0.1.4

### Patch Changes

- [#140](https://github.com/IniZio/iniz/pull/140) [`d4f10d1`](https://github.com/IniZio/iniz/commit/d4f10d16ee1d17858e32188727acd0e98680f004) Thanks [@IniZio](https://github.com/IniZio)! - Add README files

- Updated dependencies [[`d4f10d1`](https://github.com/IniZio/iniz/commit/d4f10d16ee1d17858e32188727acd0e98680f004)]:
  - @iniz/core@0.1.4

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

- Updated dependencies [[`ea60fa7`](https://github.com/IniZio/iniz/commit/ea60fa778951de897d1d9f8e72eeb2b79b9dfec4)]:
  - @iniz/core@0.1.3

## 0.1.2

### Patch Changes

- [#131](https://github.com/IniZio/iniz/pull/131) [`a5b9bd9`](https://github.com/IniZio/iniz/commit/a5b9bd9f8cbd223ef15b09c4c152fe1b6fe811da) Thanks [@IniZio](https://github.com/IniZio)! - Make computed value readonly

- Updated dependencies [[`a5b9bd9`](https://github.com/IniZio/iniz/commit/a5b9bd9f8cbd223ef15b09c4c152fe1b6fe811da)]:
  - @iniz/core@0.1.2

## 0.1.1

### Patch Changes

- [`a1694a8`](https://github.com/IniZio/iniz/commit/a1694a8b17549a8aafce0a4657edbb29b9a762ff) Thanks [@IniZio](https://github.com/IniZio)! - Fix effect never triggered for scopedAtom

- Updated dependencies [[`a1694a8`](https://github.com/IniZio/iniz/commit/a1694a8b17549a8aafce0a4657edbb29b9a762ff)]:
  - @iniz/core@0.1.1
