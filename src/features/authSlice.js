import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem('token') || null,
  loading:false,
  user:null,
  userData: null
}



export const  loginUser =createAsyncThunk('auth/loginUser' ,
  async ({username,password},thunkAPI) => {

  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      }),
    })
    

    const data = await res.json()

    console.log(data.accessToken)

    if (!res.ok) {
      return thunkAPI.rejectWithValue(data.message)
    }
    
    
    localStorage.setItem('token', data.accessToken)

    return data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
}
)

export const fetchUserData = createAsyncThunk('auth/fetchUserData',
  async (token, thunkAPI) => {
    try {
      const res = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      const data = await res.json()

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message)
      }

      return data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers : {
    logout(state){
      state.token = null
      state.userData = null
      localStorage.removeItem('token')
    }
  },
  extraReducers: (builder) => {
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload.accessToken
      localStorage.setItem('token', action.payload.accessToken)
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase(fetchUserData.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading = false
      state.userData = action.payload
    })
    .addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  }
})

export const {logout} = authSlice.actions

export default authSlice.reducer
