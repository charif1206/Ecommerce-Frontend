import EditProductModal from "@/components/manageProduct/EditProductModal";
import ProductForm from "@/components/manageProduct/ProductForm";
import {formSchema} from "@/components/manageProduct/productSchema";
import ProductTable from "@/components/manageProduct/ProductTable";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/zustand/authStore";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {useCreateProduct} from "./hooks/useCreateProduct";
import {useDeleteProduct} from "./hooks/useDeleteProduct";
import useProfileProducts from "./hooks/useProfileProduct";
import {useUpdateProduct} from "./hooks/useUpdateProduct";

export default function ManageProduct() {
    const user = useAuthStore((state) => state.user);
    // States for editing and creating products
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Fetch products
    const {data: products, isLoading, error} = useProfileProducts(user);

    // Mutations
    const deleteProductMutation = useDeleteProduct(user._id);

    const updateProductMutation = useUpdateProduct(user._id);

    const createProductMutation = useCreateProduct(user._id, setIsCreateDialogOpen);

    // React Hook Form setup
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
        form.resetField("variants");
    }, [selectedCategory, form]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("brand", data.brand);
        formData.append("description", data.description || "");
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("variants", JSON.stringify(data.variants || {}));

        if (data.productImages && data.productImages.length > 0) {
            data.productImages.forEach((file) => {
                formData.append("productImages", file);
            });
        }

        // Create the mutation promise first
        const mutationPromise = createProductMutation.mutateAsync(formData);

        // Use toast.promise to show toast notifications for the promise states
        toast.promise(mutationPromise, {
            loading: "Creating product...",
            success: "Product created successfully!",
            error: (err) => {
                console.error("Upload error details:", err);
                return "Failed to create product";
            },
        });

        try {
            // Actually await the mutation result
            await mutationPromise;

            // Reset form and close dialog on success
            form.reset();
            setIsCreateDialogOpen(false);
        } catch (error) {
            // Error is already handled by toast.promise
            console.error("Product creation error:", error);
        }
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (productId, data) => {
        updateProductMutation.mutate({productId, data});
        setIsEditModalOpen(false);
        setProductToEdit(null);
    };

    const handleDelete = (productId) => {
        deleteProductMutation.mutate(productId);
    };

    if (isLoading) return <div className="p-4 text-center">Loading products...</div>;
    if (error) return <div className="p-4 text-center">Error loading products.</div>;

    const sellerProducts = products || [];

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Create Product Dialog */}
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
                            <ProductForm
                                form={form}
                                selectedCategory={selectedCategory}
                                onSubmit={onSubmit}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Products Table */}
                <ProductTable
                    products={sellerProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Edit Product Modal */}
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
