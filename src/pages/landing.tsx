import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Search, Heart, BarChart3 } from "@/lib/icons";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { seoPages } from "@/lib/seo-data";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <SEOHead
        title={seoPages.home.title}
        description={seoPages.home.description}
        keywords={seoPages.home.keywords}
        canonicalUrl="https://studyinuk.co/"
        structuredData={seoPages.home.structuredData}
      />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Study in UK</h1>
                <p className="text-sm text-gray-500">For Bangladeshi Students</p>
              </div>
            </div>
            <Link href="/login">
              <Button className="bg-primary hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Gateway to
            <span className="text-primary"> UK Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover top UK universities, connect with expert counselors, and manage your study abroad journey with our comprehensive platform designed for Bangladeshi students.
          </p>
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-primary hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for UK Education
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools to help you find, apply, and prepare for your UK education journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-primary text-2xl" />
                </div>
                <CardTitle>Course Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Search and filter through hundreds of courses from top UK universities with detailed information including fees, IELTS requirements, and scholarships.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-secondary text-2xl" />
                </div>
                <CardTitle>Expert Counselors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect directly with experienced education counselors via WhatsApp for personalized guidance on applications, visas, and IELTS preparation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-red-500 text-2xl" />
                </div>
                <CardTitle>Favorites & Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Save your favorite courses and track your application progress with real-time notifications and status updates.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-purple-600 text-2xl" />
                </div>
                <CardTitle>Easy Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Submit applications for multiple courses with a simple form and get instant confirmation with follow-up support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-orange-600 text-2xl" />
                </div>
                <CardTitle>Personal Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor your applications, access tutorial videos, and manage your profile all in one convenient dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-teal-600 text-2xl" />
                </div>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access curated tutorial videos covering IELTS preparation, visa applications, and student life in the UK.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your UK Education Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Bangladeshi students who have successfully started their UK education journey with our platform.
          </p>
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white leading-tight">Study in UK - For Bangladeshi Students</h3>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <div className="flex space-x-4">
                <Link href="/office-location" className="hover:text-white transition-colors">
                  Office Location
                </Link>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <span className="text-xs md:text-sm">© 2025 Study in UK - Bangladesh. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}