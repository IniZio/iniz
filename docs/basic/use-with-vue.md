# Use with Vue

## ~~Immutability~~

Unlike React, Vue relies on reactivity system so you cannot use immutable system.

Therefore you can use `commit` method to mutate the state directly

```markup
<template>
    <div>
        <button @click="toggleVisiblity">{{state.visibility}}</button>
    </div>
</template>

<script>
import {store} from 'reim'

const toggles = store({visibility: 'closed'})

export default {
  data: () => toggles.state,
  methods: {
    toggleVisibility() {
      toggles.commit(state => {
        state.visibility = state.visibility === 'closed' ? 'opened' : 'closed'
      })
    }
  }
}
</script>
```

