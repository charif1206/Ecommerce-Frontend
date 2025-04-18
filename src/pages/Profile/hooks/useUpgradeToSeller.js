import axiosInstance from "@/Axios/AxiosInstance";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

export const useUpgradeToSeller = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post("/payments/create-seller-upgrade");
            return response.data;
        },
        onSuccess: (data) => {
            window.location.href = data.url;
        },
        onError: (error) => {
            toast.error(
                `Upgrade Failed: ${error.response?.data?.error || "Failed to initiate upgrade"}`
            );
        },
    });
};
