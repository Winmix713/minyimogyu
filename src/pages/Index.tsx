import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Index = () => {
  useDocumentTitle("WinMix TipsterHub");

  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <main className="relative">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
