import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Product from "@/models/Product"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { customerName, email, phone, address, items, totalAmount, paymentMethod } = body

    // Validate required fields
    if (!customerName || !email || !phone || !address || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.product}` }, { status: 400 })
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${product.title}` }, { status: 400 })
      }
    }

    // Create order
    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
    })

    // Update product quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } })
    }

    return NextResponse.json(
      {
        success: true,
        order,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const orders = await Order.find({}).populate("items.product", "title price image").sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
