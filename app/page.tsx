import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AchieveSection from '@/components/landing/AchieveSection';
import CoursesSection from '@/components/landing/CoursesSection';
import PlatformSection from '@/components/landing/PlatformSection';
import NewsletterSection from '@/components/landing/NewsletterSection';
import TopicsSection from '@/components/landing/TopicsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import InstructorsSection from '@/components/landing/InstructorsSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <AchieveSection />
      <FeaturesSection />
      <CoursesSection />
      <PlatformSection />
      <NewsletterSection />
      <TopicsSection />
      <TestimonialsSection />
      <InstructorsSection />
      <Footer />
    </div>
  );
}
