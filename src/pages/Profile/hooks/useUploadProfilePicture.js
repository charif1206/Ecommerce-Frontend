import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

export const useUploadProfilePicture = (userId) => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("profilePicture", file);
            const response = await axiosInstance.post(
                `/users/${userId}/profile/upload-profile-picture`,
                formData
            );
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Profile picture updated successfully");
            queryClient.invalidateQueries(["users", "profile", userId]);

            const userResponse = await axiosInstance.get(`/users/${userId}`);
            setUser(userResponse.data);
            localStorage.setItem("userInfo", JSON.stringify(userResponse.data));
        },
        onError: (error) => {
            toast.error("Upload failed", {
                description: error.response?.data?.message || "Failed to upload profile picture",
            });
        },
    });
};
