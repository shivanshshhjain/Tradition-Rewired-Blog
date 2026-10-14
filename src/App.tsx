/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { NotFoundView } from './components/NotFoundView';
import { ResearchDesk } from './components/ResearchDesk';
import { SEOHead } from './components/SEOHead';
import { getArticleBySlug } from './data/articles';
import { SEO_CONFIG, SITE_URL } from './data/seoConfig';

interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps = {}) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (initialPath) return initialPath;
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isResearchDeskOpen, setIsResearchDeskOpen] = useState(false);
  const [researchDeskQuery, setResearchDeskQuery] = useState<string | undefined>(undefined);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle client 301 equivalent redirect from /old-home to /
  useEffect(() => {
    if (currentPath === '/old-home' || currentPath === '/old-home/') {
      window.history.replaceState({}, '', '/');
      setCurrentPath('/');
    }
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    // Clean trailing slashes except for root
    const normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
    window.history.pushState({}, '', normalizedPath);
    setCurrentPath(normalizedPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResearchDesk = (query?: string) => {
    setResearchDeskQuery(query);
    setIsResearchDeskOpen(true);
  };

  // Derive route and active article
  const cleanSlug = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const isHome = currentPath === '/' || cleanSlug === '';
  const currentArticle = cleanSlug ? getArticleBySlug(cleanSlug) : undefined;
  const isNotFound = !isHome && !currentArticle;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#111827] font-sans selection:bg-[#111827] selection:text-[#FFFFFF]">
      {/* Dynamic SEO Meta & Schema.org JSON-LD */}
      {isHome && (
        <SEOHead
          seo={SEO_CONFIG.home}
          isArticle={false}
          imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=675&q=80"
          imageAlt="Tradition, Rewired Publication Masthead"
        />
      )}

      {currentArticle && (
        <SEOHead
          seo={currentArticle.seo}
          isArticle={true}
          imageUrl={currentArticle.featuredImage.url}
          imageAlt={currentArticle.featuredImage.alt}
          publishDate={currentArticle.isoDate}
          authorName={currentArticle.author.name}
        />
      )}

      {isNotFound && (
        <SEOHead
          seo={{
            slug: '404',
            url: typeof window !== 'undefined' ? `${window.location.origin}${currentPath}` : `${SITE_URL}${currentPath}`,
            pageTitle: 'Page Not Found — Tradition, Rewired Editorial',
            metaDescription: 'The requested article dispatch or resource could not be found. Return to Tradition, Rewired homepage to browse our complete collection.',
            mainKeyword: 'technology-driven startups',
            relatedKeywords: ['traditional business innovation', 'legacy business modernisation'],
            intent: 'Navigational',
            questionAnswered: 'How do I find published articles on Tradition, Rewired?',
            directAnswerSummary: 'Navigate back to the homepage to access all ten published articles on traditional business modernisation.'
          }}
          isArticle={false}
        />
      )}

      {/* Persistent Navigation Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenResearchDesk={() => handleOpenResearchDesk()}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {isHome && (
          <HomeView
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenResearchDesk={handleOpenResearchDesk}
          />
        )}

        {currentArticle && (
          <ArticleView
            article={currentArticle}
            onNavigate={handleNavigate}
            onOpenResearchDesk={handleOpenResearchDesk}
          />
        )}

        {isNotFound && (
          <NotFoundView
            onNavigate={handleNavigate}
            badPath={currentPath}
          />
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenResearchDesk={() => handleOpenResearchDesk()}
      />

      {/* Editorial Research Desk Chatbot with Google Search Grounding */}
      <ResearchDesk
        isOpen={isResearchDeskOpen}
        onClose={() => setIsResearchDeskOpen(false)}
        activeArticle={currentArticle}
        initialQuery={researchDeskQuery}
      />
    </div>
  );
}
