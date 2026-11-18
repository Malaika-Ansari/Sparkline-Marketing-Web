import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { siteConfig } from '@/config/site';
import { Mail, MapPin, Phone, Twitter, Linkedin, Github, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sparkline-midnight text-slate-300 border-t border-sparkline-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Sparkline Marketing is an AI-powered marketing intelligence and strategy platform.
              Transforming product attributes into structured marketing intelligence,
              predictive growth modeling, and precision execution frameworks.
            </p>

            {/* Official Contact Details */}
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sparkline-cyan shrink-0" />
                <span className="text-slate-300 font-medium">{siteConfig.contact.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sparkline-cyan shrink-0" />
                <a
                  href={siteConfig.contact.emailMailto}
                  className="text-slate-300 hover:text-white hover:underline transition-colors"
                  title="Send email to Sparkline Marketing"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sparkline-cyan shrink-0" />
                <a
                  href={siteConfig.contact.phoneTel}
                  className="text-slate-300 hover:text-white hover:underline transition-colors font-mono"
                  title="Call Sparkline Marketing"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            {/* Official Social Media Links (All 4 Profiles Connected) */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-sparkline-slate flex items-center justify-center text-slate-400 hover:text-white hover:bg-sparkline-blue transition-colors"
                aria-label="Sparkline Marketing on GitHub"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-sparkline-slate flex items-center justify-center text-slate-400 hover:text-white hover:bg-sparkline-blue transition-colors"
                aria-label="Sparkline Marketing on LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-sparkline-slate flex items-center justify-center text-slate-400 hover:text-white hover:bg-sparkline-blue transition-colors"
                aria-label="Sparkline Marketing on Facebook"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-sparkline-slate flex items-center justify-center text-slate-400 hover:text-white hover:bg-sparkline-blue transition-colors"
                aria-label="Sparkline Marketing on Twitter / X"
                title="Twitter / X (@SparklineM35552)"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-white transition-colors">
                  Marketing Tools
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/marketing-academy" className="hover:text-white transition-colors">
                  Marketing Academy
                </Link>
              </li>
              <li>
                <Link to="/dashboard/metrics" className="hover:text-white transition-colors">
                  Marketing Metrics
                </Link>
              </li>
              <li>
                <Link to="/marketing-academy" className="hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/marketing-academy" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-sparkline-cyan transition-colors">
                  Design System
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/dashboard/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sparkline-slate/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Sparkline Marketing. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Think Strategy. Predict Growth. Market Smarter.
          </p>
        </div>
      </div>
    </footer>
  );
};
