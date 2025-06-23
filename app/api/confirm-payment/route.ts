import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await request.json();

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update order status in database
      await connectDB();

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "PAID",
          orderStatus: "PROCESSING",
        },
        { new: true }
      );

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order,
        paymentStatus: paymentIntent.status,
      });
    } else {
      return NextResponse.json(
        { error: "Payment not completed", paymentStatus: paymentIntent.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to confirm payment",
      },
      { status: 500 }
    );
  }
}
