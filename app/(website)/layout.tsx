import { Navbar } from "@/components/website/navbar";
import { Footer } from "@/components/website/footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
