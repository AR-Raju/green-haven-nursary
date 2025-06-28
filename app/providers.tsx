"use client";

import type React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { loadUserFromStorage } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthInitializer />
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}
