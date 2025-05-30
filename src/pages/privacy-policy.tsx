import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mail, Globe } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { seoPages } from "@/lib/seo-data";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <SEOHead
        title={seoPages.privacyPolicy.title}
        description={seoPages.privacyPolicy.description}
        keywords={seoPages.privacyPolicy.keywords}
        canonicalUrl="https://studyinuk.co/privacy-policy"
        structuredData={seoPages.privacyPolicy.structuredData}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 text-center">
            <h1 className="text-4xl font-light tracking-wide mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Privacy Policy
            </h1>
            <p className="text-slate-300 font-light">StudyinUK.co</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              
              {/* Disclaimer */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Disclaimer</h2>
                <p className="text-slate-600 leading-relaxed">
                  This Privacy Policy governs the manner in which personal data is collected and processed by StudyinUK.co ("we", "our", "us"). StudyinUK.co is operated as a service and sub-brand of Admissionboard e.K., the organization behind admissionboard.org. This affiliation supports our operational and service excellence while maintaining a dedicated brand identity for users interested in studying in the UK.
                </p>
              </div>

              {/* Inventory Data */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Inventory Data</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-700 mb-3">1. Personal Data Use</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Your personal data (e.g. title, name, address, e-mail, phone number, bank details, credit card number, etc.), insofar as they are necessary for this contractual relationship (inventory data), including its establishment, content organization, and potential modifications, will be used solely for your application to foreign universities, particularly in the United Kingdom. If you are an employee, your data will be used only to maintain employment records in accordance with applicable federal laws.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-700 mb-3">2. Third-Party Sharing</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Without your explicit consent or a legal obligation, your personal data will not be disclosed to third parties beyond what is required to fulfill the contractual agreement. Upon completion of the contract and the expiry of relevant retention periods in line with tax and commercial law, your data will be restricted from further use.
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-300 p-4 my-6">
                  <p className="text-slate-600 text-sm">
                    <strong>Note:</strong> This privacy policy applies exclusively to our web pages at www.studyinuk.co. If you follow links to external sites, please consult the respective privacy policies of those websites.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Your Rights Under the Data Protection Act</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Under the Federal Data Protection Act, you are entitled to request information about the personal data stored about you, free of charge. You also have the right to request correction, blocking, or deletion of your data where applicable. Please direct such inquiries to:
                </p>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">info@studyinuk.co</span>
                </div>
              </section>

              {/* Photos and Videos */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Photos and Videos</h2>
                <p className="text-slate-600 leading-relaxed">
                  By submitting photos or videos to StudyinUK.co, users agree that these materials may be used for marketing and promotional purposes, including publication on our website or social media. If you object to such usage, please notify us in writing at info@studyinuk.co.
                </p>
              </section>

              {/* Newsletter */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Newsletter</h2>
                <p className="text-slate-600 leading-relaxed">
                  You can opt in to receive our newsletters and informational emails via our website. These communications provide updates about our services and study opportunities in the UK. To subscribe, we only require a valid email address. Your information is used exclusively for newsletter distribution and Facebook advertising; no data is shared with third parties.
                </p>
                <p className="text-slate-600 leading-relaxed mt-3">
                  You may unsubscribe at any time by emailing info@studyinuk.co.
                </p>
              </section>

              {/* Accountability for Content */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Accountability for Content</h2>
                <p className="text-slate-600 leading-relaxed">
                  We create and maintain our website content with great care and attention. Nonetheless, we do not guarantee its accuracy, completeness, or timeliness. Under statutory provisions, we are responsible for our own content on these web pages. However, we are not required to monitor transmitted or stored third-party information unless there are clear indications of illegal activity.
                </p>
              </section>

              {/* External Links */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">External Links</h2>
                <p className="text-slate-600 leading-relaxed">
                  We are not responsible for the content of externally linked websites. At the time of linking, no legal violations were known. Upon notification of any infringements, such links will be removed immediately.
                </p>
              </section>

              {/* Copyright */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Copyright</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  All content and media on this website are protected under German copyright law. Any form of reproduction, distribution, or processing requires written permission from the rights holder, unless explicitly permitted by law. Use of content for commercial purposes is not allowed without prior consent.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Sources:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• www.studygroup.com</li>
                    <li>• www.applyboard.com</li>
                    <li>• www.mdx.ac.uk</li>
                    <li>• www.youtube.com</li>
                  </ul>
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Cookies</h2>
                <p className="text-slate-600 leading-relaxed">
                  StudyinUK.co uses cookies to recognize returning users and optimize user experience. Cookies are small files stored by your browser. Some are "session cookies" deleted after you leave, while others allow recognition based on IP address.
                </p>
                <p className="text-slate-600 leading-relaxed mt-3">
                  You can disable cookies via browser settings, but this may limit website functionality.
                </p>
              </section>

              {/* Social Media and Tracking */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Use of Social Media and Tracking Tools</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Facebook Components</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      We use Facebook plugins. When you visit our site, Facebook may collect data such as your IP address or visited pages. If logged into Facebook, interactions (e.g. "Like") are linked to your account. You can avoid this by logging out before visiting our site.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Twitter Components</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      Twitter plugins are embedded in our site. These may collect your IP address and visited URLs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">LinkedIn Components</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      LinkedIn components may associate your website interactions with your LinkedIn profile.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Google Analytics</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      We use Google Analytics with the "_anonymizeIp" extension. This helps track website activity while anonymizing your IP address. Google may process this data on our behalf, but does not combine it with other personal data.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Google Adwords & AdSense</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      We use Google Adwords Conversion Tracking and AdSense for advertising. These services may use cookies and web beacons to analyze traffic and measure ad performance. No personal data is shared with advertisers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-light text-slate-800 mb-4 border-b border-slate-200 pb-2">Contact & Data Controller</h2>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <p className="font-medium text-slate-800 mb-4">StudyinUK.co (a service of Admissionboard e.K.)</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>info@studyinuk.co</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Globe className="w-4 h-4" />
                      <span>www.studyinuk.co</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Back Button */}
          <div className="bg-slate-50 px-8 py-6 text-center border-t border-slate-200">
            <Link href="/">
              <Button variant="outline" className="font-light">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}