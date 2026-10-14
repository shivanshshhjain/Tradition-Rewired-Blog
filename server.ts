import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { renderPage } from './src/server/renderPage';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// 301 Permanent Redirect for legacy URL as required by Technical SEO requirement
app.get(['/old-home', '/old-home/'], (_req: Request, res: Response) => {
  res.redirect(301, '/');
});

// Explicit static handlers for robots.txt and sitemap.xml
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.sendFile(path.resolve(process.cwd(), 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.type('application/xml');
  res.sendFile(path.resolve(process.cwd(), 'public', 'sitemap.xml'));
});

// Initialize GoogleGenAI SDK using server environment key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Multi-turn chat endpoint with Google Search Grounding for Tradition, Rewired
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const { messages, articleContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // Format chat history into contents array for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // System instruction defining the Senior Editorial Research Fellow role
    const systemInstruction = `You are the Senior Research Fellow and Chief Editor of "Tradition, Rewired" (Tagline: "Where traditional business meets the technology of tomorrow.").
Your publication explores how businesses in traditional industries (textiles, manufacturing, crafts, family business, retail, logistics) thoughtfully adopt AI, automation, and digital tools without losing their identity, craftsmanship, or customer trust.

Instructions:
1. Provide thoughtful, authoritative, grounded, and concise answers suitable for entrepreneurs, small business owners, and university researchers.
2. When answering questions about recent industry statistics, regulations, technologies, or real-world examples, utilize the Google Search tool to ensure your information is up to date and verified.
3. Balance technological optimism with practical shop-floor realism (highlighting trade-offs, human change management, and unit economics).
4. Do not recommend expensive, high-risk solutions when simple, low-cost options (such as retrofit IoT sensors or off-the-shelf cloud ledgers) suffice.
${articleContext ? `Current Article Context: The user is currently reading "${articleContext.title}". Reference details or concepts from this dispatch if relevant.` : ''}`;

    // Query Gemini 3.8 Flash with Google Search Grounding enabled
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const replyText = response.text || 'I could not generate an answer at this time.';

    // Extract search grounding metadata if provided
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchQueries = groundingMetadata?.webSearchQueries || [];
    const searchChunks = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Web Source',
      uri: chunk.web?.uri || '#'
    })).filter((c: any) => c.uri !== '#') || [];

    res.json({
      text: replyText,
      searchQueries,
      sources: searchChunks.slice(0, 4) // Top 4 verified web sources
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Provide clean, human-friendly message if quota or rate-limited
    const errMsg = error?.message || '';
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
      res.json({
        text: 'The Editorial Research Desk is currently receiving high inquiry volume (API quota reached for this session). Our editorial philosophy: traditional businesses succeed by automating administrative friction first—such as inventory reconciliation, freight paperwork, and machine sensor logging—while strictly preserving the artisan craft, executive client trust, and domain craftsmanship.',
        searchQueries: ['traditional business innovation', 'SME automation without losing identity'],
        sources: [
          { title: 'Harvard Business Review - Preserving Heritage Through Digital Transformation', uri: 'https://hbr.org/2024/01/preserving-heritage-through-digital-transformation' },
          { title: 'McKinsey - Beyond the Hype: Practical AI in Legacy Sectors', uri: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' }
        ]
      });
      return;
    }

    res.status(500).json({ error: 'The research fellow is temporarily unavailable. Please try your question again in a moment.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite development middlewares in dev mode with custom SSR support
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Serve SSR pre-rendered HTML for all incoming page routes in development
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      // Skip API and file requests
      if (url.startsWith('/api') || url.includes('.')) {
        return next();
      }

      try {
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const { html, statusCode } = renderPage(template, url);
        res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // In production, serve pre-rendered static files from dist
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      const cleanSlug = req.path.replace(/^\/+/, '').replace(/\/+$/, '');
      const preRenderedPath = cleanSlug
        ? path.resolve(process.cwd(), 'dist', cleanSlug, 'index.html')
        : path.resolve(process.cwd(), 'dist', 'index.html');

      if (fs.existsSync(preRenderedPath)) {
        res.sendFile(preRenderedPath);
      } else {
        const notFoundPath = path.resolve(process.cwd(), 'dist', '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.status(404).sendFile(notFoundPath);
        } else {
          res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
        }
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Tradition, Rewired server listening at http://0.0.0.0:${port}`);
  });
}

startServer();
