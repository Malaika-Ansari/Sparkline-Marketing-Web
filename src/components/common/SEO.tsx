import React, { useEffect } from 'react';
import { SEOProps } from '@/types';
import { useSEO } from '@/hooks/useSEO';

interface ExtendedSEOProps extends SEOProps {
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const SEO: React.FC<ExtendedSEOProps> = ({ jsonLd, ...props }) => {
  useSEO(props);

  useEffect(() => {
    if (!jsonLd) return;

    const scriptId = 'sparkline-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(jsonLd);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [jsonLd]);

  return null;
};

