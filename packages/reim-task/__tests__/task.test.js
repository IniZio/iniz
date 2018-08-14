import Storage from 'dom-storage'
import {store} from 'reim'
import task from '../src'

test('triggers hook throughout the process', async () => {
  const tstore = store({
    abc: 12
  }, {
    name: 'xyz',
    plugins: [
      task()
    ]
  })

  const subscriber1 = jest.fn()
  const subscriber2 = jest.fn()

  const testTask = task(() => {
    return 'resolved task'
  }, subscriber1)

  testTask.subscribe(subscriber2)

  await testTask()

  expect(subscriber1).toBeCalledWith({status: 'pending'})
  expect(subscriber1).toBeCalledWith({status: 'resolved', result: 'resolved task'})

  expect(subscriber2).toHaveBeenCalledTimes(2)

  const subscriber3 = jest.fn()
  const failTask = task(() => {throw new Error('woops')}, subscriber3)
  try {
    await failTask()
  } catch (e) {
    // Once for pending, once for rejected
    expect(subscriber3).toHaveBeenCalledTimes(2)
  }
})
