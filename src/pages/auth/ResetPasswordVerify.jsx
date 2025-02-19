// src/pages/ResetPasswordVerify.jsx
import axiosInstance from "@/Axios/AxiosInstance";
import {useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";

export default function ResetPasswordVerify() {
    const {id, token} = useParams();
    const navigate = useNavigate();

    const {isLoading, isError} = useQuery({
        queryKey: ["verifyResetPassword", id, token],
        queryFn: () => axiosInstance.get(`/password/reset-password/${id}/verify/${token}`),
        retry: 0,
    });

    if (isLoading) return <p className="text-center text-lg text-gray-700">Verifying...</p>;

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-6 bg-red-100 border border-red-500 rounded-lg shadow-md">
                    <p className="text-red-600 font-semibold text-center">
                        Oops! It looks like the link is invalid or has expired. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center">Link Verified ✅</h2>
                <p className="text-center">You can now reset your password.</p>
                <button
                    onClick={() => navigate(`/reset-password/${id}/${token}`)}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
                >
                    Proceed to Reset
                </button>
            </div>
        </div>
    );
}
