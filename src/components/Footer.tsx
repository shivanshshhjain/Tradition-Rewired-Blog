import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { SITE_NAME, SITE_TAGLINE } from '../data/seoConfig';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenResearchDesk?: () => void;
}

export function Footer({ onNavigate, onOpenResearchDesk }: FooterProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-white text-[#4B5563] border-t border-[#E5E7EB] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Publication Identity */}
          <div className="lg:col-span-4">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="inline-block text-xl font-bold text-[#111827] mb-1.5 hover:underline"
            >
              {SITE_NAME}
            </a>
            <p className="text-xs text-[#6B7280] font-normal mb-3">
              {SITE_TAGLINE}
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              An independent journal exploring the practical intersection of artificial intelligence, digital transformation, and industrial craftsmanship.
            </p>
          </div>

          {/* Published Articles */}
          <div className="lg:col-span-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3">
              Articles &amp; Case Studies
            </h3>
            <ul className="grid grid-cols-1 gap-1.5 text-xs">
              {ARTICLES.map((article, idx) => (
                <li key={article.id}>
                  <a
                    href={`/${article.slug}`}
                    onClick={(e) => handleNavClick(e, `/${article.slug}`)}
                    className="text-[#4B5563] hover:text-[#111827] transition-colors flex items-start gap-1.5 group py-0.5"
                  >
                    <span className="text-[#9CA3AF] font-mono shrink-0">
                      {(idx + 1).toString().padStart(2, '0')}.
                    </span>
                    <span className="group-hover:underline">
                      {article.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Research Desk */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3">
              Research &amp; Tools
            </h3>
            {onOpenResearchDesk && (
              <button
                onClick={onOpenResearchDesk}
                className="w-full text-left p-3 bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#111827] rounded text-xs font-medium text-[#111827] transition-colors flex items-center justify-between cursor-pointer mb-5 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
                  <span>Editorial Research Desk</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            )}

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
              Navigation
            </h3>
            <ul className="text-xs text-[#6B7280] space-y-1.5">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, '/')}
                  className="hover:text-[#111827] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#articles"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                    setTimeout(() => {
                      document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#111827] transition-colors"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="/#editorial-mission"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                    setTimeout(() => {
                      document.getElementById('editorial-mission')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#111827] transition-colors"
                >
                  Editorial Mission
                </a>
              </li>
              <li>
                <a
                  href="/#themes"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                    setTimeout(() => {
                      document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#111827] transition-colors"
                >
                  Core Themes
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E7EB] bg-[#FAFAFA] py-5 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} {SITE_NAME}. Where traditional business meets the technology of tomorrow.
          </div>
          <div>
            <span>Simple, effortless industrial technology strategy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
