import React from "react";
import { motion } from "framer-motion";
import { LandingNavigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Platforms } from "@/components/landing/Platforms";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavigation />
      <Hero />
      <Features />
      <Platforms />
      <CTASection />
      <Footer />
    </div>
  );
}
