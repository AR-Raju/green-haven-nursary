"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  authorName: string;
  views: number;
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sample blog post data
  const samplePost: BlogPost = {
    _id: "1",
    title: "Complete Guide to Indoor Plant Care",
    slug: "complete-guide-indoor-plant-care",
    content: `
      <h2>Introduction to Indoor Plant Care</h2>
      <p>Indoor plants have become increasingly popular in recent years, and for good reason. They not only beautify our living spaces but also provide numerous health benefits, including improved air quality and reduced stress levels.</p>
      
      <h2>Choosing the Right Plants</h2>
      <p>When selecting indoor plants, consider factors such as lighting conditions, humidity levels, and your experience level. Some excellent beginner-friendly options include:</p>
      <ul>
        <li><strong>Snake Plant (Sansevieria)</strong> - Extremely low maintenance and tolerates low light</li>
        <li><strong>Pothos</strong> - Fast-growing and adaptable to various conditions</li>
        <li><strong>ZZ Plant</strong> - Drought-tolerant and thrives in low light</li>
        <li><strong>Spider Plant</strong> - Easy to propagate and pet-friendly</li>
      </ul>
      
      <h2>Essential Care Tips</h2>
      
      <h3>Watering</h3>
      <p>One of the most common mistakes in plant care is overwatering. Most indoor plants prefer to dry out slightly between waterings. Here are some key watering tips:</p>
      <ul>
        <li>Check soil moisture by inserting your finger 1-2 inches deep</li>
        <li>Water thoroughly until water drains from the bottom</li>
        <li>Use room temperature water when possible</li>
        <li>Consider the season - plants need less water in winter</li>
      </ul>
      
      <h3>Lighting</h3>
      <p>Light is crucial for photosynthesis and plant health. Understanding your home's lighting conditions will help you choose appropriate plants:</p>
      <ul>
        <li><strong>Bright, direct light:</strong> South-facing windows (cacti, succulents)</li>
        <li><strong>Bright, indirect light:</strong> East or west-facing windows (most houseplants)</li>
        <li><strong>Low light:</strong> North-facing windows or interior spaces (snake plants, ZZ plants)</li>
      </ul>
      
      <h3>Humidity</h3>
      <p>Many indoor plants originate from tropical environments and appreciate higher humidity levels. You can increase humidity by:</p>
      <ul>
        <li>Using a humidifier</li>
        <li>Placing plants on pebble trays filled with water</li>
        <li>Grouping plants together</li>
        <li>Misting (for appropriate plants)</li>
      </ul>
      
      <h2>Common Problems and Solutions</h2>
      
      <h3>Yellow Leaves</h3>
      <p>Yellow leaves can indicate several issues:</p>
      <ul>
        <li>Overwatering (most common cause)</li>
        <li>Natural aging of older leaves</li>
        <li>Nutrient deficiency</li>
        <li>Too much direct sunlight</li>
      </ul>
      
      <h3>Brown Leaf Tips</h3>
      <p>Brown tips usually indicate:</p>
      <ul>
        <li>Low humidity</li>
        <li>Fluoride or chlorine in tap water</li>
        <li>Over-fertilization</li>
        <li>Underwatering</li>
      </ul>
      
      <h2>Fertilizing Your Plants</h2>
      <p>Indoor plants benefit from regular fertilization during the growing season (spring and summer). Use a balanced, water-soluble fertilizer diluted to half strength every 2-4 weeks.</p>
      
      <h2>Repotting</h2>
      <p>Most plants need repotting every 1-2 years or when they become root-bound. Signs it's time to repot include:</p>
      <ul>
        <li>Roots growing through drainage holes</li>
        <li>Water running straight through the pot</li>
        <li>Plant becoming top-heavy</li>
        <li>Stunted growth despite proper care</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>With proper care and attention, indoor plants can thrive and bring joy to your home for years to come. Remember that each plant is unique, so take time to observe and learn your plants' specific needs. Don't be discouraged by occasional setbacks – even experienced plant parents lose plants sometimes!</p>
      
      <p>Start with easy-care plants and gradually expand your collection as you gain confidence and experience. Happy planting!</p>
    `,
    excerpt:
      "Learn everything you need to know about caring for your indoor plants, from watering schedules to lighting requirements.",
    category: "Indoor Plants",
    tags: ["indoor", "care", "beginner", "houseplants", "watering", "lighting"],
    featuredImage: "/placeholder.svg?height=400&width=800",
    authorName: "Sarah Johnson",
    views: 1250,
    createdAt: "2024-01-15T10:00:00Z",
  };

  const sampleRelatedPosts: BlogPost[] = [
    {
      _id: "2",
      title: "Best Plants for Small Spaces",
      slug: "best-plants-small-spaces",
      content: "",
      excerpt: "Discover the perfect plants for apartments and small homes.",
      category: "Indoor Plants",
      tags: ["small-space", "apartment"],
      featuredImage: "/placeholder.svg?height=200&width=300",
      authorName: "Mike Chen",
      views: 980,
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      _id: "3",
      title: "Natural Pest Control Methods",
      slug: "natural-pest-control-methods",
      content: "",
      excerpt: "Protect your plants without harmful chemicals.",
      category: "Pest Control",
      tags: ["organic", "natural"],
      featuredImage: "/placeholder.svg?height=200&width=300",
      authorName: "David Wilson",
      views: 1450,
      createdAt: "2024-01-08T16:45:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(samplePost);
      setRelatedPosts(sampleRelatedPosts);
      setLoading(false);
    }, 1000);
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const words = content.split(" ").length;
    const readingTime = Math.ceil(words / 200);
    return `${readingTime} min read`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Article bookmarked");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">
                The article you're looking for doesn't exist.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>

              <div className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  {post.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {post.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                          {post.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{post.authorName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getReadingTime(post.content)}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views} views
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={isLiked ? "text-red-600 border-red-600" : ""}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          isLiked ? "fill-current" : ""
                        }`}
                      />
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={
                        isBookmarked ? "text-blue-600 border-blue-600" : ""
                      }
                    >
                      <Bookmark
                        className={`h-4 w-4 mr-2 ${
                          isBookmarked ? "fill-current" : ""
                        }`}
                      />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                {/* Featured Image */}
                <img
                  src={post.featuredImage || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />

                <CardContent className="p-8">
                  {/* Article Content */}
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <Separator className="my-8" />

                  {/* Tags */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-green-100"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Author Bio */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" />
                          <AvatarFallback className="text-lg">
                            {post.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">
                            {post.authorName}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Passionate gardener and plant enthusiast with over
                            10 years of experience in indoor and outdoor
                            gardening. Loves sharing knowledge and helping
                            others discover the joy of growing plants.
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Follow
                            </Button>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                {/* Table of Contents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2 text-sm">
                      <a
                        href="#introduction"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Introduction to Indoor Plant Care
                      </a>
                      <a
                        href="#choosing"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Choosing the Right Plants
                      </a>
                      <a
                        href="#care-tips"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Essential Care Tips
                      </a>
                      <a
                        href="#problems"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Common Problems
                      </a>
                      <a
                        href="#fertilizing"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Fertilizing
                      </a>
                      <a
                        href="#repotting"
                        className="block text-green-600 hover:text-green-700"
                      >
                        Repotting
                      </a>
                    </nav>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost._id}
                          href={`/blog/${relatedPost.slug}`}
                        >
                          <div className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <img
                              src={
                                relatedPost.featuredImage || "/placeholder.svg"
                              }
                              alt={relatedPost.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {relatedPost.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500">
                                <Eye className="h-3 w-3 mr-1" />
                                {relatedPost.views}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">
                      Get More Tips
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Subscribe for weekly gardening insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
