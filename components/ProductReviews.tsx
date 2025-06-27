"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CheckCircle,
  MessageSquare,
  Star,
  ThumbsUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Review {
  _id: string;
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

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // Sample reviews data
  const sampleReviews: Review[] = [
    {
      _id: "1",
      userId: "user1",
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      rating: 5,
      comment:
        "Absolutely love this plant! It arrived in perfect condition and has been thriving in my living room. The packaging was excellent and the care instructions were very helpful.",
      status: "approved",
      helpfulVotes: 12,
      verifiedPurchase: true,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      _id: "2",
      userId: "user2",
      userName: "Mike Chen",
      userEmail: "mike@example.com",
      rating: 4,
      comment:
        "Great quality plant and fast shipping. Only giving 4 stars because it was slightly smaller than expected, but overall very happy with the purchase.",
      status: "approved",
      helpfulVotes: 8,
      verifiedPurchase: true,
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      _id: "3",
      userId: "user3",
      userName: "Emma Davis",
      userEmail: "emma@example.com",
      rating: 5,
      comment:
        "Perfect addition to my plant collection! Healthy, beautiful, and exactly as described. Will definitely order again.",
      status: "approved",
      helpfulVotes: 15,
      verifiedPurchase: true,
      createdAt: "2024-01-10T09:15:00Z",
    },
    {
      _id: "4",
      userId: "user4",
      userName: "David Wilson",
      userEmail: "david@example.com",
      rating: 3,
      comment:
        "The plant is okay, but it took longer to arrive than expected and had some minor damage to the leaves. Customer service was helpful though.",
      status: "approved",
      helpfulVotes: 3,
      verifiedPurchase: true,
      createdAt: "2024-01-08T16:45:00Z",
    },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate API call
    setTimeout(() => {
      setReviews(sampleReviews);
      setLoading(false);
    }, 1000);
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      // Simulate API call
      const review: Review = {
        _id: Date.now().toString(),
        userId: user.email,
        userName: user.name,
        userEmail: user.email,
        rating: newReview.rating,
        comment: newReview.comment,
        status: "pending",
        helpfulVotes: 0,
        verifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 0, comment: "" });
      setIsDialogOpen(false);
      toast.success(
        "Review submitted successfully! It will be visible after moderation."
      );
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? { ...review, helpfulVotes: review.helpfulVotes + 1 }
          : review
      )
    );
    toast.success("Thank you for your feedback!");
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= (interactive ? hoveredRating || rating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateRatingStats = () => {
    if (reviews.length === 0)
      return { average: 0, distribution: [0, 0, 0, 0, 0] };

    const approvedReviews = reviews.filter((r) => r.status === "approved");
    const total = approvedReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const average = total / approvedReviews.length;

    const distribution = [0, 0, 0, 0, 0];
    approvedReviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });

    return { average, distribution };
  };

  const { average, distribution } = calculateRatingStats();
  const approvedReviews = reviews.filter((r) => r.status === "approved");

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="mt-2">
                      {renderStars(newReview.rating, true, (rating) =>
                        setNewReview({ ...newReview, rating })
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      placeholder="Tell others about your experience with this product..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Review</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Rating Overview */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl font-bold">{average.toFixed(1)}</div>
                  <div>
                    {renderStars(Math.round(average))}
                    <p className="text-sm text-gray-600 mt-1">
                      Based on {approvedReviews.length} review
                      {approvedReviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Progress
                      value={
                        approvedReviews.length > 0
                          ? (distribution[rating - 1] /
                              approvedReviews.length) *
                            100
                          : 0
                      }
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-gray-600 w-8">
                      {distribution[rating - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to review this product!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Write the first review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {approvedReviews.length > 0 && (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{review.userName}</h4>
                          {review.verifiedPurchase && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">•</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    {review.adminResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Store Response
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {review.adminResponse}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review._id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({review.helpfulVotes})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
