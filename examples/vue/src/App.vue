<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <button @click="toggleVisibility">{{state.visibility}}</button>
  </div>
</template>

<script>
import visibilityStore, {mutations} from './stores/visibility'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data: () => ({
    state: visibilityStore.state
  }),
  methods: {
    toggleVisibility() {
      visibilityStore.commit(state => {
        state.visibility = state.visibility === 'closed' ? 'opened' : 'closed'
      })
      console.log('visibility: ', visibilityStore.state)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
