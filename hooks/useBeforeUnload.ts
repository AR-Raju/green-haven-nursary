"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export function useBeforeUnload() {
  const { totalItems } = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (totalItems > 0) {
        e.preventDefault()
        e.returnValue = "You have items in your cart. Are you sure you want to leave?"
        return "You have items in your cart. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [totalItems])
}
