import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { siteConfig } from '@/config/site';
import { ArrowRight, Target, Brain, Shield, MapPin, Mail, Phone, Github, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const aboutJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sparklinemarketing.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: 'https://sparklinemarketing.com/about',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icons/sparkline-icon.svg`,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.business.city,
        addressCountry: siteConfig.business.country,
      },
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        siteConfig.links.facebook,
        siteConfig.links.twitter,
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="About Sparkline Marketing — Mission, Architecture & Philosophy"
        description="Our mission is to help marketers make informed, data-driven decisions that replace intuition with measurable growth trajectories and unit-economic rigor."
        canonical="https://sparklinemarketing.com/about"
        jsonLd={aboutJsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="blue" className="mb-3">
            Our Mission & Philosophy
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Think Strategy. Predict Growth. Market Smarter.
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            The era of "throw money at ads and hope for the best" is over.
            Sparkline Marketing exists to give performance teams strategic certainty.
          </p>
        </div>

        <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-sparkline-midnight">
              The Genesis of Sparkline Marketing
            </h2>
            <p>
              Digital marketing teams are drowning in vanity dashboards yet starving for
              actionable direction. Millions of dollars are incinerated every month on
              campaigns launched without structured competitive analysis or unit economics verification.
            </p>
            <p>
              We built Sparkline Marketing to bridge the divide between raw market data and
              high-conviction strategy execution. Our platform takes your concrete product
              attributes, maps competitive whitespace, and translates them into predictable acquisition roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
              <Brain className="w-6 h-6 text-sparkline-blue mb-3" />
              <h3 className="font-bold text-sparkline-midnight mb-1">
                Substance Over Fluff
              </h3>
              <p className="text-xs text-slate-600">
                Actionable marketing intelligence rather than generic, hallucinated AI copy.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
              <Target className="w-6 h-6 text-sparkline-purple mb-3" />
              <h3 className="font-bold text-sparkline-midnight mb-1">
                Empirical Economics
              </h3>
              <p className="text-xs text-slate-600">
                Grounding every tactical recommendation in verifiable CAC, LTV, and ROAS metrics.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
              <Shield className="w-6 h-6 text-sparkline-magenta mb-3" />
              <h3 className="font-bold text-sparkline-midnight mb-1">
                Zero Data Exploitation
              </h3>
              <p className="text-xs text-slate-600">
                Strict tenant isolation. Your strategic intelligence is never used to train models.
              </p>
            </div>
          </div>

          {/* Official Operations & Business Information Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card space-y-6">
            <div>
              <Badge variant="cyan" size="sm" className="mb-2">Official Operations</Badge>
              <h2 className="text-xl font-bold text-sparkline-midnight">
                Headquarters & Contact Information
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Connect with our core team for strategic advisory, enterprise onboarding, or platform inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-xs">
                  <MapPin className="w-4 h-4 text-sparkline-cyan shrink-0" />
                  <span>Location</span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  {siteConfig.contact.location}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-xs">
                  <Mail className="w-4 h-4 text-sparkline-cyan shrink-0" />
                  <span>Email</span>
                </div>
                <div>
                  <a
                    href={siteConfig.contact.emailMailto}
                    className="text-xs text-sparkline-blue hover:underline font-medium break-all"
                    title="Send email to Sparkline Marketing"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-xs">
                  <Phone className="w-4 h-4 text-sparkline-cyan shrink-0" />
                  <span>Phone</span>
                </div>
                <div>
                  <a
                    href={siteConfig.contact.phoneTel}
                    className="text-xs text-sparkline-blue hover:underline font-mono font-medium"
                    title="Call Sparkline Marketing"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Media Profiles */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">Follow our official channels:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sparkline-blue hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Sparkline Marketing on GitHub"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sparkline-blue hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Sparkline Marketing on LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sparkline-blue hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Sparkline Marketing on Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sparkline-blue hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Sparkline Marketing on Twitter / X"
                  title="Twitter / X (@SparklineM35552)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button
            to="/signup"
            variant="gradient"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Experience Sparkline Intelligence
          </Button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <Link to="/features" className="text-sparkline-blue hover:underline">Features</Link>
            <span className="text-slate-300">•</span>
            <Link to="/tools" className="text-sparkline-blue hover:underline">Tools Catalog</Link>
            <span className="text-slate-300">•</span>
            <Link to="/pricing" className="text-sparkline-blue hover:underline">Pricing</Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="text-sparkline-blue hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
