import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/context/AuthContext';
import {
  TextInput,
  TextArea,
  SelectInput,
  CurrencyInput,
  Checkbox,
} from '@/components/common/Form';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import {
  MarketingProject,
  ProductOrService,
  Competitor,
  BusinessType,
  OperatingStatus,
  BusinessSize,
  ProductAvailability,
  CustomerType,
  PurchasingBehavior,
  MarketPositionType,
  CampaignStatusType,
  CampaignDurationType,
} from '@/types/project';
import {
  Building2,
  Package,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Business Profile', icon: Building2 },
  { id: 2, label: 'Products & Economics', icon: Package },
  { id: 3, label: 'Target Audience', icon: Users },
  { id: 4, label: 'Competitors & Position', icon: Target },
  { id: 5, label: 'Goals & Budget', icon: TrendingUp },
  { id: 6, label: 'Review & Initialize', icon: CheckCircle2 },
];

const INDUSTRY_OPTIONS = [
  { label: 'E-commerce', value: 'E-commerce' },
  { label: 'Fashion and Beauty', value: 'Fashion and Beauty' },
  { label: 'Healthcare & Wellness', value: 'Healthcare' },
  { label: 'Education & EdTech', value: 'Education' },
  { label: 'Technology & SaaS', value: 'Technology' },
  { label: 'Food and Beverage', value: 'Food and Beverage' },
  { label: 'Real Estate & PropTech', value: 'Real Estate' },
  { label: 'Finance & FinTech', value: 'Finance' },
  { label: 'Travel and Hospitality', value: 'Travel and Hospitality' },
  { label: 'Professional Services & Agency', value: 'Professional Services' },
  { label: 'Manufacturing & Industrial', value: 'Manufacturing' },
  { label: 'Other (Custom Industry)', value: 'Other' },
];

const MARKETING_GOALS = [
  'Increase brand awareness',
  'Generate leads',
  'Increase sales',
  'Improve website traffic',
  'Increase conversions',
  'Grow social media accounts',
  'Improve customer retention',
  'Launch a new product',
  'Enter a new market',
  'Improve brand positioning',
];

