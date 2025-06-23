import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Green Haven</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in bringing nature closer to your home. Premium plants and gardening supplies for
              every green thumb.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=indoor" className="text-gray-400 hover:text-white transition-colors">
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=outdoor" className="text-gray-400 hover:text-white transition-colors">
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=flowers" className="text-gray-400 hover:text-white transition-colors">
                  Flowers
                </Link>
              </li>
              <li>
                <Link href="/products?category=tools" className="text-gray-400 hover:text-white transition-colors">
                  Garden Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-400">info@greenhaven.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-400">123 Garden St, Plant City, PC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 Green Haven Nursery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
