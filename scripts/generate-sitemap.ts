import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_CONFIG, SITE_URL } from '../src/data/seoConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function generateSitemapAndRobots(targetDir = path.join(rootDir, 'public')) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Generate sitemap.xml
  const urls = Object.values(SEO_CONFIG).map((cfg) => {
    const loc = cfg.slug ? `${SITE_URL}/${cfg.slug}` : `${SITE_URL}/`;
    const priority = cfg.slug ? '0.8' : '1.0';
    const changefreq = cfg.slug ? 'monthly' : 'weekly';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`✅ Generated sitemap.xml in ${targetDir} with ${urls.length} URLs using base ${SITE_URL}`);

  // 2. Generate robots.txt
  const robotsTxt = `# robots.txt for Tradition, Rewired
# Generated dynamically for: ${SITE_URL}
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(targetDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log(`✅ Generated robots.txt in ${targetDir} pointing to ${SITE_URL}/sitemap.xml`);
}

// When run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemapAndRobots();
}
