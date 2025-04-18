import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Loader2Icon} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

export const PhoneEditDialog = ({
    phone,
    phoneError,
    isUpdatingPhone,
    isDialogOpen,
    setIsDialogOpen,
    onPhoneChange,
    onSavePhone,
}) => (
    <>
        <div className="flex items-center justify-between gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <p className="mt-1 text-gray-800">{phone || "Not provided"}</p>
            </div>
            <Button
                variant="outline"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsDialogOpen(true)}
            >
                Edit
            </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Phone Number</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <div className="col-span-3 space-y-2">
                            <Input
                                id="phone"
                                value={phone}
                                onChange={onPhoneChange}
                                placeholder="+12345678901"
                            />
                            {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
                        </div>
                    </div>
                    <Button onClick={onSavePhone} disabled={isUpdatingPhone}>
                        {isUpdatingPhone ? (
                            <>
                                Saving...
                                <Loader2Icon className="animate-spin h-4 w-4 ml-2" />
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
);
