# @iniz/react

## 0.6.5

### Patch Changes

- 85a8081: Fix createElement side-effect excluded from bundle

## 0.6.4

### Patch Changes

- Updated dependencies [fdbda07]
  - @iniz/core@0.7.3

## 0.6.3

### Patch Changes

- 0bce403: Add documentaion website
- Updated dependencies [0bce403]
  - @iniz/core@0.7.2

## 0.6.2

### Patch Changes

- 3135011: Export Fragment from jsx runtime

## 0.6.1

### Patch Changes

- [`d728aa5`](https://github.com/IniZio/iniz/commit/d728aa5117c0c5258f65c8cc3ed2ce53070e2eb7) Thanks [@IniZio](https://github.com/IniZio)! - Fix package.json export

- Updated dependencies [[`d728aa5`](https://github.com/IniZio/iniz/commit/d728aa5117c0c5258f65c8cc3ed2ce53070e2eb7)]:
  - @iniz/core@0.7.1

## 0.6.0

### Minor Changes

- [#184](https://github.com/IniZio/iniz/pull/184) [`bb50e00`](https://github.com/IniZio/iniz/commit/bb50e00422e55d34af899919def2794833c40a38) Thanks [@IniZio](https://github.com/IniZio)! - Add form-related test cases, also extracted react-related form logic from core

### Patch Changes

- Updated dependencies [[`bb50e00`](https://github.com/IniZio/iniz/commit/bb50e00422e55d34af899919def2794833c40a38)]:
  - @iniz/core@0.7.0

## 0.5.0

### Minor Changes

- [#172](https://github.com/IniZio/iniz/pull/172) [`29bf24a`](https://github.com/IniZio/iniz/commit/29bf24af9ea1c1de2025ab85367853c5690d2d4c) Thanks [@IniZio](https://github.com/IniZio)! - Support forms

### Patch Changes

- Updated dependencies [[`29bf24a`](https://github.com/IniZio/iniz/commit/29bf24af9ea1c1de2025ab85367853c5690d2d4c)]:
  - @iniz/core@0.6.0

## 0.4.1

### Patch Changes

- [#168](https://github.com/IniZio/iniz/pull/168) [`8d091c0`](https://github.com/IniZio/iniz/commit/8d091c01baeaa01dfe651f3431ff3c2c08e88003) Thanks [@IniZio](https://github.com/IniZio)! - Fix readme...

## 0.4.0

### Minor Changes

- [#166](https://github.com/IniZio/iniz/pull/166) [`3997271`](https://github.com/IniZio/iniz/commit/399727102e131e7970bfdf7eca78d2db147cb32b) Thanks [@IniZio](https://github.com/IniZio)! - Auto unwrap nested atom in atom

### Patch Changes

- Updated dependencies [[`3997271`](https://github.com/IniZio/iniz/commit/399727102e131e7970bfdf7eca78d2db147cb32b)]:
  - @iniz/core@0.5.0

## 0.3.0

### Minor Changes

- [#164](https://github.com/IniZio/iniz/pull/164) [`56e119e`](https://github.com/IniZio/iniz/commit/56e119e0df6de9de1327d2f943d72f20b03656bf) Thanks [@IniZio](https://github.com/IniZio)! - Reduce exposed API

### Patch Changes

- Updated dependencies [[`56e119e`](https://github.com/IniZio/iniz/commit/56e119e0df6de9de1327d2f943d72f20b03656bf)]:
  - @iniz/core@0.4.0

## 0.2.2

### Patch Changes

- [#162](https://github.com/IniZio/iniz/pull/162) [`583d18e`](https://github.com/IniZio/iniz/commit/583d18e315cc8da6ff181a35868d8649cca85e11) Thanks [@IniZio](https://github.com/IniZio)! - Provide jsxImportSource for error `default not exported by jsx runtime`

## 0.2.1

### Patch Changes

- [#158](https://github.com/IniZio/iniz/pull/158) [`6a4cecc`](https://github.com/IniZio/iniz/commit/6a4ceccf8a292330d3702948d434d025347219e7) Thanks [@IniZio](https://github.com/IniZio)! - Update readmes for latest version

- Updated dependencies [[`6a4cecc`](https://github.com/IniZio/iniz/commit/6a4ceccf8a292330d3702948d434d025347219e7)]:
  - @iniz/core@0.3.1

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
