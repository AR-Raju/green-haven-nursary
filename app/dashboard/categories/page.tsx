"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CategoryModal from "@/components/admin/CategoryModal";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/redux/slices/categoriesSlice";
import {
  deleteCategory,
  fetchCategories,
} from "@/redux/slices/categoriesSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Edit,
  Folder,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  const [user, setUser] = useState<any>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await dispatch(deleteCategory(selectedCategory._id)).unwrap();
        toast({
          title: "Category Deleted",
          description: "Category has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Failed to delete category. It may have associated products.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const stats = {
    total: categories.length,
    active: categories.length,
    withProducts: categories.length, // This would need to be calculated from products
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Manage your product categories and organization
            </p>
          </div>
          {user?.role === "admin" && (
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Categories
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                With Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withProducts}</div>
              <p className="text-xs text-muted-foreground">Categories in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">From last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Management */}
        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>
              Organize your products with categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-md overflow-hidden">
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-muted-foreground">
                            {category.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">0 products</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {user?.role === "admin" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(category)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Category Modal */}
        {user?.role === "admin" && (
          <>
            <CategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              category={selectedCategory}
            />

            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDelete}
              title="Delete Category"
              description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
