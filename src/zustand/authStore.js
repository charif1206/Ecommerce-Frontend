import {create} from "zustand";

// Store for managing authentication state
const useAuthStore = create((set) => ({
    // User information from localStorage or null
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
    // Email verification status
    isEmailVerified: false,

    // Update user state and persist to localStorage
    setUser: (userData) => {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        set({user: userData});
    },

    // Set email as verified
    setEmailVerified: () => {
        set({isEmailVerified: true});
    },
}));

export default useAuthStore;
