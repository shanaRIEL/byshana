import Hero from "@/components/hero/Hero";
import SearchBar from "@/components/search/SearchBar";
import HowItWorksStrip from "@/components/sections/HowItWorksStrip";
import FeaturedSection from "@/components/sections/FeaturedSection";
import EarnSection from "@/components/sections/EarnSection";
import TrustSection from "@/components/sections/TrustSection";
import Footer from "@/components/footer/Footer";
import { homeFooterColumns } from "@/data";

export default function Home() {
  return (
    <main>
      <Hero />
      <SearchBar />
      <HowItWorksStrip />
      <FeaturedSection />
      <EarnSection />
      <TrustSection />
      <Footer columns={homeFooterColumns} />
    </main>
  );
}
