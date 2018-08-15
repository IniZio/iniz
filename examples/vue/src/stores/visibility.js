import {store} from 'reim'

export default store({
  visibility: 'closed'
})

export const mutations = {
  setVisibility: (state, payload) => {
    state.visibility = payload
  }
}
