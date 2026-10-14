import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Clock, Sparkles, ShieldCheck, Cpu, Store, Factory, Users, RefreshCw } from 'lucide-react';
import { ARTICLES, getFeaturedArticle } from '../data/articles';
import { ArticleCard } from './ArticleCard';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenResearchDesk?: (query?: string) => void;
}

const CATEGORIES = [
  'All Dispatches',
  'AI & Automation',
  'Digital Strategy',
  'Family Business',
  'Manufacturing',
  'Retail & Commerce',
  'Craft & Heritage',
  'Entrepreneurship',
  'Sustainability'
];

export function HomeView({ onNavigate, searchQuery, onSearchChange, onOpenResearchDesk }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Dispatches');
  const featuredArticle = getFeaturedArticle();

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All Dispatches' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.seo.mainKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* 1. HERO SECTION */}
      <section className="border-b border-[#E5E7EB] bg-white pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
              <span>Business &amp; Technology Strategy</span>
            </div>

            {/* Publication Hero Headline */}
            <h1 className="text-3xl sm:text-5xl font-bold text-[#111827] tracking-tight leading-[1.2] mb-5">
              Where Traditional Business Meets the Technology of Tomorrow.
            </h1>

            {/* Hero Proposition */}
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed mb-7">
              We investigate how physical industries—from multigenerational textile mills and precision machine shops to heritage craft guilds and local retailers—deploy artificial intelligence, cloud architecture, and circular economics to build resilient enterprises without surrendering their human soul.
            </p>

            {/* Quick Hero Nav Anchor Links */}
            <div className="flex items-center flex-wrap gap-3 text-xs sm:text-sm font-medium">
              <a
                href="#featured"
                className="bg-[#111827] text-white hover:bg-black px-4 py-2 rounded transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <span>Read Featured Story</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
              </a>

              <a
                href="#articles"
                className="text-[#374151] hover:text-[#111827] bg-white border border-[#E5E7EB] hover:border-[#111827] px-4 py-2 rounded transition-colors"
              >
                Browse Dispatches
              </a>

              {onOpenResearchDesk && (
                <button
                  onClick={() => onOpenResearchDesk('How can traditional businesses modernise without losing their identity?')}
                  className="text-[#374151] hover:text-[#111827] bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] px-3.5 py-2 rounded transition-colors inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
                  <span>Ask Research Desk</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE HERO CARD */}
      <section id="featured" className="py-10 sm:py-14 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Featured Analysis
            </h2>
            <span className="text-xs text-[#9CA3AF]">Lead Dispatch</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xs hover:border-[#111827] transition-all duration-200">
            {/* Visual Media Column */}
            <div className="lg:col-span-7 relative aspect-16/9 lg:aspect-auto overflow-hidden bg-[#F3F4F6]">
              <img
                src={featuredArticle.featuredImage.url}
                alt={featuredArticle.featuredImage.alt}
                width={featuredArticle.featuredImage.width}
                height={featuredArticle.featuredImage.height}
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#111827] text-white text-[11px] font-semibold px-2 py-0.5 uppercase tracking-wider rounded">
                Lead Story
              </div>
            </div>

            {/* Editorial Content Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Unboxed Metadata Line */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-[#6B7280] mb-2.5 font-medium">
                  <span className="text-[#111827] font-semibold">{featuredArticle.category}</span>
                  <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                  <span>{featuredArticle.publishedDate}</span>
                  <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9CA3AF]" />
                    {featuredArticle.readingTime}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug mb-3 hover:underline">
                  <a
                    href={`/${featuredArticle.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/${featuredArticle.slug}`);
                    }}
                  >
                    {featuredArticle.title}
                  </a>
                </h3>

                <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
                  {featuredArticle.subtitle}
                </p>

                {/* Direct Question Answer Highlight Box */}
                <div className="bg-[#F9FAFB] border-l-3 border-[#111827] p-3.5 rounded-r text-xs text-[#374151] mb-5 border-y border-r border-[#E5E7EB]">
                  <span className="font-semibold text-[#111827] block mb-1">
                    {featuredArticle.seo.questionAnswered}
                  </span>
                  <span className="text-[#4B5563] leading-relaxed">
                    {featuredArticle.seo.directAnswerSummary}
                  </span>
                </div>
              </div>

              {/* Author & CTA */}
              <div className="pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredArticle.author.avatar}
                    alt={featuredArticle.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#111827]">{featuredArticle.author.name}</div>
                    <div className="text-[11px] text-[#6B7280]">{featuredArticle.author.role}</div>
                  </div>
                </div>

                <a
                  href={`/${featuredArticle.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/${featuredArticle.slug}`);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#111827] hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUESTION HEADINGS WITH DIRECT ANSWERS */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Foundational Inquiries</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
              Core Principles of Modernisation
            </h2>
            <p className="text-[#6B7280] text-sm mt-1.5">
              Direct answers to the two most pressing dilemmas confronting traditional business owners today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Question H2 #1 */}
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] p-6 rounded flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111827] mb-2.5">
                  Why Must Traditional Businesses Modernize Today Rather Than Tomorrow?
                </h2>
                {/* Immediate direct answer */}
                <p className="text-sm text-[#111827] font-medium bg-white border-l-3 border-[#111827] p-3.5 rounded-r mb-3.5 leading-relaxed border-y border-r border-[#E5E7EB]">
                  Traditional businesses must modernize immediately because shifting customer expectations, margin compression from digitized competitors, and succession generational transitions require operational agility that manual processes cannot support. Delaying digital infrastructure risks losing both customer loyalty and talented heirs to agile digital-native competitors.
                </p>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-4">
                  Legacy businesses frequently view technology upgrades as discretionary capital expenditures to be postponed during volatile markets. However, the true cost of delay is compounding operational friction: trapped working capital, opaque supply chains, and an inability to recruit modern engineering talent.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] text-xs font-semibold text-[#111827]">
                <a
                  href="/digital-transformation-small-business"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/digital-transformation-small-business');
                  }}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Explore the small business modernization roadmap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Question H2 #2 */}
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] p-6 rounded flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111827] mb-2.5">
                  Can Heritage Craftsmanship and Modern Artificial Intelligence Truly Coexist?
                </h2>
                {/* Immediate direct answer */}
                <p className="text-sm text-[#111827] font-medium bg-white border-l-3 border-[#111827] p-3.5 rounded-r mb-3.5 leading-relaxed border-y border-r border-[#E5E7EB]">
                  Heritage craftsmanship and artificial intelligence not only coexist but thrive together when AI is confined to administrative friction, predictive inventory, and logistics, leaving the tactile mastery, human judgment, and aesthetic curation entirely in the hands of seasoned artisans.
                </p>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-4">
                  The existential error lies in treating generative algorithms as substitutes for domain taste. When algorithms handle repetitive documentation, invoice parsing, and freight scheduling, artisan masters regain the mental freedom to mentor apprentices and perfect irreplaceable physical goods.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] text-xs font-semibold text-[#111827]">
                <a
                  href="/ai-for-traditional-businesses"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/ai-for-traditional-businesses');
                  }}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Read how traditional firms adopt AI while preserving identity</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARTICLES CARD GRID */}
      <section id="articles" className="py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Dispatches</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
                Articles &amp; Investigations
              </h2>
              <p className="text-[#6B7280] text-sm mt-1">
                Original research, operational implementation frameworks, verified case evidence, and leadership lessons.
              </p>
            </div>

            {/* Filter Count Counter */}
            <div className="text-xs text-[#6B7280] font-medium">
              Showing <strong>{filteredArticles.length}</strong> dispatches
            </div>
          </div>

          {/* Interactive Filter Segmented Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111827] text-white shadow-2xs'
                    : 'bg-white text-[#4B5563] hover:text-[#111827] border border-[#E5E7EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] p-10 text-center rounded">
              <p className="text-[#374151] text-base mb-2">No dispatches match your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All Dispatches');
                  onSearchChange('');
                }}
                className="text-xs font-semibold text-[#111827] underline cursor-pointer"
              >
                Reset search and filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredArticles.map((article, idx) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onNavigate={onNavigate}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. EDITORIAL MISSION */}
      <section id="editorial-mission" className="py-14 sm:py-18 bg-[#111827] text-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                Editorial Manifesto
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-5 leading-tight">
                Why Traditional Businesses Need Thoughtful Modernisation.
              </h2>
              <div className="space-y-3.5 text-gray-300 text-sm leading-relaxed">
                <p>
                  For the past twenty years, venture capital orthodoxy has preached a doctrine of ruthless disruption: move fast, break things, replace human labor with algorithms, and commoditize physical craft into disposable software transactions.
                </p>
                <p>
                  We reject that doctrine. The businesses that build generational wealth—the spice trading dynasties of Kochi, the precision machine shops of Baden-Württemberg, the family masonry contractors of Chicago—are rooted in patient trust, tactile excellence, and enduring community bonds.
                </p>
                <p>
                  Our editorial mission at <em>Tradition, Rewired</em> is to champion <strong>thoughtful modernisation</strong>: adopting modern software, artificial intelligence, and data disciplines to protect and amplify human craftsmanship rather than liquidate it.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-[#1F2937] border border-gray-700 p-5 rounded">
                <ShieldCheck className="w-5 h-5 text-gray-300 mb-2.5" />
                <h3 className="text-base font-bold text-white mb-1.5">Heritage Over Hype</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  We never endorse technology for its own sake. Every recommendation must survive a strict test of real-world cash flow, employee dignity, and customer trust.
                </p>
              </div>

              <div className="bg-[#1F2937] border border-gray-700 p-5 rounded">
                <Cpu className="w-5 h-5 text-gray-300 mb-2.5" />
                <h3 className="text-base font-bold text-white mb-1.5">Pragmatic Automation</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Automate the friction boundary—invoices, delivery tracking, machine sensor logging—while jealously defending the human master-apprentice dynamic.
                </p>
              </div>

              <div className="bg-[#1F2937] border border-gray-700 p-5 rounded">
                <Users className="w-5 h-5 text-gray-300 mb-2.5" />
                <h3 className="text-base font-bold text-white mb-1.5">Generational Continuity</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Guiding next-generation family successors to professionalize governance and cloud systems without alienating senior founder wisdom.
                </p>
              </div>

              <div className="bg-[#1F2937] border border-gray-700 p-5 rounded">
                <RefreshCw className="w-5 h-5 text-gray-300 mb-2.5" />
                <h3 className="text-base font-bold text-white mb-1.5">Long-Term Resilience</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pioneering circular economy loops and unit-economics discipline that insulate traditional businesses against supply chain shocks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE 7 THEMATIC PILLARS */}
      <section id="themes" className="py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Pillars</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
              Core Strategic Pillars
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">
              Our investigations span seven structural domains where traditional industries and modern technology converge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <Cpu className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">1. AI &amp; Automation</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Deploying optical defect sorting, semantic document search, and predictive sensor maintenance.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/ai-for-traditional-businesses"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/ai-for-traditional-businesses');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → AI for Traditional Businesses
                </a>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <RefreshCw className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">2. Digital Transformation</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Replacing fragmented spreadsheets with unified cloud ledgers and automated inventory reconciliation.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/digital-transformation-small-business"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/digital-transformation-small-business');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → Small Business Transformation Roadmap
                </a>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <Users className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">3. Family Business Succession</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Decoupling family emotional politics from commercial software governance with low-risk pilots.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/modernise-family-business"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/modernise-family-business');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → Family Business Next-Gen Roadmap
                </a>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <Factory className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">4. Smart Manufacturing</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Retrofitting affordable thermal and vibration IoT sensors onto legacy shop-floor machines.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/ai-in-traditional-manufacturing"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/ai-in-traditional-manufacturing');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → AI in Manufacturing: Small Steps
                </a>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <Store className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">5. Omnichannel Retail</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Transforming storefronts into hyper-local fulfillment and experiential connection centers.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/omnichannel-traditional-retail"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/omnichannel-traditional-retail');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → Local Shop to Omnichannel Brand
                </a>
              </div>
            </div>

            {/* Pillar 6 & 7 */}
            <div className="bg-white border border-[#E5E7EB] p-5 rounded hover:border-[#111827] transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <Sparkles className="w-5 h-5 text-[#111827] mb-2.5" />
                <h3 className="text-base font-bold text-[#111827] mb-1.5">6. Craft &amp; Circular Scale</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-3">
                  Empowering artisan makers through digital provenance, and pioneering circular economy loops.
                </p>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-[#F3F4F6] text-xs">
                <a
                  href="/traditional-crafts-to-scalable-startups"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/traditional-crafts-to-scalable-startups');
                  }}
                  className="font-medium text-[#111827] hover:underline block"
                >
                  → Traditional Crafts into Scalable Startups
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
