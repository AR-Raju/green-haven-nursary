"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Ban,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20",
    orders: 12,
    totalSpent: 456.78,
    address: {
      street: "123 Garden St",
      city: "Green Valley",
      state: "CA",
      zip: "90210",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    role: "vendor",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-19",
    orders: 0,
    totalSpent: 0,
    products: 25,
    totalSales: 2340.5,
    address: {
      street: "456 Plant Ave",
      city: "Botanical City",
      state: "NY",
      zip: "10001",
    },
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    role: "user",
    status: "suspended",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-08",
    lastLogin: "2024-01-18",
    orders: 8,
    totalSpent: 234.56,
    address: {
      street: "789 Leaf Ln",
      city: "Flora Town",
      state: "TX",
      zip: "75001",
    },
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 321-0987",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-05",
    lastLogin: "2024-01-20",
    orders: 0,
    totalSpent: 0,
    address: {
      street: "321 Succulent St",
      city: "Desert Springs",
      state: "AZ",
      zip: "85001",
    },
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    phone: "+1 (555) 654-3210",
    role: "user",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-03",
    lastLogin: "2024-01-10",
    orders: 3,
    totalSpent: 89.99,
    address: {
      street: "654 Fern St",
      city: "Greenwood",
      state: "WA",
      zip: "98001",
    },
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success("User status updated successfully");
  };

  const updateUserRole = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    toast.success("User role updated successfully");
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast.success("User deleted successfully");
  };

  const stats = {
    total: filteredUsers.length,
    active: filteredUsers.filter((u) => u.status === "active").length,
    admins: filteredUsers.filter((u) => u.role === "admin").length,
    vendors: filteredUsers.filter((u) => u.role === "vendor").length,
    users: filteredUsers.filter((u) => u.role === "user").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.admins}
              </div>
              <p className="text-xs text-muted-foreground">Admin accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.vendors}
              </div>
              <p className="text-xs text-muted-foreground">Vendor accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.users}
              </div>
              <p className="text-xs text-muted-foreground">Customer accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          {user.role === "user" && (
                            <div className="text-sm">
                              <p>{user.orders} orders</p>
                              <p className="text-muted-foreground">
                                ${user.totalSpent.toFixed(2)} spent
                              </p>
                            </div>
                          )}
                          {user.role === "vendor" && (
                            <div className="text-sm">
                              <p>{user.products} products</p>
                              <p className="text-muted-foreground">
                                ${user.totalSales?.toFixed(2)} sales
                              </p>
                            </div>
                          )}
                          {user.role === "admin" && (
                            <div className="text-sm">
                              <p>Admin user</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                {selectedUser && (
                                  <Tabs
                                    defaultValue="profile"
                                    className="space-y-4"
                                  >
                                    <TabsList>
                                      <TabsTrigger value="profile">
                                        Profile
                                      </TabsTrigger>
                                      <TabsTrigger value="activity">
                                        Activity
                                      </TabsTrigger>
                                      <TabsTrigger value="settings">
                                        Settings
                                      </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                      value="profile"
                                      className="space-y-4"
                                    >
                                      <div className="flex items-center space-x-4">
                                        <Avatar className="h-16 w-16">
                                          <AvatarImage
                                            src={
                                              selectedUser.avatar ||
                                              "/placeholder.svg"
                                            }
                                          />
                                          <AvatarFallback className="text-lg">
                                            {selectedUser.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="text-xl font-semibold">
                                            {selectedUser.name}
                                          </h3>
                                          <p className="text-muted-foreground">
                                            {selectedUser.email}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <Badge
                                              className={getRoleColor(
                                                selectedUser.role
                                              )}
                                            >
                                              {selectedUser.role}
                                            </Badge>
                                            <Badge
                                              className={getStatusColor(
                                                selectedUser.status
                                              )}
                                            >
                                              {selectedUser.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                              {selectedUser.email}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                              {selectedUser.phone}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                              Joined {selectedUser.joinDate}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm">
                                              <p>
                                                {selectedUser.address.street}
                                              </p>
                                              <p>
                                                {selectedUser.address.city},{" "}
                                                {selectedUser.address.state}{" "}
                                                {selectedUser.address.zip}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </TabsContent>

                                    <TabsContent
                                      value="activity"
                                      className="space-y-4"
                                    >
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <Card>
                                            <CardHeader className="pb-2">
                                              <CardTitle className="text-sm">
                                                Last Login
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <p className="text-lg font-semibold">
                                                {selectedUser.lastLogin}
                                              </p>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardHeader className="pb-2">
                                              <CardTitle className="text-sm">
                                                Account Status
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <Badge
                                                className={getStatusColor(
                                                  selectedUser.status
                                                )}
                                              >
                                                {selectedUser.status}
                                              </Badge>
                                            </CardContent>
                                          </Card>
                                        </div>

                                        {selectedUser.role === "user" && (
                                          <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                              <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                  Total Orders
                                                </CardTitle>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="text-2xl font-bold">
                                                  {selectedUser.orders}
                                                </p>
                                              </CardContent>
                                            </Card>
                                            <Card>
                                              <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                  Total Spent
                                                </CardTitle>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="text-2xl font-bold">
                                                  $
                                                  {selectedUser.totalSpent.toFixed(
                                                    2
                                                  )}
                                                </p>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        )}

                                        {selectedUser.role === "vendor" && (
                                          <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                              <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                  Products Listed
                                                </CardTitle>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="text-2xl font-bold">
                                                  {selectedUser.products}
                                                </p>
                                              </CardContent>
                                            </Card>
                                            <Card>
                                              <CardHeader className="pb-2">
                                                <CardTitle className="text-sm">
                                                  Total Sales
                                                </CardTitle>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="text-2xl font-bold">
                                                  $
                                                  {selectedUser.totalSales?.toFixed(
                                                    2
                                                  )}
                                                </p>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        )}
                                      </div>
                                    </TabsContent>

                                    <TabsContent
                                      value="settings"
                                      className="space-y-4"
                                    >
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">
                                            Role
                                          </label>
                                          <Select
                                            value={selectedUser.role}
                                            onValueChange={(value) =>
                                              updateUserRole(
                                                selectedUser.id,
                                                value
                                              )
                                            }
                                          >
                                            <SelectTrigger className="mt-1">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="user">
                                                User
                                              </SelectItem>
                                              <SelectItem value="vendor">
                                                Vendor
                                              </SelectItem>
                                              <SelectItem value="admin">
                                                Admin
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium">
                                            Status
                                          </label>
                                          <Select
                                            value={selectedUser.status}
                                            onValueChange={(value) =>
                                              updateUserStatus(
                                                selectedUser.id,
                                                value
                                              )
                                            }
                                          >
                                            <SelectTrigger className="mt-1">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="active">
                                                Active
                                              </SelectItem>
                                              <SelectItem value="inactive">
                                                Inactive
                                              </SelectItem>
                                              <SelectItem value="suspended">
                                                Suspended
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="flex space-x-2 pt-4">
                                          <Button
                                            variant="destructive"
                                            onClick={() =>
                                              deleteUser(selectedUser.id)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete User
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateUserStatus(
                                                selectedUser.id,
                                                selectedUser.status ===
                                                  "suspended"
                                                  ? "active"
                                                  : "suspended"
                                              )
                                            }
                                          >
                                            <Ban className="h-4 w-4 mr-2" />
                                            {selectedUser.status === "suspended"
                                              ? "Unsuspend"
                                              : "Suspend"}
                                          </Button>
                                        </div>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
