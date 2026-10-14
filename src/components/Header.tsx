import React, { useState } from 'react';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { SITE_NAME, SITE_TAGLINE } from '../data/seoConfig';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenResearchDesk?: () => void;
}

export function Header({ currentPath, onNavigate, searchQuery, onSearchChange, onOpenResearchDesk }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand Masthead */}
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            onClick={(e) => handleNavClick(e, '/')}
            className="group flex flex-col focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] group-hover:text-black transition-colors">
              {SITE_NAME}
            </span>
            <span className="text-xs text-[#6B7280] font-normal tracking-normal hidden sm:block">
              {SITE_TAGLINE}
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4B5563]">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className={`transition-colors py-1 hover:text-[#111827] ${
              currentPath === '/' ? 'text-[#111827] font-semibold border-b-2 border-[#111827]' : ''
            }`}
          >
            Home
          </a>
          <a
            href="/#articles"
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== '/') {
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#111827] transition-colors py-1"
          >
            Articles
          </a>
          <a
            href="/#themes"
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== '/') {
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#111827] transition-colors py-1"
          >
            Core Themes
          </a>
          <a
            href="/#editorial-mission"
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== '/') {
                onNavigate('/');
                setTimeout(() => {
                  document.getElementById('editorial-mission')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('editorial-mission')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#111827] transition-colors py-1"
          >
            Editorial Mission
          </a>
        </nav>

        {/* Action Controls: Search & Research Desk */}
        <div className="flex items-center gap-2.5">
          {onOpenResearchDesk && (
            <button
              onClick={onOpenResearchDesk}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#111827] hover:bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1.5 rounded transition-colors cursor-pointer"
              title="Open Editorial Research Desk with Search Grounding"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
              <span>Research Desk</span>
            </button>
          )}

          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#F9FAFB] border border-[#111827] rounded px-3 py-1.5 shadow-2xs">
                <Search className="w-4 h-4 text-[#9CA3AF] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles, topics..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="text-xs sm:text-sm bg-transparent border-none focus:outline-none w-36 sm:w-52 text-[#111827] placeholder:text-[#9CA3AF]"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[#9CA3AF] hover:text-[#111827] ml-1 p-0.5 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition-colors flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                aria-label="Search articles"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 shadow-sm animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className={`px-3 py-2 text-sm font-medium rounded ${
                currentPath === '/' ? 'bg-[#F3F4F6] text-[#111827]' : 'text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              Home
            </a>
            <a
              href="/#articles"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (currentPath !== '/') {
                  onNavigate('/');
                  setTimeout(() => {
                    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB] rounded"
            >
              Articles
            </a>
            <a
              href="/#themes"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (currentPath !== '/') {
                  onNavigate('/');
                  setTimeout(() => {
                    document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('themes')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB] rounded"
            >
              Core Themes
            </a>
            <a
              href="/#editorial-mission"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (currentPath !== '/') {
                  onNavigate('/');
                  setTimeout(() => {
                    document.getElementById('editorial-mission')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('editorial-mission')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB] rounded"
            >
              Editorial Mission
            </a>

            {onOpenResearchDesk && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResearchDesk();
                }}
                className="text-left px-3 py-2 text-sm font-medium text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#111827]" />
                <span>Editorial Research Desk</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
