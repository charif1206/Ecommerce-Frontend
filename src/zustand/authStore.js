import {create} from "zustand";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
    isEmailVerified: false,

    setUser: (userData) => {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        set({user: userData});
    },

    setEmailVerified: () => {
        set({isEmailVerified: true});
    },
}));

export default useAuthStore;
