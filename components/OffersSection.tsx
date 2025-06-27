import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Percent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const offers = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 40% Off",
    description: "Get amazing discounts on outdoor plants and garden tools",
    image: "/placeholder.svg?height=300&width=400",
    badge: "Limited Time",
    cta: "Shop Sale",
    link: "/products?sale=true",
    bgColor: "from-orange-400 to-red-500",
  },
  {
    id: 2,
    title: "New Customer Special",
    subtitle: "25% Off First Order",
    description:
      "Welcome to Green Haven! Enjoy special pricing on your first purchase",
    image: "/placeholder.svg?height=300&width=400",
    badge: "New Customer",
    cta: "Claim Offer",
    link: "/products?new-customer=true",
    bgColor: "from-blue-400 to-purple-500",
  },
  {
    id: 3,
    title: "Bundle Deals",
    subtitle: "Buy 2 Get 1 Free",
    description: "Mix and match from our indoor plant collection",
    image: "/placeholder.svg?height=300&width=400",
    badge: "Best Value",
    cta: "Shop Bundles",
    link: "/products?bundle=true",
    bgColor: "from-green-400 to-teal-500",
  },
];

const quickOffers = [
  {
    icon: Percent,
    title: "Daily Deals",
    description: "New offers every day",
    discount: "Up to 30% off",
  },
  {
    icon: Clock,
    title: "Flash Sale",
    description: "Limited time offers",
    discount: "50% off selected items",
  },
  {
    icon: Gift,
    title: "Free Gifts",
    description: "With orders over $75",
    discount: "Complimentary care kit",
  },
];

export default function OffersSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals and exclusive offers for plant
            lovers
          </p>
        </div>

        {/* Main Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${offer.bgColor} opacity-90`}
                  />
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-900"
                    >
                      {offer.badge}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                      <p className="text-3xl font-bold mb-2">
                        {offer.subtitle}
                      </p>
                      <p className="text-sm opacity-90 mb-4">
                        {offer.description}
                      </p>
                      <Link href={offer.link}>
                        <Button
                          variant="secondary"
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          {offer.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Offers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickOffers.map((offer, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <offer.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {offer.description}
                </p>
                <p className="text-green-600 font-semibold">{offer.discount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
