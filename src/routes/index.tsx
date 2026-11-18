import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';

// Lightweight fallback loader
const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-sparkline-blue animate-spin" />
      <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider">
        LOADING INTELLIGENCE...
      </span>
    </div>
  </div>
);

// Lazy Loaded Auth Pages
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignUpPage = lazy(() =>
  import('@/pages/auth/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
  import('@/pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage }))
);
const AccountSettingsPage = lazy(() =>
  import('@/pages/dashboard/AccountSettingsPage').then((m) => ({ default: m.AccountSettingsPage }))
);

// Lazy Loaded Public Pages
const HomePage = lazy(() =>
  import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage }))
);
const FeaturesPage = lazy(() =>
  import('@/pages/public/FeaturesPage').then((m) => ({ default: m.FeaturesPage }))
);
const ToolsPage = lazy(() =>
  import('@/pages/public/ToolsPage').then((m) => ({ default: m.ToolsPage }))
);
const MarketingAcademyPage = lazy(() =>
  import('@/pages/public/MarketingAcademyPage').then((m) => ({
    default: m.MarketingAcademyPage,
  }))
);
const PricingPage = lazy(() =>
  import('@/pages/public/PricingPage').then((m) => ({ default: m.PricingPage }))
);
const AboutPage = lazy(() =>
  import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('@/pages/public/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/public/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  }))
);
const TermsPage = lazy(() =>
  import('@/pages/public/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const DesignSystemPage = lazy(() =>
  import('@/pages/public/DesignSystemPage').then((m) => ({
    default: m.DesignSystemPage,
  }))
);

// Lazy Loaded Dashboard Pages
const DashboardOverviewPage = lazy(() =>
  import('@/pages/dashboard/DashboardOverviewPage').then((m) => ({
    default: m.DashboardOverviewPage,
  }))
);
const AIStrategistPage = lazy(() =>
  import('@/pages/dashboard/AIStrategistPage').then((m) => ({
    default: m.AIStrategistPage,
  }))
);
const MarketResearchPage = lazy(() =>
  import('@/pages/dashboard/MarketResearchPage').then((m) => ({
    default: m.MarketResearchPage,
  }))
);
const CompetitorIntelligencePage = lazy(() =>
  import('@/pages/dashboard/CompetitorIntelligencePage').then((m) => ({
    default: m.CompetitorIntelligencePage,
  }))
);
const MarketingMetricsPage = lazy(() =>
  import('@/pages/dashboard/MarketingMetricsPage').then((m) => ({
    default: m.MarketingMetricsPage,
  }))
);
const MarketingForecastPage = lazy(() =>
  import('@/pages/dashboard/MarketingForecastPage').then((m) => ({
    default: m.MarketingForecastPage,
  }))
);
const MarketingBudgetPage = lazy(() =>
  import('@/pages/dashboard/MarketingBudgetPage').then((m) => ({
    default: m.MarketingBudgetPage,
  }))
);
const CurrencyCostCalculatorPage = lazy(() =>
  import('@/pages/dashboard/CurrencyCostCalculatorPage').then((m) => ({
    default: m.CurrencyCostCalculatorPage,
  }))
);
const AdvertisingCampaignPage = lazy(() =>
  import('@/pages/dashboard/AdvertisingCampaignPage').then((m) => ({
    default: m.AdvertisingCampaignPage,
  }))
);
const SocialMediaContentStudioPage = lazy(() =>
  import('@/pages/dashboard/SocialMediaContentStudioPage').then((m) => ({
    default: m.SocialMediaContentStudioPage,
  }))
);
const ReportsPage = lazy(() =>
  import('@/pages/dashboard/ReportsPage').then((m) => ({
    default: m.ReportsPage,
  }))
);
const ProjectsPage = lazy(() =>
  import('@/pages/dashboard/ProjectsPage').then((m) => ({
    default: m.ProjectsPage,
  }))
);
const NewProjectPage = lazy(() =>
  import('@/pages/dashboard/NewProjectPage').then((m) => ({
    default: m.NewProjectPage,
  }))
);
const ProjectDetailPage = lazy(() =>
  import('@/pages/dashboard/ProjectDetailPage').then((m) => ({
    default: m.ProjectDetailPage,
  }))
);
const SecurityPlaceholder = lazy(() =>
  import('@/pages/dashboard/SecurityPlaceholder').then((m) => ({
    default: m.SecurityPlaceholder,
  }))
);
const AudienceIntelligencePage = lazy(() =>
  import('@/pages/dashboard/AudienceIntelligencePage').then((m) => ({
    default: m.AudienceIntelligencePage,
  }))
);
const MarketingStrategyPage = lazy(() =>
  import('@/pages/dashboard/MarketingStrategyPage').then((m) => ({
    default: m.MarketingStrategyPage,
  }))
);
const CalendarPlaceholder = lazy(() =>
  import('@/pages/dashboard/CalendarPlaceholder').then((m) => ({
    default: m.CalendarPlaceholder,
  }))
);
const SEOIntelligencePage = lazy(() =>
  import('@/pages/dashboard/SEOIntelligencePage').then((m) => ({
    default: m.SEOIntelligencePage,
  }))
);
const AdvancedAnalyticsPage = lazy(() =>
  import('@/pages/dashboard/AdvancedAnalyticsPage').then((m) => ({
    default: m.AdvancedAnalyticsPage,
  }))
);
const IntegrationsPage = lazy(() =>
  import('@/pages/dashboard/IntegrationsPage').then((m) => ({
    default: m.IntegrationsPage,
  }))
);
const HelpPlaceholder = lazy(() =>
  import('@/pages/dashboard/HelpPlaceholder').then((m) => ({
    default: m.HelpPlaceholder,
  }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'features',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeaturesPage />
          </Suspense>
        ),
      },
      {
        path: 'tools',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ToolsPage />
          </Suspense>
        ),
      },
      {
        path: 'marketing-academy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingAcademyPage />
          </Suspense>
        ),
      },
      {
        path: 'pricing',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PricingPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'design-system',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DesignSystemPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicOnlyRoute>
        <Suspense fallback={<PageLoader />}>
          <SignUpPage />
        </Suspense>
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <Suspense fallback={<PageLoader />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardOverviewPage />
          </Suspense>
        ),
      },
      {
        path: 'strategist',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AIStrategistPage />
          </Suspense>
        ),
      },
      {
        path: 'market-research',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketResearchPage />
          </Suspense>
        ),
      },
      {
        path: 'competitors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompetitorIntelligencePage />
          </Suspense>
        ),
      },
      {
        path: 'metrics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingMetricsPage />
          </Suspense>
        ),
      },
      {
        path: 'budget',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingBudgetPage />
          </Suspense>
        ),
      },
      {
        path: 'currency',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CurrencyCostCalculatorPage />
          </Suspense>
        ),
      },
      {
        path: 'campaigns',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdvertisingCampaignPage />
          </Suspense>
        ),
      },
      {
        path: 'content-studio',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SocialMediaContentStudioPage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NewProjectPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/:projectId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AccountSettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings/account',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AccountSettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'security',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SecurityPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'audience',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AudienceIntelligencePage />
          </Suspense>
        ),
      },
      {
        path: 'strategy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingStrategyPage />
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CalendarPlaceholder />
          </Suspense>
        ),
      },
      {
        path: 'social-studio',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SocialMediaContentStudioPage />
          </Suspense>
        ),
      },
      {
        path: 'seo',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SEOIntelligencePage />
          </Suspense>
        ),
      },
      {
        path: 'forecast',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingForecastPage />
          </Suspense>
        ),
      },
      {
        path: 'roi-calculator',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MarketingForecastPage />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdvancedAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'integrations',
        element: (
          <Suspense fallback={<PageLoader />}>
            <IntegrationsPage />
          </Suspense>
        ),
      },
      {
        path: 'help',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HelpPlaceholder />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
