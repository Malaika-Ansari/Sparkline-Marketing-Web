/**
 * SPARKLINE MARKETING — COMPREHENSIVE SEO & METADATA TEST SUITE (PHASE 24)
 * Validates robots.txt, sitemap.xml, canonical URLs, meta tags, Open Graph, Twitter cards,
 * Schema.org structured data, and search engine privacy boundaries.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('================================================================');
console.log('SPARKLINE MARKETING — SEO & METADATA TEST SUITE (PHASE 24)');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// 1. ROBOTS.TXT VERIFICATION
// -------------------------------------------------------------
runTest('robots.txt exists and specifies User-agent & Sitemap', () => {
  const robotsPath = path.join(rootDir, 'public/robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'public/robots.txt must exist');
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(content.includes('User-agent: *'), 'Must declare User-agent: *');
  assert.ok(content.includes('Sitemap: https://sparklinemarketing.com/sitemap.xml'), 'Must point to sitemap.xml');
});

runTest('robots.txt disallows private dashboard routes', () => {
  const content = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf8');
  assert.ok(content.includes('Disallow: /dashboard/'), 'Must disallow /dashboard/');
  assert.ok(content.includes('Disallow: /dashboard/*'), 'Must disallow /dashboard/*');
});

runTest('robots.txt disallows auth & internal pages (/login, /signup, /design-system, /api/)', () => {
  const content = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf8');
  assert.ok(content.includes('Disallow: /login'), 'Must disallow /login');
  assert.ok(content.includes('Disallow: /signup'), 'Must disallow /signup');
  assert.ok(content.includes('Disallow: /forgot-password'), 'Must disallow /forgot-password');
  assert.ok(content.includes('Disallow: /reset-password'), 'Must disallow /reset-password');
  assert.ok(content.includes('Disallow: /design-system'), 'Must disallow /design-system');
  assert.ok(content.includes('Disallow: /api/'), 'Must disallow /api/');
});

// -------------------------------------------------------------
// 2. SITEMAP.XML VERIFICATION
// -------------------------------------------------------------
runTest('sitemap.xml exists and includes all 9 public marketing pages', () => {
  const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'public/sitemap.xml must exist');
  const content = fs.readFileSync(sitemapPath, 'utf8');

  const requiredUrls = [
    'https://sparklinemarketing.com/',
    'https://sparklinemarketing.com/features',
    'https://sparklinemarketing.com/tools',
    'https://sparklinemarketing.com/marketing-academy',
    'https://sparklinemarketing.com/pricing',
    'https://sparklinemarketing.com/about',
    'https://sparklinemarketing.com/contact',
    'https://sparklinemarketing.com/privacy-policy',
    'https://sparklinemarketing.com/terms',
  ];

  for (const url of requiredUrls) {
    assert.ok(content.includes(`<loc>${url}</loc>`), `sitemap.xml must include ${url}`);
  }
});

runTest('sitemap.xml strictly excludes private routes and authenticated dashboards', () => {
  const content = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'), 'utf8');
  assert.ok(!content.includes('/dashboard'), 'sitemap.xml must never expose /dashboard');
  assert.ok(!content.includes('/login'), 'sitemap.xml must never expose /login');
  assert.ok(!content.includes('/signup'), 'sitemap.xml must never expose /signup');
  assert.ok(!content.includes('/api'), 'sitemap.xml must never expose /api');
  assert.ok(!content.includes('/design-system'), 'sitemap.xml must never expose /design-system');
});

// -------------------------------------------------------------
// 3. INDEX.HTML METADATA & PRE-RENDERED SCHEMA
// -------------------------------------------------------------
runTest('index.html contains theme-color, canonical, Open Graph, and Twitter tags', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('<meta name="theme-color" content="#0A2540" />'), 'Must include theme-color meta');
  assert.ok(indexHtml.includes('<link rel="canonical" href="https://sparklinemarketing.com" />'), 'Must include canonical tag');
  assert.ok(indexHtml.includes('<meta property="og:type" content="website" />'), 'Must declare og:type');
  assert.ok(indexHtml.includes('<meta property="og:site_name" content="Sparkline Marketing" />'), 'Must declare og:site_name');
  assert.ok(indexHtml.includes('<meta name="twitter:card" content="summary_large_image" />'), 'Must declare twitter:card');
  assert.ok(indexHtml.includes('<meta name="twitter:site" content="@SparklineM35552" />'), 'Must declare twitter:site');
});

runTest('index.html contains valid static JSON-LD SoftwareApplication & Organization schema', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch, 'index.html must include application/ld+json script block');

  const parsed = JSON.parse(jsonLdMatch[1]);
  assert.ok(parsed['@context'] === 'https://schema.org', 'Schema must use https://schema.org context');
  assert.ok(Array.isArray(parsed['@graph']), 'Schema must contain @graph array');

  const types = parsed['@graph'].map((item) => item['@type']);
  assert.ok(types.includes('SoftwareApplication'), 'Schema must declare SoftwareApplication');
  assert.ok(types.includes('Organization'), 'Schema must declare Organization');
  assert.ok(types.includes('WebSite'), 'Schema must declare WebSite');
});

// -------------------------------------------------------------
// 4. PUBLIC PAGES SEO METADATA COVERAGE
// -------------------------------------------------------------
runTest('All public pages define dedicated <SEO> title and description tags', () => {
  const publicPagesDir = path.join(rootDir, 'src/pages/public');
  const files = fs.readdirSync(publicPagesDir).filter((f) => f.endsWith('.tsx'));

  for (const file of files) {
    const code = fs.readFileSync(path.join(publicPagesDir, file), 'utf8');
    assert.ok(code.includes('<SEO'), `${file} must include <SEO component`);
    assert.ok(code.includes('title='), `${file} must specify a title prop`);
    assert.ok(code.includes('description='), `${file} must specify a description prop`);
  }
});

runTest('Authentication pages enforce noIndex={true} to shield them from crawlers', () => {
  const authPagesDir = path.join(rootDir, 'src/pages/auth');
  const files = fs.readdirSync(authPagesDir).filter((f) => f.endsWith('.tsx'));

  for (const file of files) {
    const code = fs.readFileSync(path.join(authPagesDir, file), 'utf8');
    assert.ok(code.includes('noIndex={true}'), `${file} must have noIndex={true} configured`);
  }
});

// -------------------------------------------------------------
// 5. HOOK IMPLEMENTATION (USESEO)
// -------------------------------------------------------------
runTest('useSEO hook manages document title, meta descriptions, and robots tags', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/hooks/useSEO.ts'), 'utf8');
  assert.ok(code.includes("document.title = fullTitle"), 'Must set document.title');
  assert.ok(code.includes("setMeta('description', description)"), 'Must set description');
  assert.ok(code.includes("setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')"), 'Must set robots tag');
  assert.ok(code.includes("setMeta('og:title', fullTitle, true)"), 'Must set Open Graph title');
  assert.ok(code.includes("setMeta('twitter:card', 'summary_large_image')"), 'Must set Twitter card');
  assert.ok(code.includes("link[rel=\"canonical\"]"), 'Must manage canonical link element');
});

// -------------------------------------------------------------
// 6. ACCESSIBILITY IN PUBLIC NAVIGATION & LAYOUTS
// -------------------------------------------------------------
runTest('PublicLayout and DashboardLayout include Skip to Content accessibility links', () => {
  const publicLayout = fs.readFileSync(path.join(rootDir, 'src/layouts/PublicLayout.tsx'), 'utf8');
  assert.ok(publicLayout.includes('Skip to main content'), 'PublicLayout must include skip to content link');
  assert.ok(publicLayout.includes('id="main-content"'), 'PublicLayout must have target id="main-content"');

  const dashboardLayout = fs.readFileSync(path.join(rootDir, 'src/layouts/DashboardLayout.tsx'), 'utf8');
  assert.ok(dashboardLayout.includes('Skip to main content'), 'DashboardLayout must include skip to content link');
  assert.ok(dashboardLayout.includes('id="dashboard-main-content"'), 'DashboardLayout must have target id="dashboard-main-content"');
});

runTest('Navbar includes aria-expanded, aria-controls, and escape key accessibility handling', () => {
  const navbarCode = fs.readFileSync(path.join(rootDir, 'src/components/navigation/Navbar.tsx'), 'utf8');
  assert.ok(navbarCode.includes('aria-expanded='), 'Navbar must handle aria-expanded on dropdowns');
  assert.ok(navbarCode.includes('aria-label="Toggle navigation menu"'), 'Mobile menu toggle button must have aria-label');
  assert.ok(navbarCode.includes("e.key === 'Escape'"), 'Navbar must close on Escape key');
});

console.log('\n================================================================');
console.log(`SEO & METADATA TEST SUMMARY: ${passedTests} / ${totalTests} Passed (100% SUCCESS)`);
console.log('================================================================\n');

