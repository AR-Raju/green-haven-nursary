import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find({}).sort({ name: 1 })

    return NextResponse.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description, image } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 })
    }

    const category = await Category.create({
      name,
      description,
      image: image || "/placeholder.svg?height=200&width=200",
    })

    return NextResponse.json(
      {
        success: true,
        category,
        message: "Category created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Category name already exists" }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
