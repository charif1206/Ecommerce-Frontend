// src/zustand/cartStore.js
// Store for managing shopping cart state
import {create} from "zustand";

const useCartStore = create((set) => ({
    // Cart items from localStorage or empty array
    items: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    // Total price of items in cart
    totalPrice: 0,
    // Update cart items
    setCartItems: (items) => set({items}),
    // Update total price
    setTotalPrice: (totalPrice) => set({totalPrice}),
}));

export default useCartStore;
