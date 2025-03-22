import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function OrderFilters({filter, setFilter}) {
    return (
        <div className="mb-6">
            <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[200px] bg-white text-gray-900 font-medium py-3 border border-gray-300 shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-gray-400">
                    <SelectValue placeholder="Filter orders" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 font-medium border-gray-300 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-100 focus:bg-gray-100">
                        All Orders
                    </SelectItem>
                    <SelectItem value="pending" className="hover:bg-gray-100 focus:bg-gray-100">
                        Pending
                    </SelectItem>
                    <SelectItem value="shipped" className="hover:bg-gray-100 focus:bg-gray-100">
                        Shipped
                    </SelectItem>
                    <SelectItem value="delivered" className="hover:bg-gray-100 focus:bg-gray-100">
                        Delivered
                    </SelectItem>
                    <SelectItem value="cancelled" className="hover:bg-gray-100 focus:bg-gray-100">
                        Cancelled
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
