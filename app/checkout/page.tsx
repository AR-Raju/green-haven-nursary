"use client";

import type React from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PaymentForm from "@/components/PaymentForm";
import StripeProvider from "@/components/StripeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { clearCart } from "@/redux/slices/cartSlice";
import { createOrder } from "@/redux/slices/ordersSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { CreditCard, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.orders);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    paymentMethod: "COD" as "COD" | "STRIPE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string>("");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim())
      newErrors.customerName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.street.trim())
      newErrors.street = "Street address is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";
    if (!formData.address.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const createPaymentIntent = async (orderId: string) => {
    try {
      const response = await apiRequest("/payment/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          amount: totalAmount,
          currency: "usd",
          metadata: {
            orderId,
          },
        }),
      });

      setClientSecret(response.data.clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      toast({
        title: "Payment Setup Failed",
        description: "Failed to setup payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      setCurrentOrderId(result._id);

      if (formData.paymentMethod === "STRIPE") {
        // Create payment intent for Stripe
        await createPaymentIntent(result._id);
      } else {
        // COD order - complete immediately
        dispatch(clearCart());
        toast({
          title: "Order Placed Successfully!",
          description:
            "Thank you for your order. You will receive a confirmation email shortly.",
        });
        router.push("/order-success");
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
    router.push("/order-success");
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checkout.
            </p>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPaymentForm && clientSecret) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>
          <div className="max-w-md mx-auto">
            <StripeProvider clientSecret={clientSecret}>
              <PaymentForm
                amount={totalAmount}
                orderId={currentOrderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        handleInputChange("customerName", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                    placeholder="Enter your street address"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleInputChange("address.city", e.target.value)
                      }
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        handleInputChange("address.state", e.target.value)
                      }
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        handleInputChange("address.zipCode", e.target.value)
                      }
                      placeholder="ZIP Code"
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="STRIPE" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">
                          Secure payment with Stripe
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × $
                          {item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading
                    ? "Processing..."
                    : formData.paymentMethod === "STRIPE"
                    ? "Continue to Payment"
                    : "Place Order"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
