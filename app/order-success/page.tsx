"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"

export default function OrderSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any cart data from localStorage on successful order
    if (typeof window !== "undefined") {
      localStorage.removeItem("nursery-cart")
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your order. We've received your request and will process it shortly.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">You'll receive an order confirmation email shortly</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">We'll prepare your plants with care</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Your order will be delivered within 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/products")} size="lg">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} size="lg">
                Back to Home
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:support@greenhaven.com" className="text-primary hover:underline">
                support@greenhaven.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
