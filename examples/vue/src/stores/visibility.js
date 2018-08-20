import reim from 'reim'

export default reim({
  visibility: 'closed'
})

export const mutations = {
  setVisibility: (state, payload) => {
    state.visibility = payload
  }
}
