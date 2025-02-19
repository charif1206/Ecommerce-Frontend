import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {useQuery} from "@tanstack/react-query";
import {DollarSign, Package, ShoppingCart, Users} from "lucide-react";
// import {useState} from "react";
import {useParams} from "react-router-dom";
import {motion} from "framer-motion"; // For animations
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function ProfileInformation() {
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const {id: userId} = useParams();

    // Query for user profile
    const {data: user} = useQuery({
        queryKey: ["users", "profile", userId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });

    // Only fetch analytics if the logged-in user is viewing their own profile
    // and their role is either "admin" or "seller".
    const isAuthorized =
        authUser &&
        userId &&
        authUser._id === userId &&
        (authUser.roles === "admin" || authUser.roles === "seller");

    console.log("isAuthorized", isAuthorized);

    // Query for analytics (only runs if authorized)
    const {data: analyticsResponse} = useQuery({
        queryKey: ["analytics", userId],
        queryFn: async () => {
            const response = await axiosInstance.get("/analytics");
            return response.data;
        },
        enabled: isAuthorized,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Use default values if analytics data is missing
    const analyticsData = analyticsResponse?.analyticsData || {
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    };
    const dailySalesData = analyticsResponse?.dailySalesData || [];

    // Local state for editing profile info (for the modal)
    // const [userInfo, setUserInfo] = useState({
    //     fullName: "Youssef Ait",
    //     role: "Seller",
    //     phone: "0699999999",
    //     email: "test009@gmail.com",
    // });

    // Derived profile values
    const userName = user?.username || "Unknown";
    const userProfilePicture = user?.profilePicture?.url || "";
    const userEmail = user?.email || "";
    const userPhone = user?.phone || "/";

    // Handle Edit Profile form submission
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setIsEditModalOpen(false);
    //     // Handle form submission logic here
    // };

    return (
        <div>
            {/* Main Content */}
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    {/* Show Upgrade button only if the auth user is not already a seller */}
                    {authUser.roles === "customer" && authUser?._id === userId && (
                        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Upgrade to Seller
                        </button>
                    )}
                </div>

                {/* Profile Information Card */}
                <div className="max-w mx-auto p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center md:space-x-6 border-b border-gray-200 pb-6 mb-6">
                            {/* Avatar */}
                            <Avatar className="h-16 w-16 rounded-full border-2 border-gray-300">
                                <AvatarImage
                                    src={userProfilePicture}
                                    alt={userName}
                                    className="h-full w-full object-cover rounded-full"
                                />
                                <AvatarFallback className="bg-gray-200 text-gray-600 font-medium h-full w-full flex items-center justify-center rounded-full">
                                    {userName?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="mt-4 md:mt-0 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-gray-900">{userName}</h2>
                                <p className="text-sm text-gray-500 capitalize">
                                    {user?.roles || "User"}
                                </p>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Personal Information
                                </h2>
                                {authUser._id === userId && (
                                    <button
                                        // onClick={() => setIsEditModalOpen(true)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">Phone</label>
                                    <p className="mt-1 text-gray-800">{userPhone}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600">Email</label>
                                    <p className="mt-1 text-gray-800">{userEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Cards and Rechart */}
            {isAuthorized && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {analyticsResponse && (
                            <>
                                {authUser.roles === "admin" && (
                                    <AnalyticsCard
                                        title="Total Users"
                                        value={analyticsData.users.toLocaleString()}
                                        icon={Users}
                                        color="from-emerald-500 to-teal-700"
                                    />
                                )}
                                <AnalyticsCard
                                    title="Total Products"
                                    value={analyticsData.products.toLocaleString()}
                                    icon={Package}
                                    color="from-emerald-500 to-green-700"
                                />
                                <AnalyticsCard
                                    title="Total Sales"
                                    value={analyticsData.totalSales.toLocaleString()}
                                    icon={ShoppingCart}
                                    color="from-emerald-500 to-cyan-700"
                                />
                                <AnalyticsCard
                                    title="Total Revenue"
                                    value={`$${analyticsData.totalRevenue.toLocaleString()}`}
                                    icon={DollarSign}
                                    color="from-emerald-500 to-lime-700"
                                />
                            </>
                        )}
                    </div>
                    <motion.div
                        className="hidden md:block bg-white rounded-lg p-6 shadow-lg"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.25}}
                    >
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={dailySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="date" stroke="#374151" />
                                <YAxis yAxisId="left" stroke="#374151" />
                                <YAxis yAxisId="right" orientation="right" stroke="#374151" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10B981"
                                    activeDot={{r: 8}}
                                    name="Sales"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3B82F6"
                                    activeDot={{r: 8}}
                                    name="Revenue"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

const AnalyticsCard = ({title, value, icon: Icon, color}) => (
    <motion.div
        className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
    >
        <div className="flex justify-between items-center">
            <div className="z-10">
                <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
                <h3 className="text-white text-3xl font-bold">{value}</h3>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
        <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
            <Icon className="h-32 w-32" />
        </div>
    </motion.div>
);

// {isEditModalOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-md p-6">
//           <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Edit Profile</h2>
//               <button
//                   onClick={() => setIsEditModalOpen(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                   ×
//               </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name
//                   </label>
//                   <input
//                       type="text"
//                       value={userName}
//                       onChange={(e) =>
//                           setUserInfo({...userInfo, fullName: e.target.value})
//                       }
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//               </div>

//               <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Role
//                   </label>
//                   <input
//                       type="text"
//                       value={user?.roles}
//                       onChange={(e) =>
//                           setUserInfo({...userInfo, role: e.target.value})
//                       }
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//               </div>

//               <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Phone Number
//                   </label>
//                   <input
//                       type="tel"
//                       value={userPhone}
//                       onChange={(e) =>
//                           setUserInfo({...userInfo, phone: e.target.value})
//                       }
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//               </div>

//               <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                   </label>
//                   <input
//                       type="email"
//                       value={userEmail}
//                       onChange={(e) =>
//                           setUserInfo({...userInfo, email: e.target.value})
//                       }
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//               </div>

//               <div className="flex justify-end space-x-4 pt-4">
//                   <button
//                       type="button"
//                       onClick={() => setIsEditModalOpen(false)}
//                       className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                   >
//                       Cancel
//                   </button>
//                   <button
//                       type="submit"
//                       className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
//                   >
//                       Save Changes
//                   </button>
//               </div>
//           </form>
//       </div>
//   </div>
// )}
