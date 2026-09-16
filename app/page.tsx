import Nav from "@/components/Nav/Nav";
import HeroSection from "@/components/HeroSection/HeroSection";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Product from "@/components/Product/Product";
import PreOrderTypes from "@/components/PreOrderTypes/PreOrderTypes";
import ContactSection from "@/components/ContactSection/ContactSection";
import FAQSection from "@/components/FAQSection/FAQSection";

export default function Home() {
  return (
   <>
   <Nav />
   <HeroSection />
     <HowItWorks />
     <Product featured />   
   <PreOrderTypes />
    <ContactSection />
  <FAQSection />
   
   </>
  );
}
