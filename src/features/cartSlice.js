import { createSlice } from "@reduxjs/toolkit";

const persistedOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
const initialState = {
  items: [],
  totalPrice: 0,
  orders: persistedOrders,
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
    placeOrder: (state, action) =>
    {
      const order = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        orderNumber: `ORD${Date.now().toString().slice(-8)}`,
        items: state.items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        subtotal: state.totalPrice,
        tax: Number((state.totalPrice * 0.1).toFixed(2)),
        grandTotal: Number((state.totalPrice * 1.1).toFixed(2)),
        placedAt: new Date().toISOString(),
        paymentId: action.payload.paymentId,
        status: 'Processing',
        trackingNumber: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
        statusHistory: [
          { status: 'Order Placed', date: new Date().toISOString() },
        ],
      };
      state.orders.unshift(order);
      state.items = [];
      state.totalPrice = 0;
      localStorage.setItem('orderHistory', JSON.stringify(state.orders));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, decreaseProductStock, placeOrder } = cartSlice.actions;
export default cartSlice.reducer;
