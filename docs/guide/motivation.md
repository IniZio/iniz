---
description: What and why Reim.js?
---

# Motivation

Creating the first library is for solving problems. Creating another similar library is for solving problems of the former. 

There are already hundreds o[f](https://github.com/IniZio/reim/blob/master/CHANGELOG.md) libraries for solving [state management](https://github.com/IniZio/reim/blob/master/CHANGELOG.md), but there are problems with them too:

### 1. Boilerplate / Overkill

**Redux** has been the go-to library when making big React projects for a long time, since it uses **Flux** concepts like actions and reducers. 

Problem though is that every single change of state needs to have that combination, which makes things pretty cumbersome. And the thing is, although **Redux** was made for **React**, you still need something called **react-redux** to actually use it.

Not to mention that for new learners, **Redux** seems like another language when they are still grasping how JSX works...

### 2. Side-Effect

**Mobx** became really popular recently, due to its reactivity and usage of ES7 decorators. In fact quite some developers have ditched **Redux** to **Mobx**.

However now everything seems like a side-effect, because it gets really tempting to have state changes in API calls, writing to storage, etc.

### 3. `{...}` Hell

Another problem that even `setState` has is that you will always see something like this:

```javascript
this.setState(state => ({
    deep: {
        ...state.deep,
        even: {
            ...state.deep.even,
            deeper: {
                justOne: 'simple change...'
            }
        }
    }
}))
```

Not to mention when you write reducers in **Redux**. 

**Reim** attempts to solve these problems by, well, making another library :\). 

