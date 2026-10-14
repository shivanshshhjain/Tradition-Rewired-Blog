import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Share2, ArrowLeft, ArrowRight, ExternalLink, BookmarkCheck, CheckCircle2, BookOpen, Link2, Check } from 'lucide-react';
import { ArticleData } from '../types/seo';
import { Breadcrumbs } from './Breadcrumbs';
import { ArticleCard } from './ArticleCard';
import { ARTICLES } from '../data/articles';

interface ArticleViewProps {
  article: ArticleData;
  onNavigate: (path: string) => void;
  onOpenResearchDesk?: (query?: string) => void;
}

export function ArticleView({ article, onNavigate, onOpenResearchDesk }: ArticleViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [topCopied, setTopCopied] = useState(false);
  const articleContentRef = useRef<HTMLElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current) return;

      const element = articleContentRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;
      const elementTop = rect.top;

      const totalDist = elementHeight - windowHeight + 200;
      const currentScroll = -elementTop + 100;

      if (totalDist > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalDist) * 100));
        setScrollProgress(progress);
      }

      setIsScrolled(window.scrollY > 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  const copyUrlToClipboard = (fromTop = false) => {
    navigator.clipboard.writeText(window.location.href);

    if (fromTop) {
      setTopCopied(true);
      setTimeout(() => setTopCopied(false), 2000);
    }

    // Trigger toast notification
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2800);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      copyUrlToClipboard(true);
    }
  };

  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* 
        SUBTLE MINIMALIST READING PROGRESS BAR
        Clean 2px black line tracking article scroll 
      */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#E5E7EB] z-[60] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#111827] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Subtle Floating Reading Indicator */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-200 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-[#111827] text-white px-3 py-1.5 rounded-full text-xs font-mono shadow-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>{Math.round(scrollProgress)}% read</span>
        </div>
      </div>

      {/* Floating 'Link Copied' Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showToast
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-[#111827] text-white px-4 py-2.5 rounded shadow-lg flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-gray-700">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Link copied to clipboard</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Articles', path: '/#articles' },
            { label: article.category, path: '/#articles' },
            { label: article.title }
          ]}
          onNavigate={onNavigate}
        />

        {/* Article Header & Masthead */}
        <header className="mb-8 sm:mb-10">
          {/* Unboxed Metadata Line */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-[#6B7280] mb-3 font-medium">
            <span className="text-[#111827] font-semibold">{article.category}</span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
              {article.publishedDate}
            </span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
              {article.readingTime}
            </span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span>{article.wordCount} words</span>
          </div>

          {/* Simple, Non-Flashy H1 Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-[1.25] tracking-tight mb-4">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed mb-6">
            {article.subtitle}
          </p>

          {/* Author Byline & Top Controls */}
          <div className="py-3.5 border-y border-[#E5E7EB] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
              />
              <div>
                <div className="text-sm font-semibold text-[#111827]">{article.author.name}</div>
                <div className="text-xs text-[#6B7280]">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenResearchDesk && (
                <button
                  onClick={() => onOpenResearchDesk(`Can you explain more about ${article.title}?`)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white border border-[#E5E7EB] hover:border-[#111827] px-3 py-1.5 rounded transition-colors cursor-pointer"
                  title="Ask Research Desk with Search Grounding"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Research Desk</span>
                </button>
              )}

              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#374151] hover:text-[#111827] bg-white border border-[#E5E7EB] hover:border-[#111827] px-3 py-1.5 rounded transition-colors cursor-pointer"
                title="Share or copy article"
              >
                {topCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Main Image */}
        <figure className="mb-10 sm:mb-12">
          <div className="aspect-16/9 overflow-hidden rounded bg-[#F3F4F6] border border-[#E5E7EB]">
            <img
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              width={article.featuredImage.width}
              height={article.featuredImage.height}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-xs text-[#6B7280] mt-2 italic text-center">
            {article.featuredImage.caption}
          </figcaption>
        </figure>

        {/* Executive Summary / Target Question Box */}
        <aside className="mb-10 bg-white border border-[#E5E7EB] p-5 sm:p-6 rounded shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827] uppercase tracking-wider mb-2">
            <BookmarkCheck className="w-4 h-4 text-[#6B7280]" />
            <span>Key Question Explored</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-2">
            {article.seo.questionAnswered}
          </h2>
          <p className="text-sm sm:text-base text-[#374151] leading-relaxed bg-[#F9FAFB] p-4 rounded border-l-3 border-[#111827] border-y border-r border-[#E5E7EB]">
            <strong className="text-[#111827]">Direct Answer:</strong> {article.seo.directAnswerSummary}
          </p>
        </aside>

        {/* Long-form Article Body */}
        <article ref={articleContentRef} id="article-content" className="prose-editorial">
          {/* Engaging Introduction */}
          <div className="text-[#1F2937] text-base sm:text-lg leading-relaxed mb-8 border-b border-[#E5E7EB] pb-6 font-medium">
            {article.introduction.map((p, idx) => (
              <p key={idx} className="mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          {/* Article Content Sections */}
          {article.sections.map((section, idx) => (
            <section key={idx} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3">
                {section.h2}
              </h2>

              {/* Question H2: Direct answer callout */}
              {section.isQuestion && section.directAnswer && (
                <div className="direct-answer-callout">
                  <p className="text-sm sm:text-base text-[#111827] font-medium mb-0 leading-relaxed">
                    <span className="font-bold text-[#111827]">Direct Answer: </span>
                    {section.directAnswer}
                  </p>
                </div>
              )}

              {/* Section Paragraphs */}
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-base text-[#374151] leading-relaxed mb-4">
                  {para}
                </p>
              ))}

              {/* Informative Table if present */}
              {section.table && (
                <div className="my-6 overflow-x-auto border border-[#E5E7EB] rounded bg-white shadow-xs">
                  {section.table.caption && (
                    <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-semibold text-[#111827] uppercase tracking-wider">
                      {section.table.caption}
                    </div>
                  )}
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#111827] font-semibold">
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4 py-3 text-xs uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`px-4 py-3 text-[#374151] ${cIdx === 0 ? 'font-medium text-[#111827]' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* H3 Subsections if present */}
              {section.h3s && section.h3s.map((sub, sIdx) => (
                <div key={sIdx} className="mt-5 mb-3">
                  <h3 className="text-lg font-bold text-[#111827] mb-2">
                    {sub.h3}
                  </h3>
                  {sub.paragraphs.map((subPara, spIdx) => (
                    <p key={spIdx} className="text-base text-[#374151] leading-relaxed mb-3">
                      {subPara}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          ))}

          {/* Actionable Conclusion */}
          <section className="mt-10 p-6 bg-white border border-[#E5E7EB] rounded">
            <h2 className="text-xl font-bold text-[#111827] mb-3">
              Conclusion &amp; Key Lessons
            </h2>
            {article.conclusion.summary.map((para, cIdx) => (
              <p key={cIdx} className="text-base text-[#374151] leading-relaxed mb-3">
                {para}
              </p>
            ))}

            <div className="mt-5 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded text-sm text-[#374151]">
              <span className="font-bold text-[#111827] block mb-1">Recommended Practical Step:</span>
              <span>{article.conclusion.actionableStep}</span>
            </div>
          </section>

          {/* 
            DEDICATED 'COPY ARTICLE LINK' BUTTON AT THE BOTTOM OF ARTICLEVIEW
            Explicitly requested by user 
          */}
          <div className="mt-8 p-5 bg-white border border-[#E5E7EB] rounded flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#111827]">Share or reference this dispatch</div>
              <div className="text-xs text-[#6B7280]">Copy the direct link to share with colleagues or save for later reading.</div>
            </div>
            <button
              onClick={() => copyUrlToClipboard(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-medium rounded transition-colors cursor-pointer shadow-xs"
            >
              <Link2 className="w-4 h-4" />
              <span>Copy Article Link</span>
            </button>
          </div>

          {/* Contextual Internal Links Section */}
          <section className="mt-8 p-5 bg-white border border-[#E5E7EB] rounded">
            <h3 className="text-base font-bold text-[#111827] mb-3">
              Related Dispatches in This Publication
            </h3>
            <ul className="space-y-2.5 text-sm">
              {article.internalLinks.map((link, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
                  <span className="text-[#4B5563]">
                    {link.context}{' '}
                    <a
                      href={`/${link.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/${link.slug}`);
                      }}
                      className="font-semibold text-[#111827] hover:underline underline-offset-4"
                    >
                      {link.anchorText}
                    </a>.
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Credible External Sources and References */}
          <section className="mt-8 pt-5 border-t border-[#E5E7EB]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
              Verified External Citations &amp; Research
            </h3>
            <div className="space-y-2.5">
              {article.externalSources.map((source, idx) => (
                <div key={idx} className="text-xs text-[#6B7280]">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111827] hover:underline inline-flex items-center gap-1 group"
                  >
                    <span>{source.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#9CA3AF] group-hover:text-[#111827]" />
                  </a>
                  <div className="text-[#6B7280] mt-0.5">
                    {source.publisher} {source.year && `(${source.year})`} · {source.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Next / Previous Article Navigation */}
        <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dispatches</span>
          </button>
          <a
            href="/#articles"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
              setTimeout(() => {
                document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-xs font-semibold text-[#111827] hover:underline"
          >
            Browse All Dispatches
          </a>
        </div>

        {/* Related Articles Cards */}
        <section className="mt-12 pt-8 border-t border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827] mb-5">
            Recommended Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
