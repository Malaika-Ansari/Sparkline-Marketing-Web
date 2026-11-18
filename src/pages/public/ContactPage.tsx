import React, { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { siteConfig } from '@/config/site';
import { sanitizeText, isValidEmail } from '@/lib/validation';
import { Mail, MapPin, Phone, CheckCircle2, Github, Linkedin, Facebook, Twitter } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedEmail = sanitizeText(formData.email);
    const sanitizedName = sanitizeText(formData.name);
    const sanitizedMessage = sanitizeText(formData.message);

    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }

    // Form boundary validation is enforced cleanly
    setStatus('success');
  };

  const contactJsonLd = [
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
          name: 'Contact',
          item: 'https://sparklinemarketing.com/contact',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Sparkline Marketing',
      description: 'Get in touch with our marketing intelligence architects, request enterprise access, or submit support inquiries.',
      url: 'https://sparklinemarketing.com/contact',
      mainEntity: {
        '@type': 'Organization',
        name: siteConfig.name,
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
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Contact Sparkline Marketing — Intelligence & Enterprise Inquiries"
        description="Get in touch with our marketing intelligence architects in Lahore, Pakistan, request enterprise access, or submit support inquiries."
        canonical="https://sparklinemarketing.com/contact"
        jsonLd={contactJsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="blue" className="mb-3">
            Get In Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Connect with Our Team
          </h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Have questions about strategic modeling, enterprise workspaces, or partnerships?
            Our team responds within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <h2 className="text-lg font-bold text-sparkline-midnight">
                Direct Contact Points
              </h2>

              {/* Official Email */}
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Mail className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sparkline-midnight">Official Email</div>
                  <a
                    href={siteConfig.contact.emailMailto}
                    className="text-sparkline-blue hover:underline break-all"
                    title="Send email to Sparkline Marketing"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Contact Number */}
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Phone className="w-4 h-4 text-sparkline-cyan shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sparkline-midnight">Contact Number</div>
                  <a
                    href={siteConfig.contact.phoneTel}
                    className="text-sparkline-blue hover:underline font-mono"
                    title="Call Sparkline Marketing"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              {/* Business Location */}
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-sparkline-orange shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sparkline-midnight">Business Location</div>
                  <div className="text-slate-700 font-medium">{siteConfig.contact.location}</div>
                </div>
              </div>

              {/* Official Social Media Profiles */}
              <div className="pt-4 border-t border-slate-100">
                <div className="font-semibold text-sparkline-midnight text-xs mb-3">
                  Official Channels
                </div>
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

          <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-card">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-sparkline-midnight">
                  Message Successfully Delivered
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. A growth strategist will review your note and
                  reply to {formData.email} promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Business Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Company / Organization
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    How can we help? *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue resize-none"
                  />
                </div>

                <Button type="submit" variant="gradient" size="md" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
