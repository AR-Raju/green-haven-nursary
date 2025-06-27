"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bell, CheckCircle, Gift, Leaf, Mail } from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    icon: Gift,
    title: "Exclusive Offers",
    description:
      "Get 15% off your first order and access to subscriber-only deals",
  },
  {
    icon: Leaf,
    title: "Plant Care Tips",
    description: "Weekly expert advice and seasonal gardening guides",
  },
  {
    icon: Bell,
    title: "New Arrivals",
    description: "Be the first to know about new plants and products",
  },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully Subscribed!",
        description:
          "Welcome to Green Haven! Check your email for your 15% discount code.",
      });
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Welcome to Green Haven!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for subscribing! We've sent a welcome email with your
                15% discount code.
              </p>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Check your inbox for exclusive offers
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-600 to-green-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white mb-12">
            <Mail className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Join Our Plant Community
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive plant care tips,
              special offers, and be the first to know about new arrivals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Benefits */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 text-white"
                >
                  <div className="bg-white/20 p-3 rounded-lg">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="opacity-90">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription Form */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 mb-4"
                  >
                    Get 15% Off Your First Order
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">
                    Stay in the Loop
                  </h3>
                  <p className="text-gray-600">
                    Join 25,000+ plant lovers getting weekly tips and exclusive
                    offers
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-center"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe & Get 15% Off"}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe
                  at any time.
                </p>

                <div className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    No spam, ever
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Unsubscribe anytime
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
