import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress:{}, paymentMethod:'PayPal', itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };

// export const addDecimals = (num) => {
//   return (Math.round(num * 100) / 100).toFixed(2);
// };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      console.log('Item to add:', item);

      // Ensure item has a valid quantity
      if (!item.qty || item.qty <= 0) {
        console.error('Invalid item quantity:', item.qty);
        return; // Exit if quantity is invalid
      }

      const existItem = state.cartItems.find((x) => x._id === item._id);
      console.log('Existing item:', existItem);

      if (existItem) {
        // Update the existing item
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + item.qty } : x
        );
      } else {
        // Add new item to the cart
        state.cartItems = [...state.cartItems, item];
      }

      console.log('Updated cart items:', state.cartItems);
      return updateCart(state);
     
    },
    removeFromCart:(state, action ) => 
        {
            state.cartItems = state.cartItems.filter((x)=> x._id !== action.payload);
    
            return updateCart(state);
        },
     saveShippingAddress: (state, action) => 
      {
        state.shippingAddress = action.payload;
        return updateCart(state);
      },
      savePaymentMethod: (state, action) => 
        {
          state.paymentMethod = action.payload;
          return updateCart(state);
        },
      clearCartItems: (state, action) => 
          {
            state.cartItems = [];
            return updateCart(state);
          }       
  }

});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, } = cartSlice.actions;

export default cartSlice.reducer;
