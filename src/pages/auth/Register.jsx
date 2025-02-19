import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Eye, EyeOff} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {FcGoogle} from "react-icons/fc";
import {Link, useNavigate} from "react-router-dom";
import {z} from "zod";
import {toast} from "sonner"; // Add Sonner toaster import

import axiosInstance from "@/Axios/AxiosInstance";
import loginIllustration from "@/assets/Devices-bro.png";

// ✅ API function to register user
const registerUser = async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
};

// ✅ Validation Schema using Zod
const registerSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Use navigate for redirection

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    // ✅ React Query Mutation for registering a user
    const {
        mutate: registe,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success("Registration successful! Please check your email for verification.");
            navigate("/login"); // Redirect to login page after successful registration
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Registration failed. Please try again.";
            toast.error(errorMessage); // Show error toast
        },
    });

    const onSubmit = (data) => {
        const userData = {...data};
        delete userData.confirmPassword; // Remove confirmPassword explicitly
        registe(userData); // Trigger the mutation
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-white p-12 items-center justify-center">
                <div className="max-w-[600px]">
                    <img
                        src={loginIllustration}
                        alt="Register Illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 bg-slate-100 p-8 sm:p-12 flex items-center justify-center">
                <div className="w-full max-w-[440px] space-y-8">
                    {/* Logo */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">
                            das<span className="text-black font-thin ">tech</span>
                            <span className="text-yellow-500 font-black">.</span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                {...register("username")}
                                className="w-full px-4 py-3 shadow-inner rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="JohnDoe"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative space-y-2">
                            <label htmlFor="password" className="block text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-10 right-4 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Sign Up"}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        {/* Google Sign Up */}
                        <button
                            type="button"
                            className="w-full flex items-center shadow-inner justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle size={25} />
                            Continue With Google
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-gray-900 hover:underline">
                                Sign In
                            </Link>
                        </div>

                        {/* Show API Error */}
                        {isError && (
                            <p className="text-red-500 text-center mt-2">{error?.response?.data}</p>
                        )}

                        {/* Show Success Message */}
                        {isSuccess && (
                            <p className="text-green-500 text-center mt-2">
                                Registration successful! Check your email.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
