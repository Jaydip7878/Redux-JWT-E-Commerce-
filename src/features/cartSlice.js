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
      const userData = action.payload.userData;
      console.log(action.payload, "userData here")
      const firstName = userData.firstName;
      const userId = userData.id || userData.username;
      const subtotal = state.totalPrice;

      const isAllGroceries = state.items.every((item) => item.category === "groceries");
      const taxRate = isAllGroceries ? 0.05 : 0.18;
      const tax = Number((subtotal * taxRate).toFixed(2));
      const grandTotal = Number((subtotal + tax).toFixed(2));

      const order = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        orderNumber: `ORD${Date.now().toString().slice(-8)}`,
        customerName: firstName,
        userId: userId,
        items: state.items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        subtotal: subtotal,
        tax: tax,
        grandTotal: grandTotal,
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
