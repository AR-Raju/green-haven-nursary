"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { createProduct, updateProduct } from "@/redux/slices/productsSlice"
import type { Product } from "@/redux/slices/productsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import ImageUpload from "@/components/ui/image-upload"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { categories } = useSelector((state: RootState) => state.categories)
  const { loading } = useSelector((state: RootState) => state.products)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    rating: "",
    image: "",
    category: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        rating: product.rating.toString(),
        image: product.image,
        category: product.category._id,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        quantity: "",
        rating: "0",
        image: "",
        category: "",
      })
    }
    setErrors({})
  }, [product, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required"
    if (!formData.image.trim()) newErrors.image = "Image URL is required"
    if (!formData.category) newErrors.category = "Category is required"

    const rating = Number(formData.rating)
    if (rating < 0 || rating > 5) newErrors.rating = "Rating must be between 0 and 5"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        rating: Number(formData.rating),
        image: formData.image.trim(),
        category: formData.category,
      }

      if (product) {
        await dispatch(updateProduct({ id: product._id, ...productData })).unwrap()
        toast({
          title: "Product Updated",
          description: "Product has been successfully updated.",
        })
      } else {
        await dispatch(createProduct(productData)).unwrap()
        toast({
          title: "Product Created",
          description: "Product has been successfully created.",
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product.`,
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter product title"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="0"
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                placeholder="0.0"
              />
              {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => handleInputChange("image", url)}
            onRemove={() => handleInputChange("image", "")}
            label="Product Image"
            required
            disabled={loading}
          />
          {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
