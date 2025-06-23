"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductsAdmin from "@/components/admin/ProductsAdmin"
import CategoriesAdmin from "@/components/admin/CategoriesAdmin"
import OrdersAdmin from "@/components/admin/OrdersAdmin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, ShoppingCart, TrendingUp } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your nursery's products, categories, and orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 new this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("products")}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <Package className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                </button>

                <button
                  onClick={() => setActiveTab("categories")}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <FolderTree className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold">Manage Categories</h3>
                  <p className="text-sm text-muted-foreground">Organize product categories</p>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold">View Orders</h3>
                  <p className="text-sm text-muted-foreground">Process and track orders</p>
                </button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductsAdmin />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesAdmin />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersAdmin />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
