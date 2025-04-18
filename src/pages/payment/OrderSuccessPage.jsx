// Import necessary dependencies
import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import useCartStore from "@/zustand/cartStore";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ArrowRight, CheckCircle, Clock, Package, WalletCards} from "lucide-react";
import {useEffect, useState} from "react";
import Confetti from "react-confetti";
import {Link, useSearchParams} from "react-router-dom";

const OrderSuccessPage = () => {
    // State management
    const [clientError, setClientError] = useState(null); // Store client-side errors
    const [mounted, setMounted] = useState(false); // Track if component is mounted

    // Global state from Zustand stores
    const setUser = useAuthStore((state) => state.setUser); // Function to update user state
    const setCartItems = useCartStore((state) => state.setCartItems); // Function to update cart

    // Get session ID from URL query parameters
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    // Set mounted flag when component renders
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch order details from the API
    const {data: order, isLoading: orderLoading} = useQuery({
        queryKey: ["order", sessionId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/orders/${sessionId}`);
            return response.data;
        },
        enabled: !!sessionId, // Only run query if sessionId exists
    });

    const orderId = order?._id || "N/A"; // Extract order ID or use placeholder

    // Mutation to finalize the checkout process
    const {
        mutate,
        isLoading: mutationLoading,
        isError: mutationError,
        error: mutationErrorData,
    } = useMutation({
        mutationFn: (sessionId) => axiosInstance.post("/payments/checkout-success", {sessionId}),
        onSuccess: async () => {
            // Clear cart after successful checkout
            setCartItems([]);
            localStorage.removeItem("cartItems");

            // Mark session as processed to prevent duplicate processing
            localStorage.setItem(`checkoutProcessed_${sessionId}`, "true");

            // Fetch and update user data with new order information
            const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
            const userId = storedUserInfo?._id;
            if (userId) {
                try {
                    const userResponse = await axiosInstance.get(`/users/${userId}`);
                    setUser(userResponse.data);
                    console.log("User data:", userResponse.data);
                    localStorage.setItem("userInfo", JSON.stringify(userResponse.data));
                } catch (err) {
                    console.error("Error fetching updated user data", err);
                }
            }
        },
    });

    // Process order when component mounts
    useEffect(() => {
        if (!mounted) return;
        if (sessionId) {
            // Prevent duplicate processing by checking localStorage
            const processed = localStorage.getItem(`checkoutProcessed_${sessionId}`);
            if (!processed) {
                mutate(sessionId);
            }
        } else {
            setClientError("No session ID found in the URL.");
        }
    }, [mounted, sessionId, mutate]);

    // Conditional rendering based on different states
    if (clientError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 p-4 text-center">
                {clientError}
            </div>
        );
    }

    if (mutationLoading || orderLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600 text-lg font-medium animate-pulse">
                    Processing your order...
                </div>
            </div>
        );
    }

    if (mutationError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 p-4 text-center">
                Error: {mutationErrorData?.message || "An unexpected error occurred."}
            </div>
        );
    }

    // Success page UI
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Celebration confetti effect */}
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.2}
                numberOfPieces={400}
                recycle={false}
                colors={["#10B981", "#059669", "#047857"]}
                className="!absolute"
            />

            {/* Order confirmation card */}
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-10 border border-gray-200">
                <div className="p-8 space-y-6">
                    {/* Success header */}
                    <div className="flex flex-col items-center mb-6 space-y-4">
                        <div className="relative inline-flex">
                            <div className="absolute inset-0 rounded-full bg-green-100" />
                            <CheckCircle
                                className="relative z-10 text-green-600 w-20 h-20"
                                strokeWidth={1.5}
                            />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>

                        <p className="text-gray-600 text-center text-lg">
                            Your order is being processed. A confirmation has been sent to your
                            email.
                        </p>
                    </div>

                    {/* Order details section */}
                    <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <WalletCards className="w-5 h-5 text-gray-800" />
                            <div className="flex-1 flex justify-between">
                                <span className="text-gray-600">Order ID</span>
                                <span className="font-medium text-gray-800">#{orderId}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-800" />
                            <div className="flex-1 flex justify-between">
                                <span className="text-gray-600">Delivery Estimate</span>
                                <span className="font-medium text-gray-800">2-4 Business Days</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-800" />
                            <div className="flex-1 flex justify-between">
                                <span className="text-gray-600">Items</span>
                                <span className="font-medium text-gray-800">
                                    {order?.products?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-4">
                        <Link
                            to="/shop"
                            className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                        >
                            Continue Shopping
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
