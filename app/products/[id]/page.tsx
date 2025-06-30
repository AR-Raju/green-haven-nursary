"use client";

import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import Navbar from "@/components/Navbar";
import ProductReviews from "@/components/ProductReviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  clearCurrentProduct,
  fetchProduct,
} from "@/redux/slices/productsSlice";
import { fetchReviews } from "@/redux/slices/reviewsSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const {
    currentProduct: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);
  const { reviews } = useSelector((state: RootState) => state.reviews);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProduct(productId));
      dispatch(fetchReviews({ productId, status: "approved" }));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    if (quantity > product.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} items available.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ product, quantity }));
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.title}(s) added to your cart.`,
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.image ? [product.image] : ["/placeholder.svg"];
  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </a>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <a
                href="/products"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </a>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="font-medium">{product.title}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <ImageGallery
              images={images}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({reviews?.length} reviews)
                </span>
              </div>

              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>

              <div className="text-3xl font-bold text-green-600 mb-4">
                ${product.price.toFixed(2)}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">
                      In Stock ({product.quantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <RefreshCw className="h-4 w-4 text-green-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{product.description}</p>
                {/* Add more detailed product information here */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product._id} />
      </div>

      <Footer />
    </div>
  );
}
