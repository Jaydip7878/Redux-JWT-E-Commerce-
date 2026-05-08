import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const savedUserData = JSON.parse(localStorage.getItem('userData') || 'null')
const ADMIN_CREDENTIALS = { username: 'Jaydip', password: 'Jaydippass' }
const ADMIN_TOKEN = 'admin-token'

const initialState = {
  token: localStorage.getItem('token') || null,
  loading: false,
  user: null,
  userData: savedUserData,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) =>
  {
    try {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminData = {
          firstName: 'Jaydip',
          lastName: 'Admin',
          username: 'Jaydip',
          email: 'admin@shopease.com',
          role: 'admin',
          image: 'https://via.placeholder.com/150?text=Jaydip',
        }

        localStorage.setItem('token', ADMIN_TOKEN)
        localStorage.setItem('userData', JSON.stringify(adminData))

        return { accessToken: ADMIN_TOKEN, userData: adminData }
      }

      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message)
      }

      const userData = { ...data, role: 'user' }
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('userData', JSON.stringify(userData))

      return { accessToken: data.accessToken, userData }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (token, thunkAPI) => {
    try {
      if (token === ADMIN_TOKEN) {
        const savedData = JSON.parse(localStorage.getItem('userData') || 'null')
        return (
          savedData || {
            firstName: 'Jaydip',
            lastName: 'Admin',
            username: 'Jaydip',
            email: 'admin@shopease.com',
            role: 'admin',
            image: 'https://via.placeholder.com/150?text=Jaydip',
          }
        )
      }

      const res = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message)
      }

      return { ...data, role: 'user' }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state)
    {
      state.token = null
      state.userData = null
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) =>
      {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) =>
      {
        state.loading = false
        state.token = action.payload.accessToken
        state.userData = action.payload.userData
      })
      .addCase(loginUser.rejected, (state, action) =>
      {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserData.pending, (state) =>
      {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) =>
      {
        state.loading = false
        state.userData = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) =>
      {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
