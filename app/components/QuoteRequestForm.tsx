"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X, Plus, Trash2, Send, Loader2, Info, CheckCircle, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { PRODUCTS } from "@/app/data/products"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    companyName: z.string().min(2, "Company Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6, "Phone number is required"),
    message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SelectedProduct {
    name: string
    quantity: number
}

export default function QuoteRequestForm() {
    const [selectedProducts, setSelectedProducts] = React.useState<SelectedProduct[]>([])
    const [open, setOpen] = React.useState(false) // Popover state
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSuccess, setIsSuccess] = React.useState(false)
    const [errorDetails, setErrorDetails] = React.useState("")

    // State for the "Add New Item" row
    const [newItemName, setNewItemName] = React.useState("")
    const [newItemQuantity, setNewItemQuantity] = React.useState(1)

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    // Load user details from LocalStorage on mount
    React.useEffect(() => {
        const savedDetails = localStorage.getItem("biogex_user_details")
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails)
                if (parsed.name) setValue("name", parsed.name)
                if (parsed.companyName) setValue("companyName", parsed.companyName)
                if (parsed.email) setValue("email", parsed.email)
                if (parsed.phone) setValue("phone", parsed.phone)
            } catch (e) {
                console.error("Failed to parse saved user details", e)
            }
        }
    }, [setValue])

    // Filter products for performance
    const filteredProducts = React.useMemo(() => {
        if (!searchQuery) return PRODUCTS.slice(0, 50)
        return PRODUCTS.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50)
    }, [searchQuery])

    const selectProductToAdd = (productName: string) => {
        setNewItemName(productName)
        setOpen(false)
        setSearchQuery("")
    }

    const addNewItem = () => {
        if (!newItemName) return

        // Check if exists
        if (selectedProducts.find(p => p.name === newItemName)) {
            const existing = selectedProducts.find(p => p.name === newItemName)
            if (existing) {
                updateQuantity(newItemName, existing.quantity + newItemQuantity)
            }
        } else {
            setSelectedProducts([...selectedProducts, { name: newItemName, quantity: newItemQuantity }])
        }

        // Reset inputs
        setNewItemName("")
        setNewItemQuantity(1)
    }

    const removeProduct = (productName: string) => {
        setSelectedProducts(selectedProducts.filter(p => p.name !== productName))
    }

    const updateQuantity = (productName: string, quantity: number) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.name === productName ? { ...p, quantity } : p
        ))
    }

    const onSubmit = async (data: FormValues) => {
        if (selectedProducts.length === 0) {
            setErrorDetails("Please add at least one product to your quote.")
            return
        }

        setIsSubmitting(true)
        setErrorDetails("")

        try {
            // Persist user details to LocalStorage
            localStorage.setItem("biogex_user_details", JSON.stringify({
                name: data.name,
                companyName: data.companyName,
                email: data.email,
                phone: data.phone
            }))

            const payload = {
                ...data,
                products: selectedProducts
            }

            const res = await fetch('/api/quote-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Failed to submit quote")

            setIsSuccess(true)
            reset()
            // Re-populate form with saved details so if they submit again, fields are filled
            setValue("name", data.name)
            setValue("companyName", data.companyName)
            setValue("email", data.email)
            setValue("phone", data.phone)

            setSelectedProducts([])
        } catch (err: any) {
            setErrorDetails(err.message || "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-white/60 flex flex-col gap-2 items-center backdrop-blur-sm rounded-xl p-8 border border-white/30 shadow-sm text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-4 inline-block">
                    <CheckCircle className="text-green-600 mx-auto mb-4 w-16 h-16" />
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Quote Requested!</h2>
                    <p className="text-lg text-green-700 max-w-md mx-auto">
                        Your quote is being prepared by the Biogex team. We will be in touch with you shortly via email.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setIsSuccess(false)}
                    className="text-white font-medium text-lg bg-[#2e7d32] hover:bg-[#2e7d32]/80 py-6 px-4 !rounded-xl"
                >
                    Submit another request
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/30 shadow-lg">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request a Quote</h3>
                <p className="text-gray-600">Select products from our catalog and we'll send you a personalized quote.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input {...register("name")} className="bg-white" placeholder="Your Name" />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <Input {...register("companyName")} className="bg-white" placeholder="Pharmacy / Hospital Name" />
                        {errors.companyName && <span className="text-red-500 text-xs">{errors.companyName.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input {...register("email")} className="bg-white" placeholder="name@company.com" />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input {...register("phone")} className="bg-white" placeholder="+254 700 000000" />
                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                    </div>
                </div>

                {/* --- Product Selection Section --- */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">Products Needed</h4>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                        <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> Quantity is in <strong>packets/boxes</strong>. (e.g., "100's" in the name typically indicates the number of pieces per packet).
                        </p>
                    </div>

                    {/* Add Item Row */}
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        {/* Product Combobox */}
                        <div className="w-full sm:flex-grow relative">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Search Product</label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between bg-white",
                                            !newItemName && "text-muted-foreground"
                                        )}
                                    >
                                        {newItemName || "Select product..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Search product..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No products found.</CommandEmpty>
                                            <CommandGroup>
                                                {filteredProducts.map((product) => (
                                                    <CommandItem
                                                        key={product}
                                                        value={product}
                                                        onSelect={() => selectProductToAdd(product)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                newItemName === product ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {product}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Quantity Input */}
                        <div className="w-full sm:w-24 flex-shrink-0">
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Qty (Pkts)</label>
                            <Input
                                type="number"
                                min="1"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                                className="bg-white"
                            />
                        </div>

                        {/* Add Button */}
                        <Button
                            type="button"
                            onClick={addNewItem}
                            disabled={!newItemName}
                            className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white"
                        >
                            <Plus size={16} className="mr-2" />
                            Add
                        </Button>
                    </div>

                    {/* Selected Products List Table */}
                    {selectedProducts.length > 0 ? (
                        <div className="mt-4 border rounded-md bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead className="w-24 text-center">Qty (Pkts)</TableHead>
                                        <TableHead className="w-16"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProducts.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.name, parseInt(e.target.value) || 1)}
                                                    className="w-20 text-center h-8"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeProduct(item.name)}
                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="mt-4 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                            No products added yet. Use the fields above to add items.
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                    <textarea
                        {...register("message")}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent outline-none resize-none bg-white"
                        placeholder="Any additional details..."
                    />
                </div>

                {errorDetails && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {errorDetails}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white py-6 text-lg font-semibold shadow-md hover:shadow-xl"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Sending Request...
                        </>
                    ) : (
                        <>
                            Send Quote Request
                            <Send size={20} className="ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
