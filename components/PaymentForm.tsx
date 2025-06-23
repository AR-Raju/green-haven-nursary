"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock } from "lucide-react"

interface PaymentFormProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PaymentForm({ amount, orderId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (error) {
        onError(error.message || "Payment failed")
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on server
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        })

        if (response.ok) {
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully",
          })
          onSuccess()
        } else {
          const errorData = await response.json()
          onError(errorData.error || "Failed to confirm payment")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      onError("An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button type="submit" disabled={!stripe || !elements || isProcessing} className="w-full" size="lg">
            {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
