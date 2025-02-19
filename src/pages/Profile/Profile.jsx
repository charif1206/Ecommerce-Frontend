import axiosInstance from "@/Axios/AxiosInstance";
import {FaBars, FaTimes} from "react-icons/fa";
import ManageProduct from "./ManageProduct";
import ProfileInformation from "./ProfileInformation";
import ProfileLikes from "./ProfileLikes";
import ProfileSecurity from "./ProfileSecurity";
import ProfileWishlist from "./ProfileWishlist";
import {useParams} from "react-router-dom";
import {useState} from "react";
import useAuthStore from "@/zustand/authStore";
import {useMutation} from "@tanstack/react-query";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./MnageOrders";

export default function Profile() {
    const {id: userId} = useParams();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [activeTab, setActiveTab] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {mutate: handleLogout, isLoading} = useMutation({
        mutationFn: async () => {
            await axiosInstance.post("/auth/logout"); // Call backend logout route
        },
        onSuccess: () => {
            logout(); // Clear user from Zustand and localStorage
        },
        onError: (error) => {
            console.error("Logout failed:", error.response?.data || error.message);
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden w-full bg-white p-4 sticky top-0 z-30 shadow-md">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center space-x-2 text-gray-600"
                >
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    <span>Menu</span>
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div
                    className={`
            fixed lg:sticky top-0 left-0 h-screen overflow-y-auto
            bg-white shadow-lg
            lg:w-64 w-64 
            transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 z-20
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
                >
                    <div className="h-full flex flex-col p-6">
                        <>
                            {/* Profile Tab */}
                            <button
                                onClick={() => {
                                    setActiveTab("profile");
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === "profile"
                                        ? "bg-gray-100 font-semibold"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                Profile
                            </button>

                            {/* Restricted Tabs (Visible Only to Profile Owner) */}
                            {user._id === userId && (
                                <>
                                    {/* Security Tab */}
                                    <button
                                        onClick={() => {
                                            setActiveTab("security");
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "security"
                                                ? "bg-gray-100 font-semibold"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        Security
                                    </button>

                                    {/* Products Tab (Conditional for Seller/Admin) */}
                                    {(user.roles === "seller" || user.roles === "admin") && (
                                        <button
                                            onClick={() => {
                                                setActiveTab("products");
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                                activeTab === "products"
                                                    ? "bg-gray-100 font-semibold"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            Products
                                        </button>
                                    )}

                                    {/* Orders Tab */}
                                    <button
                                        onClick={() => {
                                            setActiveTab("orders");
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "orders"
                                                ? "bg-gray-100 font-semibold"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        Orders
                                    </button>

                                    {/* Wishlist Tab */}
                                    <button
                                        onClick={() => {
                                            setActiveTab("wishlist");
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "wishlist"
                                                ? "bg-gray-100 font-semibold"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        Wishlist
                                    </button>

                                    {/* Likes Tab */}
                                    <button
                                        onClick={() => {
                                            setActiveTab("likes");
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                            activeTab === "likes"
                                                ? "bg-gray-100 font-semibold"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        Likes
                                    </button>

                                    {/* Users Tab (Admin Only) */}
                                    {user.roles === "admin" && (
                                        <button
                                            onClick={() => {
                                                setActiveTab("users");
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                                activeTab === "users"
                                                    ? "bg-gray-100 font-semibold"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            Users
                                        </button>
                                    )}

                                    {/* Delete Account Button */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 text-red-500 text-left hover:bg-red-50 rounded-lg transition-colors mt-auto"
                                    >
                                        Delete Account
                                    </button>
                                </>
                            )}
                        </>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {activeTab === "profile" && <ProfileInformation />}
                    {activeTab === "security" && <ProfileSecurity />}
                    {activeTab === "products" && <ManageProduct />}
                    {activeTab === "wishlist" && <ProfileWishlist />}
                    {activeTab === "likes" && <ProfileLikes />}
                    {activeTab === "orders" && <ManageOrders />}
                    {activeTab === "users" && <ManageUsers />}
                </div>
            </div>
        </div>
    );
}
