"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Eye,
  MessageSquare,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: string;
  helpfulVotes: number;
  verifiedPurchase: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    reviewId: string,
    status: "approved" | "rejected",
    response?: string
  ) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminResponse: response }),
      });

      if (res.ok) {
        toast.success(`Review ${status} successfully`);
        fetchReviews();
        setIsResponseDialogOpen(false);
        setAdminResponse("");
      } else {
        throw new Error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const openResponseDialog = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.adminResponse || "");
    setIsResponseDialogOpen(true);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Reviews Management</h1>
          <p className="text-gray-600">Moderate and manage product reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter((r) => r.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              Manage customer reviews and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              review.productId.images[0] ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={review.productId.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">
                              {review.productId.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-gray-500">
                            {review.userEmail}
                          </div>
                          {review.verifiedPurchase && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">{review.comment}</p>
                          {review.helpfulVotes > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {review.helpfulVotes} helpful votes
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Details</DialogTitle>
                                <DialogDescription>
                                  Full review information and moderation options
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Product</Label>
                                    <p className="font-medium">
                                      {review.productId.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Customer</Label>
                                    <p className="font-medium">
                                      {review.userName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {review.userEmail}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Rating</Label>
                                  <div className="mt-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <div>
                                  <Label>Review Comment</Label>
                                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                                    {review.comment}
                                  </p>
                                </div>
                                {review.adminResponse && (
                                  <div>
                                    <Label>Admin Response</Label>
                                    <p className="mt-1 p-3 bg-blue-50 rounded-md">
                                      {review.adminResponse}
                                    </p>
                                  </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                  {review.status === "pending" && (
                                    <>
                                      <Button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            review._id,
                                            "approved"
                                          )
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          openResponseDialog(review)
                                        }
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Respond & Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {review.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(review._id, "approved")
                                }
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openResponseDialog(review)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Review
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this review?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(review._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Admin Response Dialog */}
        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Review with Response</DialogTitle>
              <DialogDescription>
                Provide feedback to the customer about why their review was
                rejected
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="response">Admin Response (Optional)</Label>
                <Textarea
                  id="response"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Explain why this review was rejected..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsResponseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    selectedReview &&
                    handleStatusUpdate(
                      selectedReview._id,
                      "rejected",
                      adminResponse
                    )
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
