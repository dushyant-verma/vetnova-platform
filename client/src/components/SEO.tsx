import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({ 
  title, 
  description = "India's practical veterinary learning institute helping veterinarians, veterinary nurses, students, pet owners and animal welfare professionals learn, practice and lead.", 
  keywords = "Veterinary, Education, Workshops, Surgery, Cardiology",
  image = "/logo.png",
  url = "https://vetnova.edu.in"
}: SEOProps) => {
  const fullTitle = `${title} | VetNova Training Institute`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VetNova Training Institute",
          "url": "https://vetnova.edu.in",
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://vetnova.edu.in/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://vetnova.edu.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title,
              "item": url
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
