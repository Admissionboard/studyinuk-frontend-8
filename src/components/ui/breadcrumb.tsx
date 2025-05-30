import { ChevronRight, Home } from "@/lib/icons";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://studyinuk.co${item.href}` : undefined
    }))
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Visual breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.href && !item.current ? (
              <Link 
                href={item.href}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={`${item.current ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}