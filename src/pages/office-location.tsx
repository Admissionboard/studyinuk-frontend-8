import { MapPin, Clock, Phone, Mail, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { seoPages } from "@/lib/seo-data";

export default function OfficeLocation() {
  const openGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/zGjaXmw8VeRqpfvL9", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <SEOHead
        title={seoPages.officeLocation.title}
        description={seoPages.officeLocation.description}
        keywords={seoPages.officeLocation.keywords}
        canonicalUrl="https://studyinuk.co/office-location"
        structuredData={seoPages.officeLocation.structuredData}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-slate-800 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Visit Our Office
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Come meet us for personalized guidance on your UK study journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Office Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 border-b border-slate-200 pb-4">
                Office Details
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">Address</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Plot-1/1, Block-D Road No. 7<br />
                      Dhaka 1216, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">Office Hours</h3>
                    <div className="text-slate-600 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday to Wednesday</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm">11:00 - 13:00</p>
                        <p className="text-sm">14:00 - 17:00</p>
                      </div>
                      <p className="text-sm text-slate-500 italic">
                        Closed on Thursday and Friday
                      </p>
                    </div>
                  </div>
                </div>



                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-orange-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">Phone</h3>
                    <p className="text-slate-600">+8801876397805</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-red-600 h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">Email</h3>
                    <p className="text-slate-600">info@studyinuk.co</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 border-b border-slate-200 pb-4">
                Location Map
              </h2>
              
              <div className="mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.186404790916!2d90.35845761073342!3d23.811969678539285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c152ea39c089%3A0xe90f074a147daaa3!2sADMISSIONBOARD!5e0!3m2!1sen!2sus!4v1748354628450!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
              
              <Button 
                onClick={openGoogleMaps}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>

          {/* Directions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-light text-slate-800 mb-6 border-b border-slate-200 pb-4 flex items-center">
              <span className="mr-3">🗺️</span>
              How to Reach Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm font-bold">🚇</span>
                  </div>
                  By Metro Rail
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Nearest Station:</strong> Mirpur 10 Metro Station
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    <strong>Route:</strong> Take the Metro to Mirpur 10 Metro Station → Exit towards Mirpur 6 Kacha Bazar → Take a rickshaw or walk (~7–10 minutes) towards Mirpur 6 Kacha Bazar.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    <strong>Tip:</strong> Use Google Maps and search "ADMISSIONBOARD" for the most precise navigation.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">🚌</span>
                  </div>
                  By Bus & Rickshaw
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Bus Routes:</strong> Get off at Mirpur 2, or Mirpur 11 (accessible via major city bus lines).
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    <strong>Then:</strong> Take a rickshaw or CNG to Admissionboard, Green Building that has Tata Motors Showroom on the Ground Floor (5–10 minutes depending on traffic).
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 text-sm font-bold">🚗</span>
                  </div>
                  By Car or Taxi
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600 leading-relaxed">
                    <strong>From Airport:</strong> Uttara → Airport Road → Mirpur → Mirpur 6 (approx. 45–70 minutes depending on traffic)
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    <strong>GPS:</strong> Use this link for direct Google Maps location: 
                    <a href="https://maps.app.goo.gl/rckUotNeJCV5MRC4A" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      Google Maps
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Detailed directions */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-3">📍 Detailed Location</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Our office is located in Mirpur 6, 3 minutes from Mirpur 6 Kacha Bazar.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                For accurate directions, open this Google Maps location or search "ADMISSIONBOARD" on your navigation app.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Studyinuk.co is a part of Admissionboard.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Need Directions or Have Questions?
              </h3>
              <p className="text-slate-600 mb-4">
                Call us at +8801876397805 for assistance with directions or to schedule an appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
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