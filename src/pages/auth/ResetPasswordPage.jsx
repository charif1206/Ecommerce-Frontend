// src/pages/ResetPasswordPage.jsx
import axiosInstance from "@/Axios/AxiosInstance";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {toast} from "sonner";
import {z} from "zod";

const schema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

export default function ResetPasswordPage() {
    const {id, token} = useParams();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({resolver: zodResolver(schema)});

    const mutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post(
                `/password/reset-password/${id}/verify/${token}`,
                formData
            );
            console.log("API Response:", response);
            return response; // Make sure to return the response here
        },
        onSuccess: (data) => {
            console.log("Success callback triggered", data);
            toast.success("Password updated successfully! 🎉");
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || "Something went wrong.";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data) => mutation.mutate({password: data.password});

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        {...register("password")}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500">{errors.confirmPassword.message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
