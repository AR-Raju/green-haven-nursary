"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { fetchProducts } from "@/redux/slices/productsSlice"
import Navbar from "@/components/Navbar"
import ProductFilter from "@/components/ProductFilter"
import ProductList from "@/components/ProductList"
import Pagination from "@/components/Pagination"
import Footer from "@/components/Footer"
import { useBeforeUnload } from "@/hooks/useBeforeUnload"

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { filters, currentPage } = useSelector((state: RootState) => state.products)

  useBeforeUnload()

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: currentPage }))
  }, [dispatch, filters, currentPage])

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground">Browse our extensive collection of plants and gardening supplies</p>
        </div>

        <div className="space-y-8">
          <ProductFilter />
          <ProductList filters={filters} page={currentPage} />
          <Pagination />
        </div>
      </div>

      <Footer />
    </div>
  )
}
