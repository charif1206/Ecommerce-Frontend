import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import EditProductForm from "./EditProductForm";

function EditProductModal({product, onClose, onUpdate}) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Edit Product - {product?.name}
                    </DialogTitle>
                </DialogHeader>
                <EditProductForm product={product} onUpdate={onUpdate} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}

export default EditProductModal;
