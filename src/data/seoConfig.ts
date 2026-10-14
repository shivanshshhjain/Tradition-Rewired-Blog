import { PageSEOConfig } from '../types/seo';

// Canonical Site Base URL — configurable via environment variable VITE_SITE_URL or SITE_URL
export const SITE_URL =
  (typeof process !== 'undefined' && (process.env?.VITE_SITE_URL || process.env?.SITE_URL)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SITE_URL) ||
  'https://tradition-rewired.vercel.app';
export const SITE_NAME = 'Tradition, Rewired';
export const SITE_TAGLINE = 'Where traditional business meets the technology of tomorrow.';

export const SEO_CONFIG: Record<string, PageSEOConfig> = {
  home: {
    slug: '',
    url: `${SITE_URL}/`,
    pageTitle: 'Technology-Driven Startups & Legacy Business Innovation', // 55 chars
    metaDescription: 'Learn how traditional businesses leverage digital transformation, AI, and automation to build resilient, technology-driven startups and scalable enterprises.', // 158 chars
    mainKeyword: 'technology-driven startups',
    relatedKeywords: ['traditional business innovation', 'legacy business modernisation'],
    intent: 'Informational',
    questionAnswered: 'How can traditional businesses use modern technology to build lasting startups?',
    directAnswerSummary: 'Traditional businesses can build lasting startups by digitizing operational backbones, deploying targeted automation for repetitive bottlenecks, and utilizing their existing domain authority to outcompete pure-play software competitors.'
  },
  'ai-for-traditional-businesses': {
    slug: 'ai-for-traditional-businesses',
    url: `${SITE_URL}/ai-for-traditional-businesses`,
    pageTitle: 'AI for Traditional Businesses: Retain Identity and Scale', // 56 chars
    metaDescription: 'Discover how AI for traditional businesses unlocks operational scale, customer intelligence, and efficiency while preserving core heritage and brand trust.', // 156 chars
    mainKeyword: 'AI for traditional businesses',
    relatedKeywords: ['AI adoption for small businesses', 'AI tools for traditional industries'],
    intent: 'Informational',
    questionAnswered: 'How Can Traditional Businesses Use AI Without Losing Their Identity?',
    directAnswerSummary: 'Traditional businesses preserve identity while adopting AI by automating administrative friction instead of craft, keeping human subject-matter experts in the loop for high-touch customer relationships, and using machine learning to amplify domain craftsmanship.'
  },
  'digital-transformation-small-business': {
    slug: 'digital-transformation-small-business',
    url: `${SITE_URL}/digital-transformation-small-business`,
    pageTitle: 'Digital Transformation for Small Businesses: 2026 Guide', // 55 chars
    metaDescription: 'Follow this practical digital transformation for small businesses roadmap to automate workflows, upgrade legacy tools, and drive sustainable profitable growth.', // 159 chars
    mainKeyword: 'digital transformation for small businesses',
    relatedKeywords: ['small business automation', 'business modernisation strategy'],
    intent: 'Informational',
    questionAnswered: 'What steps should a small business take to modernise its operations?',
    directAnswerSummary: 'Small businesses should modernize operations through a phased four-step framework: map paper and manual communication bottlenecks, standardize on unified cloud record-keeping, automate repetitive data transfers, and only then layer predictive business analytics.'
  },
  'modernise-family-business': {
    slug: 'modernise-family-business',
    url: `${SITE_URL}/modernise-family-business`,
    pageTitle: 'Family Business Digital Transformation & Generational Scale', // 58 chars
    metaDescription: 'Learn how family business digital transformation bridges founder heritage with next-generation leadership, modern governance, cloud tools, and data systems.', // 157 chars
    mainKeyword: 'family business digital transformation',
    relatedKeywords: ['modernise a family business', 'next-generation family business'],
    intent: 'Informational',
    questionAnswered: 'How can a family business modernise while preserving its values?',
    directAnswerSummary: 'Family businesses modernize while honoring heritage by separating family relationship dynamics from operating governance, framing technological upgrades around the founder’s core commitment to customer care, and running low-risk pilot projects that demonstrate quick financial gains.'
  },
  'ai-in-traditional-manufacturing': {
    slug: 'ai-in-traditional-manufacturing',
    url: `${SITE_URL}/ai-in-traditional-manufacturing`,
    pageTitle: 'AI in Traditional Manufacturing: Practical Industry Guide', // 57 chars
    metaDescription: 'Explore practical AI in traditional manufacturing strategies that reduce scrap waste, predict machine downtime, and boost floor yield without high overhead.', // 156 chars
    mainKeyword: 'AI in traditional manufacturing',
    relatedKeywords: ['smart manufacturing for SMEs', 'predictive maintenance small factory'],
    intent: 'Informational',
    questionAnswered: 'Can small factories implement AI without millions in capital expenditure?',
    directAnswerSummary: 'Small and mid-sized manufacturing facilities can adopt artificial intelligence affordably by outfitting existing machinery with low-cost vibration and thermal IoT sensors, utilizing cloud computer vision for end-of-line optical defect sorting, and targeting high-scrap work cells first.'
  },
  'omnichannel-traditional-retail': {
    slug: 'omnichannel-traditional-retail',
    url: `${SITE_URL}/omnichannel-traditional-retail`,
    pageTitle: 'Omnichannel Traditional Retail: From Local Store to Scale', // 57 chars
    metaDescription: 'Transform legacy brick-and-mortar storefronts with omnichannel traditional retail strategies, unifying POS data, local delivery, and customer loyalty online.', // 158 chars
    mainKeyword: 'omnichannel traditional retail',
    relatedKeywords: ['local retail modernization', 'physical store to digital brand'],
    intent: 'Informational',
    questionAnswered: 'How can a local shop transition to an omnichannel retail model?',
    directAnswerSummary: 'A local retailer transitions to an omnichannel model by deploying an unified inventory management system that synchronizes physical point-of-sale registers with web and marketplace inventory in real time, turning the store footprint into a micro-fulfillment and community pickup hub.'
  },
  'traditional-crafts-to-scalable-startups': {
    slug: 'traditional-crafts-to-scalable-startups',
    url: `${SITE_URL}/traditional-crafts-to-scalable-startups`,
    pageTitle: 'Traditional Crafts into Scalable Startups: A 2026 Roadmap', // 57 chars
    metaDescription: 'Turn heritage artisan techniques and traditional crafts into scalable startups with ethical supply chains, global direct-to-consumer reach, and modern tech.', // 158 chars
    mainKeyword: 'traditional crafts into scalable startups',
    relatedKeywords: ['artisan brand scaling', 'heritage craft supply chain'],
    intent: 'Informational',
    questionAnswered: 'Can handmade heritage goods scale into high-growth modern ventures?',
    directAnswerSummary: 'Traditional craft enterprises scale successfully by standardizing raw material sourcing and logistics while keeping core artisanal finishing manual, utilizing digital provenance tracking to command premium global pricing, and building direct-to-consumer subscriber relationships.'
  },
  'startups-in-traditional-industries': {
    slug: 'startups-in-traditional-industries',
    url: `${SITE_URL}/startups-in-traditional-industries`,
    pageTitle: 'Startups in Traditional Industries: Blueprint for Growth', // 56 chars
    metaDescription: 'Master how to launch startups in traditional industries, navigate legacy gatekeepers, modernize supply chains, and build lasting technological advantages.', // 155 chars
    mainKeyword: 'startups in traditional industries',
    relatedKeywords: ['unsexy startup industries', 'legacy market disruption'],
    intent: 'Informational',
    questionAnswered: 'Why are traditional industries often the best fertile ground for startups?',
    directAnswerSummary: 'Traditional industries provide exceptional startup opportunities because they possess massive established cash flows, fragmented vendor ecosystems, and acute workflow inefficiencies where even modest software, automation, and logistics upgrades create enormous competitive moats.'
  },
  'ai-customer-service-small-business': {
    slug: 'ai-customer-service-small-business',
    url: `${SITE_URL}/ai-customer-service-small-business`,
    pageTitle: 'AI Customer Service for Small Business: Balance & Empathy', // 57 chars
    metaDescription: 'Implement AI customer service for small business without sacrificing empathy, combining 24/7 intelligent routing with personalized human relationship touch.', // 157 chars
    mainKeyword: 'AI customer service for small business',
    relatedKeywords: ['automated customer care SME', 'human in the loop support'],
    intent: 'Informational',
    questionAnswered: 'Can AI customer support maintain personal warmth and customer trust?',
    directAnswerSummary: 'AI customer service maintains warmth and trust when deployed to resolve repetitive transactional inquiries like order tracking and hours instantaneously, while immediately routing nuanced, emotionally sensitive, or high-value customer conversations to trained human staff.'
  },
  'data-driven-decisions-small-business': {
    slug: 'data-driven-decisions-small-business',
    url: `${SITE_URL}/data-driven-decisions-small-business`,
    pageTitle: 'Data-Driven Decisions for Small Business: Practical Steps', // 57 chars
    metaDescription: 'Unlock data-driven decisions for small business by unifying fragmented spreadsheets, inventory signals, and customer metrics into simple actionable growth.', // 156 chars
    mainKeyword: 'data-driven decisions for small business',
    relatedKeywords: ['practical analytics for SMEs', 'small business KPI tracking'],
    intent: 'Informational',
    questionAnswered: 'How can a small business leverage existing numbers to make sharper decisions?',
    directAnswerSummary: 'Small businesses make actionable data-driven decisions by consolidating scattered sales, payroll, and supplier spreadsheets into a single weekly dashboard focused on three primary metrics: contribution margin per product, inventory turnover velocity, and customer repeat purchase rate.'
  },
  'sustainable-business-models-technology': {
    slug: 'sustainable-business-models-technology',
    url: `${SITE_URL}/sustainable-business-models-technology`,
    pageTitle: 'Sustainable Business Models and Technology for Growth', // 53 chars
    metaDescription: 'Discover how sustainable business models and technology enable circular economy loops, reduce industrial waste, and unlock profitable long-term ESG growth.', // 156 chars
    mainKeyword: 'sustainable business models and technology',
    relatedKeywords: ['circular economy for SMEs', 'clean technology legacy business'],
    intent: 'Informational',
    questionAnswered: 'How does circular technology drive long-term business resilience?',
    directAnswerSummary: 'Circular business models combined with IoT tracking and modular manufacturing insulate companies from raw material price volatility, capture recurring revenue through refurbishment programs, and future-proof enterprises against evolving environmental compliance standards.'
  }
};
