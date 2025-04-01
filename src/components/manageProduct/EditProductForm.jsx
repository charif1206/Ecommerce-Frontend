import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";

function EditProductForm({product, onUpdate, onClose}) {
    const baseSchema = z.object({
        name: z.string().min(1, {message: "Required"}),
        brand: z.string().min(1, {message: "Required"}),
        price: z.coerce.number().positive({message: "Must be positive"}),
        stock: z.coerce.number().min(0, {message: "Must be non-negative"}),
        description: z.string().min(1, {message: "Required"}),
    });

    let variantSchema;
    switch (product?.category) {
        case "Phones":
            variantSchema = z.object({
                ram: z.string().min(1, {message: "Required"}),
                storage: z.string().min(1, {message: "Required"}),
            });
            break;
        case "Headphones":
            variantSchema = z.object({
                batteryLife: z.string().min(1, {message: "Required"}),
                noiseCancellation: z.boolean(),
            });
            break;
        case "Smartwatches":
            variantSchema = z.object({
                screenType: z.string().min(1, {message: "Required"}),
                waterResistant: z.boolean(),
            });
            break;
        default:
            variantSchema = z.object({});
    }

    const formSchema = baseSchema.merge(variantSchema);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            price: 0,
            stock: 0,
            description: "",
            ...(product?.variants || {}),
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                brand: product.brand,
                price: product.price,
                stock: product.stock,
                description: product.description,
                ...product.variants,
            });
        }
    }, [product, form]);

    const onSubmit = (data) => {
        const updatedData = {
            name: data.name,
            brand: data.brand,
            price: data.price,
            stock: data.stock,
            description: data.description,
            variants: {},
        };

        switch (product.category) {
            case "Phones":
                updatedData.variants = {
                    ram: data.ram,
                    storage: data.storage,
                };
                break;
            case "Headphones":
                updatedData.variants = {
                    batteryLife: data.batteryLife,
                    noiseCancellation: data.noiseCancellation,
                };
                break;
            case "Smartwatches":
                updatedData.variants = {
                    screenType: data.screenType,
                    waterResistant: data.waterResistant,
                };
                break;
        }

        onUpdate(product._id, updatedData);
        onClose();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
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
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
                </div>

                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        {product?.category} Specifications
                    </h3>
                    <div className="space-y-4">
                        {product?.category === "Phones" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="ram"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>RAM</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select RAM" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="4GB">4GB</SelectItem>
                                                    <SelectItem value="6GB">6GB</SelectItem>
                                                    <SelectItem value="8GB">8GB</SelectItem>
                                                    <SelectItem value="12GB">12GB</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="storage"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Storage</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Storage" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="64GB">64GB</SelectItem>
                                                    <SelectItem value="128GB">128GB</SelectItem>
                                                    <SelectItem value="256GB">256GB</SelectItem>
                                                    <SelectItem value="512GB">512GB</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {product?.category === "Headphones" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="batteryLife"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Battery Life</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        if (value && !value.endsWith("h")) {
                                                            field.onChange(value + "h");
                                                        }
                                                        field.onBlur();
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="noiseCancellation"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Noise Cancellation</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {product?.category === "Smartwatches" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="screenType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Screen Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Screen Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="AMOLED">AMOLED</SelectItem>
                                                    <SelectItem value="LCD">LCD</SelectItem>
                                                    <SelectItem value="LED">LED</SelectItem>
                                                    <SelectItem value="Retina">Retina</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="waterResistant"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Water Resistant</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Form>
    );
}

export default EditProductForm;
