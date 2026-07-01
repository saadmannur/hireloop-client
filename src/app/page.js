import ExploreSection from "@/components/homepage/ExploreSection";
import HeroSection from "@/components/homepage/HeroSection";
import PlatformStats from "@/components/homepage/PlatformStats";
import PricingSection from "@/components/homepage/PricingSection";
import SuccessSection from "@/components/homepage/SuccessSection";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <PlatformStats></PlatformStats>
      <SuccessSection></SuccessSection>
      <PricingSection></PricingSection>
      <ExploreSection></ExploreSection>
    </div>
  );
}
