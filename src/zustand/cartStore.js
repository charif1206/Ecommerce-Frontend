// src/zustand/cartStore.js
import {create} from "zustand";

const useCartStore = create((set) => ({
    items: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    totalPrice: 0,
    setCartItems: (items) => set({items}),
    setTotalPrice: (totalPrice) => set({totalPrice}),
}));

export default useCartStore;
