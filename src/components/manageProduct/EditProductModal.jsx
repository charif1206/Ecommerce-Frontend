import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

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
                            <label className="block text-sm font-medium text-gray-700">RAM</label>
                            <input
                                name="ram"
                                value={formData.ram}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Storage
                            </label>
                            <input
                                name="storage"
                                value={formData.storage}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                    </>
                );
            case "Headphones":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Battery Life
                            </label>
                            <input
                                name="batteryLife"
                                value={formData.batteryLife}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                name="noiseCancellation"
                                type="checkbox"
                                checked={formData.noiseCancellation}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Noise Cancellation
                            </span>
                        </label>
                    </>
                );
            case "Smartwatches":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Screen Type
                            </label>
                            <input
                                name="screenType"
                                value={formData.screenType}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                name="waterResistant"
                                type="checkbox"
                                checked={formData.waterResistant}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Water Resistant
                            </span>
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
            <DialogContent className="max-w-lg" autoFocus={false}>
                <DialogHeader>
                    <DialogTitle>Edit Product - {product.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Main product fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <input
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md px-3 py-2"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            required
                        />
                    </div>
                    {/* Variant fields */}
                    {getVariantFields()}
                    <DialogFooter>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditProductModal;
