// Import necessary dependencies and components
import axiosInstance from "@/Axios/AxiosInstance";
import {Button} from "@/components/ui/button";
import useAuthStore from "@/zustand/authStore";
import {useMutation} from "@tanstack/react-query";
import {CheckCircle, Store, WalletCards} from "lucide-react";
import {useEffect} from "react";
import Confetti from "react-confetti";
import {Link, useSearchParams} from "react-router-dom";
import {toast} from "sonner";

export default function SellerUpgradeSuccessPage() {
    // Get session ID from URL parameters
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    // Access global authentication state
    const authUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const userId = authUser?._id;

    // Mutation to confirm seller upgrade payment
    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: (id) => axiosInstance.post("/payments/checkout-success", {sessionId: id}),
        onSuccess: async () => {
            // After successful upgrade, fetch updated user data with seller role
            if (!userId) return;
            const {data: user} = await axiosInstance.get(`/users/${userId}`);
            // Update local user state and storage
            setUser(user);
            localStorage.setItem("userInfo", JSON.stringify(user));
            toast.dismiss();
            toast.success("Upgrade Successful! Your seller account has been activated");
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(
                `Upgrade Failed: ${error.response?.data?.error || "Failed to complete upgrade"}`
            );
        },
    });

    // Process payment on component mount if session ID exists
    useEffect(() => {
        if (sessionId && sessionId !== "") {
            mutate(sessionId);
        }
    }, [sessionId, mutate]);

    // Show loading screen if session ID is still loading
    if (sessionId === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600 text-lg font-medium animate-pulse">
                        Loading session data...
                    </p>
                </div>
            </div>
        );
    }

    // Show error if no session ID was found in URL
    if (sessionId === "") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">Invalid Session</h1>
                    <p className="text-gray-600">
                        No payment session detected. Please try upgrading again.
                    </p>
                    <Button asChild>
                        <Link to="/profile">Return to Profile</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Show loading and error states during payment processing
    if (isPending) return <LoadingDisplay />;
    if (isError) return <ErrorDisplay message={error.message} />;

    // Success page display
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Celebration animation */}
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.2}
                numberOfPieces={400}
                recycle={false}
                colors={["#10B981", "#059669", "#047857"]}
                className="!absolute"
            />
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-10 border border-gray-200">
                <div className="p-8 space-y-6">
                    {/* Success header with icon */}
                    <div className="flex flex-col items-center mb-6 space-y-4">
                        <div className="relative inline-flex">
                            <div className="absolute inset-0 rounded-full bg-green-100" />
                            <CheckCircle
                                className="relative z-10 text-green-600 w-20 h-20"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Seller Account Activated
                        </h1>
                        <p className="text-gray-600 text-center text-lg">
                            You now have access to exclusive seller features and your dashboard.
                        </p>
                    </div>

                    {/* Feature list section */}
                    <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Store className="w-5 h-5 text-gray-800" />
                            <span className="text-gray-600">Seller Privileges Activated</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <WalletCards className="w-5 h-5 text-gray-800" />
                            <span className="text-gray-600">Premium Seller Features Unlocked</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-gray-800" />
                            <span className="text-gray-600">Priority Support Enabled</span>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="space-y-4">
                        <Link
                            to={`/profile/${userId}`}
                            className="w-full border-2 border-gray-900 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                        >
                            Return to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading component for processing state
const LoadingDisplay = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
            Finalizing your upgrade...
        </div>
    </div>
);

// Error component for failed payments
const ErrorDisplay = ({message}) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 p-4 text-center">
        Error: {message || "Failed to complete upgrade"}
    </div>
);
