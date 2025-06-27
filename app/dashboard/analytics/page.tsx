"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Download,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4000, orders: 240, customers: 120 },
  { month: "Feb", sales: 3000, orders: 198, customers: 98 },
  { month: "Mar", sales: 5000, orders: 300, customers: 150 },
  { month: "Apr", sales: 4500, orders: 278, customers: 139 },
  { month: "May", sales: 6000, orders: 389, customers: 195 },
  { month: "Jun", sales: 5500, orders: 349, customers: 175 },
  { month: "Jul", sales: 7000, orders: 420, customers: 210 },
  { month: "Aug", sales: 6500, orders: 390, customers: 195 },
  { month: "Sep", sales: 8000, orders: 480, customers: 240 },
  { month: "Oct", sales: 7500, orders: 450, customers: 225 },
  { month: "Nov", sales: 9000, orders: 540, customers: 270 },
  { month: "Dec", sales: 8500, orders: 510, customers: 255 },
];

const categoryData = [
  { name: "Indoor Plants", value: 400, color: "#22c55e" },
  { name: "Outdoor Plants", value: 300, color: "#3b82f6" },
  { name: "Tools & Equipment", value: 200, color: "#f59e0b" },
  { name: "Accessories", value: 150, color: "#ef4444" },
  { name: "Seeds", value: 100, color: "#8b5cf6" },
  { name: "Fertilizers", value: 80, color: "#06b6d4" },
];

const topProducts = [
  { name: "Monstera Deliciosa", sales: 156, revenue: 7020.44 },
  { name: "Fiddle Leaf Fig", sales: 134, revenue: 12056.66 },
  { name: "Snake Plant", sales: 128, revenue: 3839.72 },
  { name: "Peace Lily", sales: 98, revenue: 3429.02 },
  { name: "Rubber Plant", sales: 87, revenue: 4609.13 },
];

const trafficData = [
  { source: "Organic Search", visitors: 3420, percentage: 45.2 },
  { source: "Direct", visitors: 2180, percentage: 28.8 },
  { source: "Social Media", visitors: 980, percentage: 12.9 },
  { source: "Email", visitors: 650, percentage: 8.6 },
  { source: "Referral", visitors: 340, percentage: 4.5 },
];

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("12m");
  const [selectedMetric, setSelectedMetric] = useState("sales");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const kpiData = [
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
      title: "New Customers",
      value: "234",
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      description: "from last month",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "-2.1%",
      changeType: "negative",
      icon: TrendingUp,
      description: "from last month",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              {user?.role === "admin"
                ? "Comprehensive business analytics and insights"
                : user?.role === "vendor"
                ? "Your store performance and analytics"
                : "Your account activity analytics"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.changeType === "positive" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      kpi.changeType === "positive"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {kpi.change}
                  </span>
                  <span className="ml-1">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue and order trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
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
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>
                    Product category distribution
                  </CardDescription>
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

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>
                    Best selling products by revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} sales
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${product.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest business activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "New order received",
                        time: "2 minutes ago",
                        type: "order",
                      },
                      {
                        action: "Product updated",
                        time: "1 hour ago",
                        type: "product",
                      },
                      {
                        action: "Customer registered",
                        time: "2 hours ago",
                        type: "customer",
                      },
                      {
                        action: "Payment processed",
                        time: "3 hours ago",
                        type: "payment",
                      },
                      {
                        action: "Inventory updated",
                        time: "4 hours ago",
                        type: "inventory",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sales Performance</CardTitle>
                      <CardDescription>
                        Track your sales metrics over time
                      </CardDescription>
                    </div>
                    <Select
                      value={selectedMetric}
                      onValueChange={setSelectedMetric}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Revenue</SelectItem>
                        <SelectItem value="orders">Order Count</SelectItem>
                        <SelectItem value="customers">New Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: "#22c55e" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Comparison</CardTitle>
                    <CardDescription>
                      Compare current vs previous month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData.slice(-2)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales Goals</CardTitle>
                    <CardDescription>
                      Track progress towards monthly goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Monthly Revenue Goal</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        $8,500 / $10,000
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Order Count Goal</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        460 / 500 orders
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>New Customers Goal</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        195 / 250 customers
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    Top performing products by sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>
                    Sales distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
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

            <Card>
              <CardHeader>
                <CardTitle>Product Insights</CardTitle>
                <CardDescription>
                  Detailed product performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${product.revenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>
                    New customer acquisition over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="customers"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>
                    Customer distribution by value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        segment: "High Value",
                        count: 45,
                        percentage: 15,
                        color: "bg-green-500",
                      },
                      {
                        segment: "Medium Value",
                        count: 120,
                        percentage: 40,
                        color: "bg-blue-500",
                      },
                      {
                        segment: "Low Value",
                        count: 135,
                        percentage: 45,
                        color: "bg-gray-500",
                      },
                    ].map((segment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {segment.segment}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {segment.count} customers
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${segment.color} h-2 rounded-full`}
                            style={{ width: `${segment.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>
                  Key customer performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2,345</div>
                    <p className="text-sm text-muted-foreground">
                      Total Customers
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$189.50</div>
                    <p className="text-sm text-muted-foreground">
                      Avg Order Value
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">3.2</div>
                    <p className="text-sm text-muted-foreground">
                      Avg Orders/Customer
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-sm text-muted-foreground">
                      Retention Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>
                    Where your visitors come from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficData.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            {source.source}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {source.visitors.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {source.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page Views</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { page: "/", views: 12450, bounce: "32%" },
                      { page: "/products", views: 8920, bounce: "28%" },
                      { page: "/about", views: 3450, bounce: "45%" },
                      { page: "/contact", views: 2340, bounce: "52%" },
                      { page: "/blog", views: 1890, bounce: "38%" },
                    ].map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{page.page}</p>
                          <p className="text-xs text-muted-foreground">
                            Bounce rate: {page.bounce}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {page.views.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
                <CardDescription>Key website metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">29,340</div>
                    <p className="text-sm text-muted-foreground">
                      Total Visitors
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.4</div>
                    <p className="text-sm text-muted-foreground">
                      Pages/Session
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2:34</div>
                    <p className="text-sm text-muted-foreground">Avg Session</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">35.2%</div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
