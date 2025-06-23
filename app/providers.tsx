"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/redux/store"
import StripeProvider from "@/components/StripeProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StripeProvider>{children}</StripeProvider>
    </Provider>
  )
}
