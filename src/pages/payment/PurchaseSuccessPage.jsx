import {ArrowRight, CheckCircle, HandHeart} from "lucide-react";
import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import Confetti from "react-confetti";
import {useMutation, useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";

const PurchaseSuccessPage = () => {
    const [clientError, setClientError] = useState();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const {data: order} = useQuery({
        queryKey: ["order", sessionId],
        queryFn: async () => {
            const data = await axiosInstance.get(`/orders/${sessionId}`);
            return data.data;
        },
    });

    const orderId = order ? order._id : null;
    console.log(order);

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: (sessionId) => {
            console.log(sessionId);

            axiosInstance.post("/payments/checkout-success", {sessionId});
        },
        onSuccess: () => localStorage.removeItem("cartItems"),
    });

    useEffect(() => {
        if (sessionId) {
            mutate(sessionId);
        } else {
            setClientError("No session ID found in the URL");
        }
    }, [mutate, sessionId]);

    if (clientError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-red-400 p-4 text-center">
                {clientError}
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-pulse text-emerald-400">Processing your order...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-red-400 p-4 text-center">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.15}
                numberOfPieces={800}
                recycle={false}
                className="!absolute"
            />

            <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative z-10 border border-gray-700">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative inline-flex">
                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                            <CheckCircle className="text-emerald-400 w-20 h-20" strokeWidth={1.5} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-emerald-400 mb-4">
                        Order Confirmed!
                    </h1>

                    <p className="text-gray-300 text-center mb-6 text-lg">
                        Your purchase was successful. We are preparing your order for shipment.
                    </p>

                    <div className="bg-gray-700/50 rounded-xl p-5 mb-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Order ID</span>
                            <span className="font-medium text-emerald-400">#{orderId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Estimated Delivery</span>
                            <span className="font-medium text-emerald-400">3-5 Days</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            className="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold py-3 px-6 
              rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <HandHeart className="w-5 h-5" />
                            Track Your Order
                        </button>

                        <Link
                            to="/"
                            className="w-full bg-gray-700 hover:bg-gray-600/80 text-emerald-400 font-semibold py-3 px-6 
              rounded-full transition-all duration-300 flex items-center justify-center gap-2"
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

export default PurchaseSuccessPage;
