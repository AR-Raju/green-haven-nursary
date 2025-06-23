import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import ProductList from "@/components/ProductList"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium plants and gardening essentials
            </p>
          </div>
          <ProductList limit={8} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
