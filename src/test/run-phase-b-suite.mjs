/**
 * SPARKLINE MARKETING — PHASE B: PERFORMANCE, SEO & ACCESSIBILITY TEST SUITE (TASK 5)
 * Validates performance optimizations, Core Web Vitals readiness, technical & content SEO,
 * JSON-LD structured data, WCAG 2.2 AA accessibility attributes, responsive design boundaries,
 * and code splitting chunk budgets.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('================================================================');
console.log('SPARKLINE MARKETING — PERFORMANCE, SEO & ACCESSIBILITY SUITE (TASK 5)');
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
// 1. HTML HEAD & VIEWPORT ESSENTIALS
// -------------------------------------------------------------
runTest('index.html contains valid viewport, charset, title, meta description, and theme-color', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.ok(html.includes('<meta charset="UTF-8" />'), 'Charset UTF-8 missing');
  assert.ok(html.includes('name="viewport" content="width=device-width, initial-scale=1.0"'), 'Viewport meta missing or invalid');
  assert.ok(html.includes('<title>Sparkline Marketing | AI-Powered Marketing Intelligence'), 'Title tag missing');
  assert.ok(html.includes('name="description"'), 'Meta description missing');
  assert.ok(html.includes('name="theme-color"'), 'Theme color missing');
  assert.ok(html.includes('name="robots" content="index, follow"'), 'Base robots directive missing');
});

// -------------------------------------------------------------
// 2. FONT LOADING & RENDER PERFORMANCE
// -------------------------------------------------------------
runTest('index.html implements non-blocking font loading with preconnect and swap', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

  assert.ok(html.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'Missing preconnect to fonts.googleapis.com');
  assert.ok(html.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), 'Missing preconnect to fonts.gstatic.com');
  assert.ok(html.includes('display=swap'), 'Font stylesheet must include display=swap');
  assert.ok(html.includes('media="print" onload="this.media=\'all\'"'), 'Font stylesheet must load asynchronously with media swap');
  assert.ok(html.includes('<noscript>'), 'Must provide noscript fallback for font loading');
});

// -------------------------------------------------------------
// 3. ASSET PRELOAD FOR LCP OPTIMIZATION
// -------------------------------------------------------------
runTest('index.html preloads key vector brand asset for rapid LCP rendering', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(
    html.includes('<link rel="preload" as="image" href="/icons/sparkline-icon.svg" type="image/svg+xml" />'),
    'Brand icon must be preloaded for instant paint'
  );
  const iconPath = path.join(rootDir, 'public/icons/sparkline-icon.svg');
  assert.ok(fs.existsSync(iconPath), 'Preloaded asset /icons/sparkline-icon.svg must exist on disk');
});

// -------------------------------------------------------------
// 4. ROBOTS.TXT STRICT BOUNDARIES & SITEMAP
// -------------------------------------------------------------
runTest('robots.txt disallows all private, auth, and API routes while exposing sitemap', () => {
  const robotsPath = path.join(rootDir, 'public/robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist');
  const robots = fs.readFileSync(robotsPath, 'utf8');

  assert.ok(robots.includes('User-agent: *'), 'Must declare User-agent: *');
  assert.ok(robots.includes('Disallow: /dashboard/'), 'Must disallow /dashboard/');
  assert.ok(robots.includes('Disallow: /login'), 'Must disallow /login');
  assert.ok(robots.includes('Disallow: /signup'), 'Must disallow /signup');
  assert.ok(robots.includes('Disallow: /forgot-password'), 'Must disallow /forgot-password');
  assert.ok(robots.includes('Disallow: /reset-password'), 'Must disallow /reset-password');
  assert.ok(robots.includes('Disallow: /verify-email'), 'Must disallow /verify-email');
  assert.ok(robots.includes('Disallow: /api/'), 'Must disallow /api/');
  assert.ok(robots.includes('Sitemap: https://sparklinemarketing.com/sitemap.xml'), 'Must declare sitemap location');
});

// -------------------------------------------------------------
// 5. SITEMAP.XML CANONICAL ROUTES & UPDATED TIMESTAMPS
// -------------------------------------------------------------
runTest('sitemap.xml lists all 9 public canonical routes with updated 2026 timestamps', () => {
  const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist');
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');

  const expectedRoutes = [
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

  for (const route of expectedRoutes) {
    assert.ok(sitemap.includes(`<loc>${route}</loc>`), `Sitemap missing route: ${route}`);
  }

  assert.ok(sitemap.includes('<lastmod>2026-11-18</lastmod>'), 'Sitemap lastmod must be updated to 2026-11-18');
  assert.ok(!sitemap.includes('/dashboard'), 'Sitemap must never index private dashboard routes');
  assert.ok(!sitemap.includes('/login'), 'Sitemap must never index private auth routes');
});

// -------------------------------------------------------------
// 6. SITE CONFIG METADATA & ASSET HYGIENE
// -------------------------------------------------------------
runTest('siteConfig defines verified OG image, official contact, and social metadata', () => {
  const configPath = path.join(rootDir, 'src/config/site.ts');
  const config = fs.readFileSync(configPath, 'utf8');

  assert.ok(config.includes("ogImage: '/icons/sparkline-icon.svg'"), 'ogImage must point to valid SVG asset');
  assert.ok(config.includes('marketer.spark.44@gmail.com'), 'Official email must be configured in site config');
  assert.ok(config.includes('03114456285'), 'Official phone number must be configured in site config');
  assert.ok(config.includes('Lahore, Pakistan'), 'Official location must be configured in site config');
});

// -------------------------------------------------------------
// 7. DYNAMIC SEO & SOCIAL METADATA HOOK (useSEO)
// -------------------------------------------------------------
runTest('useSEO hook updates page title, meta description, robots, OG, and Twitter card tags', () => {
  const seoHookPath = path.join(rootDir, 'src/hooks/useSEO.ts');
  const seoHook = fs.readFileSync(seoHookPath, 'utf8');

  assert.ok(seoHook.includes('document.title = fullTitle'), 'Must dynamically update document.title');
  assert.ok(seoHook.includes("setMeta('description', description)"), 'Must update meta description');
  assert.ok(seoHook.includes("setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')"), 'Must update robots meta');
  assert.ok(seoHook.includes("setMeta('og:title', fullTitle, true)"), 'Must update og:title');
  assert.ok(seoHook.includes("setMeta('og:image', resolvedImage, true)"), 'Must update og:image');
  assert.ok(seoHook.includes("setMeta('twitter:card', 'summary_large_image')"), 'Must update twitter:card');
  assert.ok(seoHook.includes("setMeta('twitter:image', resolvedImage)"), 'Must update twitter:image');
});

// -------------------------------------------------------------
// 8. SCHEMA.ORG JSON-LD STRUCTURED DATA
// -------------------------------------------------------------
runTest('Schema.org structured data component and HTML baseline are correctly declared', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(html.includes('"@type": "SoftwareApplication"'), 'HTML must declare SoftwareApplication schema');
  assert.ok(html.includes('"@type": "Organization"'), 'HTML must declare Organization schema');

  const seoComponent = fs.readFileSync(path.join(rootDir, 'src/components/common/SEO.tsx'), 'utf8');
  assert.ok(seoComponent.includes('application/ld+json'), 'SEO component must support JSON-LD dynamic injection');
  assert.ok(seoComponent.includes('sparkline-json-ld'), 'SEO component must manage script element id');
});

// -------------------------------------------------------------
// 9. DASHBOARD ROUTE PRIVACY PROTECTION (noIndex=true)
// -------------------------------------------------------------
runTest('DashboardLayout strictly enforces noindex, nofollow across all authenticated views', () => {
  const dashboardLayoutPath = path.join(rootDir, 'src/layouts/DashboardLayout.tsx');
  const dashboardLayout = fs.readFileSync(dashboardLayoutPath, 'utf8');

  assert.ok(dashboardLayout.includes('<SEO'), 'DashboardLayout must render SEO component');
  assert.ok(dashboardLayout.includes('noIndex={true}'), 'DashboardLayout must set noIndex={true}');
  assert.ok(dashboardLayout.includes('Marketing Intelligence Dashboard'), 'DashboardLayout title must be set');
});

// -------------------------------------------------------------
// 10. AUTH PAGES PRIVACY PROTECTION (noIndex=true)
// -------------------------------------------------------------
runTest('All authentication pages strictly enforce noindex, nofollow', () => {
  const authFiles = [
    'src/pages/auth/LoginPage.tsx',
    'src/pages/auth/SignUpPage.tsx',
    'src/pages/auth/ForgotPasswordPage.tsx',
    'src/pages/auth/ResetPasswordPage.tsx',
    'src/pages/auth/VerifyEmailPage.tsx',
  ];

  for (const file of authFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.ok(content.includes('noIndex={true}'), `${file} must explicitly pass noIndex={true} to SEO`);
  }
});

// -------------------------------------------------------------
// 11. ACCESSIBLE SKIP TO CONTENT NAVIGATION
// -------------------------------------------------------------
runTest('Public and Dashboard layouts implement accessible skip-to-content links', () => {
  const publicLayout = fs.readFileSync(path.join(rootDir, 'src/layouts/PublicLayout.tsx'), 'utf8');
  assert.ok(publicLayout.includes('href="#main-content"'), 'PublicLayout must link to #main-content');
  assert.ok(publicLayout.includes('sr-only focus:not-sr-only'), 'Public skip link must use sr-only pattern');
  assert.ok(publicLayout.includes('id="main-content"'), 'PublicLayout must have target id="main-content"');

  const dashboardLayout = fs.readFileSync(path.join(rootDir, 'src/layouts/DashboardLayout.tsx'), 'utf8');
  assert.ok(dashboardLayout.includes('href="#dashboard-main-content"'), 'DashboardLayout must link to #dashboard-main-content');
  assert.ok(dashboardLayout.includes('sr-only focus:not-sr-only'), 'Dashboard skip link must use sr-only pattern');
  assert.ok(dashboardLayout.includes('id="dashboard-main-content"'), 'DashboardLayout must have target id="dashboard-main-content"');
});

// -------------------------------------------------------------
// 12. PREFERS-REDUCED-MOTION SUPPORT (WCAG 2.3.3)
// -------------------------------------------------------------
runTest('src/styles/index.css includes prefers-reduced-motion media query override', () => {
  const css = fs.readFileSync(path.join(rootDir, 'src/styles/index.css'), 'utf8');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS must declare prefers-reduced-motion query');
  assert.ok(css.includes('animation-duration: 0.01ms !important;'), 'Animations must be squashed for reduced motion');
  assert.ok(css.includes('transition-duration: 0.01ms !important;'), 'Transitions must be squashed for reduced motion');
});

// -------------------------------------------------------------
// 13. ACCESSIBLE VISIBLE FOCUS INDICATORS (WCAG 2.4.7)
// -------------------------------------------------------------
runTest('src/styles/index.css defines clear :focus-visible styling', () => {
  const css = fs.readFileSync(path.join(rootDir, 'src/styles/index.css'), 'utf8');
  assert.ok(css.includes(':focus-visible'), 'CSS must define :focus-visible rules');
  assert.ok(css.includes('outline: 2px solid #0C65F4;'), 'Focus outline must have visible color and width');
  assert.ok(css.includes('outline-offset: 2px;'), 'Focus outline offset must be defined');
});

// -------------------------------------------------------------
// 14. FORM INPUT ARIA ATTRIBUTES (aria-invalid & aria-describedby)
// -------------------------------------------------------------
runTest('Form components wire aria-invalid and aria-describedby to error and helper IDs', () => {
  const formComponent = fs.readFileSync(path.join(rootDir, 'src/components/common/Form.tsx'), 'utf8');
  assert.ok(formComponent.includes('aria-invalid={Boolean(error)}'), 'TextInput/TextArea must set aria-invalid');
  assert.ok(formComponent.includes('aria-describedby={error ? errorId : helperText ? helperId : undefined}'), 'TextInput/TextArea must set aria-describedby');
  assert.ok(formComponent.includes('id={errorId}'), 'Form error must have matching id');
  assert.ok(formComponent.includes('id={helperId}'), 'Form helper text must have matching id');
});

// -------------------------------------------------------------
// 15. SCREEN READER ALERT ROLES FOR ERRORS (WCAG 4.1.3)
// -------------------------------------------------------------
runTest('Form error messages declare role="alert" for assistive screen readers', () => {
  const formComponent = fs.readFileSync(path.join(rootDir, 'src/components/common/Form.tsx'), 'utf8');
  assert.ok(formComponent.includes('role="alert"'), 'Form error must specify role="alert"');
});

// -------------------------------------------------------------
// 16. BUTTON ACCESSIBILITY ATTRIBUTES (aria-busy & disabled)
// -------------------------------------------------------------
runTest('Button component implements aria-busy={isLoading} and native disabled state', () => {
  const buttonComponent = fs.readFileSync(path.join(rootDir, 'src/components/common/Button.tsx'), 'utf8');
  assert.ok(buttonComponent.includes('aria-busy={isLoading}'), 'Button must specify aria-busy when loading');
  assert.ok(buttonComponent.includes('disabled={disabled || isLoading}'), 'Button must disable interactions during loading');
});

// -------------------------------------------------------------
// 17. MOBILE VIEWPORT OVERFLOW PROTECTION ON DATA TABLES
// -------------------------------------------------------------
runTest('Dashboard tables and data containers use overflow-x-auto to prevent mobile clipping', () => {
  const metricsPage = fs.readFileSync(path.join(rootDir, 'src/pages/dashboard/MarketingMetricsPage.tsx'), 'utf8');
  assert.ok(metricsPage.includes('overflow-x-auto'), 'Metrics table must have overflow-x-auto');

  const budgetPage = fs.readFileSync(path.join(rootDir, 'src/pages/dashboard/MarketingBudgetPage.tsx'), 'utf8');
  assert.ok(budgetPage.includes('overflow-x-auto'), 'Budget tables must have overflow-x-auto');

  const campaignPage = fs.readFileSync(path.join(rootDir, 'src/pages/dashboard/AdvertisingCampaignPage.tsx'), 'utf8');
  assert.ok(campaignPage.includes('overflow-x-auto'), 'Campaign tables must have overflow-x-auto');
});

// -------------------------------------------------------------
// 18. ROUTE-LEVEL DYNAMIC CODE SPLITTING (React.lazy)
// -------------------------------------------------------------
runTest('Application routes are dynamically code-split with React.lazy and Suspense', () => {
  const routerPath = path.join(rootDir, 'src/routes/index.tsx');
  const routerCode = fs.readFileSync(routerPath, 'utf8');

  assert.ok(routerCode.includes('import React, { Suspense, lazy }'), 'Router must import lazy and Suspense');
  assert.ok(routerCode.includes('const HomePage = lazy('), 'HomePage must be lazy loaded');
  assert.ok(routerCode.includes('const LoginPage = lazy('), 'LoginPage must be lazy loaded');
  assert.ok(routerCode.includes('const AIStrategistPage = lazy('), 'AIStrategistPage must be lazy loaded');
  assert.ok(routerCode.includes('const MarketingMetricsPage = lazy('), 'MarketingMetricsPage must be lazy loaded');
  assert.ok(routerCode.includes('<Suspense fallback={<PageLoader />}'), 'Routes must be wrapped with Suspense fallback');
});

// -------------------------------------------------------------
// 19. VENDOR CHUNK SEGMENTATION CONFIGURATION
// -------------------------------------------------------------
runTest('vite.config.ts configures manualChunks for vendor-react, vendor-charts, and vendor-icons', () => {
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

  assert.ok(viteConfig.includes("'vendor-react': ['react', 'react-dom', 'react-router-dom']"), 'vendor-react chunk must be defined');
  assert.ok(viteConfig.includes("'vendor-charts': ['recharts']"), 'vendor-charts chunk must be defined');
  assert.ok(viteConfig.includes("'vendor-icons': ['lucide-react']"), 'vendor-icons chunk must be defined');
  assert.ok(viteConfig.includes('chunkSizeWarningLimit: 600'), 'chunkSizeWarningLimit must be 600 kB');
});

// -------------------------------------------------------------
// 20. PRODUCTION BUILD CHUNK BUDGET CONFORMANCE
// -------------------------------------------------------------
runTest('Production build dist artifacts exist and strictly conform to the 600 kB chunk budget', () => {
  const distPath = path.join(rootDir, 'dist');
  assert.ok(fs.existsSync(distPath), 'dist/ directory must exist from build');

  const assetsPath = path.join(distPath, 'assets');
  assert.ok(fs.existsSync(assetsPath), 'dist/assets directory must exist');

  const files = fs.readdirSync(assetsPath);
  assert.ok(files.length > 10, 'Expected multiple code-split chunks in dist/assets');

  const BUDGET_BYTES = 600 * 1024; // 600 kB
  let checkedJsFiles = 0;

  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(assetsPath, file);
      const stat = fs.statSync(filePath);
      assert.ok(
        stat.size <= BUDGET_BYTES,
        `Chunk ${file} (${Math.round(stat.size / 1024)} kB) exceeds 600 kB budget limit!`
      );
      checkedJsFiles++;
    }
  }

  assert.ok(checkedJsFiles >= 15, `Expected at least 15 JS chunks, found ${checkedJsFiles}`);
});

console.log('\n================================================================');
console.log(`PHASE B TEST SUMMARY: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}% SUCCESS)`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('[SUCCESS] All Performance, SEO, and Accessibility checks passed flawlessly!\n');
} else {
  process.exitCode = 1;
}
