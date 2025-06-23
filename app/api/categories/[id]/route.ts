import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"
import Product from "@/models/Product"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()

    const category = await Category.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      category,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: params.id })
    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete category with existing products" },
        { status: 400 },
      )
    }

    const category = await Category.findByIdAndDelete(params.id)

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
