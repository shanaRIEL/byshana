import Footer from "@/components/footer/Footer";
import HowItWorksPageContent from "@/components/detail/HowItWorksPageContent";
import { howItWorksFooterColumns } from "@/data";

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksPageContent />
      <div className="mt-16">
        <Footer columns={howItWorksFooterColumns} />
      </div>
    </>
  );
}
