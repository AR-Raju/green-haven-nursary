import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "10 Best Indoor Plants for Beginners",
    excerpt:
      "Starting your indoor garden journey? These low-maintenance plants are perfect for new plant parents and will thrive in most home environments.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Plant Care",
    slug: "best-indoor-plants-beginners",
  },
  {
    id: 2,
    title: "Seasonal Garden Maintenance Tips",
    excerpt:
      "Keep your garden healthy year-round with our comprehensive seasonal maintenance guide. Learn what to do in each season for optimal plant health.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Mike Chen",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "Gardening Tips",
    slug: "seasonal-garden-maintenance",
  },
  {
    id: 3,
    title: "Creating a Sustainable Garden",
    excerpt:
      "Discover eco-friendly gardening practices that benefit both your plants and the environment. Learn about composting, water conservation, and more.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Emma Davis",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Sustainability",
    slug: "sustainable-garden-practices",
  },
  {
    id: 4,
    title: "Common Plant Diseases and Solutions",
    excerpt:
      "Identify and treat common plant diseases before they spread. Our expert guide covers prevention, identification, and treatment methods.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Dr. Robert Green",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "Plant Health",
    slug: "plant-diseases-solutions",
  },
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest gardening tips, plant care advice, and
            green living inspiration from our experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-900"
                    >
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
