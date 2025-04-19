// Product table component for displaying seller's products and actions
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import {formatSpecs} from "@/components/manageProduct/formatSpecs";
import {Button} from "@/components/ui/button";
import {Edit, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";

export default function ProductTable({products, onEdit, onDelete}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
                <TableCaption className="text-lg font-semibold mb-4 caption-top">
                    Seller Products
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Brand
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Category
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Price
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Stock
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Specifications
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="px-6 py-4 font-medium">{product.name}</TableCell>
                            <TableCell className="px-6 py-4">{product.brand}</TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge variant="secondary">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 font-semibold">
                                ${product.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Badge variant={product.stock > 10 ? "success" : "destructive"}>
                                    {product.stock}
                                </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 max-w-xs truncate font-semibold">
                                {formatSpecs(product)}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(product)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Confirm Deletion
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this product? It
                                                    will be soft-deleted and may still appear in
                                                    buyer orders.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => onDelete(product._id)}
                                                    className="bg-red-600 text-white hover:bg-red-700"
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
    );
}
