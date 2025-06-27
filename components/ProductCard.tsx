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
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg w-60">
        <CardContent className="p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {!product.inStock && (
              <Badge
                variant="destructive"
                className="absolute top-1 left-1 text-xs"
              >
                Out of Stock
              </Badge>
            )}
            {product.inStock && product.quantity < 10 && (
              <Badge
                variant="secondary"
                className="absolute top-1 left-1 text-xs"
              >
                Low Stock
              </Badge>
            )}
          </div>

          <div className="py-2">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-8 text-sm"
            variant={product.inStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
