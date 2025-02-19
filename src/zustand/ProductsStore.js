// src/store/productStore.js
import {create} from "zustand";

const useProductStore = create((set) => ({
    products: [],
    searchProducts: [],
    searchQuery: "", // Store search query
    setProducts: (products) => set({products}),
    setSearchQueryValue: (searchQuery) => set({searchQuery}), // Method to set search query
    setSearchProducts: (searchProducts) => set({searchProducts}),
}));

export default useProductStore;
