import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />

      <Footer />
    </div>
  );
}
