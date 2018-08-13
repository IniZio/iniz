import merge from 'lodash/merge'

function getState(key, storage, value) {
  try {
    return (value = storage.getItem(key)) && typeof value !== 'undefined'
      ? JSON.parse(value)
      : undefined;
  } catch (err) {}

  return undefined;
}

function setState(key, state, storage) {
  return storage.setItem(key, JSON.stringify(state));
}

export default function persist(options = {}) {
  const storage = options.storage || (window && window.localStorage)
  const key = `reim/${options.key}`

  return {
    name: 'persist',
    apply(store) {
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
