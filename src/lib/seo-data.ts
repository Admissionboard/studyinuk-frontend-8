// SEO data for different pages
export const seoPages = {
  landing: {
    title: "Study in UK from Bangladesh | StudyinUK.co - Your Gateway to British Universities",
    description: "Expert guidance for Bangladeshi students to study in UK universities. Get personalized course recommendations, application support, and scholarship information. Start your UK education journey today.",
    keywords: "study in UK from Bangladesh, UK universities for Bangladeshi students, British higher education, UK study visa, scholarship opportunities UK",
    canonical: "/",
    ogImage: "/og-landing.jpg"
  },
  home: {
    title: "StudyinUK.co - Premium UK University Application Support for Bangladeshi Students",
    description: "Discover top UK universities and courses tailored for Bangladeshi students. Expert counseling, application assistance, and scholarship guidance to achieve your British education dreams.",
    keywords: "UK university applications, study abroad UK, Bangladeshi students UK, British education consultant, UK course finder",
    canonical: "/home",
    ogImage: "/og-home.jpg"
  },
  courseDetails: {
    title: "Course Details | StudyinUK.co - Find Your Perfect UK University Program",
    description: "Explore detailed information about UK university courses including entry requirements, fees, duration, and career prospects. Make informed decisions about your British education.",
    keywords: "UK course details, university programs UK, course requirements UK, UK degree information",
    canonical: "/course-details",
    ogImage: "/og-course.jpg"
  },
  officeLocation: {
    title: "Our Office Locations | StudyinUK.co - Visit Us for Personalized Guidance",
    description: "Find our office locations in Bangladesh for in-person consultation about studying in UK. Expert counselors ready to help with your British university applications.",
    keywords: "StudyinUK office Bangladesh, UK education consultant office, study abroad office location",
    canonical: "/office-location",
    ogImage: "/og-office.jpg"
  },
  privacyPolicy: {
    title: "Privacy Policy | StudyinUK.co - Your Data Protection Commitment",
    description: "Learn how StudyinUK.co protects your personal information and data privacy while providing UK university application services to Bangladeshi students.",
    keywords: "privacy policy, data protection, StudyinUK privacy, student data security",
    canonical: "/privacy-policy",
    ogImage: "/og-privacy.jpg"
  }
};

// Generate dynamic SEO for specific pages
export const generateDynamicSEO = (pageType: string, data?: any) => {
  const baseSEO = seoPages[pageType as keyof typeof seoPages];
  
  if (!baseSEO) {
    return seoPages.home; // fallback
  }

  // Customize based on data if provided
  if (data && pageType === 'courseDetails') {
    return {
      ...baseSEO,
      title: `${data.courseName} at ${data.universityName} | StudyinUK.co`,
      description: `Study ${data.courseName} at ${data.universityName}. Entry requirements, fees, duration and application guidance for Bangladeshi students.`,
      keywords: `${data.courseName}, ${data.universityName}, UK university course, study in UK`
    };
  }

  return baseSEO;
};

// Generate structured data for courses
export const generateCourseStructuredData = (course: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description || `Study ${course.name} at a prestigious UK university`,
    "provider": {
      "@type": "Organization",
      "name": course.university?.name || "UK University",
      "sameAs": course.university?.website
    },
    "courseCode": course.code,
    "educationalLevel": course.level,
    "timeRequired": course.duration,
    "courseFee": course.fees,
    "inLanguage": "en",
    "availableLanguage": "en",
    "teaches": course.subjects || [course.name],
    "coursePrerequisites": course.entryRequirements,
    "occupationalCredentialAwarded": course.qualification || "Degree"
  };
};