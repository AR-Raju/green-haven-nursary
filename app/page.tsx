import BlogSection from "@/components/BlogSection";
import BrandsSection from "@/components/BrandsSection";
import CallToActionSection from "@/components/CallToActionSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import NewsletterSection from "@/components/NewsletterSection";
import OffersSection from "@/components/OffersSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <OffersSection />
        <TestimonialsSection />
        <BrandsSection />
        <BlogSection />
        <NewsletterSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}
