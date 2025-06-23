"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { fetchCategories } from "@/redux/slices/categoriesSlice"
import { setFilters } from "@/redux/slices/productsSlice"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

export default function ProductFilter() {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state.categories)
  const { filters } = useSelector((state: RootState) => state.products)

  const [searchTerm, setSearchTerm] = useState(filters.search)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearchTerm }))
  }, [debouncedSearchTerm, dispatch])

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category: category === "all" ? "" : category }))
  }

  const handleSortChange = (sort: string) => {
    const [sortBy, sortOrder] = sort.split("-")
    dispatch(setFilters({ sortBy, sortOrder: sortOrder as "asc" | "desc" }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    dispatch(
      setFilters({
        category: "",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    )
  }

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="title-asc">Name: A to Z</SelectItem>
            <SelectItem value="title-desc">Name: Z to A</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
