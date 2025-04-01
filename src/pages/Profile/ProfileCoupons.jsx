import axiosInstance from "@/Axios/AxiosInstance";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/zustand/authStore";
import {DialogTrigger} from "@radix-ui/react-dialog";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Copy} from "lucide-react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "sonner";

// Static coupons available for redemption
const redeemableCoupons = [
    {id: "coupon5", amount: 5, color: "bg-blue-100"},
    {id: "coupon10", amount: 10, color: "bg-teal-100"},
    {id: "coupon20", amount: 20, color: "bg-green-100"},
    {id: "coupon50", amount: 50, color: "bg-purple-100"},
];

const minimumPurchaseMap = {
    5: 25,
    10: 50,
    20: 100,
    50: 250,
};

export default function ProfileCoupons() {
    const {id: userId} = useParams();
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    // Fetch user's redeemed coupons
    const {
        data: userCoupons,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["userCoupons", user?._id],
        queryFn: async () => {
            const response = await axiosInstance.get("/coupons");
            return response.data;
        },
        enabled: !!user?._id,
        onError: (error) => {
            toast.error(error.response?.data?.error || "Failed to fetch coupons");
        },
    });

    const getPointsNeeded = (amount) => amount * 100;

    const redeemCouponMutation = useMutation({
        mutationFn: async (amount) => {
            const response = await axiosInstance.post("/coupons/redeem", {value: amount});
            return response.data;
        },
        onSuccess: async (data) => {
            const {code, value} = data;
            setCouponDialog({
                isOpen: true,
                code,
                value,
            });

            // Refresh user data and coupons
            const userResponse = await axiosInstance.get(`/users/${userId}`);
            setUser(userResponse.data);
            await refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Not enough points to redeem this coupon");
        },
    });

    const [couponDialog, setCouponDialog] = useState({
        isOpen: false,
        code: "",
        value: 0,
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        amount: 0,
    });

    const handleBuy = (amount) => {
        redeemCouponMutation.mutate(amount);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Coupon code copied successfully");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <header>
                        <h1 className="text-2xl font-bold text-gray-900">Discount Coupons</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Redeem your points for discount coupons
                        </p>
                    </header>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>My Coupons ({userCoupons?.length || 0})</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>My Redeemed Coupons</DialogTitle>
                                <DialogDescription>
                                    {userCoupons?.length
                                        ? "Your available discount coupons"
                                        : "No coupons redeemed yet"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-4">Loading coupons...</div>
                                ) : isError ? (
                                    <div className="text-center py-4 text-red-500">
                                        Failed to load coupons
                                    </div>
                                ) : (
                                    userCoupons?.map((coupon) => (
                                        <Card key={coupon._id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            ${coupon.value} Discount
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Code: {coupon.code}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Min. purchase: $
                                                            {minimumPurchaseMap[coupon.value]}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(coupon.code)}
                                                    >
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {redeemableCoupons.map((coupon) => (
                        <Card
                            key={coupon.id}
                            className="overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                            <div className={`h-1 ${coupon.color}`}></div>
                            <CardContent className="p-0">
                                <div className="flex items-center p-4">
                                    <div
                                        className={`flex-shrink-0 p-3 rounded-full ${coupon.color}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-800"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    ${coupon.amount} Discount
                                                </h3>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    Min. purchase: $
                                                    {minimumPurchaseMap[coupon.amount]}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {getPointsNeeded(coupon.amount)} POINTS
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 pb-4 flex justify-end">
                                    <Button
                                        onClick={() =>
                                            setConfirmDialog({isOpen: true, amount: coupon.amount})
                                        }
                                        className="bg-black hover:bg-gray-800 text-sm py-1 h-8"
                                        disabled={redeemCouponMutation.isPending}
                                    >
                                        {redeemCouponMutation.isPending
                                            ? "Redeeming..."
                                            : "Redeem Points"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.isOpen}
                onOpenChange={(open) => !open && setConfirmDialog({isOpen: false, amount: 0})}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to redeem points for a ${confirmDialog.amount}{" "}
                            discount coupon?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialog({isOpen: false, amount: 0})}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleBuy(confirmDialog.amount);
                                setConfirmDialog({isOpen: false, amount: 0});
                            }}
                            className="bg-black hover:bg-gray-800"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Coupon Code Dialog */}
            <Dialog
                open={couponDialog.isOpen}
                onOpenChange={(open) =>
                    !open && setCouponDialog((prev) => ({...prev, isOpen: false}))
                }
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Coupon Redeemed Successfully!</DialogTitle>
                        <DialogDescription>
                            Your ${couponDialog.value} discount coupon has been created.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 my-4">
                        <div className="bg-gray-100 p-4 rounded-md w-full text-center">
                            <p className="text-sm text-gray-500 mb-1">Your coupon code</p>
                            <p className="text-lg font-mono font-semibold tracking-wider">
                                {couponDialog.code}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => copyToClipboard(couponDialog.code)}
                        >
                            <Copy className="h-4 w-4" />
                            Copy
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setCouponDialog({isOpen: false, code: "", value: 0})}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
