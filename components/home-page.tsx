import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { EventsSection } from "@/components/events-section";
import { HeroSection } from "@/components/hero-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StackedProcess } from "@/components/stacked-process";
import { WorkSection } from "@/components/work-section";
import { CloudDivider } from "@/components/CloudDivider";

/** Home page composition only. Each band owns its own content and interactions. */
export function HomePage() {
  return <main className="page-shell">
    <SiteHeader />
    <HeroSection />
    <CloudDivider color="var(--cream)" seed={1} />
    <AboutSection />
    <CloudDivider color="var(--pink)" seed={2} />
    <WorkSection />
    <CloudDivider color="var(--blue)" seed={3} />
    <EventsSection />
    <CloudDivider color="var(--pink)" seed={4} order="rtl" />
    <StackedProcess />
    <CloudDivider color="var(--pink)" seed={5} order="center-out" />
    <ContactSection />
    <CloudDivider color="var(--blue)" seed={6} />
    <SiteFooter />
  </main>;
}
