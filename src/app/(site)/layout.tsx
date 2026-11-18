import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
