import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderPage } from '../src/server/renderPage';
import { ARTICLES } from '../src/data/articles';
import { SEO_CONFIG, SITE_URL } from '../src/data/seoConfig';
import { generateSitemapAndRobots } from './generate-sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const publicDir = path.resolve(__dirname, '..', 'public');

async function prerender() {
  console.log('🚀 Starting static pre-rendering for Tradition, Rewired...');
  console.log(`🌐 Configured SITE_URL: ${SITE_URL}`);

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, 'utf8');

  // 1. Pre-render Homepage
  const homeResult = renderPage(rawTemplate, '/');
  fs.writeFileSync(templatePath, homeResult.html, 'utf8');
  console.log(`✅ Pre-rendered / -> dist/index.html (${homeResult.html.length} bytes)`);

  // 2. Pre-render All 10 Articles
  for (const article of ARTICLES) {
    const route = `/${article.slug}`;
    const result = renderPage(rawTemplate, route);
    const articleDir = path.join(distDir, article.slug);

    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const targetFile = path.join(articleDir, 'index.html');
    fs.writeFileSync(targetFile, result.html, 'utf8');
    console.log(`✅ Pre-rendered ${route} -> dist/${article.slug}/index.html (${result.html.length} bytes)`);
  }

  // 3. Pre-render 404 Page
  const notFoundResult = renderPage(rawTemplate, '/404');
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundResult.html, 'utf8');
  console.log(`✅ Pre-rendered /404 -> dist/404.html (${notFoundResult.html.length} bytes)`);

  // 4. Dynamically generate and sync sitemap.xml and robots.txt in both public and dist
  generateSitemapAndRobots(distDir);
  generateSitemapAndRobots(publicDir);

  console.log(`🎉 Static pre-rendering completed successfully for 11 routes + 404 page!`);
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