const CHANNELS_LIST = [
  'Google Search Ads',
  'Meta Ads (Facebook/Instagram)',
  'SEO & Organic Search',
  'Email Marketing',
  'LinkedIn ABM Ads',
  'TikTok Ads',
  'Influencer Marketing',
  'YouTube Video Ads',
  'Content Marketing / Blog',
  'None yet (Starting fresh)',
];

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const duplicateId = searchParams.get('duplicate');
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  // Step 1: Business Profile
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('E-commerce');
  const [customIndustry, setCustomIndustry] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('D2C');
  const [location, setLocation] = useState('New York, USA');
  const [regionsServed, setRegionsServed] = useState('United States, Global');
  const [operatingStatus, setOperatingStatus] = useState<OperatingStatus>('Growing');
  const [businessSize, setBusinessSize] = useState<BusinessSize>('Small Business');

  // Step 2: Products
  const [products, setProducts] = useState<ProductOrService[]>([
    {
      id: 'prod-new-1',
      name: '',
      category: 'Main Offering',
      description: '',
      features: ['High-quality formulation', 'Clean ingredients'],
      benefits: ['Fast visible transformation', 'Non-greasy hydration'],
      usp: '',
      sellingPrice: 45,
      currency: 'USD',
      costOfGoods: 12,
      availability: 'In Stock',
      pageUrl: '',
    },
  ]);

  // Temporary product form state for adding extra products
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // Step 3: Target Audience
  const [targetLocations, setTargetLocations] = useState('United States, Canada, UK');
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>(['25-34', '35-44']);
  const [customerType, setCustomerType] = useState<CustomerType>('Individuals');
  const [interests, setInterests] = useState('Skincare routines, Clean beauty, Wellness');
  const [needsAndProblems, setNeedsAndProblems] = useState(
    'Customers want visible skincare results without harsh chemical irritation or paying $150+ for luxury department store brands.'
  );
  const [mainPainPoints, setMainPainPoints] = useState(
    'Serum oxidizes quickly; Stinging and irritation; High markup prices from legacy cosmetics conglomerates.'
  );
  const [preferredLanguages, setPreferredLanguages] = useState('English');
  const [purchasingBehavior, setPurchasingBehavior] = useState<PurchasingBehavior>('Research-heavy');
  const [existingCustomerSegments, setExistingCustomerSegments] = useState('Ingredient-conscious skincare buyers aged 25-45.');

  // Step 4: Competitors & Market Position
  const [noCompetitorsYet, setNoCompetitorsYet] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: 'comp-1',
      name: 'Leading Category Brand',
      websiteUrl: 'https://example-competitor.com',
      alternativeOfferings: 'Priced at $80+ with synthetic stabilizers',
    },
  ]);
  const [currentPosition, setCurrentPosition] = useState<MarketPositionType>('Challenger');
  const [whatMakesYouDifferent, setWhatMakesYouDifferent] = useState(
    'Clinical 20% potency stabilized with ferulic acid at an accessible direct-to-consumer price point.'
  );
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState(
    '70%+ gross margin; Transparent ingredient lab test reports; 30-day money-back guarantee.'
  );
  const [knownMarketChallenges, setKnownMarketChallenges] = useState(
    'Rising Meta ad auction CPMs; Consumer skepticism regarding clean beauty greenwashing.'
  );

  // Step 5: Marketing Goals & Budget
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Increase sales',
    'Increase conversions',
    'Improve website traffic',
  ]);
  const [primaryObjective, setPrimaryObjective] = useState('Increase sales');
  const [currentChannels, setCurrentChannels] = useState<string[]>([
    'Google Search Ads',
    'Meta Ads (Facebook/Instagram)',
    'Email Marketing',
  ]);
  const [existingCampaignStatus, setExistingCampaignStatus] = useState<CampaignStatusType>(
    'Running with mixed results'
  );
  const [monthlyBudget, setMonthlyBudget] = useState(12000);
  const [budgetCurrency, setBudgetCurrency] = useState('USD');
  const [preferredAdPlatforms, setPreferredAdPlatforms] = useState<string[]>([
    'Google Ads',
    'Meta (Instagram/Facebook)',
  ]);
  const [campaignDuration, setCampaignDuration] = useState<CampaignDurationType>('3-6 months');
  const [expectedOutcome, setExpectedOutcome] = useState(
    '$45,000 monthly revenue at minimum 3.2x blended ROAS.'
  );

  // Load existing project if editing/duplicating or load draft if available
  useEffect(() => {
    const targetProject = editId
      ? projectService.getProjectById(editId)
      : duplicateId
      ? projectService.getProjectById(duplicateId)
      : null;

    if (targetProject) {
      const b = targetProject.business;
      if (b) {
        setBrandName(duplicateId ? `${b.brandName} (Copy)` : b.brandName);
        if (b.websiteUrl) setWebsiteUrl(b.websiteUrl);
        if (b.description) setDescription(b.description);
        if (b.industry) setIndustry(b.industry);
        if (b.customIndustry) setCustomIndustry(b.customIndustry);
        if (b.businessType) setBusinessType(b.businessType);
        if (b.location) setLocation(b.location);
        if (b.regionsServed) setRegionsServed(b.regionsServed);
        if (b.operatingStatus) setOperatingStatus(b.operatingStatus);
        if (b.businessSize) setBusinessSize(b.businessSize);
      }
      if (targetProject.products && targetProject.products.length > 0) {
        setProducts(targetProject.products);
      }
      if (targetProject.audience) {
        const a = targetProject.audience;
        if (a.targetLocations) setTargetLocations(a.targetLocations.join(', '));
        if (a.ageRanges) setSelectedAgeRanges(a.ageRanges);
        if (a.customerType) setCustomerType(a.customerType);
        if (a.interests) setInterests(a.interests.join(', '));
        if (a.needsAndProblems) setNeedsAndProblems(a.needsAndProblems);
        if (a.mainPainPoints) setMainPainPoints(a.mainPainPoints.join('; '));
        if (a.preferredLanguages) setPreferredLanguages(a.preferredLanguages.join(', '));
        if (a.purchasingBehavior) setPurchasingBehavior(a.purchasingBehavior);
        if (a.existingCustomerSegments) setExistingCustomerSegments(a.existingCustomerSegments);
      }
      if (targetProject.competitors) {
        setCompetitors(targetProject.competitors);
      }
      if (targetProject.marketPosition) {
        const mp = targetProject.marketPosition;
        if (mp.currentPosition) setCurrentPosition(mp.currentPosition);
        if (mp.whatMakesYouDifferent) setWhatMakesYouDifferent(mp.whatMakesYouDifferent);
        if (mp.competitiveAdvantages) setCompetitiveAdvantages(mp.competitiveAdvantages.join('; '));
        if (mp.knownMarketChallenges) setKnownMarketChallenges(mp.knownMarketChallenges.join('; '));
      }
      if (targetProject.marketing) {
        const m = targetProject.marketing;
        if (m.selectedGoals) setSelectedGoals(m.selectedGoals);
        if (m.primaryObjective) setPrimaryObjective(m.primaryObjective);
        if (m.currentChannels) setCurrentChannels(m.currentChannels);
        if (m.existingCampaignStatus) setExistingCampaignStatus(m.existingCampaignStatus);
        if (m.monthlyBudget) setMonthlyBudget(m.monthlyBudget);
        if (m.budgetCurrency) setBudgetCurrency(m.budgetCurrency);
        if (m.preferredAdPlatforms) setPreferredAdPlatforms(m.preferredAdPlatforms);
        if (m.campaignDuration) setCampaignDuration(m.campaignDuration);
        if (m.expectedOutcome) setExpectedOutcome(m.expectedOutcome);
      }
      return;
    }

    const draft = projectService.getDraft();
    if (draft && draft.business) {
      if (draft.business.brandName) setBrandName(draft.business.brandName);
      if (draft.business.websiteUrl) setWebsiteUrl(draft.business.websiteUrl);
      if (draft.business.description) setDescription(draft.business.description);
      if (draft.business.industry) setIndustry(draft.business.industry);
      if (draft.business.customIndustry) setCustomIndustry(draft.business.customIndustry);
      if (draft.business.businessType) setBusinessType(draft.business.businessType);
      if (draft.business.location) setLocation(draft.business.location);
      if (draft.business.regionsServed) setRegionsServed(draft.business.regionsServed);
      if (draft.business.operatingStatus) setOperatingStatus(draft.business.operatingStatus);
      if (draft.business.businessSize) setBusinessSize(draft.business.businessSize);

      if (draft.products && draft.products.length > 0) setProducts(draft.products);
      if (draft.audience) {
        if (draft.audience.customerType) setCustomerType(draft.audience.customerType);
        if (draft.audience.needsAndProblems) setNeedsAndProblems(draft.audience.needsAndProblems);
        if (draft.audience.purchasingBehavior) setPurchasingBehavior(draft.audience.purchasingBehavior);
      }
      if (draft.marketing) {
        if (draft.marketing.monthlyBudget) setMonthlyBudget(draft.marketing.monthlyBudget);
        if (draft.marketing.primaryObjective) setPrimaryObjective(draft.marketing.primaryObjective);
      }
    }
  }, [editId, duplicateId]);

  // Validation Logic per step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!brandName.trim()) newErrors.brandName = 'Business or brand name is required.';
      if (!description.trim() || description.length < 10) {
        newErrors.description = 'Please provide a descriptive overview (at least 10 characters).';
      }
      if (industry === 'Other' && !customIndustry.trim()) {
        newErrors.customIndustry = 'Please specify your custom industry.';
      }
      if (websiteUrl.trim()) {
        try {
          new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
        } catch {
          newErrors.websiteUrl = 'Please enter a valid website URL (e.g. https://yourbrand.com).';
        }
      }
    }

    if (stepNumber === 2) {
      if (products.length === 0) {
        newErrors.products = 'Please add at least one product or service.';
      } else {
        const firstProduct = products[0];
        if (firstProduct) {
          if (!firstProduct.name.trim()) newErrors.productName = 'Product or service name is required.';
          if (!firstProduct.usp.trim()) newErrors.productUsp = 'Unique Selling Proposition (USP) is required.';
          if (firstProduct.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than zero.';
        }
      }
    }

    if (stepNumber === 3) {
      if (!needsAndProblems.trim()) {
        newErrors.needsAndProblems = 'Please describe the core customer needs or problems your business solves.';
      }
    }

    if (stepNumber === 4) {
      if (!whatMakesYouDifferent.trim()) {
        newErrors.whatMakesYouDifferent = 'Please explain what differentiates your offering from alternatives.';
      }
    }

    if (stepNumber === 5) {
      if (selectedGoals.length === 0) {
        newErrors.selectedGoals = 'Please select at least one marketing goal.';
      }
      if (monthlyBudget <= 0) {
        newErrors.monthlyBudget = 'Monthly budget must be greater than zero.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    } else {
      addToast({
        title: 'Validation Incomplete',
        message: 'Please review the highlighted fields before proceeding.',
        type: 'warning',
      });
    }
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Save Draft
  const handleSaveDraft = () => {
    const draftData: Partial<MarketingProject> = {
      status: 'Draft',
      isDraft: true,
      business: {
        brandName,
        websiteUrl,
        description,
        industry: industry === 'Other' ? customIndustry : industry,
        customIndustry,
        businessType,
        location,
        regionsServed,
        operatingStatus,
        businessSize,
      },
      products,
      audience: {
        targetLocations: targetLocations.split(',').map((s) => s.trim()).filter(Boolean),
        ageRanges: selectedAgeRanges,
        customerType,
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        needsAndProblems,
        mainPainPoints: mainPainPoints.split(';').map((s) => s.trim()).filter(Boolean),
        preferredLanguages: preferredLanguages.split(',').map((s) => s.trim()).filter(Boolean),
        purchasingBehavior,
        existingCustomerSegments,
      },
      competitors: noCompetitorsYet ? [] : competitors,
      marketPosition: {
        currentPosition,
        whatMakesYouDifferent,
        competitiveAdvantages: competitiveAdvantages.split(';').map((s) => s.trim()).filter(Boolean),
        knownMarketChallenges: knownMarketChallenges.split(';').map((s) => s.trim()).filter(Boolean),
      },
      marketing: {
        selectedGoals,
        primaryObjective,
        currentChannels,
        existingCampaignStatus,
        monthlyBudget,
        budgetCurrency,
        preferredAdPlatforms,
        campaignDuration,
        expectedOutcome,
      },
    };

    projectService.saveDraft(draftData);
    addToast({
      title: 'Progress Saved',
      message: 'Your project form draft has been saved locally.',
      type: 'info',
    });
  };

  // Submit Final Project
  const handleSubmitProject = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5)) {
      addToast({
        title: 'Review Incomplete',
        message: 'Some required fields require your attention. Please review previous steps.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const newProject: MarketingProject = {
      id: editId || `proj-${Date.now()}`,
      userId: user?.id,
      createdAt: editId
        ? projectService.getProjectById(editId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: editId
        ? projectService.getProjectById(editId)?.status || 'Ready for Strategy'
        : 'Ready for Strategy',
      business: {
        brandName,
        websiteUrl,
        description,
        industry: industry === 'Other' ? customIndustry : industry,
        customIndustry,
        businessType,
        location,
        regionsServed,
        operatingStatus,
        businessSize,
      },
      products,
      audience: {
        targetLocations: targetLocations.split(',').map((s) => s.trim()).filter(Boolean),
        ageRanges: selectedAgeRanges,
        customerType,
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        needsAndProblems,
        mainPainPoints: mainPainPoints.split(';').map((s) => s.trim()).filter(Boolean),
        preferredLanguages: preferredLanguages.split(',').map((s) => s.trim()).filter(Boolean),
        purchasingBehavior,
        existingCustomerSegments,
      },
      competitors: noCompetitorsYet ? [] : competitors,
      marketPosition: {
        currentPosition,
        whatMakesYouDifferent,
        competitiveAdvantages: competitiveAdvantages.split(';').map((s) => s.trim()).filter(Boolean),
        knownMarketChallenges: knownMarketChallenges.split(';').map((s) => s.trim()).filter(Boolean),
      },
      marketing: {
        selectedGoals,
        primaryObjective,
        currentChannels,
        existingCampaignStatus,
        monthlyBudget,
        budgetCurrency,
        preferredAdPlatforms,
        campaignDuration,
        expectedOutcome,
      },
    };

    setTimeout(() => {
      projectService.saveProject(newProject, user?.id);
      setIsSubmitting(false);

      addToast({
        title: editId ? 'Project Parameters Updated' : 'Project Initialized Successfully',
        message: `"${newProject.business.brandName}" is saved to your workspace.`,
        type: 'success',
      });

      navigate(`/dashboard/projects/${newProject.id}`);
    }, 600);
  };

  // Helper product & competitor mutators
  const updateProductField = <K extends keyof ProductOrService>(
    index: number,
    field: K,
    value: ProductOrService[K]
  ) => {
    const next = [...products];
    const current = next[index];
    if (current) {
      next[index] = { ...current, [field]: value };
      setProducts(next);
    }
  };

  const updateCompetitor = (
    index: number,
    field: keyof Competitor,
    value: string
  ) => {
    const next = [...competitors];
    const current = next[index];
    if (current) {
      next[index] = { ...current, [field]: value };
      setCompetitors(next);
    }
  };

  const addProduct = () => {
    const newProd: ProductOrService = {
      id: `prod-${Date.now()}`,
      name: `Product ${products.length + 1}`,
      category: 'Secondary Product',
      description: '',
      features: ['Core feature'],
      benefits: ['Customer benefit'],
      usp: '',
      sellingPrice: 50,
      currency: 'USD',
      costOfGoods: 15,
      availability: 'In Stock',
    };
    setProducts([...products, newProd]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) {
      addToast({
        title: 'Minimum Product Requirement',
        message: 'Your project must include at least one product or service.',
        type: 'warning',
      });
      return;
    }
    setProducts(products.filter((_, i) => i !== index));
  };

  // Helper competitor mutators
  const addCompetitor = () => {
    setCompetitors([
      ...competitors,
      {
        id: `comp-${Date.now()}`,
        name: '',
        websiteUrl: '',
        alternativeOfferings: '',
      },
    ]);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <SEO
        title="Create Marketing Project | Sparkline Marketing"
        description="Provide your business, product economics, target audience, and marketing objectives to generate custom marketing intelligence."
        noIndex={true}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue font-medium">
          Dashboard
        </Link>
        <span>/</span>
        <Link to="/dashboard/projects" className="hover:text-sparkline-blue font-medium">
          Projects
        </Link>
        <span>/</span>
        <span className="font-semibold text-sparkline-midnight">New Project</span>
      </nav>

      {/* Main Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-sparkline-blue text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Ingestion Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
              Let's Understand Your Business
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Tell us about your product, audience, and goals. Sparkline will use this information to build a marketing strategy around your business.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sparkline-midnight hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <Link
              to="/dashboard/projects"
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider">
              Step {currentStep} of 6: {STEPS[currentStep - 1]?.label ?? ''}
            </span>
            <span className="text-xs font-mono font-semibold text-sparkline-blue">
              {Math.round(((currentStep - 1) / 5) * 100)}% Complete
            </span>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sparkline-blue to-sparkline-cyan rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((currentStep - 1) / 5) * 100)}%` }}
            />
          </div>

          {/* Step Bubbles (Horizontal on Desktop, scrollable on mobile) */}
          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-1 gap-2">
            {STEPS.map((step) => {
              const isDone = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isDone || isCurrent) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={!isDone && !isCurrent}
                  className={cn(
                    'flex items-center gap-2 p-1.5 rounded-xl text-xs font-medium transition-all shrink-0 select-none text-left',
                    isCurrent
                      ? 'text-sparkline-blue font-bold'
                      : isDone
                      ? 'text-slate-600 hover:text-sparkline-midnight cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors',
                      isCurrent
                        ? 'bg-sparkline-blue text-white shadow-sm'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: BUSINESS PROFILE */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sparkline-blue" />
              <span>Step 1 — Business & Brand Foundation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide your brand identity, operational scale, and target service geography.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-sparkline-midnight block">
                Why Business Context Matters:
              </strong>
              Business model type (e.g. D2C vs B2B SaaS) dictates customer acquisition velocity, expected sales cycle duration, and required gross margin thresholds.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Business or Brand Name"
              required
              placeholder="e.g. Radiant Glow Botanicals or Apex Cloud ERP"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              error={errors.brandName}
              helperText="The public brand name associated with your campaigns."
            />

            <TextInput
              label="Official Website URL (Optional)"
              placeholder="https://yourbrand.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              error={errors.websiteUrl}
              helperText="Enables domain-level SEO and market analysis."
            />

            <div className="md:col-span-2">
              <TextArea
                label="Business Description"
                required
                maxLength={400}
                placeholder="Describe what your company does, your core value proposition, and the primary market you serve..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                helperText="Summarize your mission, offerings, and positioning (10-400 characters)."
              />
            </div>

            <SelectInput
              label="Industry"
              required
              options={INDUSTRY_OPTIONS}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              helperText="Select the category that best fits your business."
            />

            {industry === 'Other' && (
              <TextInput
                label="Specify Custom Industry"
                required
                placeholder="e.g. Sustainable Renewable Packaging"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                error={errors.customIndustry}
              />
            )}

            <SelectInput
              label="Business Type"
              required
              options={[
                { label: 'D2C (Direct-to-Consumer)', value: 'D2C' },
                { label: 'B2B (Business-to-Business)', value: 'B2B' },
                { label: 'B2C (Consumer Retail)', value: 'B2C' },
                { label: 'SaaS (Software-as-a-Service)', value: 'SaaS' },
                { label: 'Marketplace / Platform', value: 'Marketplace' },
                { label: 'Local Business / Service Provider', value: 'Local Business' },
                { label: 'Other', value: 'Other' },
              ]}
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
            />

            <TextInput
              label="Headquarters / Business Location"
              placeholder="e.g. Austin, Texas, USA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              helperText="Primary operating headquarters or base of operations."
            />

            <TextInput
              label="Countries or Regions Served"
              placeholder="e.g. United States, Canada, Europe"
              value={regionsServed}
              onChange={(e) => setRegionsServed(e.target.value)}
              helperText="Geographic areas eligible for marketing campaign reach."
            />

            <SelectInput
              label="Operating Status"
              options={[
                { label: 'New (Pre-launch or < 6 months)', value: 'New' },
                { label: 'Growing (Active sales & expanding)', value: 'Growing' },
                { label: 'Established (Stable recurring market share)', value: 'Established' },
                { label: 'Rebranding (Repositioning products)', value: 'Rebranding' },
              ]}
              value={operatingStatus}
              onChange={(e) => setOperatingStatus(e.target.value as OperatingStatus)}
            />

            <SelectInput
              label="Business Size"
              options={[
                { label: 'Solo Entrepreneur / Founder', value: 'Solo' },
                { label: 'Small Business (2-10 team members)', value: 'Small Business' },
                { label: 'Medium Business (11-50 team members)', value: 'Medium Business' },
                { label: 'Enterprise (50+ team members)', value: 'Enterprise' },
              ]}
              value={businessSize}
              onChange={(e) => setBusinessSize(e.target.value as BusinessSize)}
            />
          </div>
        </Card>
      )}

      {/* STEP 2: PRODUCT OR SERVICE INFORMATION */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Package className="w-5 h-5 text-sparkline-blue" />
                  <span>Step 2 — Product & Service Economics</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify pricing, unit economics, key features, and tangible customer benefits.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={addProduct}
              >
                Add Another Product
              </Button>
            </div>

            {/* Strategic Distinction Tip */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-700 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-sparkline-purple shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-sparkline-midnight block">
                  Features vs. Benefits Strategy Note:
                </strong>
                <strong>Features</strong> describe technical attributes of your offering (e.g. <em>20% L-Ascorbic Acid</em>). <strong>Benefits</strong> describe the actual transformation your customer experiences (e.g. <em>Visibly fades hyperpigmentation in 28 days</em>). Ad copy converts on benefits.
              </div>
            </div>

            {/* Products Loop */}
            {products.map((prod, index) => (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-sparkline-blue text-white flex items-center justify-center font-bold text-xs">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-sparkline-midnight">
                      {prod.name || `Product #${index + 1}`}
                    </span>
                  </div>

                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                      title="Remove product"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label="Product / Service Name"
                    required
                    placeholder="e.g. Organic Vitamin C Serum (30ml)"
                    value={prod.name}
                    onChange={(e) => updateProductField(index, 'name', e.target.value)}
                    error={index === 0 ? errors.productName : undefined}
                  />

                  <TextInput
                    label="Category"
                    placeholder="e.g. Skincare / Serums"
                    value={prod.category}
                    onChange={(e) => updateProductField(index, 'category', e.target.value)}
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Product Description"
                      maxLength={300}
                      placeholder="Explain what the product is, how it is made, and who it is formulated for..."
                      value={prod.description}
                      onChange={(e) => updateProductField(index, 'description', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextInput
                      label="Unique Selling Proposition (USP)"
                      required
                      placeholder="e.g. Clinical 20% potency stabilized without synthetic preservatives at an accessible DTC price point."
                      value={prod.usp}
                      onChange={(e) => updateProductField(index, 'usp', e.target.value)}
                      error={index === 0 ? errors.productUsp : undefined}
                      helperText="What is the single most compelling reason to choose this over competitors?"
                    />
                  </div>

                  <CurrencyInput
                    label="Selling Price"
                    value={prod.sellingPrice}
                    currency={prod.currency}
                    onChange={(val, cur) => {
                      updateProductField(index, 'sellingPrice', val);
                      updateProductField(index, 'currency', cur);
                    }}
                    error={index === 0 ? errors.sellingPrice : undefined}
                    helperText="Retail price before taxes and discounts."
                  />

                  <CurrencyInput
                    label="Cost of Goods (COGS) / Delivery Cost (Optional)"
                    value={prod.costOfGoods || 0}
                    currency={prod.currency}
                    onChange={(val) => updateProductField(index, 'costOfGoods', val)}
                    helperText="Enables accurate gross margin and break-even ROAS calculations."
                  />

                  <SelectInput
                    label="Product Availability"
                    options={[
                      { label: 'In Stock (Immediate fulfillment)', value: 'In Stock' },
                      { label: 'Pre-order (Future delivery)', value: 'Pre-order' },
                      { label: 'Limited Availability (Scarcity batch)', value: 'Limited Availability' },
                      { label: 'Continuous Service (Digital / SaaS / Retainer)', value: 'Continuous Service' },
                      { label: 'Discontinued / Clearance', value: 'Discontinued' },
                    ]}
                    value={prod.availability}
                    onChange={(e) =>
                      updateProductField(index, 'availability', e.target.value as ProductAvailability)
                    }
                  />

                  <TextInput
                    label="Product Landing Page URL (Optional)"
                    placeholder="https://yourbrand.com/products/serum"
                    value={prod.pageUrl || ''}
                    onChange={(e) => updateProductField(index, 'pageUrl', e.target.value)}
                  />
                </div>

                {/* Features & Benefits Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Main Product Features (Attributes)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prod.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-sparkline-blue text-xs font-medium border border-blue-100"
                        >
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextFeats = prod.features.filter((_, i) => i !== fIdx);
                              updateProductField(index, 'features', nextFeats);
                            }}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add feature (e.g. 20% Vitamin C)"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newFeatureInput.trim()) {
                              updateProductField(index, 'features', [
                                ...prod.features,
                                newFeatureInput.trim(),
                              ]);
                              setNewFeatureInput('');
                            }
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sparkline-blue bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureInput.trim()) {
                            updateProductField(index, 'features', [
                              ...prod.features,
                              newFeatureInput.trim(),
                            ]);
                            setNewFeatureInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Key Customer Benefits (Outcomes)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prod.benefits.map((ben, bIdx) => (
                        <span
                          key={bIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-sparkline-purple text-xs font-medium border border-purple-100"
                        >
                          <span>{ben}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextBens = prod.benefits.filter((_, i) => i !== bIdx);
                              updateProductField(index, 'benefits', nextBens);
                            }}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add benefit (e.g. Fades sunspots in 28 days)"
                        value={newBenefitInput}
                        onChange={(e) => setNewBenefitInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newBenefitInput.trim()) {
                              updateProductField(index, 'benefits', [
                                ...prod.benefits,
                                newBenefitInput.trim(),
                              ]);
                              setNewBenefitInput('');
                            }
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sparkline-blue bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newBenefitInput.trim()) {
                            updateProductField(index, 'benefits', [
                              ...prod.benefits,
                              newBenefitInput.trim(),
                            ]);
                            setNewBenefitInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* STEP 3: TARGET AUDIENCE */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
              <Users className="w-5 h-5 text-sparkline-blue" />
              <span>Step 3 — Target Audience & Buyer Psychology</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Identify who you are marketing to, their emotional friction, and their purchase triggers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-sparkline-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-sparkline-midnight block">
                Privacy & Data Sensitivity:
              </strong>
              Sparkline maps general demographic profiles and behavioral triggers. No personally identifiable customer data (PII) or sensitive individual information is collected.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Target Countries / Primary Geographies"
              required
              placeholder="e.g. United States, Canada, United Kingdom"
              value={targetLocations}
              onChange={(e) => setTargetLocations(e.target.value)}
              helperText="Separate multiple countries with commas."
            />

            <SelectInput
              label="Customer Type"
              options={[
                { label: 'Individuals / Consumers (B2C)', value: 'Individuals' },
                { label: 'Businesses / Organizations (B2B)', value: 'Businesses' },
                { label: 'Both Consumers & Businesses', value: 'Both' },
              ]}
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as CustomerType)}
            />

            {/* Age Ranges Checkboxes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Customer Age Range (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {['18-24', '25-34', '35-44', '45-54', '55+'].map((age) => {
                  const isChecked = selectedAgeRanges.includes(age);
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => {
                        setSelectedAgeRanges((prev) =>
                          isChecked ? prev.filter((a) => a !== age) : [...prev, age]
                        );
                      }}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all',
                        isChecked
                          ? 'bg-blue-50 text-sparkline-blue border-sparkline-blue'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <TextInput
                label="Target Audience Interests & Lifestyle Affinities"
                placeholder="e.g. Clean skincare, Dermatology ingredients, Anti-aging routines, Eco-packaging"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                helperText="Keywords that describe what this audience searches, follows, and cares about."
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                label="Core Customer Needs & Commercial Problems"
                required
                maxLength={400}
                placeholder="What frustrating situation causes customers to look for your product? What does their life look like before discovering you?"
                value={needsAndProblems}
                onChange={(e) => setNeedsAndProblems(e.target.value)}
                error={errors.needsAndProblems}
                helperText="Explain the root problem your customers are trying to solve."
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                label="Main Customer Pain Points & Objections"
                maxLength={400}
                placeholder="List key friction points (e.g. Competitor serums oxidize fast; High department store prices; Harsh artificial scents that sting sensitive skin)."
                value={mainPainPoints}
                onChange={(e) => setMainPainPoints(e.target.value)}
                helperText="Separate distinct pain points with semicolons (;)."
              />
            </div>

            <SelectInput
              label="Audience Purchasing Behavior"
              options={[
                { label: 'Research-heavy (Inspects ingredients/reviews before buying)', value: 'Research-heavy' },
                { label: 'Impulse (Fast visual checkout driven by hooks)', value: 'Impulse' },
                { label: 'Value-driven (Price sensitive, seeks deals/bundles)', value: 'Value-driven' },
                { label: 'Luxury / Premium (Prioritizes prestige and aesthetics)', value: 'Luxury/Premium' },
                { label: 'Subscription / Recurring (Prefers automatic refills)', value: 'Subscription' },
              ]}
              value={purchasingBehavior}
              onChange={(e) => setPurchasingBehavior(e.target.value as PurchasingBehavior)}
            />

            <TextInput
              label="Primary Audience Languages"
              placeholder="e.g. English, Spanish"
              value={preferredLanguages}
              onChange={(e) => setPreferredLanguages(e.target.value)}
            />

            <div className="md:col-span-2">
              <TextInput
                label="Existing or Primary Customer Segments"
                placeholder="e.g. Ingredient-conscious skincare buyers aged 25-45, clean beauty advocates."
                value={existingCustomerSegments}
                onChange={(e) => setExistingCustomerSegments(e.target.value)}
                helperText="Describe any distinct sub-groups or existing customer archetypes."
              />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: COMPETITORS AND MARKET POSITION */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                <Target className="w-5 h-5 text-sparkline-blue" />
                <span>Step 4 — Competitor Intelligence & Market Position</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Map direct alternatives and articulate your unique competitive advantage.
              </p>
            </div>

            {!noCompetitorsYet && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={addCompetitor}
              >
                Add Competitor
              </Button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-sparkline-midnight block">
                Optional Competitor Mapping:
              </strong>
              If you are launching in a completely new category or do not have competitor data yet, you can skip this section or add alternatives later.
            </div>
          </div>

          <Checkbox
            label="I don't have direct competitor information yet (Skip competitor list)"
            checked={noCompetitorsYet}
            onChange={() => setNoCompetitorsYet(!noCompetitorsYet)}
          />

          {/* Competitor Inputs */}
          {!noCompetitorsYet && (
            <div className="space-y-4">
              {competitors.map((comp, idx) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sparkline-midnight">
                      Competitor #{idx + 1}
                    </span>
                    {competitors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompetitor(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        aria-label="Remove competitor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput
                      label="Competitor Name"
                      placeholder="e.g. SkinCeuticals or Competitor Brand"
                      value={comp.name}
                      onChange={(e) => updateCompetitor(idx, 'name', e.target.value)}
                    />

                    <TextInput
                      label="Competitor Website URL"
                      placeholder="https://competitor.com"
                      value={comp.websiteUrl || ''}
                      onChange={(e) => updateCompetitor(idx, 'websiteUrl', e.target.value)}
                    />

                    <div className="sm:col-span-2">
                      <TextInput
                        label="Main Alternative Offering / Weakness"
                        placeholder="e.g. Established luxury brand, but priced high at $180 and oxidizes within 30 days."
                        value={comp.alternativeOfferings || ''}
                        onChange={(e) => updateCompetitor(idx, 'alternativeOfferings', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Market Positioning Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-sparkline-midnight">
              Positioning & Competitive Defensibility
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                label="Current Market Position"
                options={[
                  { label: 'Challenger (Disrupting established incumbent brands)', value: 'Challenger' },
                  { label: 'Niche Leader (Dominant in a specific specialized segment)', value: 'Niche Leader' },
                  { label: 'New Entrant (Introducing an unproven innovation)', value: 'New Entrant' },
                  { label: 'Cost Leader (Most affordable price in category)', value: 'Cost Leader' },
                  { label: 'Premium Brand (Highest quality, prestige status)', value: 'Premium Brand' },
                ]}
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value as MarketPositionType)}
              />

              <div className="md:col-span-2">
                <TextArea
                  label="What Makes Your Business Different? (Key Differentiator)"
                  required
                  maxLength={400}
                  placeholder="Explain why a customer would purchase from you rather than any competitor..."
                  value={whatMakesYouDifferent}
                  onChange={(e) => setWhatMakesYouDifferent(e.target.value)}
                  error={errors.whatMakesYouDifferent}
                  helperText="Your strategic differentiator forms the basis of your marketing hooks."
                />
              </div>

              <div className="md:col-span-2">
                <TextInput
                  label="Main Competitive Advantages (Strengths)"
                  placeholder="e.g. 70%+ gross margin; Direct lab ownership; 30-day money-back guarantee"
                  value={competitiveAdvantages}
                  onChange={(e) => setCompetitiveAdvantages(e.target.value)}
                  helperText="Separate distinct advantages with semicolons (;)."
                />
              </div>

              <div className="md:col-span-2">
                <TextInput
                  label="Known Market Challenges & Headwinds"
                  placeholder="e.g. Rising ad auction CPMs; Saturated search keywords; Consumer trust barriers"
                  value={knownMarketChallenges}
                  onChange={(e) => setKnownMarketChallenges(e.target.value)}
                  helperText="Separate distinct challenges with semicolons (;)."
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 5: MARKETING GOALS & CURRENT ACTIVITIES */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sparkline-blue" />
              <span>Step 5 — Marketing Goals & Budget Allocation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Define your core growth targets, current monthly spend, and campaign expectations.
            </p>
          </div>

          {/* Goal Chips Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Your Marketing Goals (Choose all that apply) *
            </label>
            {errors.selectedGoals && (
              <p className="text-xs text-rose-600 mb-2 font-medium">{errors.selectedGoals}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MARKETING_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setSelectedGoals((prev) =>
                        isSelected ? prev.filter((g) => g !== goal) : [...prev, goal]
                      );
                    }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border text-left transition-all min-h-[44px]',
                      isSelected
                        ? 'bg-blue-50/70 border-sparkline-blue font-semibold text-sparkline-midnight'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors',
                        isSelected
                          ? 'bg-sparkline-blue border-sparkline-blue text-white'
                          : 'border-slate-300 bg-white'
                      )}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <SelectInput
              label="Primary Marketing Objective"
              required
              options={selectedGoals.length > 0 ? selectedGoals.map((g) => ({ label: g, value: g })) : [{ label: 'Increase sales', value: 'Increase sales' }]}
              value={primaryObjective}
              onChange={(e) => setPrimaryObjective(e.target.value)}
              helperText="The single metric your campaigns will be calibrated to optimize first."
            />

            <SelectInput
              label="Existing Campaign Status"
              options={[
                { label: 'Not running paid ads yet', value: 'Not running ads yet' },
                { label: 'Running ads with mixed / break-even results', value: 'Running with mixed results' },
                { label: 'Scaling profitably with positive ROAS', value: 'Scaling profitably' },
                { label: 'Paused existing campaigns', value: 'Paused' },
              ]}
              value={existingCampaignStatus}
              onChange={(e) => setExistingCampaignStatus(e.target.value as CampaignStatusType)}
            />

            <CurrencyInput
              label="Estimated Monthly Marketing Budget *"
              value={monthlyBudget}
              currency={budgetCurrency}
              onChange={(val, cur) => {
                setMonthlyBudget(val);
                setBudgetCurrency(cur);
              }}
              error={errors.monthlyBudget}
              helperText="Target ad spend and creative budget per 30-day cycle."
            />

            <SelectInput
              label="Planned Campaign Horizon"
              options={[
                { label: '1-3 months (Initial validation sprint)', value: '1-3 months' },
                { label: '3-6 months (Scale phase)', value: '3-6 months' },
                { label: '6-12 months (Annual growth playbook)', value: '6-12 months' },
                { label: 'Ongoing continuous flight', value: 'Ongoing' },
              ]}
              value={campaignDuration}
              onChange={(e) => setCampaignDuration(e.target.value as CampaignDurationType)}
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Current Active Marketing Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS_LIST.map((ch) => {
                  const isChecked = currentChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        setCurrentChannels((prev) =>
                          isChecked ? prev.filter((c) => c !== ch) : [...prev, ch]
                        );
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                        isChecked
                          ? 'bg-purple-50 text-sparkline-purple border-sparkline-purple'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Ad Platforms & Networks
              </label>
              <div className="flex flex-wrap gap-2">
                {['Google Ads', 'Meta (Instagram/Facebook)', 'TikTok Ads', 'LinkedIn Ads', 'YouTube Ads', 'Pinterest Ads', 'Amazon Ads'].map((platform) => {
                  const isChecked = preferredAdPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => {
                        setPreferredAdPlatforms((prev) =>
                          isChecked ? prev.filter((p) => p !== platform) : [...prev, platform]
                        );
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                        isChecked
                          ? 'bg-blue-50 text-sparkline-blue border-sparkline-blue'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <TextInput
                label="Target Commercial Outcome / Success Milestone"
                placeholder="e.g. $40,000 monthly DTC revenue at 3.0x blended ROAS"
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                helperText="How will you define whether this marketing strategy was successful?"
              />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 6: FINAL REVIEW & CONFIRMATION */}
      {currentStep === 6 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">
                Step 6 of 6
              </Badge>
              <span className="text-xs font-semibold text-emerald-600">
                Ready for Verification
              </span>
            </div>
            <h2 className="text-xl font-bold text-sparkline-midnight mt-1">
              Review Your Business & Product Profile
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your information before submitting. You can click "Edit" on any section to make adjustments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Demonstration Storage Notice:</strong>
              This project will be saved into your local browser workspace. No live AI recommendations or backend database records are fabricated in Prompt 06.
            </div>
          </div>

          {/* Review Section 1: Business */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sparkline-blue" />
                <span>1. Business Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Brand Name</span>
                <span className="font-bold text-sparkline-midnight">{brandName || 'Untitled Brand'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Industry</span>
                <span className="font-semibold text-sparkline-midnight">
                  {industry === 'Other' ? customIndustry : industry} ({businessType})
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Description</span>
                <p className="text-slate-700 leading-relaxed">{description}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location & Market</span>
                <span className="text-slate-700">{location} • Serving: {regionsServed}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Operating Status</span>
                <span className="text-slate-700">{operatingStatus} ({businessSize})</span>
              </div>
            </div>
          </div>

          {/* Review Section 2: Products */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight flex items-center gap-2">
                <Package className="w-4 h-4 text-sparkline-blue" />
                <span>2. Products & Services ({products.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-3">
              {products.map((p, idx) => (
                <div key={p.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sparkline-midnight">
                      #{idx + 1}: {p.name || 'Unnamed Product'}
                    </span>
                    <span className="font-mono font-bold text-emerald-600">
                      ${p.sellingPrice} {p.currency}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    <strong>USP:</strong> {p.usp || 'Not defined'}
                  </div>
                  <div className="flex gap-4 mt-2 text-[11px] text-slate-600">
                    <span>COGS: ${p.costOfGoods || 0}</span>
                    <span>Status: {p.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Section 3: Audience */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight flex items-center gap-2">
                <Users className="w-4 h-4 text-sparkline-blue" />
                <span>3. Target Audience</span>
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Audience Type</span>
                <span className="font-semibold text-sparkline-midnight">
                  {customerType} (Ages: {selectedAgeRanges.join(', ') || 'All'})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Purchasing Behavior</span>
                <span className="font-semibold text-sparkline-midnight">{purchasingBehavior}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Core Needs & Problems</span>
                <p className="text-slate-700 leading-relaxed">{needsAndProblems}</p>
              </div>
            </div>
          </div>

          {/* Review Section 4: Competitors */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight flex items-center gap-2">
                <Target className="w-4 h-4 text-sparkline-blue" />
                <span>4. Competitors & Positioning</span>
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Market Position</span>
                <span className="font-semibold text-sparkline-midnight">{currentPosition}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">What Makes You Different</span>
                <p className="text-slate-700 leading-relaxed">{whatMakesYouDifferent}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Competitors Tracked</span>
                <span className="text-slate-700">
                  {noCompetitorsYet
                    ? 'No direct competitor data tracked yet'
                    : competitors.map((c) => c.name || 'Unnamed').join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Review Section 5: Marketing Goals & Budget */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sparkline-blue" />
                <span>5. Goals & Planned Budget</span>
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Objective</span>
                <span className="font-bold text-sparkline-blue">{primaryObjective}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly Budget</span>
                <span className="font-extrabold text-emerald-600 font-mono text-sm">
                  ${monthlyBudget.toLocaleString()} {budgetCurrency}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Selected Goals</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedGoals.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-semibold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Expected Outcome</span>
                <span className="text-slate-700">{expectedOutcome}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Persistent Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-modal flex items-center justify-between gap-4">
        <div>
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <Link
              to="/dashboard/projects"
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg"
            >
              Cancel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSaveDraft}
            className="hidden sm:inline-flex"
          >
            Save Draft
          </Button>

          {currentStep < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNext}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="gradient"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleSubmitProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Initializing Project...' : 'Submit & Initialize Project'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
