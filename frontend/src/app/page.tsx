import type { Metadata } from "next";

import { About } from "@/components/home/about";
import { BusinessHealth } from "@/components/home/business-health";
import { BusinessVitals } from "@/components/home/business-vitals";
import { DigitalSymptoms } from "@/components/home/digital-symptoms";
import { FeaturedCases } from "@/components/home/featured-cases";
import { FinalDiagnosticCta } from "@/components/home/final-diagnostic-cta";
import { Hero } from "@/components/home/hero";
import { SecurityPulse } from "@/components/home/security-pulse";
import { Solutions } from "@/components/home/solutions";
import { SystemBoot } from "@/components/home/system-boot";
import { TreatmentPath } from "@/components/home/treatment-path";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "Диагностика цифровых проблем бизнеса",
  description:
    "Диагностирую цифровые проблемы бизнеса и превращаю их в быстрые, удобные и защищённые IT-системы.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <SystemBoot />
        <Hero />
        <BusinessHealth />
        <BusinessVitals />
        <DigitalSymptoms />
        <TreatmentPath />
        <Solutions />
        <FeaturedCases />
        <SecurityPulse />
        <About />
        <FinalDiagnosticCta />
      </main>
      <SiteFooter />
    </>
  );
}
