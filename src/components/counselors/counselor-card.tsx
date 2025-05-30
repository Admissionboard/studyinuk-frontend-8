import { Button } from "@/components/ui/button";
import { Phone, Languages, Award } from "@/lib/icons";
import { SiWhatsapp } from "react-icons/si";
import type { Counselor } from "@/types";

interface CounselorCardProps {
  counselor: Counselor;
}

export default function CounselorCard({ counselor }: CounselorCardProps) {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello, I'm interested in studying in the UK. Could you please help me with the application process?");
    const whatsappNumber = counselor.whatsapp.replace(/\D/g, ''); // Remove non-digits
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={counselor.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
          alt={counselor.name} 
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{counselor.name}</h3>
          <p className="text-sm text-gray-500">{counselor.title}</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <Phone className="text-blue-600 h-5 w-5 flex-shrink-0" />
          <span className="text-sm text-gray-600">{counselor.whatsapp}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Languages className="text-blue-600 h-5 w-5 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {Array.isArray(counselor.languages) 
              ? counselor.languages.join(", ") 
              : counselor.languages}
          </span>
        </div>
        {counselor.experience && (
          <div className="flex items-center space-x-2">
            <Award className="text-blue-600 h-5 w-5 flex-shrink-0" />
            <span className="text-sm text-gray-600">{counselor.experience}</span>
          </div>
        )}
      </div>
      
      <Button
        onClick={openWhatsApp}
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
      >
        <SiWhatsapp className="text-lg" />
        <span>Chat on WhatsApp</span>
      </Button>
    </div>
  );
}
