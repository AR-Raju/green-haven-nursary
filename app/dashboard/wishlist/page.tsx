"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, Heart, Search, ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const mockWishlistItems = [
  {
    id: "1",
    title: "Monstera Deliciosa",
    price: 45.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Indoor Plants",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    discount: 23,
    addedDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Fiddle Leaf Fig",
    price: 89.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Indoor Plants",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    discount: 10,
    addedDate: "2024-01-12",
  },
  {
    id: "3",
    title: "Snake Plant",
    price: 29.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Indoor Plants",
    rating: 4.9,
    reviews: 156,
    inStock: false,
    discount: 14,
    addedDate: "2024-01-10",
  },
  {
    id: "4",
    title: "Peace Lily",
    price: 34.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Indoor Plants",
    rating: 4.7,
    reviews: 92,
    inStock: true,
    discount: 13,
    addedDate: "2024-01-08",
  },
  {
    id: "5",
    title: "Rubber Plant",
    price: 52.99,
    originalPrice: 62.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Indoor Plants",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    discount: 16,
    addedDate: "2024-01-05",
  },
  {
    id: "6",
    title: "Aloe Vera",
    price: 19.99,
    originalPrice: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Succulents",
    rating: 4.8,
    reviews: 203,
    inStock: true,
    discount: 20,
    addedDate: "2024-01-03",
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockWishlistItems);

  useEffect(() => {
    const filtered = wishlistItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, wishlistItems]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (item: any) => {
    if (!item.inStock) {
      toast.error("Item is out of stock");
      return;
    }
    toast.success(`${item.title} added to cart`);
  };

  const moveAllToCart = () => {
    const inStockItems = filteredItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      toast.error("No items in stock to add to cart");
      return;
    }
    toast.success(`${inStockItems.length} items added to cart`);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
  };

  const totalValue = filteredItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = filteredItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Wishlist</h2>
            <p className="text-muted-foreground">
              {filteredItems.length} items saved • Total value: $
              {totalValue.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {filteredItems.length > 0 && (
              <>
                <Button variant="outline" onClick={clearWishlist}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button onClick={moveAllToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Items in your wishlist
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Current market value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Savings
              </CardTitle>
              <Badge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalSavings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Potential savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Wishlist Items</CardTitle>
            <CardDescription>
              Manage your saved items and add them to cart when ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search wishlist items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Wishlist Items */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start adding items to your wishlist to keep track of products
                  you love
                </p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{item.discount}%
                          </Badge>
                        )}
                        {!item.inStock && (
                          <Badge className="absolute top-2 right-2 bg-gray-500">
                            Out of Stock
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <h3 className="font-semibold text-lg leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(item.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.rating} ({item.reviews})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-green-600">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Added on {item.addedDate}
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          onClick={() => addToCart(item)}
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Link href={`/products/${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        {filteredItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>You might also like</CardTitle>
              <CardDescription>
                Based on your wishlist preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={`/placeholder.svg?height=150&width=150`}
                        alt={`Recommended plant ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-medium text-sm">
                      Recommended Plant {i}
                    </h4>
                    <p className="text-sm text-green-600 font-semibold">
                      $24.99
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Add to Wishlist
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
