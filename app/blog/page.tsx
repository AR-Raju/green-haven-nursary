"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Search,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  authorName: string;
  views: number;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const categories = [
    "Plant Care",
    "Gardening Tips",
    "Seasonal Guides",
    "Plant Varieties",
    "Indoor Plants",
    "Outdoor Gardening",
    "Pest Control",
    "Fertilizers",
    "Tools & Equipment",
    "Landscaping",
  ];

  const featuredPosts = [
    {
      _id: "1",
      title: "Complete Guide to Indoor Plant Care",
      slug: "complete-guide-indoor-plant-care",
      excerpt:
        "Learn everything you need to know about caring for your indoor plants, from watering schedules to lighting requirements.",
      category: "Indoor Plants",
      tags: ["indoor", "care", "beginner"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "Sarah Johnson",
      views: 1250,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      _id: "2",
      title: "Best Plants for Small Spaces",
      slug: "best-plants-small-spaces",
      excerpt:
        "Discover the perfect plants for apartments, small homes, and compact gardens that don't compromise on beauty.",
      category: "Indoor Plants",
      tags: ["small-space", "apartment", "compact"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "Mike Chen",
      views: 980,
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      _id: "3",
      title: "Seasonal Gardening Calendar",
      slug: "seasonal-gardening-calendar",
      excerpt:
        "A comprehensive month-by-month guide to what you should be planting, pruning, and harvesting throughout the year.",
      category: "Seasonal Guides",
      tags: ["seasonal", "calendar", "planning"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "Emma Davis",
      views: 2100,
      createdAt: "2024-01-10T09:15:00Z",
    },
    {
      _id: "4",
      title: "Natural Pest Control Methods",
      slug: "natural-pest-control-methods",
      excerpt:
        "Protect your plants without harmful chemicals using these effective natural pest control techniques.",
      category: "Pest Control",
      tags: ["organic", "natural", "pest-control"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "David Wilson",
      views: 1450,
      createdAt: "2024-01-08T16:45:00Z",
    },
    {
      _id: "5",
      title: "Creating a Butterfly Garden",
      slug: "creating-butterfly-garden",
      excerpt:
        "Transform your outdoor space into a haven for butterflies with these beautiful and beneficial plants.",
      category: "Outdoor Gardening",
      tags: ["butterfly", "pollinator", "outdoor"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "Lisa Anderson",
      views: 890,
      createdAt: "2024-01-05T11:20:00Z",
    },
    {
      _id: "6",
      title: "Propagating Plants: A Beginner's Guide",
      slug: "propagating-plants-beginners-guide",
      excerpt:
        "Learn the basics of plant propagation and multiply your plant collection for free with these simple techniques.",
      category: "Plant Care",
      tags: ["propagation", "beginner", "techniques"],
      featuredImage: "/placeholder.svg?height=400&width=600",
      authorName: "Tom Rodriguez",
      views: 1680,
      createdAt: "2024-01-03T13:10:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(featuredPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (excerpt: string) => {
    const words = excerpt.split(" ").length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    return `${readingTime} min read`;
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Green Haven Blog
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Discover expert tips, guides, and inspiration for your gardening
                journey
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-8">
                {/* Categories Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Tags Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-green-100"
                          onClick={() => setSelectedTag(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">
                      Stay Updated
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Get the latest gardening tips delivered to your inbox
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Enter your email" />
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              {filteredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={
                            filteredPosts[0].featuredImage || "/placeholder.svg"
                          }
                          alt={filteredPosts[0].title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="secondary">
                            {filteredPosts[0].category}
                          </Badge>
                          <span className="text-sm text-gray-500">•</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {getReadingTime(filteredPosts[0].excerpt)}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 hover:text-green-600 transition-colors">
                          <Link href={`/blog/${filteredPosts[0].slug}`}>
                            {filteredPosts[0].title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {filteredPosts[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {filteredPosts[0].authorName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(filteredPosts[0].createdAt)}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {filteredPosts[0].views}
                            </div>
                          </div>
                          <Link href={`/blog/${filteredPosts[0].slug}`}>
                            <Button variant="outline" size="sm">
                              Read More
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              <Separator className="my-8" />

              {/* Blog Posts Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {selectedCategory !== "all" ||
                    selectedTag !== "all" ||
                    searchTerm
                      ? "Filtered Articles"
                      : "Latest Articles"}
                  </h2>
                  <p className="text-gray-600">
                    {filteredPosts.length} article
                    {filteredPosts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {filteredPosts.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        No articles found
                      </h3>
                      <p>
                        Try adjusting your search criteria or browse all
                        articles.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                          setSelectedTag("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {filteredPosts.slice(1).map((post) => (
                      <Card
                        key={post._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3">
                            <img
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge variant="outline">{post.category}</Badge>
                              <span className="text-sm text-gray-500">•</span>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {getReadingTime(post.excerpt)}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 hover:text-green-600 transition-colors">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {post.authorName}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(post.createdAt)}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {post.views}
                                </div>
                              </div>
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="outline" size="sm">
                                  Read More
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-green-100"
                                  onClick={() => setSelectedTag(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {filteredPosts.length > 6 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                      Load More Articles
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
