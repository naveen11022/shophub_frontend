import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('access_token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
