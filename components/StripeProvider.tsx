"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type React from "react";

const stripePromise = loadStripe(
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string) ||
    "pk_test_51Rd3QFChRKNPVVwKEaIbq0qFg8I3mwB04Fy2b3GxGhFHzmktm5ztMCj5gzIhfTVH3BjaWxSWwMltOJ9RKE4VK8Pv006T8gSwFz"
);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#16a34a",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={clientSecret ? options : undefined}
    >
      {children}
    </Elements>
  );
}
