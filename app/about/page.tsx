import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  CheckCircle,
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With over 15 years in horticulture, Sarah founded Green Haven to share her passion for plants with everyone.",
  },
  {
    name: "Michael Chen",
    role: "Head Botanist",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael brings expertise in plant care and cultivation, ensuring every plant meets our quality standards.",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Experience Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emily leads our customer service team, making sure every customer has an amazing experience with us.",
  },
  {
    name: "David Thompson",
    role: "Logistics Director",
    image: "/placeholder.svg?height=300&width=300",
    bio: "David ensures your plants arrive safely and quickly, managing our nationwide delivery network.",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We're committed to eco-friendly practices and sustainable growing methods that protect our planet.",
  },
  {
    icon: Heart,
    title: "Quality Care",
    description:
      "Every plant receives individual attention and care from our expert team before reaching your home.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We believe in building a community of plant lovers who support and learn from each other.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from plant selection to customer service.",
  },
];

const stats = [
  { number: "50,000+", label: "Happy Customers" },
  { number: "10,000+", label: "Plants Delivered" },
  { number: "15+", label: "Years Experience" },
  { number: "99%", label: "Customer Satisfaction" },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over $50",
  },
  {
    icon: Shield,
    title: "Plant Guarantee",
    description: "30-day health guarantee on all plants",
  },
  {
    icon: Star,
    title: "Expert Support",
    description: "Get advice from our plant specialists",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Same-day delivery in select areas",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Growing Dreams, One Plant at a Time
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Welcome to Green Haven Nursery, where passion for plants meets
              exceptional service. We've been helping people create beautiful,
              thriving gardens for over 15 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Shop Plants</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Green Haven Nursery was born from a simple belief: everyone
                    deserves to experience the joy and tranquility that plants
                    bring to our lives. Founded in 2009 by Sarah Johnson, a
                    passionate horticulturist with over 15 years of experience,
                    we started as a small local nursery with big dreams.
                  </p>
                  <p>
                    What began as a weekend farmers market stall has grown into
                    one of the region's most trusted plant retailers. We've
                    helped thousands of customers transform their homes and
                    gardens, from first-time plant parents to seasoned
                    gardeners.
                  </p>
                  <p>
                    Today, we're proud to offer an extensive collection of
                    indoor and outdoor plants, gardening tools, and accessories,
                    all backed by our commitment to quality and exceptional
                    customer service.
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/products">Explore Our Collection</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Green Haven Nursery greenhouse"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Est. 2009</div>
                      <div className="text-sm text-gray-600">
                        15+ Years of Excellence
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape the way we
                serve our community of plant lovers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our passionate team of plant experts is here to help you succeed
                in your gardening journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Green Haven?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We go above and beyond to ensure your plant shopping experience
                is exceptional.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              To inspire and empower people to create beautiful, healthy living
              spaces through the transformative power of plants, while promoting
              sustainable practices and environmental stewardship.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <h3 className="text-lg font-semibold mb-2">
                  Quality Assurance
                </h3>
                <p className="text-green-100">
                  Every plant is carefully inspected and cared for
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
                <p className="text-green-100">
                  Professional advice for all your gardening needs
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <h3 className="text-lg font-semibold mb-2">Customer Success</h3>
                <p className="text-green-100">
                  We're committed to your gardening success
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Plant Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a beginner or an experienced gardener, we're here
              to help you succeed. Get in touch with our team or visit our store
              today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>

            <Separator className="my-12" />

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Visit Our Store</h3>
                <p className="text-gray-600">
                  123 Garden Street
                  <br />
                  Green Valley, CA 12345
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600">
                  +1 (555) 123-4567
                  <br />
                  Mon-Sat: 9AM-6PM
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600">
                  info@greenhaven.com
                  <br />
                  We reply within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
