import React from 'react'
import {connect, State} from 'react-reim'

import auth from '../stores/auth'

const Profile = ({setProfile, profile}) => (
  <State initial={{editting: true, form: profile}}>
    {
      ({editting, form}, {set}) => (
        <div>
          {
            editting ?
              <input
                value={form.name}
                onChange={e => set(({form}) => {form.name = e.target.value})}
              /> :
              <div>{form.name}</div>
          }
          <button onClick={() => {
            set({editting: !editting})
            setProfile(form)
          }}>Save</button>
        </div>
      )
    }
  </State>
)

export default connect(
  auth,
  s => ({profile: s.profile}),
  ({set}) => ({
    async setProfile(profile) {
      set(state => {
        state.profile = {...profile}
      })
    }
  })
)(Profile)
