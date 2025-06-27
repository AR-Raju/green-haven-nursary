"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import { setFilters } from "@/redux/slices/productsSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { DollarSign, Filter, Search, Star, Tag, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { filters } = useSelector((state: RootState) => state.products);

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : 1000,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : 0,
    inStock: searchParams.get("inStock") === "true",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  const debouncedSearch = useDebounce(localFilters.search, 500);
  const debouncedPriceRange = useDebounce(
    [localFilters.minPrice, localFilters.maxPrice],
    500
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    updateFilters();
  }, [
    debouncedSearch,
    debouncedPriceRange,
    localFilters.category,
    localFilters.rating,
    localFilters.inStock,
    localFilters.sortBy,
    localFilters.sortOrder,
  ]);

  const updateFilters = () => {
    const newFilters = {
      search: debouncedSearch,
      category: localFilters.category,
      minPrice: localFilters.minPrice > 0 ? localFilters.minPrice : undefined,
      maxPrice:
        localFilters.maxPrice < 1000 ? localFilters.maxPrice : undefined,
      rating: localFilters.rating > 0 ? localFilters.rating : undefined,
      inStock: localFilters.inStock || undefined,
      sortBy: localFilters.sortBy,
      sortOrder: localFilters.sortOrder,
    };

    dispatch(setFilters(newFilters));

    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && !!value !== false) {
        params.set(key, String(value));
      }
    });

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.replace(newUrl, { scroll: false });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      category: checked ? categoryId : "",
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating,
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      inStock: false,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    };
    setLocalFilters(clearedFilters);
    router.replace("/products", { scroll: false });
  };

  const activeFiltersCount = [
    localFilters.search,
    localFilters.category,
    localFilters.minPrice > 0 || localFilters.maxPrice < 1000,
    localFilters.rating > 0,
    localFilters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, description..."
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <Checkbox
                id={category._id}
                checked={localFilters.category === category._id}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category._id, checked as boolean)
                }
              />
              <label
                htmlFor={category._id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {category.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[localFilters.minPrice, localFilters.maxPrice]}
            onValueChange={handlePriceRangeChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${localFilters.minPrice}</span>
            <span>${localFilters.maxPrice}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Min Price</label>
              <Input
                type="number"
                value={localFilters.minPrice}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    minPrice: Number(e.target.value),
                  }))
                }
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Price</label>
              <Input
                type="number"
                value={localFilters.maxPrice}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    maxPrice: Number(e.target.value),
                  }))
                }
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" />
            Customer Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => handleRatingChange(rating)}
            >
              <Checkbox checked={localFilters.rating === rating} />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">& up</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={localFilters.inStock}
              onCheckedChange={(checked) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  inStock: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { value: "createdAt-desc", label: "Newest First" },
            { value: "createdAt-asc", label: "Oldest First" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "title-asc", label: "Name: A to Z" },
            { value: "title-desc", label: "Name: Z to A" },
            { value: "rating-desc", label: "Highest Rated" },
          ].map((option) => {
            const [sortBy, sortOrder] = option.value.split("-");
            const isSelected =
              localFilters.sortBy === sortBy &&
              localFilters.sortOrder === sortOrder;

            return (
              <div
                key={option.value}
                className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded ${
                  isSelected ? "bg-green-50 border border-green-200" : ""
                }`}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    sortBy,
                    sortOrder: sortOrder as "asc" | "desc",
                  }))
                }
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isSelected ? "font-medium text-green-700" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
