import nanoid from 'nanoid'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import {store as register} from 'reim'

export const task = (func, subscriber) => {
  const id = nanoid()
  const store = register({status: 'initialized'}, {name: `$task/${id}`})

  if (isFunction(subscriber)) store.subscribe(subscriber)

  const task = async (...args) => {
    let result = null
    try {
      store.setState(() => ({status: 'pending'}))
      result = await func(...args)
      store.setState(() => ({status: 'resolved', result}))
      return result
    } catch (error) {
      store.setState(() => ({status: 'rejected', error}))
      throw error
    }
  }

  task.subscribe = store.subscribe

  return task
}

export default task
