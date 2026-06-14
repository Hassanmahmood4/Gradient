import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Statement } from "@/components/sections/Statement";
import { FeatureRows } from "@/components/sections/FeatureRows";
import { Walkthrough } from "@/components/sections/Walkthrough";
import { DemoShowcase } from "@/components/sections/DemoShowcase";
import { CodeBridge } from "@/components/sections/CodeBridge";
import { Reviews } from "@/components/sections/Reviews";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Statement />
        <FeatureRows />
        <Walkthrough />
        <DemoShowcase />
        <CodeBridge />
        <Reviews />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
