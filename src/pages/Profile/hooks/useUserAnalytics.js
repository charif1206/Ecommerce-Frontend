import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";

export const useUserAnalytics = (userId, isAuthorized) => {
    return useQuery({
        queryKey: ["analytics", userId],
        queryFn: async () => {
            const response = await axiosInstance.get("/analytics");
            return response.data;
        },
        enabled: isAuthorized,
        staleTime: 5 * 60 * 1000,
    });
};
