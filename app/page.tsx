import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutUsSection from '@/components/landing/AboutUsSection';
import CourseCategoriesSection from '@/components/landing/CourseCategoriesSection';
import CoursesSection from '@/components/landing/CoursesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import InstructorsSection from '@/components/landing/InstructorsSection';
import DifferentSection from '@/components/landing/DifferentSection';
import NewsSection from '@/components/landing/NewsSection';
import NewsletterSection from '@/components/landing/NewsletterSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Us Section */}
      <AboutUsSection />
      
      {/* Course Categories */}
      <CourseCategoriesSection />
      
      {/* Popular Courses */}
      <CoursesSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Instructors */}
      <InstructorsSection />
      
      {/* What Makes Us Different */}
      <DifferentSection />
      
      {/* Latest News */}
      <NewsSection />
      
      {/* Newsletter */}
      <NewsletterSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
