// src/store/productStore.js
import {create} from "zustand";

// Store for managing product data and search functionality
const useProductStore = create((set) => ({
    // Array holding all available products
    products: [],
    // Array holding products filtered by search
    searchProducts: [],
    // Update the products array

    setProducts: (products) => set({products}),
    // Search query value
    searchQuery: "",
    // Update the search query value
    setSearchQueryValue: (searchQuery) => set({searchQuery}),
    // Update the filtered search products
    setSearchProducts: (searchProducts) => set({searchProducts}),
}));

export default useProductStore;
