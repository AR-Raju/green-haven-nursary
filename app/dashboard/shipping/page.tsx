"use client";

import type React from "react";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Clock,
  DollarSign,
  Edit,
  MapPin,
  Package,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  methods: ShippingMethod[];
  isActive: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: string;
  freeShippingThreshold?: number;
  isActive: boolean;
}

export default function ShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([
    {
      id: "1",
      name: "Local Delivery",
      regions: ["City Center", "Suburbs", "Downtown"],
      methods: [
        {
          id: "1",
          name: "Same Day Delivery",
          description: "Delivered within 24 hours",
          cost: 15,
          estimatedDays: "Same day",
          isActive: true,
        },
        {
          id: "2",
          name: "Next Day Delivery",
          description: "Delivered next business day",
          cost: 10,
          estimatedDays: "1 business day",
          isActive: true,
        },
      ],
      isActive: true,
    },
    {
      id: "2",
      name: "National Shipping",
      regions: ["All States", "Nationwide"],
      methods: [
        {
          id: "3",
          name: "Standard Shipping",
          description: "Regular delivery service",
          cost: 8,
          estimatedDays: "3-5 business days",
          freeShippingThreshold: 50,
          isActive: true,
        },
        {
          id: "4",
          name: "Express Shipping",
          description: "Fast delivery service",
          cost: 20,
          estimatedDays: "1-2 business days",
          isActive: true,
        },
      ],
      isActive: true,
    },
  ]);

  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(
    null
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");

  const [zoneForm, setZoneForm] = useState({
    name: "",
    regions: "",
    isActive: true,
  });

  const [methodForm, setMethodForm] = useState({
    name: "",
    description: "",
    cost: 0,
    estimatedDays: "",
    freeShippingThreshold: 0,
    isActive: true,
  });

  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newZone: ShippingZone = {
      id: editingZone?.id || Date.now().toString(),
      name: zoneForm.name,
      regions: zoneForm.regions.split(",").map((r) => r.trim()),
      methods: editingZone?.methods || [],
      isActive: zoneForm.isActive,
    };

    if (editingZone) {
      setZones(zones.map((z) => (z.id === editingZone.id ? newZone : z)));
      toast.success("Shipping zone updated successfully");
    } else {
      setZones([...zones, newZone]);
      toast.success("Shipping zone created successfully");
    }

    setIsZoneDialogOpen(false);
    setEditingZone(null);
    setZoneForm({ name: "", regions: "", isActive: true });
  };

  const handleMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedZoneId) {
      toast.error("Please select a shipping zone");
      return;
    }

    const newMethod: ShippingMethod = {
      id: editingMethod?.id || Date.now().toString(),
      name: methodForm.name,
      description: methodForm.description,
      cost: methodForm.cost,
      estimatedDays: methodForm.estimatedDays,
      freeShippingThreshold: methodForm.freeShippingThreshold || undefined,
      isActive: methodForm.isActive,
    };

    setZones(
      zones.map((zone) => {
        if (zone.id === selectedZoneId) {
          if (editingMethod) {
            return {
              ...zone,
              methods: zone.methods.map((m) =>
                m.id === editingMethod.id ? newMethod : m
              ),
            };
          } else {
            return {
              ...zone,
              methods: [...zone.methods, newMethod],
            };
          }
        }
        return zone;
      })
    );

    toast.success(
      editingMethod
        ? "Shipping method updated successfully"
        : "Shipping method created successfully"
    );
    setIsMethodDialogOpen(false);
    setEditingMethod(null);
    setMethodForm({
      name: "",
      description: "",
      cost: 0,
      estimatedDays: "",
      freeShippingThreshold: 0,
      isActive: true,
    });
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      regions: zone.regions.join(", "),
      isActive: zone.isActive,
    });
    setIsZoneDialogOpen(true);
  };

  const handleEditMethod = (method: ShippingMethod, zoneId: string) => {
    setEditingMethod(method);
    setSelectedZoneId(zoneId);
    setMethodForm({
      name: method.name,
      description: method.description,
      cost: method.cost,
      estimatedDays: method.estimatedDays,
      freeShippingThreshold: method.freeShippingThreshold || 0,
      isActive: method.isActive,
    });
    setIsMethodDialogOpen(true);
  };

  const handleDeleteZone = (zoneId: string) => {
    setZones(zones.filter((z) => z.id !== zoneId));
    toast.success("Shipping zone deleted successfully");
  };

  const handleDeleteMethod = (zoneId: string, methodId: string) => {
    setZones(
      zones.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            methods: zone.methods.filter((m) => m.id !== methodId),
          };
        }
        return zone;
      })
    );
    toast.success("Shipping method deleted successfully");
  };

  const toggleZoneStatus = (zoneId: string) => {
    setZones(
      zones.map((zone) => {
        if (zone.id === zoneId) {
          return { ...zone, isActive: !zone.isActive };
        }
        return zone;
      })
    );
  };

  const toggleMethodStatus = (zoneId: string, methodId: string) => {
    setZones(
      zones.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            methods: zone.methods.map((method) => {
              if (method.id === methodId) {
                return { ...method, isActive: !method.isActive };
              }
              return method;
            }),
          };
        }
        return zone;
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Shipping Management</h1>
            <p className="text-gray-600">
              Configure shipping zones, methods, and rates
            </p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingZone(null);
                    setZoneForm({ name: "", regions: "", isActive: true });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingZone ? "Edit Shipping Zone" : "Add Shipping Zone"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure shipping zones for different regions
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleZoneSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="zoneName">Zone Name</Label>
                    <Input
                      id="zoneName"
                      value={zoneForm.name}
                      onChange={(e) =>
                        setZoneForm({ ...zoneForm, name: e.target.value })
                      }
                      placeholder="e.g., Local Delivery, National Shipping"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="regions">Regions (comma-separated)</Label>
                    <Input
                      id="regions"
                      value={zoneForm.regions}
                      onChange={(e) =>
                        setZoneForm({ ...zoneForm, regions: e.target.value })
                      }
                      placeholder="e.g., City Center, Suburbs, Downtown"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="zoneActive"
                      checked={zoneForm.isActive}
                      onCheckedChange={(checked) =>
                        setZoneForm({ ...zoneForm, isActive: checked })
                      }
                    />
                    <Label htmlFor="zoneActive">Active</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsZoneDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingZone ? "Update" : "Create"} Zone
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isMethodDialogOpen}
              onOpenChange={setIsMethodDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingMethod(null);
                    setMethodForm({
                      name: "",
                      description: "",
                      cost: 0,
                      estimatedDays: "",
                      freeShippingThreshold: 0,
                      isActive: true,
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingMethod
                      ? "Edit Shipping Method"
                      : "Add Shipping Method"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure shipping methods and rates
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMethodSubmit} className="space-y-4">
                  {!editingMethod && (
                    <div>
                      <Label htmlFor="zoneSelect">Shipping Zone</Label>
                      <Select
                        value={selectedZoneId}
                        onValueChange={setSelectedZoneId}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipping zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="methodName">Method Name</Label>
                    <Input
                      id="methodName"
                      value={methodForm.name}
                      onChange={(e) =>
                        setMethodForm({ ...methodForm, name: e.target.value })
                      }
                      placeholder="e.g., Standard Shipping, Express Delivery"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={methodForm.description}
                      onChange={(e) =>
                        setMethodForm({
                          ...methodForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the shipping method"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={methodForm.cost}
                        onChange={(e) =>
                          setMethodForm({
                            ...methodForm,
                            cost: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedDays">Estimated Delivery</Label>
                      <Input
                        id="estimatedDays"
                        value={methodForm.estimatedDays}
                        onChange={(e) =>
                          setMethodForm({
                            ...methodForm,
                            estimatedDays: e.target.value,
                          })
                        }
                        placeholder="e.g., 3-5 business days"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="freeThreshold">
                      Free Shipping Threshold ($)
                    </Label>
                    <Input
                      id="freeThreshold"
                      type="number"
                      step="0.01"
                      value={methodForm.freeShippingThreshold}
                      onChange={(e) =>
                        setMethodForm({
                          ...methodForm,
                          freeShippingThreshold:
                            Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00 (optional)"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="methodActive"
                      checked={methodForm.isActive}
                      onCheckedChange={(checked) =>
                        setMethodForm({ ...methodForm, isActive: checked })
                      }
                    />
                    <Label htmlFor="methodActive">Active</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsMethodDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingMethod ? "Update" : "Create"} Method
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Zones
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.filter((z) => z.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Shipping Methods
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.reduce((total, zone) => total + zone.methods.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {zones.reduce((total, zone) => {
                  const zoneCosts = zone.methods.reduce(
                    (sum, method) => sum + method.cost,
                    0
                  );
                  return total + zoneCosts;
                }, 0) /
                  Math.max(
                    zones.reduce(
                      (total, zone) => total + zone.methods.length,
                      0
                    ),
                    1
                  )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Free Shipping Options
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {zones.reduce(
                  (total, zone) =>
                    total +
                    zone.methods.filter(
                      (method) => method.freeShippingThreshold
                    ).length,
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Zones */}
        <Tabs defaultValue="zones" className="space-y-4">
          <TabsList>
            <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
            <TabsTrigger value="methods">All Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{zone.name}</span>
                        <Badge
                          variant={zone.isActive ? "default" : "secondary"}
                        >
                          {zone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Regions: {zone.regions.join(", ")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={zone.isActive}
                        onCheckedChange={() => toggleZoneStatus(zone.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditZone(zone)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Shipping Methods</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedZoneId(zone.id);
                          setEditingMethod(null);
                          setMethodForm({
                            name: "",
                            description: "",
                            cost: 0,
                            estimatedDays: "",
                            freeShippingThreshold: 0,
                            isActive: true,
                          });
                          setIsMethodDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Method
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {zone.methods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium">{method.name}</h5>
                              <Badge
                                variant={
                                  method.isActive ? "default" : "secondary"
                                }
                              >
                                {method.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />$
                                {method.cost}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {method.estimatedDays}
                              </span>
                              {method.freeShippingThreshold && (
                                <span className="text-green-600">
                                  Free over ${method.freeShippingThreshold}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={method.isActive}
                              onCheckedChange={() =>
                                toggleMethodStatus(zone.id, method.id)
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMethod(method, zone.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteMethod(zone.id, method.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {zone.methods.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No shipping methods configured for this zone
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>All Shipping Methods</CardTitle>
                <CardDescription>
                  Overview of all configured shipping methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Free Shipping</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.flatMap((zone) =>
                      zone.methods.map((method) => (
                        <TableRow key={`${zone.id}-${method.id}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500">
                                {method.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{zone.name}</TableCell>
                          <TableCell>${method.cost}</TableCell>
                          <TableCell>{method.estimatedDays}</TableCell>
                          <TableCell>
                            {method.freeShippingThreshold ? (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                Over ${method.freeShippingThreshold}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                method.isActive ? "default" : "secondary"
                              }
                            >
                              {method.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditMethod(method, zone.id)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteMethod(zone.id, method.id)
                                }
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
