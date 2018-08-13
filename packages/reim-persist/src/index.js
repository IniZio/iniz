export default persist = (options = {}) => store => {
  const {setState} = store

  store.setState = (...args) => {
    console.log('hello setState')
    return setState.apply(store, args)
  }

  return store
}
