"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 5000, orders: 300 },
  { name: "Apr", sales: 4500, orders: 278 },
  { name: "May", sales: 6000, orders: 389 },
  { name: "Jun", sales: 5500, orders: 349 },
];

const categoryData = [
  { name: "Indoor Plants", value: 400, color: "#22c55e" },
  { name: "Outdoor Plants", value: 300, color: "#3b82f6" },
  { name: "Tools", value: 200, color: "#f59e0b" },
  { name: "Accessories", value: 100, color: "#ef4444" },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Monstera Deliciosa",
    amount: 45.99,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Snake Plant",
    amount: 29.99,
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Fiddle Leaf Fig",
    amount: 89.99,
    status: "shipped",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "Peace Lily",
    amount: 34.99,
    status: "completed",
    date: "2024-01-12",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats =
    user?.role === "admin"
      ? [
          {
            title: "Total Revenue",
            value: "$45,231.89",
            change: "+20.1%",
            changeType: "positive",
            icon: DollarSign,
            description: "from last month",
          },
          {
            title: "Total Orders",
            value: "1,234",
            change: "+15.3%",
            changeType: "positive",
            icon: ShoppingCart,
            description: "from last month",
          },
          {
            title: "Total Products",
            value: "567",
            change: "+5.2%",
            changeType: "positive",
            icon: Package,
            description: "active products",
          },
          {
            title: "Total Users",
            value: "2,345",
            change: "+12.5%",
            changeType: "positive",
            icon: Users,
            description: "registered users",
          },
        ]
      : [
          {
            title: "My Orders",
            value: "12",
            change: "+2",
            changeType: "positive",
            icon: ShoppingCart,
            description: "this month",
          },
          {
            title: "Wishlist Items",
            value: "8",
            change: "+3",
            changeType: "positive",
            icon: Package,
            description: "saved items",
          },
          {
            title: "Total Spent",
            value: "$456.78",
            change: "+$89.12",
            changeType: "positive",
            icon: DollarSign,
            description: "this year",
          },
          {
            title: "Reviews Given",
            value: "15",
            change: "+5",
            changeType: "positive",
            icon: Star,
            description: "product reviews",
          },
        ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              {user?.role === "admin"
                ? "Here's what's happening with your store today."
                : "Here's an overview of your account activity."}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7 days
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30 days
            </Button>
            <Button
              variant={timeRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("90d")}
            >
              90 days
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {user?.role === "admin" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Monthly sales and order trends
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === "admin" ? "Recent Orders" : "My Recent Orders"}
            </CardTitle>
            <CardDescription>
              {user?.role === "admin"
                ? "Latest orders from your customers"
                : "Your recent purchase history"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user?.role === "admin" ? (
                <>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View All Orders
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Track Orders
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write Review
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sales Target</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Order Fulfillment</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">New order received</p>
                    <p className="text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Product updated</p>
                    <p className="text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Low stock alert</p>
                    <p className="text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
