import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { SEO_CONFIG, SITE_NAME, SITE_URL } from '../data/seoConfig';
import { getArticleBySlug } from '../data/articles';

export function renderPage(templateHtml: string, rawPathname: string): { html: string; statusCode: number } {
  const pathname = rawPathname.split('?')[0].split('#')[0];
  const cleanSlug = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const isHome = pathname === '/' || cleanSlug === '';
  const article = cleanSlug ? getArticleBySlug(cleanSlug) : undefined;
  const isNotFound = !isHome && !article;

  let statusCode = 200;
  let seo = SEO_CONFIG.home;
  let isArticle = false;
  let imageUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=675&q=80';
  let imageAlt = 'Tradition, Rewired Editorial Cover';
  let publishDate = '2026-10-14T09:00:00Z';
  let authorName = 'Editorial Board';

  if (isHome) {
    seo = SEO_CONFIG.home;
  } else if (article) {
    seo = article.seo;
    isArticle = true;
    imageUrl = article.featuredImage.url;
    imageAlt = article.featuredImage.alt;
    publishDate = article.isoDate;
    authorName = article.author.name;
  } else {
    statusCode = 404;
    seo = {
      slug: '404',
      url: `${SITE_URL}${pathname}`,
      pageTitle: 'Page Not Found — Tradition, Rewired Editorial',
      metaDescription: 'The requested article dispatch or resource could not be found. Return to Tradition, Rewired homepage to browse our complete collection.',
      mainKeyword: 'technology-driven startups',
      relatedKeywords: ['traditional business innovation', 'legacy business modernisation'],
      intent: 'Navigational',
      questionAnswered: 'How do I find published articles on Tradition, Rewired?',
      directAnswerSummary: 'Navigate back to the homepage to access all ten published articles on traditional business modernisation.'
    };
  }

  // Render React App to string
  const appHtml = renderToString(React.createElement(App as React.FC<{ initialPath?: string }>, { initialPath: pathname }));

  // Build JSON-LD
  const schemaJson = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: seo.pageTitle,
        description: seo.metaDescription,
        image: [imageUrl],
        datePublished: publishDate,
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
      }
    : {
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

  let output = templateHtml;

  // Replace <title>
  output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.pageTitle)}</title>`);

  // Replace meta description
  output = output.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(seo.metaDescription)}" />`
  );

  // Replace canonical link
  output = output.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(seo.url)}" />`
  );

  // Replace OpenGraph tags
  output = output.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(seo.pageTitle)}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(seo.metaDescription)}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(seo.url)}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`
  );

  // Replace Twitter tags
  output = output.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.pageTitle)}" />`
  );
  output = output.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.metaDescription)}" />`
  );

  // Add or replace JSON-LD script
  const jsonLdScript = `<script id="schema-jsonld" type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n    </script>`;
  if (output.includes('id="schema-jsonld"')) {
    output = output.replace(/<script id="schema-jsonld"[\s\S]*?<\/script>/i, jsonLdScript);
  } else {
    output = output.replace('</head>', `    ${jsonLdScript}\n  </head>`);
  }

  // Inject rendered React HTML into <div id="root"></div>
  output = output.replace(
    /<div id=["']root["']>[\s\S]*?<\/div>/i,
    `<div id="root">${appHtml}</div>`
  );

  return { html: output, statusCode };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
