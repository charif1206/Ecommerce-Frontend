import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {useQuery} from "@tanstack/react-query";
import {useParams, useNavigate, Link} from "react-router-dom";

// Fetch verification status
const fetchVerificationStatus = async (userId, token) => {
    try {
        const response = await axiosInstance.get(`/auth/${userId}/verify/${token}`);
        return response.data; // Return the data to React Query
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Verification failed");
    }
};

const VerifyEmail = () => {
    const {userId, token} = useParams();
    const navigate = useNavigate();
    // Retrieve the isEmailVerified state from your auth store
    const {isEmailVerified} = useAuthStore();
    // Handle fetching of verification status with React Query
    const {data, error, isLoading, isError} = useQuery({
        queryKey: ["verifyEmail", userId, token],
        queryFn: () => fetchVerificationStatus(userId, token),
        retry: 1,
    });

    // If email is already verified, redirect to login page
    if (isEmailVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 rounded-xl shadow-lg bg-white p-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Email already verified
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your email has already been verified. You can now proceed to login.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                        >
                            Proceed to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Redirect if userId or token is missing
    if (!userId || !token) {
        navigate("/error");
        return null;
    }

    // Handle loading, error, and success states
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="spinner-border text-blue-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        console.error(error); // Log the error for debugging
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">Error</h3>
                    <p>{error?.response?.data?.message || "An unexpected error occurred"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 rounded-xl shadow-lg bg-white p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {data?.message === "Email verified"
                            ? "Email Verified"
                            : "Verify Your Email"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {data?.message === "Email verified"
                            ? "You can now proceed to login."
                            : "Please check your email for the verification link."}
                    </p>
                </div>

                <div
                    className={`rounded-lg p-4 mt-6 ${
                        data?.message === "Email verified" ? "bg-green-50" : "bg-blue-50"
                    } border-2 border-solid ${
                        data?.message === "Email verified" ? "border-green-300" : "border-blue-300"
                    }`}
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className={`h-8 w-8 ${
                                    data?.message === "Email verified"
                                        ? "text-green-400"
                                        : "text-blue-400"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {data?.message === "Email verified" ? (
                                    <path
                                        fillRule="evenodd"
                                        d="M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm3.707-9.293a1 1 0 0 0-1.414-1.414L12 13.586 9.707 11.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l4-4z"
                                    />
                                ) : (
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zM11 16l-4-4h8l-4 4z" />
                                )}
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3
                                className={`text-sm font-medium ${
                                    data?.message === "Email verified"
                                        ? "text-green-800"
                                        : "text-blue-800"
                                }`}
                            >
                                {data?.message === "Email verified"
                                    ? "Email Verified"
                                    : "Verification Pending"}
                            </h3>
                            <p
                                className={`mt-2 text-sm ${
                                    data?.message === "Email verified"
                                        ? "text-green-700"
                                        : "text-blue-700"
                                }`}
                            >
                                {data?.message === "Email verified"
                                    ? "You can now log in to your account."
                                    : "Check your inbox and click the verification link to activate your account."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-center mt-4">
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                    >
                        {data?.message === "Email verified" ? "Proceed to Login" : "Back to Login"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
