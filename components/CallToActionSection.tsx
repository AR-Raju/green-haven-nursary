import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-800 to-green-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Leaf className="h-24 w-24 text-white transform rotate-12" />
        </div>
        <div className="absolute top-32 right-20">
          <Leaf className="h-16 w-16 text-white transform -rotate-45" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <Leaf className="h-20 w-20 text-white transform rotate-45" />
        </div>
        <div className="absolute bottom-10 right-10">
          <Leaf className="h-32 w-32 text-white transform -rotate-12" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of plant lovers who have created their perfect
              green sanctuary with Green Haven. Start your plant journey today
              and discover the joy of gardening.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">10K+</span>
                </div>
                <p className="text-sm opacity-80">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <p className="text-sm opacity-80">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Leaf className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">50K+</span>
                </div>
                <p className="text-sm opacity-80">Plants Delivered</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-green-800 hover:bg-gray-100 font-semibold"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-800 bg-transparent"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Beautiful indoor garden setup"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99%</div>
                <div className="text-xs text-gray-600">Plant Survival</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
