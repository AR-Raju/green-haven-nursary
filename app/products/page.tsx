"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import ProductFilter from "@/components/ProductFilter";
import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { fetchProducts } from "@/redux/slices/productsSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Filter, Grid, List } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { filters, currentPage, totalProducts, loading } = useSelector(
    (state: RootState) => state.products
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useBeforeUnload();

  useEffect(() => {
    // Get initial filters from URL params
    const initialFilters = {
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      rating: searchParams.get("rating")
        ? Number(searchParams.get("rating"))
        : undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    dispatch(fetchProducts({ ...initialFilters, page: currentPage }));
  }, [dispatch, searchParams, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-gray-600 mb-4">
            Discover our extensive collection of plants, tools, and gardening
            supplies
          </p>

          {/* Results Info & View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              {loading
                ? "Loading products..."
                : `Showing ${(currentPage - 1) * 12 + 1}-${Math.min(
                    currentPage * 12,
                    totalProducts
                  )} of ${totalProducts} products`}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <ProductFilter />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilter />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ProductList viewMode={viewMode} />
            <div className="mt-8">
              <Pagination />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
