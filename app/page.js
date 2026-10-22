import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Marquee from "@/components/home/Marquee";
import Featured from "@/components/home/Featured";
import HowItWorks from "@/components/home/HowItWorks";
import BrokerageCalc from "@/components/home/BrokerageCalc";
import PropertyTypes from "@/components/home/PropertyTypes";
import WhyUs from "@/components/home/WhyUs";
import OwnersSeekers from "@/components/home/OwnersSeekers";
import AppCTA from "@/components/home/AppCTA";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Marquee />
      <Featured />
      <HowItWorks />
      <BrokerageCalc />
      <PropertyTypes />
      <WhyUs />
      <OwnersSeekers />
      <AppCTA />
      <FAQ />
    </>
  );
}
