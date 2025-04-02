import {useEffect, useState} from "react";
import {useQueryClient, useMutation, useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {DollarSign, Loader2Icon, Package, ShoppingCart, Users} from "lucide-react";
import {useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function ProfileInformation() {
    const authUser = useAuthStore((state) => state.user);
    const {id: userId} = useParams();
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    // Query for user profile
    const {data: user} = useQuery({
        queryKey: ["users", "profile", userId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });

    const {mutate: uploadProfilePicture, isPending: isUploading} = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("profilePicture", file);
            const response = await axiosInstance.post(
                `/users/${userId}/profile/upload-profile-picture`,
                formData
            );
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Profile picture updated successfully");
            queryClient.invalidateQueries(["users", "profile", userId]);

            const userResponse = await axiosInstance.get(`/users/${userId}`);
            setUser(userResponse.data);
            console.log("User data:", userResponse.data);

            localStorage.setItem("userInfo", JSON.stringify(userResponse.data));
        },
        onError: (error) => {
            toast.error("Upload failed", {
                description: error.response?.data?.message || "Failed to upload profile picture",
            });
        },
    });

    // Seller upgrade mutation
    const {mutate: initiateUpgrade, isPending: isUpgrading} = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post("/payments/create-seller-upgrade");
            return response.data;
        },
        onSuccess: (data) => {
            window.location.href = data.url;
        },
        onError: (error) => {
            toast.error(
                `Upgrade Failed: ${error.response?.data?.error || "Failed to initiate upgrade"}`
            );
        },
    });

    // Phone number validation
    const validatePhoneNumber = (phone) => {
        return /^\+?[1-9]\d{9,14}$/.test(phone); // Ensures 10-15 digits with optional "+"
    };

    // Phone number update mutation
    const {mutate: updatePhoneNumber, isPending: isUpdatingPhone} = useMutation({
        mutationFn: async (newPhone) => {
            const response = await axiosInstance.put(`/users/${userId}/update-phone`, {
                phoneNumber: newPhone,
            });
            return response.data;
        },
        onSuccess: async () => {
            toast.success("Phone number updated successfully");
            setIsDialogOpen(false);

            // Update user in global state and localStorage
            const userResponse = await axiosInstance.get(`/users/${userId}`);
            setUser(userResponse.data);
            localStorage.setItem("userInfo", JSON.stringify(userResponse.data));

            // Invalidate the user profile query to refetch the latest data
            queryClient.invalidateQueries(["users", "profile", userId]);
        },
        onError: (error) => {
            toast.error("Failed to update phone number", {
                description: error.response?.data?.message || "An error occurred",
            });
        },
    });

    // Analytics authorization check
    const isAuthorized =
        authUser &&
        userId &&
        authUser._id === userId &&
        (authUser.roles === "admin" || authUser.roles === "seller");

    // When authUser changes to an authorized role, refetch analytics.
    useEffect(() => {
        if (authUser && (authUser.roles === "seller" || authUser.roles === "admin")) {
            queryClient.invalidateQueries(["analytics", userId]);
        }
    }, [authUser, queryClient, userId]);

    // Analytics query
    const {data: analyticsResponse} = useQuery({
        queryKey: ["analytics", userId],
        queryFn: async () => {
            const response = await axiosInstance.get("/analytics");
            return response.data;
        },
        enabled: isAuthorized,
        staleTime: 5 * 60 * 1000,
    });

    // Derived values
    const analyticsData = analyticsResponse?.analyticsData || {
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    };
    const dailySalesData = analyticsResponse?.dailySalesData || [];
    const userName = user?.username || "Unknown";
    const userProfilePicture = user?.profilePicture?.url || "";
    const userEmail = user?.email || "";

    const [phone, setPhone] = useState("");
    useEffect(() => {
        if (user?.phoneNumber) {
            setPhone(user.phoneNumber);
        } else {
            const storedUser = localStorage.getItem("userInfo");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setPhone(parsedUser.phoneNumber || "");
                } catch (error) {
                    console.error("Failed to parse stored user info:", error);
                }
            }
        }
    }, [user]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSavePhone = () => {
        if (!validatePhoneNumber(phone)) {
            console.log("Validation failed - stopping execution.");
            toast.error("Invalid phone number", {
                description: "Please enter a valid phone number (e.g., +12345678901).",
            });
            return; // Stop execution
        }

        updatePhoneNumber(phone); // Call mutation only if validation passes
    };

    return (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    {authUser.roles === "customer" && authUser?._id === userId && (
                        <Button
                            onClick={() => initiateUpgrade()}
                            disabled={isUpgrading}
                            className="gap-2"
                        >
                            {isUpgrading ? "Processing..." : "Upgrade to Seller"}
                        </Button>
                    )}
                </div>

                {/* Profile Information Card */}
                <div className="max-w mx-auto p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row md:space-x-6 border-b border-gray-200 pb-6 mb-6">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24 rounded-full border-2 border-gray-300">
                                    <AvatarImage
                                        src={userProfilePicture}
                                        alt={userName}
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                    <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-2xl">
                                        {userName?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {authUser._id === userId && (
                                    <div className="flex flex-col items-center gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="avatar-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadProfilePicture(file);
                                            }}
                                            disabled={isUploading}
                                        />
                                        <Button variant="outline" className="w-full" asChild>
                                            <label
                                                htmlFor="avatar-upload"
                                                className="cursor-pointer"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        uploading{" "}
                                                        <Loader2Icon className="animate-spin" />
                                                    </>
                                                ) : (
                                                    "Change Picture"
                                                )}
                                            </label>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 md:mt-0 text-center md:text-left">
                                <h2 className="text-2xl font-semibold text-gray-900">{userName}</h2>
                                <p className="text-sm text-gray-500 capitalize">
                                    {user?.roles || "User"}
                                </p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Personal Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">
                                            Phone
                                        </label>
                                        <p className="mt-1 text-gray-800">{phone}</p>
                                    </div>
                                    {authUser._id === userId && (
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Phone Number</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label
                                                            htmlFor="phone"
                                                            className="text-right"
                                                        >
                                                            Phone
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            value={phone}
                                                            onChange={(e) =>
                                                                setPhone(e.target.value)
                                                            }
                                                            className="col-span-3"
                                                            placeholder="+12345678901"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={handleSavePhone}
                                                        disabled={isUpdatingPhone}
                                                    >
                                                        {isUpdatingPhone ? "Saving..." : "Save"}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600">
                                        Email
                                    </label>
                                    <p className="mt-1 text-gray-800">{userEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
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
