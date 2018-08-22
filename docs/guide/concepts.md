# Concepts

### Pub / Sub

**Reim** is a pub/sub instance, so you can subscribe to it. When its state changes, it will notify the subscribers.

### HOC

Unlike other state libraries that encourage you to use them when you have state that are global, **Reim** can be easily used as an _HOC_, kind of like **Git** where instead of one single global state tree, it promotes having multiple state trees.

### Selector

A component does not necessarily need the whole state tree held by the store. This is where _selector_ comes in to prevent unnecessary rerenders. When you subscribe to a **Reim** store, you can choose which state change actually matters to you.

### Immutability

What immutablility means to Reim is `store.state.message = 'abc'` will throw an error. Instead you must do `store.set({message: 'abc'})`. 

This makes sure the mutations can be easily traced when errors happen. You can even rollback the changes, which is useful in devtools or debugging.

