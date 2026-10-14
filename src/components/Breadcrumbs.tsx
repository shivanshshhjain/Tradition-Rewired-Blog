import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { SITE_URL } from '../data/seoConfig';

interface BreadcrumbsProps {
  items: {
    label: string;
    path?: string;
  }[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path?: string) => {
    e.preventDefault();
    if (path) {
      onNavigate(path);
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${SITE_URL}${item.path}` : undefined
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ol className="flex items-center flex-wrap gap-2 text-xs text-[#6B7280] font-medium">
        <li>
          <a
            href="/"
            onClick={(e) => handleClick(e, '/')}
            className="flex items-center gap-1 hover:text-[#111827] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-[#9CA3AF] shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="text-[#111827] font-semibold truncate max-w-[240px] sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => handleClick(e, item.path)}
                  className="hover:text-[#111827] transition-colors truncate max-w-[180px] sm:max-w-xs"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
