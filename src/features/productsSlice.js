import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"



  export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',async(_,thunkAPI)=>{
      try {
        const res =  await fetch('https://dummyjson.com/products?limit=100')
        const data = await res.json()
        // console.log(data.products)
        // localStorage.setItem('products',data.products)

        if(!res.ok){
          return thunkAPI.rejectWithValue("fail to fetch products")
        }
        return data.products
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
      }
    }
  )

  export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',async(id,thunkAPI)=>{
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`,{
        method:'DELETE'
        }
      )
       const data = await res.json()
             console.log(data)

       if(!res.ok){
        thunkAPI.rejectWithValue("fail to delete Products")
       }  
       console.log(id)
       return id
      } catch (error) {
        thunkAPI.rejectWithValue('network Error please try again')
      }
    }
  )

  export const  addProducts = createAsyncThunk(
    'products/addProducts',async(productsData,thunkAPI)=>{
      try {
        const res = await fetch('https://dummyjson.com/products/add',{
          method:'POST',
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify(productsData),
        })
        const data = await res.json()
        if(!res.ok){
        return   thunkAPI.rejectWithValue("add Data is failed ")
        }
        return data
      } catch (error) {
       return  thunkAPI.rejectWithValue('network issue')
      }
    }
  )

  export const updateProducts = createAsyncThunk(
    'products/updateProducts',async({id,...productsData},thunkAPI)=>{
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`,{
      method:'PUT',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify(productsData)
     })
     console.log(productsData)
     const data = await res.json()
     console.log(data)
     if(!res.ok){
      return thunkAPI.rejectWithValue('Products Update Failed')
     }
      return data
      } catch (error) {
        return thunkAPI.rejectWithValue('Network Error please Try again some time later')
      }
    })
  


    const initialState = {
      products:[],
      loading:false,
      error:null,
      successMsg:null,
      isFetched: false
    }

    const productsSlice = createSlice({
      name:'products',
      initialState,
      reducers:{
       clearError(state){
        state.error = null,
        state.successMsg = null
       },
        decreaseStock(state, action) {
          const { productId, quantity } = action.payload;
          const product = state.products.find((p) => p.id === productId);
          
          if (product && product.stock >= quantity) {
            product.stock -= quantity;
          }
        },
        increaseStock(state, action) {
          const { productId, quantity } = action.payload;
          const product = state.products.find((p) => p.id === productId);
          if (product) {
            product.stock += quantity;
          }
        }
      },
      extraReducers:(builder)=>{
          builder
          //Fetch Products
            .addCase(fetchProducts.pending,(state)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(fetchProducts.fulfilled,(state,action)=>{
              state.loading = false,
              state.products = action.payload,
              state.isFetched = true
              // localStorage.setItem('products',action.payload)
            })
            .addCase(fetchProducts.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })  

          //Delete Products
            .addCase(deleteProduct.pending,(state)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(deleteProduct.fulfilled,(state,action)=>{
              state.loading = false,
              state.products = state.products.filter(p=>p.id!==action.payload)
            })
            .addCase(deleteProduct.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })

          // Add Products
            .addCase(addProducts.pending,(state)=>{
              state.loading = true,
              state.erzzor = null
            })
            .addCase(addProducts.fulfilled,(state,action)=>{
              state.loading = false,
              state.products.push(action.payload)
              console.log(state.products,"for add")
              state.successMsg = 'Product add successfully'
            })
            .addCase(addProducts.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })
            //update Products
            .addCase(updateProducts.pending,(state)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(updateProducts.fulfilled,(state,action)=>{
              state.loading = false
              const index = state.products.findIndex((p)=>p.id===action.payload.id)
              if(index!==-1){
                state.products[index] = action.payload
              }
            })
            .addCase(updateProducts.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })
      }
    })

    export const { clearError, decreaseStock, increaseStock } = productsSlice.actions
    export default productsSlice.reducer