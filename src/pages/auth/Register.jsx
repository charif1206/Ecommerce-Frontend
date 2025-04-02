import axiosInstance from "@/Axios/AxiosInstance";
import loginIllustration from "@/assets/Devices-bro.png";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

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
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {mutate: registerUser, isPending} = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/register", userData),
        onSuccess: () => {
            toast.success("Registration successful! Please check your email for verification.");
            navigate("/login");
        },
        onError: (error) => {
            const errorMessage = error?.response?.data || "Registration failed. Please try again.";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data) => {
        // eslint-disable-next-line no-unused-vars
        const {confirmPassword, ...userData} = data;
        registerUser(userData);
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
                <div className="w-full max-w-sm space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">
                            <span className="text-gray-900">Das</span>
                            <span className="text-gray-500">Tech</span>
                            <span className="text-yellow-500">.</span>
                        </h1>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-white shadow-inner focus:ring-2 focus:ring-blue-500"
                                                placeholder="JohnDoe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-white shadow-inner focus:ring-2 focus:ring-blue-500"
                                                placeholder="john@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    className="bg-white shadow-inner focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-6 w-6"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-white shadow-inner focus:ring-2 focus:ring-blue-500"
                                                placeholder="Confirm your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center gap-2"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-100 text-gray-500">Or</span>
                                </div>
                            </div>

                            {/* Google Sign Up */}
                            <Button
                                variant="outline"
                                className="w-full shadow-inner hover:bg-gray-50"
                            >
                                <FcGoogle className="mr-2 h-5 w-5" />
                                Continue With Google
                            </Button>

                            {/* Sign In Link */}
                            <div className="text-center text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-gray-900 hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
