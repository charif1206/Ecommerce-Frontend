import {useMutation} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";

const useValidateCoupon = (setDiscount) => {
    return useMutation({
        mutationFn: ({code, cartTotal}) =>
            axiosInstance.post("/coupons/validate-coupon", {code, cartTotal}),
        onSuccess: (response) => {
            const data = response.data;
            console.log(data);
            // Convert discount value to a number explicitly
            setDiscount(Number(data.value));
            toast.dismiss();
            toast.success(data.message);
        },
        onError: (error) => {
            setDiscount(0);
            toast.dismiss();
            toast.error(error.response?.data?.error || "Invalid coupon code");
        },
    });
};

export default useValidateCoupon;
