"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer Martinez",
    location: "Los Angeles, CA",
    rating: 5,
    text: "Green Haven transformed my apartment into a green oasis! The plants arrived in perfect condition and their care instructions are so helpful. My fiddle leaf fig is thriving!",
    image: "/placeholder.svg?height=80&width=80",
    purchase: "Indoor Plant Bundle",
  },
  {
    id: 2,
    name: "David Thompson",
    location: "Austin, TX",
    rating: 5,
    text: "Outstanding quality and service! I've been buying from Green Haven for over a year now. Their plant selection is incredible and the delivery is always fast and secure.",
    image: "/placeholder.svg?height=80&width=80",
    purchase: "Garden Tool Set",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    location: "Miami, FL",
    rating: 5,
    text: "As a beginner gardener, I was nervous about keeping plants alive. Green Haven's expert advice and healthy plants made it so easy. My garden is now my pride and joy!",
    image: "/placeholder.svg?height=80&width=80",
    purchase: "Beginner's Garden Kit",
  },
  {
    id: 4,
    name: "Robert Kim",
    location: "Seattle, WA",
    rating: 5,
    text: "The customer service is exceptional! When I had questions about plant care, their team provided detailed, personalized advice. Highly recommend to all plant lovers!",
    image: "/placeholder.svg?height=80&width=80",
    purchase: "Rare Plant Collection",
  },
  {
    id: 5,
    name: "Lisa Chen",
    location: "New York, NY",
    rating: 5,
    text: "Green Haven's plants are simply the best quality I've found online. Fast shipping, excellent packaging, and the plants always arrive healthy and beautiful.",
    image: "/placeholder.svg?height=80&width=80",
    purchase: "Office Plant Package",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their
            spaces with our premium plants and expert care
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Display */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <Card className="mx-4 bg-white shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Quote className="h-12 w-12 text-green-200 mx-auto mb-6" />

                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>

                      <div className="flex items-center justify-center space-x-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.location}
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            Purchased: {testimonial.purchase}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              10,000+
            </div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              50,000+
            </div>
            <div className="text-gray-600">Plants Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
            <div className="text-gray-600">Plant Survival Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
