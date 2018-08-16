---
description: What and why Reim.js?
---

# Motivation

## State management

#### Between Browser and App

Modern view frameworks like Vue and React are built on the fact that maintaining state between browser and app itself is hard and clumsy. These frameworks solves the pain by breaking the website down into components.

#### Between Components

But then the new problem kicks in: How do I maintain state between components?

Libraries like Redux, Mobx came to the rescue. Redux organises state changes with actions and reducers from Flux, whereas Mobx makes everything reactive according to their decorators.

They are on two ends of the spectrum: One does not have any magic, only strict architecture. Another seems to make the states magically reactive.

Redux makes projects very scalable, but it is also complained to introduce boilerplate code. Mobx makes starting out projects really a breeze, but when things get pretty hard to clean up once side-effects are everywhere.

### Why setState is awesome... and why not sometimes

React is very well known for its `setState` function, and libraries like unstated mocks it to make mutating store states feel more natural.

In fact, since people are already used to only changing state data instead of making side-effects in `setState`, it really does make sense to do the same thing to global state management as well.

But there is still a problem where when you `setState`, you will eventually meet the 'spread hell':

{% code-tabs %}
{% code-tabs-item title="spread-hell.js" %}
```jsx
setState(state => ({
    deep: {
        ...state.deep,
        evenDeeper: {
            ...state.deep.evenDeeper,
            literally: 'hell' 
        }
    }
}))
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Reim.js tries to solve these issues that make state management uncomfortable.

