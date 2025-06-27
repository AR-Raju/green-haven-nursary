"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Leaf,
  Mail,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    id: "plant-care",
    title: "Plant Care",
    icon: Leaf,
    color: "bg-green-100 text-green-600",
    count: 12,
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: Truck,
    color: "bg-blue-100 text-blue-600",
    count: 8,
  },
  {
    id: "orders",
    title: "Orders & Payment",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-600",
    count: 10,
  },
  {
    id: "returns",
    title: "Returns & Warranty",
    icon: Shield,
    color: "bg-orange-100 text-orange-600",
    count: 6,
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: Package,
    color: "bg-pink-100 text-pink-600",
    count: 5,
  },
];

const faqs = [
  {
    category: "plant-care",
    question: "How often should I water my plants?",
    answer:
      "Watering frequency depends on the plant type, pot size, soil, and environmental conditions. Most houseplants need water when the top inch of soil feels dry. Check by inserting your finger into the soil. Succulents need less frequent watering, while tropical plants may need more consistent moisture.",
    popular: true,
  },
  {
    category: "plant-care",
    question: "Why are my plant's leaves turning yellow?",
    answer:
      "Yellow leaves can indicate several issues: overwatering (most common), underwatering, nutrient deficiency, or natural aging. Check soil moisture first - if it's soggy, reduce watering. If dry, increase watering frequency. Remove yellow leaves to encourage new growth.",
    popular: true,
  },
  {
    category: "plant-care",
    question: "How much light do indoor plants need?",
    answer:
      "Light requirements vary by plant species. Low-light plants (snake plants, pothos) can thrive in indirect light. Medium-light plants need bright, indirect light near windows. High-light plants require direct sunlight for several hours daily. Observe your plant's response and adjust placement accordingly.",
    popular: false,
  },
  {
    category: "plant-care",
    question: "When should I repot my plants?",
    answer:
      "Repot when roots are circling the pot bottom, growing through drainage holes, or when growth slows despite proper care. Most plants need repotting every 1-2 years. Spring is the best time for repotting as plants enter their growing season.",
    popular: false,
  },
  {
    category: "shipping",
    question: "Do you offer free shipping?",
    answer:
      "Yes! We offer free standard shipping on orders over $50 within the continental United States. Orders under $50 have a flat shipping rate of $9.99. Express shipping options are available for an additional fee.",
    popular: true,
  },
  {
    category: "shipping",
    question: "How are plants packaged for shipping?",
    answer:
      "We use specialized plant packaging to ensure your plants arrive safely. Plants are secured in their pots, wrapped in protective material, and placed in custom boxes with ventilation. We include care instructions and our plant guarantee with every shipment.",
    popular: true,
  },
  {
    category: "shipping",
    question: "What areas do you deliver to?",
    answer:
      "We ship throughout the continental United States. Same-day delivery is available within 15 miles of our store location. Alaska and Hawaii shipping is available with additional fees. International shipping is currently not available.",
    popular: false,
  },
  {
    category: "orders",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. For wholesale orders, we also accept bank transfers and offer net payment terms for qualified businesses.",
    popular: true,
  },
  {
    category: "orders",
    question: "Can I modify or cancel my order?",
    answer:
      "Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Contact our customer service team immediately if you need to make changes.",
    popular: false,
  },
  {
    category: "returns",
    question: "What is your plant guarantee?",
    answer:
      "We offer a 30-day health guarantee on all plants. If your plant arrives damaged or doesn't thrive within 30 days despite proper care, we'll replace it free of charge or provide a full refund. Photos and care details may be required for claims.",
    popular: true,
  },
  {
    category: "returns",
    question: "How do I return a plant?",
    answer:
      "Contact our customer service team within 30 days of purchase. We'll guide you through the return process, which may include photos of the plant and care documentation. Most returns are processed as replacements or store credit rather than shipping plants back.",
    popular: false,
  },
  {
    category: "account",
    question: "How do I create an account?",
    answer:
      "Click 'Sign Up' in the top right corner of our website. You can create an account with your email address or sign up using Google or Facebook. Having an account allows you to track orders, save favorites, and access exclusive member benefits.",
    popular: false,
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter((faq) => faq.popular);

  const toggleItem = (index: string) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Find answers to common questions about plants, orders, shipping,
              and more
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      {!searchQuery && !selectedCategory && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Most Popular Questions
              </h2>
              <div className="space-y-4">
                {popularFAQs.map((faq, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <Collapsible
                      open={openItems.includes(`popular-${index}`)}
                      onOpenChange={() => toggleItem(`popular-${index}`)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Star className="h-4 w-4 text-green-600" />
                              </div>
                              <CardTitle className="text-left">
                                {faq.question}
                              </CardTitle>
                            </div>
                            {openItems.includes(`popular-${index}`) ? (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {faqCategories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id
                      ? "ring-2 ring-green-500 shadow-lg"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                >
                  <CardContent className="pt-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <Badge variant="secondary">
                      {category.count} questions
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear Filter Button */}
            {selectedCategory && (
              <div className="text-center mb-8">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Show All Categories</span>
                </Button>
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => {
                  const categoryInfo = faqCategories.find(
                    (cat) => cat.id === faq.category
                  );
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <Collapsible
                        open={openItems.includes(`faq-${index}`)}
                        onOpenChange={() => toggleItem(`faq-${index}`)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-full ${categoryInfo?.color}`}
                                >
                                  {categoryInfo && (
                                    <categoryInfo.icon className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <CardTitle className="mb-1">
                                    {faq.question}
                                  </CardTitle>
                                  <Badge variant="outline" className="text-xs">
                                    {categoryInfo?.title}
                                  </Badge>
                                </div>
                              </div>
                              {openItems.includes(`faq-${index}`) ? (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="pt-8 text-center">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any FAQs matching your search. Try
                      different keywords or browse our categories.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                    >
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl text-green-100 mb-8">
              Can't find the answer you're looking for? Our friendly support
              team is here to help!
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-6 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-4 text-green-200" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Speak directly with our plant experts
                  </p>
                  <Button variant="secondary" size="sm">
                    +1 (555) 123-4567
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-4 text-green-200" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Get instant answers to your questions
                  </p>
                  <Button variant="secondary" size="sm">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-6 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4 text-green-200" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-green-100 text-sm mb-4">
                    We'll respond within 24 hours
                  </p>
                  <Button variant="secondary" size="sm">
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <p className="text-green-200">
                Average response time: <strong>2 hours</strong> • Available 7
                days a week
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
