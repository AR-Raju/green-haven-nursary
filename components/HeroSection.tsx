"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Shield,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    id: 1,
    title: "Transform Your Space with Premium Plants",
    subtitle: "Discover Nature's Beauty",
    description:
      "Bring life to your home with our carefully curated collection of indoor and outdoor plants. From air-purifying houseplants to stunning garden varieties.",
    image: "/shop-plants.jpg?height=600&width=800",
    cta: "Shop Plants",
    ctaLink: "/products?category=plants",
    badge: "New Collection",
    bgColor: "from-green-400 to-green-600",
  },
  {
    id: 2,
    title: "Professional Garden Tools & Accessories",
    subtitle: "Everything You Need to Garden",
    description:
      "Equip yourself with high-quality tools and accessories. From basic gardening essentials to professional-grade equipment for serious gardeners.",
    image: "/tools-and-accessories.jpg?height=600&width=800",
    cta: "Shop Tools",
    ctaLink: "/products?category=tools",
    badge: "Best Sellers",
    bgColor: "from-blue-400 to-blue-600",
  },
  {
    id: 3,
    title: "Seasonal Flowers & Decorative Plants",
    subtitle: "Bloom All Year Round",
    description:
      "Add color and fragrance to your garden with our seasonal flower collection. Perfect for creating stunning displays and attracting beneficial wildlife.",
    image: "/seasonal-flowers-and-decorative.jpg?height=600&width=800",
    cta: "Shop Flowers",
    ctaLink: "/products?category=flowers",
    badge: "Limited Time",
    bgColor: "from-pink-400 to-pink-600",
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Plant Guarantee",
    description: "30-day healthy plant promise",
  },
  {
    icon: Award,
    title: "Expert Care",
    description: "Professional gardening advice",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Sustainable growing practices",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Hero Carousel */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}
            />
            <div className="absolute inset-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center backdrop-blur-[2px] ">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-white/20 text-white border-white/30"
                  >
                    {slide.badge}
                  </Badge>
                  <p className="text-lg mb-2 opacity-90">{slide.subtitle}</p>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                      >
                        Browse All Products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <feature.icon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
