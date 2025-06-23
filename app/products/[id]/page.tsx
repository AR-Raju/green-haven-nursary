"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { addToCart } from "@/redux/slices/cartSlice"
import type { Product } from "@/redux/slices/productsSlice"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ImageGallery from "@/components/ImageGallery"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ShoppingCart, Leaf, Droplets, Sun } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailsPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.product)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    if (quantity > product.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} items available.`,
        variant: "destructive",
      })
      return
    }

    dispatch(addToCart({ product, quantity }))
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.title}(s) added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ImageGallery images={[product.image]} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
              </div>

              <div className="text-3xl font-bold text-primary mb-4">${product.price.toFixed(2)}</div>

              <div className="flex items-center gap-4 mb-4">
                {product.inStock ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    In Stock ({product.quantity} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Care Instructions */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
              <div className="text-center">
                <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Care</p>
              </div>
              <div className="text-center">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Regular Water</p>
              </div>
              <div className="text-center">
                <Sun className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Bright Light</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button onClick={handleAddToCart} disabled={!product.inStock} size="lg" className="w-full">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
