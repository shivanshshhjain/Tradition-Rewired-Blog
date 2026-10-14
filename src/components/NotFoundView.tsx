import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ARTICLES } from '../data/articles';

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
  badPath: string;
}

export function NotFoundView({ onNavigate, badPath }: NotFoundViewProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] text-[#111827] px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
          HTTP 404 · Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-3">
          The Requested Page Could Not Be Found
        </h1>
        <p className="text-[#4B5563] text-sm leading-relaxed mb-6 max-w-lg mx-auto">
          The URL <code className="bg-[#E5E7EB] px-1.5 py-0.5 rounded text-xs font-mono text-[#111827]">{badPath}</code> does not match an active dispatch or resource in our publication index.
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => onNavigate('/')}
            className="bg-[#111827] text-white hover:bg-black px-4 py-2 rounded text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>

        {/* Suggested Active Articles */}
        <div className="text-left bg-white border border-[#E5E7EB] p-5 sm:p-6 rounded shadow-2xs">
          <h2 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#6B7280]" />
            <span>Popular Dispatches</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            {ARTICLES.slice(0, 5).map((art) => (
              <li key={art.id} className="flex items-start justify-between gap-4 pb-2 border-b border-[#F3F4F6] last:border-none">
                <a
                  href={`/${art.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/${art.slug}`);
                  }}
                  className="font-medium text-[#374151] hover:text-[#111827] hover:underline transition-colors"
                >
                  {art.title}
                </a>
                <span className="text-xs text-[#9CA3AF] shrink-0 font-medium">{art.readingTime}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
