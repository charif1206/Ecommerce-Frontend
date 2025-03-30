import axiosInstance from "@/Axios/AxiosInstance";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import useAuthStore from "@/zustand/authStore";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {FaBars} from "react-icons/fa";
import {useParams, useSearchParams} from "react-router-dom";
import ManageOrders from "./ManageOrders";
import ManageProduct from "./ManageProduct";
import ManageUsers from "./ManageUsers";
import ProfileCoupons from "./ProfileCoupons";
import ProfileInformation from "./ProfileInformation";
import ProfileLikes from "./ProfileLikes";
import ProfileWishlist from "./ProfileWishlist";

// Import AlertDialog components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Profile() {
    const {id: userId} = useParams();
    const [searchParams] = useSearchParams();
    // Set default tab from query parameter or fallback to "profile"
    const defaultTab = searchParams.get("tab") || "profile";
    const [activeTab, setActiveTab] = useState(defaultTab);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // State to control the deletion alert dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // const {mutate: handleLogout, isLoading} = useMutation({
    //     mutationFn: async () => {
    //         await axiosInstance.post("/auth/logout");
    //     },
    //     onSuccess: () => {
    //         logout();
    //     },
    //     onError: (error) => {
    //         console.error("Logout failed:", error.response?.data || error.message);
    //     },
    // });

    // Mutation to handle account deletion
    const {mutate: handleDeleteAccount, isLoading: isDeleting} = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/users/${userId}`);
        },
        onSuccess: () => {
            logout();
        },
        onError: (error) => {
            console.error("Delete account failed:", error.response?.data || error.message);
        },
    });

    // Main navigation items without Delete Account (it's now a separate button)
    const mainNavigationItems = [
        {id: "profile", label: "Profile"},
        ...(user._id === userId
            ? [
                  {id: "coupons", label: "Coupons"},
                  ...(user.roles === "seller" || user.roles === "admin"
                      ? [{id: "products", label: "Products"}]
                      : []),
                  {id: "orders", label: "Orders"},
                  {id: "wishlist", label: "Wishlist"},
                  {id: "likes", label: "Likes"},
                  ...(user.roles === "admin" ? [{id: "users", label: "Users"}] : []),
              ]
            : []),
    ];

    // Helper function to render a Tab trigger.
    const renderTabTrigger = (item) => {
        return (
            <TabsTrigger
                key={item.id}
                value={item.id}
                className="w-full justify-start px-4 py-3 text-left text-sm font-medium transition-all hover:bg-accent/50 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                onClick={() => {
                    setIsSidebarOpen(false);
                    setActiveTab(item.id);
                }}
            >
                {item.label}
            </TabsTrigger>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Navigation */}
            <div className="lg:hidden sticky top-0 z-40 border-b bg-background">
                <div className="flex items-center justify-between p-4">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
                                <FaBars className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] p-0">
                            <SheetHeader className="px-4 py-6 border-b">
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-80px)]">
                                <div className="flex flex-col py-2">
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={setActiveTab}
                                        orientation="vertical"
                                        className="w-full"
                                    >
                                        <TabsList className="flex flex-col items-start w-full h-auto bg-transparent space-y-1 px-2">
                                            {mainNavigationItems.map((item) =>
                                                renderTabTrigger(item)
                                            )}
                                        </TabsList>
                                    </Tabs>

                                    {user._id === userId && (
                                        <div className="px-4 py-4 mt-2 border-t">
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => {
                                                    setIsSidebarOpen(false);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="flex flex-col lg:flex-row">
                <div className="hidden lg:block w-64 border-r bg-background">
                    <div className="sticky top-0 h-screen p-4 flex flex-col justify-between">
                        <ScrollArea className="flex-1">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                orientation="vertical"
                                className="space-y-1"
                            >
                                <TabsList className="flex flex-col items-start h-auto bg-transparent">
                                    {mainNavigationItems.map((item) => renderTabTrigger(item))}
                                </TabsList>
                            </Tabs>
                        </ScrollArea>
                        {user._id === userId && (
                            <div className="mt-4">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="min-h-[calc(100vh-8rem)] p-4 lg:p-6">
                        {activeTab === "profile" && <ProfileInformation />}
                        {activeTab === "coupons" && <ProfileCoupons />}
                        {activeTab === "products" && <ManageProduct />}
                        {activeTab === "wishlist" && <ProfileWishlist />}
                        {activeTab === "likes" && <ProfileLikes />}
                        {activeTab === "orders" && <ManageOrders />}
                        {activeTab === "users" && <ManageUsers />}
                        {!activeTab && (
                            <div className="flex items-center justify-center h-full">
                                <Skeleton className="h-8 w-24" />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* AlertDialog for Delete Account */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete your account? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteAccount()}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
