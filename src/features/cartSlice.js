import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalPrice: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      // console.log(action.payload)

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
        console.log(state.items)
      }

      state.totalPrice = state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    decreaseProductStock: (state, action) => {
      // This action is handled by productsSlice, but can be triggered from cart
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalPrice = state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    

      state.totalPrice = state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, decreaseProductStock } = cartSlice.actions;
export default cartSlice.reducer;
