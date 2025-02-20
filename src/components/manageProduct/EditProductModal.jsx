import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function EditProductModal({product, onClose, onUpdate}) {
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        stock: "",
        description: "",
        ram: "",
        storage: "",
        batteryLife: "",
        noiseCancellation: false,
        screenType: "",
        waterResistant: false,
    });

    // Sync form data with product prop
    useEffect(() => {
        if (!product) return;
        setFormData({
            name: product.name || "",
            brand: product.brand || "",
            price: product.price || "",
            stock: product.stock || "",
            description: product.description || "",
            ram: product.variants?.ram || "",
            storage: product.variants?.storage || "",
            batteryLife: product.variants?.batteryLife || "",
            noiseCancellation: product.variants?.noiseCancellation || false,
            screenType: product.variants?.screenType || "",
            waterResistant: product.variants?.waterResistant || false,
        });
    }, [product]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            name: formData.name,
            brand: formData.brand,
            price: formData.price,
            stock: formData.stock,
            description: formData.description,
            variants: {},
        };

        // Add variants based on category
        if (product.category === "Phones") {
            updatedData.variants = {
                ram: formData.ram,
                storage: formData.storage,
            };
        } else if (product.category === "Headphones") {
            updatedData.variants = {
                batteryLife: formData.batteryLife,
                noiseCancellation: formData.noiseCancellation,
            };
        } else if (product.category === "Smartwatches") {
            updatedData.variants = {
                screenType: formData.screenType,
                waterResistant: formData.waterResistant,
            };
        }

        onUpdate(product._id, updatedData);
    };

    const getVariantFields = () => {
        switch (product.category) {
            case "Phones":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                RAM
                            </label>
                            <Select
                                value={formData.ram}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({...prev, ram: value}))
                                }
                            >
                                <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                    <SelectValue placeholder="Select RAM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4GB">4GB</SelectItem>
                                    <SelectItem value="6GB">6GB</SelectItem>
                                    <SelectItem value="8GB">8GB</SelectItem>
                                    <SelectItem value="12GB">12GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Storage
                            </label>
                            <Select
                                value={formData.storage}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({...prev, storage: value}))
                                }
                            >
                                <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                    <SelectValue placeholder="Select Storage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="64GB">64GB</SelectItem>
                                    <SelectItem value="128GB">128GB</SelectItem>
                                    <SelectItem value="256GB">256GB</SelectItem>
                                    <SelectItem value="512GB">512GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            case "Headphones":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Battery Life
                            </label>
                            <input
                                name="batteryLife"
                                value={formData.batteryLife}
                                onChange={handleChange}
                                onBlur={() => {
                                    setFormData((prev) => {
                                        let bl = prev.batteryLife;
                                        if (bl && !bl.trim().endsWith("h")) {
                                            return {...prev, batteryLife: bl.trim() + "h"};
                                        }
                                        return prev;
                                    });
                                }}
                                placeholder="e.g., 18h"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                            />
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                name="noiseCancellation"
                                type="checkbox"
                                checked={formData.noiseCancellation}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-700">Noise Cancellation</span>
                        </label>
                    </>
                );
            case "Smartwatches":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Screen Type
                            </label>
                            <Select
                                value={formData.screenType}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({...prev, screenType: value}))
                                }
                            >
                                <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                    <SelectValue placeholder="Select Screen Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AMOLED">AMOLED</SelectItem>
                                    <SelectItem value="LCD">LCD</SelectItem>
                                    <SelectItem value="LED">LED</SelectItem>
                                    <SelectItem value="Retina">Retina</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                name="waterResistant"
                                type="checkbox"
                                checked={formData.waterResistant}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-700">Water Resistant</span>
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-w-xl" autoFocus={false}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Edit Product - {product.name}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main product fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Brand <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                required
                            />
                        </div>
                    </div>

                    {/* Variant fields */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            {product.category} Specifications
                        </h3>
                        <div className="space-y-4">{getVariantFields()}</div>
                    </div>

                    <DialogFooter>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditProductModal;
