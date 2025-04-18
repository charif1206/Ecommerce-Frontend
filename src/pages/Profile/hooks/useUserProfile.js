import axiosInstance from "@/Axios/AxiosInstance";
import {useQuery} from "@tanstack/react-query";

export const useUserProfile = (userId) => {
    return useQuery({
        queryKey: ["users", "profile", userId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });
};
