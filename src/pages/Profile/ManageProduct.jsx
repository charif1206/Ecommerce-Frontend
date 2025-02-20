import axiosInstance from "@/Axios/AxiosInstance";
import EditProductModal from "@/components/manageProduct/EditProductModal";
import ProductForm from "@/components/manageProduct/ProductForm";
import ProductTable from "@/components/manageProduct/ProductTable";
import useAuthStore from "@/zustand/authStore";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {formSchema} from "@/components/manageProduct/productSchema";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";

export default function ManageProduct() {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    // Fetch products
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

    // Mutations
    const deleteProductMutation = useMutation({
        mutationFn: async (productId) => {
            const response = await axiosInstance.delete(`/products/${productId}`);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries(["sellerProducts", user._id]),
        onError: (error) => console.error("Error deleting product:", error),
    });

    const updateProductMutation = useMutation({
        mutationFn: async ({productId, data}) => {
            const response = await axiosInstance.patch(`/products/${productId}`, data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries(["sellerProducts", user._id]),
    });

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
        formData.append("variants", JSON.stringify(data.variants));

        if (data.productImages && data.productImages.length > 0) {
            data.productImages.forEach((file) => {
                formData.append("productImages", file);
            });
        }

        toast
            .promise(createProductMutation.mutateAsync(formData), {
                loading: "Creating product...",
                success: "Product created successfully!",
                error: "Failed to create product",
            })
            .then(() => form.reset());
    };

    // States for editing and creating products
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
