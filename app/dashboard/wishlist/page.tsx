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

// Add these imports at the top
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlistItems, loading } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const filteredItems = wishlistItems.filter((item) =>
    item?.productId?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const removeFromWishlistHandler = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (item: any) => {
    toast.success(`${item.product.title} added to cart`);
  };

  const moveAllToCart = () => {
    toast.success(`${filteredItems.length} items added to cart`);
  };

  const clearWishlist = () => {
    filteredItems.forEach((item) => {
      dispatch(removeFromWishlist(item.productId._id));
    });
    toast.success("Wishlist cleared");
  };

  const totalValue = filteredItems.reduce(
    (sum, item) => sum + item.productId.price,
    0
  );
  const totalSavings = filteredItems.reduce(
    (sum, item) => sum + (item.productId.price - item.productId.price),
    0
  );

  console.log("Wishlist Items:", filteredItems);

  // Update the loading condition
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                    key={item.productId._id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={item.productId.image || "/placeholder.svg"}
                          alt={item.productId.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.productId.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{item.productId.discount}%
                          </Badge>
                        )}
                        {!item.productId.inStock && (
                          <Badge className="absolute top-2 right-2 bg-gray-500">
                            Out of Stock
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() =>
                            removeFromWishlistHandler(item.productId._id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {item.productId.category}
                        </Badge>
                        <h3 className="font-semibold text-lg leading-tight">
                          {item.productId.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(item.productId.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.productId.rating} ({item.productId.reviews})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-green-600">
                            ${item.productId.price.toFixed(2)}
                          </span>
                          {item.productId.originalPrice >
                            item.productId.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.productId.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Added on {item.addedAt}
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          onClick={() => addToCart(item)}
                          disabled={!item.productId.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.productId.inStock
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </Button>
                        <Link href={`/products/${item.productId._id}`}>
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
