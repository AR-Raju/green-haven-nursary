"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Filter, Star, Tag, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ProductFilterProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
}

export default function ProductFilter({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}: ProductFilterProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    onFilterChange({
      category: checked ? categoryId : "",
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFilterChange({
      minPrice: values[0] > 0 ? values[0] : undefined,
      maxPrice: values[1] < 1000 ? values[1] : undefined,
    });
  };

  const handleMinPriceChange = (value: string) => {
    const minPrice = Number(value);
    onFilterChange({
      minPrice: minPrice > 0 ? minPrice : undefined,
    });
  };

  const handleMaxPriceChange = (value: string) => {
    const maxPrice = Number(value);
    onFilterChange({
      maxPrice: maxPrice > 0 && maxPrice < 1000 ? maxPrice : undefined,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFilterChange({
      inStock: checked || undefined,
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.inStock,
  ].filter(Boolean).length;

  const currentMinPrice = filters.minPrice || 0;
  const currentMaxPrice = filters.maxPrice || 1000;

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
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
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
                checked={filters.category === category._id}
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
            value={[currentMinPrice, currentMaxPrice]}
            onValueChange={handlePriceRangeChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${currentMinPrice}</span>
            <span>${currentMaxPrice}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Min Price</label>
              <Input
                type="number"
                value={currentMinPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="h-8"
                min="0"
                max="1000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max Price</label>
              <Input
                type="number"
                value={currentMaxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="h-8"
                min="0"
                max="1000"
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
              <Checkbox checked={filters.rating === rating} aria-readonly />
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
              checked={filters.inStock || false}
              onCheckedChange={handleInStockChange}
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
    </div>
  );
}
