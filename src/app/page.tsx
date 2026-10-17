import Hero from "@/components/hero/Hero";
import TrustSection from "@/components/sections/TrustSection";
import CategorySection from "@/components/sections/CategorySection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import EarnSection from "@/components/sections/EarnSection";
import Footer from "@/components/footer/Footer";
import { homeFooterColumns } from "@/data";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <CategorySection />
      <FeaturedSection />
      <EarnSection />
      <Footer columns={homeFooterColumns} />
    </main>
  );
}
