"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/redux/slices/cartSlice";
import type { Product } from "@/redux/slices/productsSlice";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ product }));
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}
            {product.inStock && product.quantity < 10 && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                Low Stock
              </Badge>
            )}
          </div>

          <div className="py-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Badge variant="outline">{product.category.name}</Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full"
            variant={product.inStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
