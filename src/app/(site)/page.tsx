import { CtaBanner } from "@/components/landing/cta-banner";
import { Hero } from "@/components/landing/hero";
import { SwipeMatchConnect } from "@/components/landing/swipe-match-connect";
import { ValueProps } from "@/components/landing/value-props";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <SwipeMatchConnect />
      <CtaBanner />
    </>
  );
}
