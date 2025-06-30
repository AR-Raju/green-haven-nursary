"use client";

import type React from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { ProductCardSkeleton } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import {
  clearFilters,
  fetchProducts,
  setCurrentPage,
  setFilters,
} from "@/redux/slices/productsSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    filters,
  } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      ...(filters.category && { category: filters.category }),
      ...(filters.search && { searchTerm: filters.search }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.rating && { rating: filters.rating }),
      ...(filters.inStock && { inStock: filters.inStock }),
      ...(filters.sortBy &&
        filters.sortOrder && {
          sort: `${filters.sortOrder === "desc" ? "-" : ""}${filters.sortBy}`,
        }),
    };

    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ ...filters, search: searchTerm }));
    dispatch(setCurrentPage(1));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm("");
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    dispatch(setFilters({ ...filters, sortBy, sortOrder }));
    dispatch(setCurrentPage(1));
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={() => dispatch(fetchProducts({}))}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our wide selection of beautiful plants and gardening
            supplies
          </p>
        </div>

        {/* Mobile Search and Sort */}
        <div className="lg:hidden mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex gap-2">
            <Select
              value={`${filters.sortBy || "createdAt"}-${
                filters.sortOrder || "desc"
              }`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="title-asc">Name: A to Z</SelectItem>
                <SelectItem value="title-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <ProductFilter
                  categories={categories}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="flex gap-8">
          {/* Left Sidebar - Filters (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              {/* Desktop Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Search
                  </Button>
                </form>
              </div>

              {/* Desktop Sort */}
              <div className="mb-6">
                <Select
                  value={`${filters.sortBy || "createdAt"}-${
                    filters.sortOrder || "desc"
                  }`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="title-asc">Name: A to Z</SelectItem>
                    <SelectItem value="title-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters */}
              <ProductFilter
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {totalProducts} products
              </p>
              {(filters.search ||
                filters.category ||
                filters.minPrice ||
                filters.maxPrice ||
                filters.rating ||
                filters.inStock) && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalProducts={totalProducts}
                    productsPerPage={12}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
