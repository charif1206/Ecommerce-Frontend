// ManageProduct.jsx
import axiosInstance from "@/Axios/AxiosInstance";
import EditProductModal from "@/components/manageProduct/EditProductModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useAuthStore from "@/zustand/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// ---------- New Product Dialog Components & Form Setup ----------
import { formSchema } from "@/components/manageProduct/productSchema";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Import Toast from Sonner

// --------------------- ManageProduct Component ---------------------
export default function ManageProduct() {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    // Fetch seller products using React Query.
    const {
        data: products,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["sellerProducts", user._id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/products/seller/${user._id}`);
            return response.data.products;
        },
        enabled: !!user,
    });

    // Mutation for deleting a product.
    const deleteProductMutation = useMutation({
        mutationFn: async (productId) => {
            const response = await axiosInstance.delete(`/products/${productId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts", user._id]);
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
        },
    });

    // Mutation for updating a product.
    const updateProductMutation = useMutation({
        mutationFn: async ({productId, data}) => {
            const response = await axiosInstance.patch(`/products/${productId}`, data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries(["sellerProducts", user._id]),
    });

    // Mutation for creating a product.
    const createProductMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post("/products", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts", user._id]);
            setIsCreateDialogOpen(false);
        },
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            description: "",
            category: "Phones",
            price: "",
            stock: "",
            productImages: [],
            variants: {},
        },
    });

    const selectedCategory = form.watch("category");

    useEffect(() => {
        // Reset variants when category changes.
        form.resetField("variants");
    }, [selectedCategory, form]);

    const onSubmit = async (data) => {
        // Build FormData for multipart request.
        const formData = new FormData();

        // Append basic fields.
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("description", data.description || "");
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("stock", data.stock);

        // Append variants as a JSON string.
        formData.append("variants", JSON.stringify(data.variants));

        // Append each selected file.
        if (data.productImages && data.productImages.length > 0) {
            data.productImages.forEach((file) => {
                formData.append("productImages", file);
            });
        }

        // Use toast.promise to show a waiting toast, then clear the form upon success.
        toast
            .promise(createProductMutation.mutateAsync(formData), {
                loading: "Creating product...",
                success: "Product created successfully!",
                error: "Failed to create product",
            })
            .then(() => {
                form.reset();
            });
    };

    // States for editing product.
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleEdit = (product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (productId, data) => {
        updateProductMutation.mutate({productId, data});
        setIsEditModalOpen(false);
        setProductToEdit(null);
    };

    // Helper to format variant specifications based on product category.
    const formatSpecs = (product) => {
        if (!product.variants) return "N/A";
        const {variants, category} = product;
        switch (category) {
            case "Phones":
                return `RAM: ${variants.ram || "N/A"}, Storage: ${variants.storage || "N/A"}`;
            case "Headphones":
                return `Battery Life: ${variants.batteryLife || "N/A"}, Noise Cancellation: ${
                    variants.noiseCancellation ? "Yes" : "No"
                }`;
            case "Smartwatches":
                return `Screen: ${variants.screenType || "N/A"}, Water Resistant: ${
                    variants.waterResistant ? "Yes" : "No"
                }`;
            default:
                return "N/A";
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading products...</div>;
    if (error) return <div className="p-4 text-center">Error loading products.</div>;

    const sellerProducts = products || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Products</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Create New Product</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Product</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    {/* File Upload Field for up to 4 images */}
                                    <FormField
                                        control={form.control}
                                        name="productImages"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Product Images (up to 4)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const files = Array.from(
                                                                e.target.files || []
                                                            );
                                                            field.onChange(files);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Common Fields */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Phones">
                                                            Phones
                                                        </SelectItem>
                                                        <SelectItem value="Headphones">
                                                            Headphones
                                                        </SelectItem>
                                                        <SelectItem value="Smartwatches">
                                                            Smartwatches
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(Number(e.target.value))
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(Number(e.target.value))
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Dynamic Fields based on Category */}
                                    {selectedCategory === "Phones" && (
                                        <>
                                            {/* Using Select for RAM */}
                                            <FormField
                                                control={form.control}
                                                name="variants.ram"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>RAM</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select RAM" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="4GB">
                                                                    4GB
                                                                </SelectItem>
                                                                <SelectItem value="6GB">
                                                                    6GB
                                                                </SelectItem>
                                                                <SelectItem value="8GB">
                                                                    8GB
                                                                </SelectItem>
                                                                <SelectItem value="12GB">
                                                                    12GB
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Using Select for Storage */}
                                            <FormField
                                                control={form.control}
                                                name="variants.storage"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Storage</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Storage" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="64GB">
                                                                    64GB
                                                                </SelectItem>
                                                                <SelectItem value="128GB">
                                                                    128GB
                                                                </SelectItem>
                                                                <SelectItem value="256GB">
                                                                    256GB
                                                                </SelectItem>
                                                                <SelectItem value="512GB">
                                                                    512GB
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    {selectedCategory === "Headphones" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="variants.batteryLife"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Battery Life</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="e.g., 18h"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="variants.noiseCancellation"
                                                render={({field}) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>
                                                                Noise Cancellation
                                                            </FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    {selectedCategory === "Smartwatches" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="variants.screenType"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Screen Type</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="variants.waterResistant"
                                                render={({field}) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Water Resistant</FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    <Button type="submit" className="w-full">
                                        Create Product
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Existing Table */}
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableCaption className="text-base font-semibold">
                            Seller Products
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="text-sm">
                                <TableHead className="px-4 py-2">Name</TableHead>
                                <TableHead className="px-4 py-2">Brand</TableHead>
                                <TableHead className="px-4 py-2">Category</TableHead>
                                <TableHead className="px-4 py-2">Price</TableHead>
                                <TableHead className="px-4 py-2">Stock</TableHead>
                                <TableHead className="px-4 py-2">Specifications</TableHead>
                                <TableHead className="px-4 py-2">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellerProducts.map((product) => (
                                <TableRow
                                    key={product._id}
                                    className="text-sm hover:bg-gray-100 transition-colors"
                                >
                                    <TableCell className="px-4 py-2">{product.name}</TableCell>
                                    <TableCell className="px-4 py-2">{product.brand}</TableCell>
                                    <TableCell className="px-4 py-2">{product.category}</TableCell>
                                    <TableCell className="px-4 py-2">${product.price}</TableCell>
                                    <TableCell className="px-4 py-2">{product.stock}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {formatSpecs(product)}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        Delete
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Confirm Deletion
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this
                                                            product? It will be soft-deleted and may
                                                            still appear in buyer orders.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                deleteProductMutation.mutate(
                                                                    product._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {isEditModalOpen && productToEdit && (
                    <EditProductModal
                        product={productToEdit}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setProductToEdit(null);
                        }}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
}
