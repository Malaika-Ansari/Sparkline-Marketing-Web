import { useEffect } from 'react';
import { SEOProps } from '@/types';
import { siteConfig } from '@/config/site';

/**
 * Lightweight, zero-dependency hook to manage document head metadata.
 */
export function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = siteConfig.ogImage,
  noIndex = false,
}: SEOProps): void {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`;
    document.title = fullTitle;

    // 2. Helper to set/update meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta
    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Update Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', siteConfig.name, true);
    const resolvedImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${siteConfig.url}${ogImage}`
      : undefined;

    if (resolvedImage) {
      setMeta('og:image', resolvedImage, true);
    }
    if (canonical) {
      setMeta('og:url', canonical, true);
    }

    // 5. Update Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:site', siteConfig.social.twitter.handle);
    if (resolvedImage) {
      setMeta('twitter:image', resolvedImage);
    }

    // 6. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    } else if (canonicalLink) {
      canonicalLink.remove();
    }
  }, [title, description, canonical, ogType, ogImage, noIndex]);
}

