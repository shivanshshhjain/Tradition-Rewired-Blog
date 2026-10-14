import { useEffect } from 'react';
import { PageSEOConfig } from '../types/seo';
import { SITE_NAME, SITE_URL } from '../data/seoConfig';

interface SEOHeadProps {
  seo: PageSEOConfig;
  imageUrl?: string;
  imageAlt?: string;
  publishDate?: string;
  authorName?: string;
  isArticle?: boolean;
}

export function SEOHead({
  seo,
  imageUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=675&q=80',
  imageAlt = 'Tradition, Rewired Editorial Cover',
  publishDate,
  authorName = 'Editorial Board',
  isArticle = false
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Page Title
    document.title = seo.pageTitle;

    // Helper to update or create meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Description
    setMetaTag('name', 'description', seo.metaDescription);

    // 3. Canonical URL
    setLinkTag('canonical', seo.url);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', seo.pageTitle);
    setMetaTag('property', 'og:description', seo.metaDescription);
    setMetaTag('property', 'og:url', seo.url);
    setMetaTag('property', 'og:type', isArticle ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:image:alt', imageAlt);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seo.pageTitle);
    setMetaTag('name', 'twitter:description', seo.metaDescription);
    setMetaTag('name', 'twitter:image', imageUrl);
    setMetaTag('name', 'twitter:image:alt', imageAlt);

    // 6. Schema.org JSON-LD Structured Data
    const scriptId = 'schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (isArticle) {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: seo.pageTitle,
        description: seo.metaDescription,
        image: [imageUrl],
        datePublished: publishDate || '2026-10-14T09:00:00Z',
        dateModified: '2026-10-14T09:00:00Z',
        author: {
          '@type': 'Person',
          name: authorName,
          url: `${SITE_URL}/about`
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': seo.url
        },
        keywords: [seo.mainKeyword, ...seo.relatedKeywords].join(', ')
      };
      scriptTag.textContent = JSON.stringify(articleSchema, null, 2);
    } else {
      const siteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: seo.metaDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
      scriptTag.textContent = JSON.stringify(siteSchema, null, 2);
    }

    // Scroll window smoothly to top upon route change
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [seo, imageUrl, imageAlt, publishDate, authorName, isArticle]);

  return null;
}
