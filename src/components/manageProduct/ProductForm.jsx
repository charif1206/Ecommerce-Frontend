import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export default function ProductForm({form, selectedCategory, onSubmit}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* File Upload Field */}
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
                                        const files = Array.from(e.target.files || []);
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Phones">Phones</SelectItem>
                                    <SelectItem value="Headphones">Headphones</SelectItem>
                                    <SelectItem value="Smartwatches">Smartwatches</SelectItem>
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
                                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Dynamic Fields based on Category */}
                {selectedCategory === "Phones" && (
                    <>
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

                {selectedCategory === "Headphones" && (
                    <>
                        <FormField
                            control={form.control}
                            name="variants.batteryLife"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Battery Life</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., 18h" />
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
                                        <FormLabel>Noise Cancellation</FormLabel>
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
    );
}
