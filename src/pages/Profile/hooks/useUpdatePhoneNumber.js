import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useUpdatePhoneNumber = (userId, setIsDialogOpen) => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: async (newPhone) => {
            const response = await axiosInstance.put(`/users/${userId}/update-phone`, {
                phoneNumber: newPhone,
            });
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Phone number updated successfully");
            setIsDialogOpen(false);

            const userResponse = await axiosInstance.get(`/users/${userId}`);
            setUser(userResponse.data);
            localStorage.setItem("userInfo", JSON.stringify(userResponse.data));

            queryClient.invalidateQueries(["users", "profile", userId]);
        },
        onError: (error) => {
            toast.error("Failed to update phone number", {
                description: error.response?.data?.message || "An error occurred",
            });
        },
    });
};
