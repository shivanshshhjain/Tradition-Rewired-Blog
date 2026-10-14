import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { ArticleData } from '../types/seo';

interface ArticleCardProps {
  article: ArticleData;
  onNavigate: (path: string) => void;
  priority?: boolean;
}

export function ArticleCard({ article, onNavigate, priority = false }: ArticleCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(`/${article.slug}`);
  };

  return (
    <article className="group flex flex-col bg-white border border-[#E5E7EB] hover:border-[#111827] transition-all duration-150 rounded overflow-hidden h-full shadow-2xs hover:shadow-xs">
      {/* Article Image Container */}
      <a
        href={`/${article.slug}`}
        onClick={handleClick}
        className="block relative aspect-16/9 overflow-hidden bg-[#F3F4F6]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          width={article.featuredImage.width}
          height={article.featuredImage.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
        />
      </a>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Unboxed Metadata Line */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-[#6B7280] mb-2 font-medium">
          <span className="text-[#111827] font-semibold">{article.category}</span>
          <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
          <span>{article.publishedDate}</span>
          <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#9CA3AF]" />
            {article.readingTime}
          </span>
        </div>

        {/* Article Headline */}
        <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug tracking-tight mb-2 group-hover:text-black transition-colors">
          <a href={`/${article.slug}`} onClick={handleClick}>
            {article.title}
          </a>
        </h3>

        {/* Short Subtitle / Excerpt */}
        <p className="text-xs sm:text-sm text-[#4B5563] line-clamp-3 leading-relaxed mb-4 flex-grow">
          {article.subtitle}
        </p>

        {/* Direct Question Answer Hint */}
        <div className="mb-4 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7280]">
          <span className="font-semibold text-[#111827] block mb-0.5">Key Inquiry:</span>
          <span className="italic line-clamp-2 text-[#4B5563]">"{article.seo.questionAnswered}"</span>
        </div>

        {/* Card Footer: Author + Read Link */}
        <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              width={24}
              height={24}
              loading="lazy"
              className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
            />
            <span className="text-xs font-medium text-[#374151] truncate max-w-[120px] sm:max-w-[140px]">
              {article.author.name}
            </span>
          </div>

          <a
            href={`/${article.slug}`}
            onClick={handleClick}
            className="text-xs font-semibold text-[#111827] group-hover:underline flex items-center gap-1 underline-offset-4"
          >
            <span>Read Article</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
