"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Bell,
  Heart,
  Home,
  Leaf,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Truck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getUserMenuItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: ShoppingCart, label: "My Orders", href: "/dashboard/orders" },
      { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
      { icon: User, label: "Profile", href: "/dashboard/profile" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];

    if (user.role === "admin") {
      return [
        { icon: Home, label: "Dashboard", href: "/dashboard" },
        { icon: Package, label: "All Products", href: "/dashboard/products" },
        { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
        { icon: Users, label: "Users", href: "/dashboard/users" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
        { icon: Store, label: "Categories", href: "/dashboard/categories" },
        { icon: MessageSquare, label: "Reviews", href: "/dashboard/reviews" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      ];
    }

    if (user.role === "vendor") {
      return [
        { icon: Home, label: "Dashboard", href: "/dashboard" },
        { icon: Package, label: "My Products", href: "/dashboard/products" },
        { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
        { icon: Star, label: "Reviews", href: "/dashboard/reviews" },
        { icon: Truck, label: "Shipping", href: "/dashboard/shipping" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      ];
    }

    return baseItems;
  };

  const menuItems = getUserMenuItems();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-green-600">
                  Green Haven
                </span>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                {user.role === "admin"
                  ? "Admin Panel"
                  : user.role === "vendor"
                  ? "Vendor Panel"
                  : "My Account"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold">
                    {pathname === "/dashboard"
                      ? "Dashboard"
                      : pathname
                          .split("/")
                          .pop()
                          ?.replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Welcome back, {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
