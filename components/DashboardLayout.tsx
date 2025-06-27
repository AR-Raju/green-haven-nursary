"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  FileText,
  FolderOpen,
  Heart,
  Home,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["user", "vendor", "admin"],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/dashboard/orders",
      roles: ["user", "vendor", "admin"],
    },
    {
      title: "Wishlist",
      icon: Heart,
      href: "/dashboard/wishlist",
      roles: ["user"],
    },
    {
      title: "Products",
      icon: Package,
      href: "/dashboard/products",
      roles: ["vendor", "admin"],
    },
    {
      title: "Categories",
      icon: FolderOpen,
      href: "/dashboard/categories",
      roles: ["admin", "vendor"],
    },
    {
      title: "Reviews",
      icon: MessageSquare,
      href: "/dashboard/reviews",
      roles: ["admin", "vendor"],
    },
    {
      title: "Blog",
      icon: FileText,
      href: "/dashboard/blog",
      roles: ["admin", "vendor"],
    },
    {
      title: "Users",
      icon: Users,
      href: "/dashboard/users",
      roles: ["admin"],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      roles: ["vendor", "admin"],
    },
    {
      title: "Shipping",
      icon: Truck,
      href: "/dashboard/shipping",
      roles: ["admin"],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["user", "vendor", "admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex">
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

          <SidebarContent className="p-4">
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href &&
                        "bg-green-100 text-green-700 hover:bg-green-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="text-xs">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-white border-b px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex flex-col h-full">
                      <div className="border-b p-4">
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
                      </div>

                      <div className="flex-1 p-4">
                        <nav className="space-y-2">
                          {filteredMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.href
                                  ? "bg-green-100 text-green-700"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          ))}
                        </nav>
                      </div>

                      <div className="border-t p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="text-xs">
                              {user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <SidebarTrigger className="hidden lg:flex" />

                <div className="hidden lg:block">
                  <h1 className="text-xl font-semibold">
                    {pathname === "/dashboard" && "Dashboard"}
                    {pathname === "/dashboard/orders" && "Orders"}
                    {pathname === "/dashboard/wishlist" && "Wishlist"}
                    {pathname === "/dashboard/products" && "Products"}
                    {pathname === "/dashboard/categories" && "Categories"}
                    {pathname === "/dashboard/reviews" && "Reviews"}
                    {pathname === "/dashboard/blog" && "Blog"}
                    {pathname === "/dashboard/users" && "Users"}
                    {pathname === "/dashboard/analytics" && "Analytics"}
                    {pathname === "/dashboard/shipping" && "Shipping"}
                    {pathname === "/dashboard/settings" && "Settings"}
                    {pathname === "/dashboard/profile" && "Profile"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>

                {/* Back to Store */}
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Store
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">
                          {user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <Badge
                          variant="outline"
                          className="w-fit text-xs capitalize"
                        >
                          {user.role}
                        </Badge>
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
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Back to Store</span>
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
          <main className="flex-1 p-4 lg:p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
