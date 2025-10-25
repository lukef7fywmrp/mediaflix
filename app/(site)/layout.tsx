import Header from "@/components/Header";

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default SiteLayout;
