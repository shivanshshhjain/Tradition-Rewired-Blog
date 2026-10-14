export type SearchIntent = 'Informational' | 'Navigational' | 'Commercial' | 'Transactional';

export interface PageSEOConfig {
  slug: string;
  url: string;
  pageTitle: string; // Target: 50-60 characters
  metaDescription: string; // Target: 150-160 characters
  mainKeyword: string;
  relatedKeywords: [string, string]; // Exactly 2 related keywords
  intent: SearchIntent;
  questionAnswered: string;
  directAnswerSummary: string; // Direct 1-2 sentence answer
}

export interface ExternalCitation {
  title: string;
  publisher: string;
  year?: number | string;
  url: string;
  description: string;
}

export interface InternalLinkTarget {
  slug: string;
  title: string;
  anchorText: string;
  context: string;
}

export interface ArticleContentSection {
  h2: string;
  isQuestion?: boolean;
  directAnswer?: string; // Concise 1-2 sentence direct answer for question H2s
  paragraphs: string[];
  h3s?: {
    h3: string;
    paragraphs: string[];
  }[];
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  callout?: {
    title: string;
    text: string;
  };
}

export interface ArticleData {
  id: string;
  slug: string;
  title: string; // H1
  subtitle: string;
  seo: PageSEOConfig;
  category: 'AI & Automation' | 'Digital Strategy' | 'Family Business' | 'Manufacturing' | 'Retail & Commerce' | 'Craft & Heritage' | 'Entrepreneurship' | 'Sustainability';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  isoDate: string;
  readingTime: string;
  wordCount: number;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  introduction: string[];
  sections: ArticleContentSection[];
  conclusion: {
    summary: string[];
    actionableStep: string;
  };
  internalLinks: InternalLinkTarget[];
  externalSources: ExternalCitation[];
}
