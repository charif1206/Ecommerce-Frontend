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
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Copy} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";

export default function ProfileCoupons() {
    const [couponDialog, setCouponDialog] = useState({
        isOpen: false,
        code: "",
        value: 0,
    });
    const queryClient = useQueryClient();

    // Points conversion rate (example: 1 coupon dollar = 100 points)
    const getPointsNeeded = (amount) => amount * 100;

    const coupons = [
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

    // React Query mutation for redeeming coupons
    const redeemCouponMutation = useMutation({
        mutationFn: async (amount) => {
            const response = await axiosInstance.post("/coupons/redeem", {value: amount});
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);

            const {code, value} = data;
            console.log(code, value);

            setCouponDialog({
                isOpen: true,
                code,
                value,
            });

            // Invalidate relevant queries to refresh user data
            queryClient.invalidateQueries(["userData"]);
            queryClient.invalidateQueries(["userPoints"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Not enough points to redeem this coupon");
        },
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
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Discount Coupons</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Redeem your points for discount coupons
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
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
                                        onClick={() => handleBuy(coupon.amount)}
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
