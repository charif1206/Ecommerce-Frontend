import loginIllustration from "@/assets/Devices-bro.png";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {FcGoogle} from "react-icons/fc";
import {Link, useNavigate} from "react-router-dom";
import {z} from "zod";

import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import useCartStore from "@/zustand/cartStore";

// Zod validation schema for the form
const loginSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long")
        .nonempty("Password is required"),
});

export default function Login() {
    const setCartItems = useCartStore((state) => state.setCartItems);
    const setUser = useAuthStore((state) => state.setUser);
    const setTotalPrice = useCartStore((state) => state.setTotalPrice);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(loginSchema), // Zod validation for form
    });

    // React Query hook for login mutation
    const {mutate: login, isLoading} = useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post("/auth/login", data);
            return response.data;
        },
        onSuccess: async (data) => {
            // If the user is successfully logged in and verified
            if (data) {
                // Show success toast with user object, e.g. "Login successful"
                toast.success("Login successful!");

                // Store user data in Zustand and localStorage
                setUser(data);
                localStorage.setItem("userInfo", JSON.stringify(data));

                const response = await axiosInstance.get("/cart");
                localStorage.setItem("cartItems", JSON.stringify(response.data.items));
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
                // Redirect to home
                navigate("/");
            }
        },
        onError: (error) => {
            // Check if error response contains message from backend
            const errorMessage =
                error.response?.data?.message || error.message || "Login failed. Please try again.";

            // If the message is about verification link being sent
            if (
                error.response?.status === 400 &&
                error.response?.data?.message === "we sent a verification link to your email"
            ) {
                toast.info(error.response.data.message); // Info toast for email verification message
            } else {
                toast.error(errorMessage); // Error toast for invalid credentials or other errors
            }

            console.error("Error during login:", errorMessage);
        },
    });

    const onSubmit = (data) => {
        login(data);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-white p-12 items-center justify-center">
                <div className="max-w-[600px]">
                    <img
                        src={loginIllustration}
                        alt="Login Illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-slate-100 p-8 sm:p-12 flex items-center justify-center">
                <div className="w-full max-w-[440px] space-y-8">
                    {/* Logo */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">
                            <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
                                Das
                                <span className="text-2xl font-light text-gray-500 tracking-wide">
                                    Tech
                                    <span className="text-3xl font-black text-yellow-500">.</span>
                                </span>
                            </span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                {...register("email")} // Registering email field
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}{" "}
                            {/* Error message */}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                {...register("password")} // Registering password field
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}{" "}
                            {/* Error message */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            disabled={isLoading} // Disable when loading
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
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

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 shadow-inner bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle size={25} />
                            Continue With Google
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center text-gray-600">
                            Are You New?{" "}
                            <Link to="/register" className="text-gray-900 hover:underline">
                                Create An Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
