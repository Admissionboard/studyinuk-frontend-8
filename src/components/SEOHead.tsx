import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  structuredData,
  noIndex = false
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    
    // Bangladesh-specific meta tags
    updateMetaTag('geo.region', 'BD');
    updateMetaTag('geo.country', 'Bangladesh');
    updateMetaTag('geo.placename', 'Dhaka, Bangladesh');
    
    // Language and locale
    updateMetaTag('language', 'en-BD');
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:locale', 'en_BD', true);
    updateMetaTag('og:site_name', 'Study in UK Bangladesh', true);
    
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl, true);
      
      // Update canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
      updateMetaTag('og:image:alt', title, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) updateMetaTag('twitter:image', ogImage);

    // Robots meta tag
    updateMetaTag('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // Structured data with Safari fix
    if (structuredData && typeof structuredData === 'object' && structuredData !== null) {
      try {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
          script = document.createElement('script');
          script.setAttribute('type', 'application/ld+json');
          document.head.appendChild(script);
        }
        
        // Handle both arrays and single objects
        const dataToSerialize = Array.isArray(structuredData) && structuredData.length > 0 
          ? structuredData[0] // Use first item if array
          : structuredData;
          
        script.textContent = JSON.stringify(dataToSerialize);
      } catch (error) {
        console.warn('Error setting structured data:', error);
      }
    }

  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData, noIndex]);

  return null;
}