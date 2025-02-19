// src/pages/ForgotPasswordPage.jsx
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {z} from "zod";
import {toast} from "sonner";
import axiosInstance from "@/Axios/AxiosInstance";

const schema = z.object({
    email: z.string().email("Invalid email format"),
});

export default function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({resolver: zodResolver(schema)});

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await axiosInstance.post("/password/reset-password", data);
        },
        onSuccess: () => {
            toast.success("Check your email for the reset link.");
        },
        onError: (error) => {
            console.log(error);

            const errorMessage = error?.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data) => mutation.mutate(data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
