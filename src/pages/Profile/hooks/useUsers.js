import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await axiosInstance.get("/users");
            return response.data;
        },
    });
};
