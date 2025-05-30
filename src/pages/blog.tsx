import { SEOHead } from "@/components/SEOHead";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    slug: "top-10-uk-universities-bangladeshi-students",
    title: "Top 10 UK Universities for Bangladeshi Students in 2024",
    excerpt: "Discover the best UK universities offering excellent programs, scholarships, and support for Bangladeshi students. Complete guide with admission requirements and fees.",
    content: "Complete analysis of the top universities including Oxford, Cambridge, Imperial College London, and more...",
    author: "Study in UK Team",
    publishDate: "2024-01-15",
    readTime: "8 min read",
    category: "University Rankings",
    tags: ["UK Universities", "Rankings", "Admissions"],
    featured: true
  },
  {
    id: 2,
    slug: "uk-student-visa-application-bangladesh",
    title: "How to Apply for UK Student Visa from Bangladesh: Complete Guide 2024",
    excerpt: "Step-by-step guide to UK student visa application process for Bangladeshi students. Required documents, fees, timeline, and expert tips for success.",
    content: "Comprehensive visa application guide covering CAS, financial requirements, English proficiency...",
    author: "Visa Expert Team",
    publishDate: "2024-01-10",
    readTime: "12 min read",
    category: "Visa Guide",
    tags: ["Student Visa", "Immigration", "Documentation"]
  },
  {
    id: 3,
    slug: "uk-university-deadlines-bangladeshi-applicants",
    title: "UK University Application Deadlines 2024 for Bangladeshi Students",
    excerpt: "Important deadlines for UCAS, direct applications, and scholarship applications. Never miss a deadline with our comprehensive calendar.",
    content: "Detailed timeline for undergraduate and postgraduate applications...",
    author: "Admissions Team",
    publishDate: "2024-01-05",
    readTime: "6 min read",
    category: "Application Timeline",
    tags: ["Deadlines", "UCAS", "Applications"]
  },
  {
    id: 4,
    slug: "ielts-preparation-uk-university-admission",
    title: "IELTS Preparation Guide for UK University Admission",
    excerpt: "Master IELTS with our comprehensive preparation guide. Tips, strategies, and resources to achieve your target score for UK university admission.",
    content: "Complete IELTS preparation strategy including band requirements for different universities...",
    author: "Language Expert",
    publishDate: "2023-12-28",
    readTime: "10 min read",
    category: "Test Preparation",
    tags: ["IELTS", "English Test", "Preparation"]
  },
  {
    id: 5,
    slug: "uk-scholarships-bangladeshi-students",
    title: "UK Scholarships and Financial Aid for Bangladeshi Students",
    excerpt: "Explore available scholarships, grants, and financial aid options for Bangladeshi students studying in the UK. Application tips and eligibility criteria.",
    content: "Comprehensive list of scholarships including Chevening, Commonwealth, and university-specific awards...",
    author: "Financial Aid Team",
    publishDate: "2023-12-20",
    readTime: "9 min read",
    category: "Financial Aid",
    tags: ["Scholarships", "Funding", "Financial Aid"]
  },
  {
    id: 6,
    slug: "student-life-uk-bangladeshi-perspective",
    title: "Student Life in UK: A Bangladeshi Student's Perspective",
    excerpt: "Real experiences and practical advice from Bangladeshi students studying in the UK. Culture, accommodation, food, and social life insights.",
    content: "Personal stories and practical tips for adapting to UK student life...",
    author: "Alumni Network",
    publishDate: "2023-12-15",
    readTime: "7 min read",
    category: "Student Experience",
    tags: ["Student Life", "Culture", "Experience"]
  }
];

const categories = ["All", "University Rankings", "Visa Guide", "Application Timeline", "Test Preparation", "Financial Aid", "Student Experience"];

export default function Blog() {
  const breadcrumbItems = [
    { label: "Blog", current: true }
  ];

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Study in UK Bangladesh Blog",
    "description": "Expert guidance and insights for Bangladeshi students planning to study in the UK",
    "url": "https://studyinuk.co/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Study in UK Bangladesh"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://studyinuk.co/blog/${post.slug}`,
      "datePublished": post.publishDate,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "keywords": post.tags.join(", ")
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="UK Study Blog for Bangladeshi Students | Expert Guidance | StudyinUK.co"
        description="Expert advice, guides, and insights for Bangladeshi students planning to study in UK universities. University rankings, visa guides, IELTS preparation, and more."
        keywords="UK study blog, university guide Bangladesh, UK visa guide, IELTS preparation, UK scholarships, student visa UK"
        canonicalUrl="https://studyinuk.co/blog"
        structuredData={blogStructuredData}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UK Study Blog for Bangladeshi Students
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guidance, university insights, and practical advice for your UK education journey
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-100 transition-colors px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <Card key={post.id} className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600 text-white">Featured</Badge>
                <Badge variant="secondary">{post.category}</Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl text-gray-900 mb-4">
                {post.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishDate).toLocaleDateString('en-GB')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 text-gray-900">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishDate).toLocaleDateString('en-GB')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with UK Study Tips</h2>
            <p className="mb-6 text-blue-100">
              Get the latest guides, deadlines, and expert advice delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}