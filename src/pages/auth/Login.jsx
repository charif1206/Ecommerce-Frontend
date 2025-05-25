// Login page for user authentication and handling login logic
import loginIllustration from "@/assets/Devices-bro.png";
import axiosInstance from "@/Axios/AxiosInstance";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import useAuthStore from "@/zustand/authStore";
import useCartStore from "@/zustand/cartStore";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {z} from "zod";

// Validation schema for login form
const loginSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z
        .string()
        .min(6, "Password should be at least 6 characters long")
        .nonempty("Password is required"),
});

export default function Login() {
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    // Zustand store actions for cart and user
    const setCartItems = useCartStore((state) => state.setCartItems);
    const setUser = useAuthStore((state) => state.setUser);
    const setTotalPrice = useCartStore((state) => state.setTotalPrice);
    const navigate = useNavigate();

    // React Hook Form setup
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Mutation for login API call
    const {mutate: login, isPending} = useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post("/auth/login", data);
            return response.data;
        },
        onSuccess: async (data) => {
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            const response = await axiosInstance.get("/cart");
            localStorage.setItem("cartItems", JSON.stringify(response.data.items));
            setCartItems(response.data.items);
            setTotalPrice(response.data.totalPrice);
            navigate("/");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            if (error.response?.status === 400 && errorMessage.includes("verification")) {
                toast.info(errorMessage);
            } else {
                toast.error(errorMessage);
            }
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="block text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full px-4 py-4 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <FormLabel className="block text-gray-700">
                                                Password
                                            </FormLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-gray-600 hover:text-blue-600"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    className="w-full px-4 py-4 rounded-lg border shadow-inner border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400"
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

                            {/* Sign In Button with Loading Animation */}
                            <Button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            {/* Sign Up Link */}
                            <div className="text-center text-gray-600">
                                Are You New?{" "}
                                <Link to="/register" className="text-gray-900 hover:underline">
                                    Create An Account
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
