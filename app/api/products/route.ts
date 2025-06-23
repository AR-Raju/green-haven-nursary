import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute queries
    const [products, totalProducts] = await Promise.all([
      Product.find(query).populate("category", "name").sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalProducts / limit)

    return NextResponse.json({
      success: true,
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { title, description, price, quantity, rating, image, category } = body

    // Validate required fields
    if (!title || !description || !price || !image || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if category exists
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 400 })
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      quantity: Number(quantity) || 0,
      rating: Number(rating) || 0,
      image,
      category,
    })

    await product.populate("category", "name")

    return NextResponse.json(
      {
        success: true,
        product,
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
