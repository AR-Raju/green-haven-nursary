"use client";

import { Label } from "@/components/ui/label";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "Monstera Deliciosa", quantity: 1, price: 45.99 },
      { name: "Snake Plant", quantity: 2, price: 29.99 },
    ],
    total: 105.97,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    address: {
      street: "123 Garden St",
      city: "Green Valley",
      state: "CA",
      zip: "90210",
    },
    tracking: "TRK123456789",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    items: [{ name: "Fiddle Leaf Fig", quantity: 1, price: 89.99 }],
    total: 89.99,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    address: {
      street: "456 Plant Ave",
      city: "Botanical City",
      state: "NY",
      zip: "10001",
    },
    tracking: "TRK987654321",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "Peace Lily", quantity: 3, price: 34.99 },
      { name: "Rubber Plant", quantity: 1, price: 52.99 },
    ],
    total: 157.96,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    orderDate: "2024-01-13",
    deliveryDate: "2024-01-16",
    address: {
      street: "789 Leaf Ln",
      city: "Flora Town",
      state: "TX",
      zip: "75001",
    },
    tracking: "TRK456789123",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 321-0987",
    items: [{ name: "Aloe Vera", quantity: 2, price: 19.99 }],
    total: 39.98,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "COD",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-15",
    address: {
      street: "321 Succulent St",
      city: "Desert Springs",
      state: "AZ",
      zip: "85001",
    },
    tracking: null,
  },
];

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success("Order status updated successfully");
  };

  const refreshOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Orders refreshed");
    }, 1000);
  };

  const exportOrders = () => {
    toast.success("Orders exported successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {user?.role === "admin" ? "All Orders" : "My Orders"}
            </h2>
            <p className="text-muted-foreground">
              {user?.role === "admin"
                ? "Manage and track all customer orders"
                : "Track your order history and status"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={refreshOrders}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {user?.role === "admin" && (
              <Button variant="outline" onClick={exportOrders}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredOrders.filter((o) => o.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredOrders.filter((o) => o.status === "shipped").length}
              </div>
              <p className="text-xs text-muted-foreground">In transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredOrders.filter((o) => o.status === "delivered").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage and track order status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {order.id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              className={getPaymentStatusColor(
                                order.paymentStatus
                              )}
                            >
                              {order.paymentStatus}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{order.orderDate}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Order Details - {selectedOrder?.id}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <Tabs
                                  defaultValue="details"
                                  className="space-y-4"
                                >
                                  <TabsList>
                                    <TabsTrigger value="details">
                                      Order Details
                                    </TabsTrigger>
                                    <TabsTrigger value="tracking">
                                      Tracking
                                    </TabsTrigger>
                                    <TabsTrigger value="customer">
                                      Customer Info
                                    </TabsTrigger>
                                  </TabsList>

                                  <TabsContent
                                    value="details"
                                    className="space-y-4"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">
                                            Order Information
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Order ID:
                                            </span>
                                            <span className="text-sm font-medium">
                                              {selectedOrder.id}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Date:
                                            </span>
                                            <span className="text-sm font-medium">
                                              {selectedOrder.orderDate}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Status:
                                            </span>
                                            <Badge
                                              className={getStatusColor(
                                                selectedOrder.status
                                              )}
                                            >
                                              {selectedOrder.status}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                              Payment:
                                            </span>
                                            <Badge
                                              className={getPaymentStatusColor(
                                                selectedOrder.paymentStatus
                                              )}
                                            >
                                              {selectedOrder.paymentStatus}
                                            </Badge>
                                          </div>
                                          {user?.role === "admin" && (
                                            <div className="pt-2">
                                              <Select
                                                value={selectedOrder.status}
                                                onValueChange={(value) =>
                                                  updateOrderStatus(
                                                    selectedOrder.id,
                                                    value
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="pending">
                                                    Pending
                                                  </SelectItem>
                                                  <SelectItem value="processing">
                                                    Processing
                                                  </SelectItem>
                                                  <SelectItem value="shipped">
                                                    Shipped
                                                  </SelectItem>
                                                  <SelectItem value="delivered">
                                                    Delivered
                                                  </SelectItem>
                                                  <SelectItem value="cancelled">
                                                    Cancelled
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">
                                            Shipping Address
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-sm space-y-1">
                                            <p className="font-medium">
                                              {selectedOrder.customer}
                                            </p>
                                            <p>
                                              {selectedOrder.address.street}
                                            </p>
                                            <p>
                                              {selectedOrder.address.city},{" "}
                                              {selectedOrder.address.state}{" "}
                                              {selectedOrder.address.zip}
                                            </p>
                                            <p className="text-muted-foreground">
                                              {selectedOrder.phone}
                                            </p>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Order Items
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Product</TableHead>
                                              <TableHead>Quantity</TableHead>
                                              <TableHead>Price</TableHead>
                                              <TableHead>Total</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedOrder.items.map(
                                              (item: any, index: number) => (
                                                <TableRow key={index}>
                                                  <TableCell className="font-medium">
                                                    {item.name}
                                                  </TableCell>
                                                  <TableCell>
                                                    {item.quantity}
                                                  </TableCell>
                                                  <TableCell>
                                                    ${item.price.toFixed(2)}
                                                  </TableCell>
                                                  <TableCell>
                                                    $
                                                    {(
                                                      item.price * item.quantity
                                                    ).toFixed(2)}
                                                  </TableCell>
                                                </TableRow>
                                              )
                                            )}
                                          </TableBody>
                                        </Table>
                                        <div className="text-right mt-4 pt-4 border-t">
                                          <p className="text-lg font-bold">
                                            Total: $
                                            {selectedOrder.total.toFixed(2)}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent
                                    value="tracking"
                                    className="space-y-4"
                                  >
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Tracking Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        {selectedOrder.tracking ? (
                                          <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                              <MapPin className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">
                                                Tracking Number:{" "}
                                                {selectedOrder.tracking}
                                              </span>
                                            </div>
                                            <div className="space-y-3">
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Order Delivered
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {selectedOrder.deliveryDate}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Out for Delivery
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {selectedOrder.deliveryDate}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    In Transit
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {selectedOrder.orderDate}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Order Placed
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {selectedOrder.orderDate}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-sm text-muted-foreground">
                                            Tracking information not available
                                            yet.
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent
                                    value="customer"
                                    className="space-y-4"
                                  >
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Customer Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-sm text-muted-foreground">
                                              Name
                                            </Label>
                                            <p className="font-medium">
                                              {selectedOrder.customer}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">
                                              Email
                                            </Label>
                                            <p className="font-medium">
                                              {selectedOrder.email}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">
                                              Phone
                                            </Label>
                                            <p className="font-medium">
                                              {selectedOrder.phone}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">
                                              Payment Method
                                            </Label>
                                            <p className="font-medium">
                                              {selectedOrder.paymentMethod}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
