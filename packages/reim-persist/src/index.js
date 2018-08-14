import merge from 'lodash/merge'

function canWriteStorage(storage) {
  try {
    storage.setItem('@@', 1)
    storage.removeItem('@@')
    return true
  } catch (e) {}

  return false
}

function getState(key, storage, value) {
  try {
    value = storage.getItem(key)
    return typeof value === 'undefined' ?
      undefined :
      JSON.parse(value)
  } catch (err) {}

  return undefined
}

function setState(key, state, storage) {
  return storage.setItem(key, JSON.stringify(state))
}

export default function persist(options = {}) {
  const storage = options.storage || (window && window.localStorage)

  if (!canWriteStorage(storage)) {
    throw new Error('Invalid storage given')
  }

  return {
    name: 'persist',
    call(store) {
      if (!store.name || (store.name.length <= 0)) {
        throw new Error('You cannot persist an anonymous store, use `name` option in store')
      }

      const key = `reim/${store.name}`
      const saved = getState(key, storage)
      if (typeof saved === 'object' && saved !== null) {
        store.setState(merge({}, store.state, saved))
      }

      store.subscribe(state => {
        setState(key, state, storage)
      }, {...options.subscriber, immediate: true})

      return store
    }
  }
}
