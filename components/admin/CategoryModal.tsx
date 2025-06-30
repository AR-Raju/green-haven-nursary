"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/redux/slices/categoriesSlice";
import {
  createCategory,
  fetchCategories,
  updateCategory,
} from "@/redux/slices/categoriesSlice";
import type { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (formData.name.length > 50)
      newErrors.name = "Category name must be 50 characters or less";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || "/placeholder.svg?height=200&width=200",
      };

      if (category) {
        console.log("Updating category:", category);
        await dispatch(updateCategory({ id: category?._id, ...categoryData }))
          .unwrap()
          .then(() => dispatch(fetchCategories({})));
        toast({
          title: "Category Updated",
          description: "Category has been successfully updated.",
        });
      } else {
        console.log("Creating category:", categoryData);
        await dispatch(createCategory(categoryData))
          .unwrap()
          .then(() => dispatch(fetchCategories({})));
        toast({
          title: "Category Created",
          description: "Category has been successfully created.",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
      toast({
        title: "Error",
        description: `Failed to ${category ? "update" : "create"} category.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter category name"
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter category description (optional)"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/200 characters
            </p>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => handleInputChange("image", url)}
            onRemove={() => handleInputChange("image", "")}
            label="Category Image"
            disabled={loading}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : category
                ? "Update Category"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
