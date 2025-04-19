// ProfileInformation page displays user profile, allows editing phone, uploading profile picture, and upgrading to seller
// Import UI components and icons
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import useAuthStore from "@/zustand/authStore";
import {DollarSign, Loader2Icon, Package, ShoppingCart, Users} from "lucide-react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "sonner";

// Import custom hooks for profile functionality
import {useUpdatePhoneNumber} from "./hooks/useUpdatePhoneNumber";
import {useUpgradeToSeller} from "./hooks/useUpgradeToSeller";
import {useUploadProfilePicture} from "./hooks/useUploadProfilePicture";
import {useUserAnalytics} from "./hooks/useUserAnalytics";
import {useUserProfile} from "./hooks/useUserProfile";

// Import profile page components
import {ProfileHeader} from "./informationCoponents/ProfileHeader";
import {PhoneEditDialog} from "./informationCoponents/PhoneEditDialog";
import {AnalyticsCard} from "./informationCoponents/AnalyticsCard";
import {SalesChart} from "./informationCoponents/SalesChart";

export default function ProfileInformation() {
    // Get current authenticated user from store
    const authUser = useAuthStore((state) => state.user);

    // Get user ID from URL parameters
    const {id: userId} = useParams();

    // State for phone number management (edit dialog, phone value, error)
    const [phone, setPhone] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    // Fetch user profile data
    const {data: user, isLoading, error} = useUserProfile(userId);

    // Profile picture upload mutation
    const {mutate: uploadProfilePicture, isPending: isUploading} = useUploadProfilePicture(userId);

    // Seller upgrade mutation
    const {mutate: initiateUpgrade, isPending: isUpgrading} = useUpgradeToSeller();

    // Phone number update mutation
    const {mutate: updatePhoneNumber, isPending: isUpdatingPhone} = useUpdatePhoneNumber(
        userId,
        setIsDialogOpen
    );

    // Check if current user is authorized to see analytics (admin or seller viewing own profile)
    const isAuthorized =
        authUser &&
        userId &&
        authUser._id === userId &&
        (authUser.roles === "admin" || authUser.roles === "seller");

    // Fetch analytics data if user is authorized to view it
    const {data: analyticsResponse} = useUserAnalytics(userId, isAuthorized);

    // Extract analytics data or use empty defaults
    const analyticsData = analyticsResponse?.analyticsData || {
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    };
    const dailySalesData = analyticsResponse?.dailySalesData || [];

    // Extract user data for display
    const userName = user?.username || "Unknown";
    const userProfilePicture = user?.profilePicture?.url || "";
    const userEmail = user?.email || "";

    // Validate phone number format
    const validatePhoneNumber = (phone) => {
        if (!phone) {
            return true;
        }
        if (!/^\+?[1-9]\d{9,14}$/.test(phone)) {
            setPhoneError("Please enter a valid phone number (e.g., +12345678901)");
            return false;
        }
        setPhoneError("");
        return true;
    };

    // Set phone number from user data when available
    useEffect(() => {
        if (user?.phoneNumber) {
            setPhone(user.phoneNumber);
        } else {
            // Try to get from localStorage as fallback
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

    // Handle phone number input changes
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        if (phoneError) setPhoneError("");
    };

    // Save phone number after validation
    const handleSavePhone = () => {
        if (!validatePhoneNumber(phone)) return;
        updatePhoneNumber(phone);
    };

    // Handle seller account upgrade process
    const handleUpgrade = () => {
        initiateUpgrade(undefined, {
            onSuccess: (data) => {
                // Redirect to Stripe checkout page
                window.location.href = data.url;
            },
            onError: (error) => {
                toast.error(
                    `Upgrade Failed: ${error.response?.data?.error || "Failed to initiate upgrade"}`
                );
            },
        });
    };

    // Handle profile picture file selection and upload
    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) uploadProfilePicture(file);
    };

    // Loading and error states
    if (isLoading) return <div className="p-4 text-center">Loading profile...</div>;
    if (error) return <div className="p-4 text-center">Error loading profile</div>;

    return (
        <div>
            <div className="space-y-6">
                {/* Profile header with upgrade button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    {/* Show upgrade button only if current user and not already a seller */}
                    {authUser.roles === "customer" && authUser?._id === userId && (
                        <Button onClick={handleUpgrade} disabled={isUpgrading} className="gap-2">
                            {isUpgrading ? (
                                <>
                                    Processing...
                                    <Loader2Icon className="animate-spin h-4 w-4" />
                                </>
                            ) : (
                                "Upgrade to Seller"
                            )}
                        </Button>
                    )}
                </div>

                {/* Profile information card */}
                <div className="max-w mx-auto p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-md">
                        {/* User avatar and name section */}
                        <ProfileHeader
                            userName={userName}
                            userProfilePicture={userProfilePicture}
                            userRoles={user?.roles}
                            isCurrentUser={authUser._id === userId}
                            isUploading={isUploading}
                            onProfilePictureChange={handleProfilePictureChange}
                        />

                        {/* Personal information section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Personal Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone number edit dialog - only shown for own profile */}
                                {authUser._id === userId && (
                                    <PhoneEditDialog
                                        phone={phone}
                                        phoneError={phoneError}
                                        isUpdatingPhone={isUpdatingPhone}
                                        isDialogOpen={isDialogOpen}
                                        setIsDialogOpen={setIsDialogOpen}
                                        onPhoneChange={handlePhoneChange}
                                        onSavePhone={handleSavePhone}
                                    />
                                )}
                                {/* Email display - non-editable */}
                                <div className="md:col-span-2">
                                    <Label className="block text-sm font-medium text-gray-600">
                                        Email
                                    </Label>
                                    <p className="mt-1 text-gray-800">{userEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics section - only visible to sellers/admins on their own profile */}
            {isAuthorized && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Analytics cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {analyticsResponse && (
                            <>
                                {/* User count card - admin only */}
                                {authUser.roles === "admin" && (
                                    <AnalyticsCard
                                        title="Total Users"
                                        value={analyticsData.users.toLocaleString()}
                                        icon={Users}
                                        color="from-emerald-500 to-teal-700"
                                    />
                                )}
                                {/* Products, sales and revenue cards */}
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

                    {/* Sales chart component */}
                    <SalesChart data={dailySalesData} />
                </div>
            )}
        </div>
    );
}
