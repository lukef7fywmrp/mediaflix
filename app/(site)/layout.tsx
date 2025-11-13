import Footer from "@/components/Footer";
import Header from "@/components/Header";

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default SiteLayout;
