import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  TextInput,
  TextArea,
  SelectInput,
  CurrencyInput,
} from '@/components/common/Form';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { strategyService, AiStatusResponse } from '@/services/strategy.service';
import { audienceService } from '@/services/audience.service';
import { MarketingProject } from '@/types/project';
import {
  AudienceAnalysis,
  AudienceAnalysisInput,
  CustomerPersona,
  MarketType,
  CustomerModelType,
} from '@/types/audience';
import {
  Users,
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  Copy,
  Printer,
  ChevronDown,
  Layers,
  HelpCircle,
  Clock,
  ShieldAlert,
  Key,
  Compass,
  Bookmark,
  ChevronUp,
  MessageSquare,
  Radio,
  SlidersHorizontal,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AudienceIntelligencePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project');
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [analyses, setAnalyses] = useState<AudienceAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudienceAnalysis | null>(null);

  // Saved personas state
  const [savedPersonas, setSavedPersonas] = useState<CustomerPersona[]>([]);
  const [showSavedPersonasModal, setShowSavedPersonasModal] = useState(false);

  // AI connection state
  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    isConfigured: false,
    provider: 'Google Gemini',
    model: 'gemini-1.5-flash',
  });
  const [checkingAi, setCheckingAi] = useState(true);

  // Form & generation state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [generationState, setGenerationState] = useState<
    'idle' | 'preparing' | 'analyzing' | 'generating' | 'saving' | 'completed' | 'failed'
  >('idle');
  const [generationError, setGenerationError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'segments' | 'personas' | 'journey' | 'messaging' | 'channels' | 'assumptions'
  >('segments');

  // Active sub-selections
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');

  // Editable Form Inputs (pre-filled from project)
  const [targetCountry, setTargetCountry] = useState('');
  const [cityOrRegion, setCityOrRegion] = useState('');
  const [marketType, setMarketType] = useState<MarketType>('National');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [customerType, setCustomerType] = useState<CustomerModelType>('B2C');
  const [ageRange, setAgeRange] = useState('');
  const [customerNeeds, setCustomerNeeds] = useState('');
  const [customerPainPoints, setCustomerPainPoints] = useState('');
  const [interests, setInterests] = useState('');
  const [purchasingMotivations, setPurchasingMotivations] = useState('');
  const [commonObjections, setCommonObjections] = useState('');
  const [purchasingBehavior, setPurchasingBehavior] = useState('Research-heavy');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(50);
  const [currency, setCurrency] = useState('USD');
  const [mainBenefits, setMainBenefits] = useState('');
  const [existingCustomerInfo, setExistingCustomerInfo] = useState('');

  // Load initial data
  useEffect(() => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);
    setSavedPersonas(audienceService.getSavedPersonas());

    if (loadedProjects.length > 0) {
      if (initialProjectId && loadedProjects.some((p) => p.id === initialProjectId)) {
        setSelectedProjectId(initialProjectId);
      } else {
        const first = loadedProjects[0];
        if (first) {
          setSelectedProjectId(first.id);
        }
      }
    }

    strategyService
      .checkAiStatus()
      .then((status) => {
        setAiStatus(status);
        setCheckingAi(false);
      })
      .catch(() => {
        setCheckingAi(false);
      });
  }, [initialProjectId]);

  // Synchronize form when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setAnalyses([]);
      setCurrentAnalysis(null);
      return;
    }

    const currentProject = projects.find((p) => p.id === selectedProjectId);
    if (currentProject) {
      setTargetCountry(currentProject.audience.targetLocations.join(', '));
      setCityOrRegion(currentProject.business.location);
      setPreferredLanguage(currentProject.audience.preferredLanguages?.[0] || 'English');
      setCustomerType((currentProject.audience.customerType as CustomerModelType) || 'B2C');
      setAgeRange(currentProject.audience.ageRanges.join(', '));
      setCustomerNeeds(currentProject.audience.needsAndProblems);
      setCustomerPainPoints(currentProject.audience.mainPainPoints.join('; '));
      setInterests(currentProject.audience.interests.join(', '));
      setPurchasingMotivations('Reliable solution to primary problem, clear return on investment');
      setCommonObjections('Price, formulation stability, and trust proof');
      setPurchasingBehavior(currentProject.audience.purchasingBehavior);

      if (currentProject.products.length > 0) {
        const firstProd = currentProject.products[0];
        if (firstProd) {
          setProductName(firstProd.name);
          setProductPrice(firstProd.sellingPrice);
          setCurrency(firstProd.currency);
          setMainBenefits(firstProd.benefits.join('; ') || firstProd.usp);
        }
      }
      setExistingCustomerInfo(currentProject.audience.existingCustomerSegments || '');
    }

    const projectAnalyses = audienceService.getAnalyses(selectedProjectId);
    setAnalyses(projectAnalyses);

    if (projectAnalyses.length > 0) {
      const latest = projectAnalyses.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      if (latest) {
        setCurrentAnalysis(latest);
        if (latest.segments.length > 0) {
          const firstSeg = latest.segments[0];
          if (firstSeg) {
            setSelectedSegmentId(firstSeg.id);
          }
        }
      }
    } else {
      setCurrentAnalysis(null);
    }
  }, [selectedProjectId, projects]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Handle AI analysis generation
  const handleAnalyzeAudience = async () => {
    if (!selectedProject) return;

    if (!customerNeeds.trim()) {
      addToast({
        title: 'Customer Needs Required',
        message: 'Please describe the core customer needs before running audience segmentation.',
        type: 'warning',
      });
      return;
    }

    setGenerationError('');
    setGenerationState('preparing');

    const customInputs: Partial<AudienceAnalysisInput> = {
      targetCountry,
      cityOrRegion,
      geographicMarketType: marketType,
      preferredLanguage,
      industry: selectedProject.business.industry,
      customerType,
      ageRange,
      customerNeeds,
      customerPainPoints,
      interests,
      purchasingMotivations,
      commonObjections,
      preferredChannels: selectedProject.marketing.currentChannels,
      purchasingBehavior,
      productName,
      productPrice,
      currency,
      mainBenefits,
      existingCustomerInfo,
      marketingGoals: selectedProject.marketing.selectedGoals.join(', '),
    };

    setTimeout(async () => {
      setGenerationState('analyzing');

      try {
        const analysis = await audienceService.generateAudienceAnalysis(
          selectedProject,
          customInputs
        );
        setGenerationState('saving');

        setTimeout(() => {
          setGenerationState('completed');
          setCurrentAnalysis(analysis);
          setAnalyses(audienceService.getAnalyses(selectedProject.id));
          if (analysis.segments.length > 0) {
            const firstSeg = analysis.segments[0];
            if (firstSeg) {
              setSelectedSegmentId(firstSeg.id);
            }
          }
          setIsFormOpen(false);

          addToast({
            title: 'Audience Analysis Complete',
            message: `Generated ${analysis.segments.length} audience segments and ${analysis.personas.length} personas.`,
            type: 'success',
          });
        }, 500);
      } catch (err: unknown) {
        setGenerationState('failed');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (err as any)?.code;
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unknown error occurred during audience analysis.';

        setGenerationError(errorMessage);

        if (errorCode === 'API_KEY_NOT_CONFIGURED') {
          addToast({
            title: 'Gemini API Key Required',
            message: 'Please set GEMINI_API_KEY in your environment to run live audience AI generation.',
            type: 'warning',
          });
        } else {
          addToast({
            title: 'Audience Analysis Failed',
            message: errorMessage,
            type: 'error',
          });
        }
      }
    }, 400);
  };

  const handleSavePersona = (persona: CustomerPersona) => {
    audienceService.savePersona(persona);
    setSavedPersonas(audienceService.getSavedPersonas());
    addToast({
      title: 'Persona Saved',
      message: `"${persona.personaName}" added to your saved customer personas.`,
      type: 'success',
    });
  };

  const handleCopyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied to Clipboard',
        message: `${label} copied to clipboard.`,
        type: 'success',
      });
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SEO
        title="Target Audience & Customer Persona Analyzer — Sparkline Marketing"
        description="Discover who your customers are, understand their motivations, and build audience segments that support smarter marketing decisions."
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-blue-100 text-sparkline-blue">
              Audience Intelligence
            </span>
            <Badge variant="cyan" size="sm">
              Phase 08
            </Badge>

            {!checkingAi && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                  aiStatus.isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    aiStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  )}
                />
                {aiStatus.isConfigured ? 'Gemini 1.5 Flash Connected' : 'Gemini Key Setup Required'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Know Your Audience. Market With Precision.
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Discover who your customers are, understand their motivations, and build audience segments that support
            smarter marketing decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSavedPersonasModal(true)}
            className="gap-2"
          >
            <Bookmark className="w-4 h-4 text-sparkline-purple" />
            <span>Saved Personas ({savedPersonas.length})</span>
          </Button>

          {currentAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2 hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* No Projects Found State */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center bg-white border-slate-200 shadow-card max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-sparkline-midnight">
              No Marketing Projects Available
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Audience intelligence requires foundational business data. Create your first marketing project
              to begin customer segmentation and persona profiling.
            </p>
          </div>
          <Link to="/dashboard/projects/new" className="inline-block">
            <Button variant="primary" size="md">
              Create Marketing Project
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Project Selector Bar */}
          <Card className="p-4 bg-white border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label
                  htmlFor="audience-project-select"
                  className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider shrink-0"
                >
                  Active Project:
                </label>
                <div className="relative min-w-[280px]">
                  <select
                    id="audience-project-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue/20 focus:border-sparkline-blue appearance-none pr-8 cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.business.brandName} ({p.business.businessType} · {p.business.industry})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {selectedProject && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="blue" size="sm">
                      {selectedProject.audience.customerType}
                    </Badge>
                    <Badge variant="slate" size="sm">
                      {selectedProject.audience.purchasingBehavior}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Version History Selector */}
              {analyses.length > 0 && (
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Analysis:</span>
                  </span>
                  <select
                    value={currentAnalysis?.id || ''}
                    onChange={(e) => {
                      const found = analyses.find((a) => a.id === e.target.value);
                      if (found) setCurrentAnalysis(found);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {analyses.map((ana) => (
                      <option key={ana.id} value={ana.id}>
                        v{ana.version} — {new Date(ana.createdAt).toLocaleDateString()} (
                        {ana.modelIdentifier.includes('Reference') ? 'Blueprint' : 'Gemini'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Selected Project Quick Attributes */}
            {selectedProject && (
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Target Geography
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.audience.targetLocations.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Core Product
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.products[0]?.name || 'N/A'} ($
                    {selectedProject.products[0]?.sellingPrice || 0})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Primary Goal
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.marketing.primaryObjective}
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to={`/dashboard/projects/${selectedProject.id}`}
                    className="text-sparkline-blue hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* Unconfigured Gemini API Key Setup Banner */}
          {!aiStatus.isConfigured && (
            <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Live Gemini API Key Required for Real-Time Audience Segmentation
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                      To run live AI audience segmentation with Google Gemini 1.5 Flash, set{' '}
                      <code className="px-1.5 py-0.5 rounded bg-amber-200/80 font-mono text-[11px] font-bold">
                        GEMINI_API_KEY=&quot;your_key&quot;
                      </code>{' '}
                      in your <code className="font-mono text-[11px]">.env</code> file. Pre-generated reference
                      blueprints are currently loaded below.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900 text-white hover:bg-amber-950 transition-colors"
                  >
                    Get Free Gemini Key
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Collapsible Audience Research Input Form */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-sparkline-blue flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                    Audience Research Input Form & Tuning
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {isFormOpen
                      ? 'Collapse form parameters'
                      : 'Customize or refine market demographics and customer psychology before analysis'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sparkline-blue">
                <span>{isFormOpen ? 'Hide' : 'Tune Parameters'}</span>
                {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isFormOpen && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                  <p>
                    These inputs are automatically synchronized with your project profile. You can fine-tune
                    any parameter here for this specific audience research sprint without altering your base project.
                  </p>
                </div>

                {/* Section 1: Market Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    1. Geographic Market Scope
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <TextInput
                      label="Target Country / Countries *"
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      placeholder="e.g. United States, Canada, UK"
                    />
                    <TextInput
                      label="City or Specific Region"
                      value={cityOrRegion}
                      onChange={(e) => setCityOrRegion(e.target.value)}
                      placeholder="e.g. Urban Tech Metros"
                    />
                    <SelectInput
                      label="Market Type"
                      value={marketType}
                      onChange={(e) => setMarketType(e.target.value as MarketType)}
                      options={[
                        { label: 'Local Market', value: 'Local' },
                        { label: 'National Market', value: 'National' },
                        { label: 'International / Multi-country', value: 'International' },
                      ]}
                    />
                  </div>
                </div>

                {/* Section 2: Customer Psychology */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Customer Information & Psychology
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectInput
                      label="Customer Model *"
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value as CustomerModelType)}
                      options={[
                        { label: 'B2C (Consumers / Individuals)', value: 'B2C' },
                        { label: 'B2B (Businesses / Organizations)', value: 'B2B' },
                        { label: 'Both B2B and B2C', value: 'Both' },
                      ]}
                    />

                    <TextInput
                      label="Estimated Age Range (Optional Assumption)"
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      placeholder="e.g. 25-45"
                      helperText="Marked as an assumption unless supported by first-party data."
                    />

                    <div className="sm:col-span-2">
                      <TextArea
                        label="Core Customer Needs & Problems *"
                        value={customerNeeds}
                        onChange={(e) => setCustomerNeeds(e.target.value)}
                        placeholder="What frustrating situation causes customers to look for your product?"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <TextArea
                        label="Customer Pain Points & Friction"
                        value={customerPainPoints}
                        onChange={(e) => setCustomerPainPoints(e.target.value)}
                        placeholder="List specific friction points separated by semicolons (;)."
                      />
                    </div>

                    <TextInput
                      label="Audience Interests & Affinities"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g. Clean beauty, skincare routines, wellness"
                    />

                    <SelectInput
                      label="Purchasing Behavior"
                      value={purchasingBehavior}
                      onChange={(e) => setPurchasingBehavior(e.target.value)}
                      options={[
                        { label: 'Research-heavy (Inspects labels, reviews, comparisons)', value: 'Research-heavy' },
                        { label: 'Impulse (Fast visual checkout driven by hooks)', value: 'Impulse' },
                        { label: 'Value-driven (Price sensitive, seeks bundles)', value: 'Value-driven' },
                        { label: 'Luxury / Premium (Prioritizes prestige)', value: 'Luxury/Premium' },
                        { label: 'Subscription / Recurring (Auto-replenishment)', value: 'Subscription' },
                      ]}
                    />
                  </div>
                </div>

                {/* Section 3: Commercial Parameters */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    3. Commercial Alignment & Unit Economics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Product or Service Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />

                    <CurrencyInput
                      label="Product Retail Price"
                      value={productPrice}
                      currency={currency}
                      onChange={(val, cur) => {
                        setProductPrice(val);
                        setCurrency(cur);
                      }}
                    />

                    <div className="sm:col-span-2">
                      <TextInput
                        label="Main Benefits & Differentiator"
                        value={mainBenefits}
                        onChange={(e) => setMainBenefits(e.target.value)}
                        placeholder="e.g. Stabilized active potency without stinging or oxidation."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Action Execution Banner */}
          <Card className="p-6 bg-gradient-to-br from-sparkline-midnight via-sparkline-slate to-sparkline-midnight text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sparkline-blue/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sparkline-blue/20 border border-sparkline-blue/30 flex items-center justify-center text-sparkline-cyan">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-sparkline-cyan">
                    Audience Segmentation & Persona Synthesis
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedProject ? selectedProject.business.brandName : 'Select a Project'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Synthesize your customer needs and unit economics into granular audience segments, fictional
                  archetypes, a 6-stage customer journey, and tailored messaging angles.
                </p>

                {/* State explanations */}
                {generationState !== 'idle' && (
                  <div className="pt-2 flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-sparkline-cyan border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-xs font-medium text-sparkline-cyan animate-pulse">
                      {generationState === 'preparing' && 'Preparing customer parameters & commercial context...'}
                      {generationState === 'analyzing' && 'Analyzing purchasing motivations and objection psychology...'}
                      {generationState === 'generating' && 'Structuring segments, customer personas, and journey stages...'}
                      {generationState === 'saving' && 'Saving audience analysis to project workspace...'}
                    </span>
                  </div>
                )}

                {/* Error Banner */}
                {generationState === 'failed' && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Analysis Error</span>
                    </div>
                    <p className="text-slate-300">{generationError}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={
                    generationState === 'preparing' ||
                    generationState === 'analyzing' ||
                    generationState === 'generating' ||
                    generationState === 'saving'
                  }
                  onClick={handleAnalyzeAudience}
                  className="bg-sparkline-blue hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 gap-2 min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {generationState === 'idle' || generationState === 'completed'
                      ? 'Analyze Audience with AI'
                      : 'Analyzing Audience...'}
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Presentation Workspace */}
          {currentAnalysis && (
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
                {[
                  {
                    id: 'segments',
                    label: `Audience Segments (${currentAnalysis.segments.length})`,
                    icon: Target,
                  },
                  {
                    id: 'personas',
                    label: `Customer Personas (${currentAnalysis.personas.length})`,
                    icon: Users,
                  },
                  {
                    id: 'journey',
                    label: 'Customer Journey (6 Stages)',
                    icon: Layers,
                  },
                  {
                    id: 'messaging',
                    label: 'Segment Messaging',
                    icon: MessageSquare,
                  },
                  {
                    id: 'channels',
                    label: 'Channel Strategy',
                    icon: Radio,
                  },
                  {
                    id: 'assumptions',
                    label: 'Assumptions & Research Needs',
                    icon: ShieldAlert,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[42px]',
                        isActive
                          ? 'bg-sparkline-midnight text-white shadow-sm'
                          : 'text-slate-600 hover:text-sparkline-midnight hover:bg-slate-100'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-sparkline-cyan' : 'text-slate-400')} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: AUDIENCE SEGMENTS */}
              {activeTab === 'segments' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                    <Info className="w-4 h-4 text-sparkline-purple shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-900 leading-relaxed">
                      <strong>Hypothesis Transparency Notice:</strong> All AI-generated audience segments
                      represent strategic hypotheses based on submitted business parameters. They are prioritized
                      to guide initial testing and should be verified with live campaign cohorts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {currentAnalysis.segments.map((seg) => {
                      const isSelected = selectedSegmentId === seg.id;
                      return (
                        <Card
                          key={seg.id}
                          className={cn(
                            'p-6 space-y-4 transition-all border-2 flex flex-col justify-between',
                            isSelected
                              ? 'border-sparkline-blue bg-blue-50/15 shadow-md ring-2 ring-sparkline-blue/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <Badge
                                variant={
                                  seg.strategicPriority === 'High'
                                    ? 'magenta'
                                    : seg.strategicPriority === 'Medium'
                                      ? 'cyan'
                                      : 'slate'
                                }
                                size="sm"
                              >
                                {seg.strategicPriority} Priority
                              </Badge>

                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-sparkline-purple border border-purple-200">
                                AI Hypothesis
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-sparkline-midnight leading-snug">
                              {seg.name}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {seg.description}
                            </p>

                            <div className="space-y-2 text-xs pt-1">
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                  Main Customer Need
                                </span>
                                <p className="font-semibold text-sparkline-midnight">
                                  {seg.mainCustomerNeed}
                                </p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-rose-800 block">
                                  Core Pain Points
                                </span>
                                <ul className="space-y-1 text-slate-700">
                                  {seg.painPoints.map((pt, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-rose-500 font-bold">•</span>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 space-y-1">
                                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                                  Recommended Message Angle
                                </span>
                                <p className="font-medium text-slate-800 italic">
                                  &ldquo;{seg.recommendedMessaging}&rdquo;
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500 font-medium">
                              CTA: <strong className="text-slate-800">{seg.suggestedCta}</strong>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSegmentId(seg.id);
                                setActiveTab('messaging');
                              }}
                              className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
                            >
                              <span>View Messaging</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED CUSTOMER PERSONAS */}
              {activeTab === 'personas' && (
                <div className="space-y-6">
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>Fictional Archetype Disclaimer:</strong> Personas are composite archetypes
                      created to embody customer motivations and friction points. They do not represent real
                      individuals or verified survey participants.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {currentAnalysis.personas.map((persona) => {
                      const isSaved = savedPersonas.some((p) => p.id === persona.id);
                      return (
                        <Card
                          key={persona.id}
                          className="p-6 bg-white border-slate-200 shadow-card space-y-5"
                        >
                          {/* Persona Header */}
                          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'w-12 h-12 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-sm',
                                  persona.avatarColor || 'bg-sparkline-blue'
                                )}
                              >
                                {persona.personaName.charAt(0)}
                              </div>
                              <div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                  {persona.segmentName}
                                </span>
                                <h3 className="text-base font-bold text-sparkline-midnight mt-0.5">
                                  {persona.personaName}
                                </h3>
                                <p className="text-xs text-slate-500 italic">{persona.tagline}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSavePersona(persona)}
                              className={cn(
                                'p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5',
                                isSaved
                                  ? 'bg-purple-50 text-sparkline-purple border-purple-200'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              )}
                              title={isSaved ? 'Saved to library' : 'Save persona'}
                            >
                              {isSaved ? (
                                <>
                                  <BookmarkCheck className="w-4 h-4 text-sparkline-purple" />
                                  <span className="hidden sm:inline">Saved</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-4 h-4" />
                                  <span className="hidden sm:inline">Save Persona</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Characteristics Grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Age Bracket (Assumption)
                              </span>
                              <span className="font-semibold text-sparkline-midnight">
                                {persona.characteristics.ageRangeAssumption}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Geographic Context
                              </span>
                              <span className="font-semibold text-sparkline-midnight">
                                {persona.characteristics.geographicContext}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Role / Occupation
                              </span>
                              <span className="font-semibold text-sparkline-midnight">
                                {persona.characteristics.occupationRole}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Lifestyle / Business Context
                              </span>
                              <span className="font-semibold text-sparkline-midnight truncate block">
                                {persona.characteristics.lifestyleOrBusinessContext}
                              </span>
                            </div>
                          </div>

                          {/* Psychology Section */}
                          <div className="space-y-3 text-xs">
                            <h4 className="font-bold text-sparkline-midnight uppercase text-[11px] tracking-wider">
                              Psychological Drivers & Objections
                            </h4>

                            <div className="space-y-2">
                              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1">
                                <span className="font-bold text-blue-900 block text-[10px] uppercase">
                                  Primary Goals & Needs
                                </span>
                                <ul className="space-y-1 text-slate-700">
                                  {persona.psychology.goals.map((g, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                      <span>{g}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 space-y-1">
                                <span className="font-bold text-rose-900 block text-[10px] uppercase">
                                  Frustrations & Objections
                                </span>
                                <ul className="space-y-1 text-slate-700">
                                  {persona.psychology.buyingObjections.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-rose-500 font-bold">•</span>
                                      <span>{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Marketing Recommendations */}
                          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                            <h4 className="font-bold text-sparkline-midnight uppercase text-[11px] tracking-wider">
                              Strategic Marketing Angle
                            </h4>
                            <p className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-slate-800 italic leading-relaxed">
                              &ldquo;{persona.recommendations.bestMessagingAngle}&rdquo;
                            </p>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span>
                                Channels:{' '}
                                <strong className="text-slate-700">
                                  {persona.recommendations.suitableChannels.slice(0, 2).join(', ')}
                                </strong>
                              </span>
                              <span>
                                Suggested CTA:{' '}
                                <strong className="text-sparkline-blue">
                                  {persona.recommendations.suggestedCta}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER JOURNEY (6 STAGES) */}
              {activeTab === 'journey' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      6-Stage Customer Decision Journey
                    </h2>
                    <p className="text-xs text-slate-500">
                      Chronological progression detailing buyer mindset, obstacles, tactical activities, and KPIs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentAnalysis.customerJourney.map((stg) => (
                      <Card
                        key={stg.stage}
                        className="p-5 bg-white border-slate-200 shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-sparkline-midnight text-sparkline-cyan font-mono text-xs font-bold flex items-center justify-center">
                              0{stg.stageNumber}
                            </span>
                            <h3 className="text-sm font-bold text-sparkline-midnight">
                              {stg.stage}
                            </h3>
                          </div>
                          <Badge variant="cyan" size="sm">
                            {stg.recommendedChannel}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Customer Mindset
                              </span>
                              <p className="text-slate-700 leading-relaxed font-medium">
                                {stg.customerMindset}
                              </p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                                Core Question
                              </span>
                              <p className="italic text-slate-800">&ldquo;{stg.mainQuestion}&rdquo;</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-rose-700 block">
                                Possible Obstacle
                              </span>
                              <p className="text-slate-700 leading-relaxed">{stg.possibleObstacle}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-sparkline-blue block">
                                Recommended Activity & Content
                              </span>
                              <p className="font-semibold text-sparkline-midnight">
                                {stg.recommendedMarketingActivity}
                              </p>
                              <span className="text-[11px] text-slate-500 block">
                                Format: {stg.suitableContentFormat} · Target KPI: {stg.relevantKpi}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIENCE MESSAGING GENERATOR */}
              {activeTab === 'messaging' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      Segment-Specific Messaging Angles
                    </h2>
                    <p className="text-xs text-slate-500">
                      Copyable hooks and call-to-action variants tailored to distinct buyer psychology.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {currentAnalysis.messaging.map((msg) => (
                      <Card
                        key={msg.segmentId}
                        className="p-6 bg-white border-slate-200 shadow-card space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-sparkline-blue tracking-wider block">
                              Target Segment
                            </span>
                            <h3 className="text-base font-bold text-sparkline-midnight">
                              {msg.segmentName}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            Tone: <strong className="text-slate-700">{msg.recommendedToneOfVoice}</strong>
                          </span>
                        </div>

                        {/* Main Message */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-sparkline-blue tracking-wider">
                              Primary Message
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText('Primary Message', msg.mainMessage)}
                              className="text-xs text-sparkline-blue hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <p className="text-sm font-bold text-sparkline-midnight leading-snug">
                            &ldquo;{msg.mainMessage}&rdquo;
                          </p>
                        </div>

                        {/* 4 Alternative Angles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-bold text-rose-700 uppercase text-[10px] tracking-wider block">
                                Pain-Point Angle
                              </span>
                              <p className="text-slate-800 italic leading-relaxed">
                                &ldquo;{msg.alternativeAngles.painPointFocused}&rdquo;
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText('Pain Point Angle', msg.alternativeAngles.painPointFocused)
                              }
                              className="text-[11px] text-slate-500 hover:text-sparkline-blue flex items-center gap-1 self-start pt-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Angle</span>
                            </button>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">
                                Benefit-Focused Angle
                              </span>
                              <p className="text-slate-800 italic leading-relaxed">
                                &ldquo;{msg.alternativeAngles.benefitFocused}&rdquo;
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText('Benefit Angle', msg.alternativeAngles.benefitFocused)
                              }
                              className="text-[11px] text-slate-500 hover:text-sparkline-blue flex items-center gap-1 self-start pt-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Angle</span>
                            </button>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-bold text-purple-800 uppercase text-[10px] tracking-wider block">
                                Emotional Aspiration Angle
                              </span>
                              <p className="text-slate-800 italic leading-relaxed">
                                &ldquo;{msg.alternativeAngles.emotionalAngle}&rdquo;
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText('Emotional Angle', msg.alternativeAngles.emotionalAngle)
                              }
                              className="text-[11px] text-slate-500 hover:text-sparkline-blue flex items-center gap-1 self-start pt-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Angle</span>
                            </button>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-bold text-cyan-800 uppercase text-[10px] tracking-wider block">
                                Educational Mechanism Angle
                              </span>
                              <p className="text-slate-800 italic leading-relaxed">
                                &ldquo;{msg.alternativeAngles.educationalAngle}&rdquo;
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  'Educational Angle',
                                  msg.alternativeAngles.educationalAngle
                                )
                              }
                              className="text-[11px] text-slate-500 hover:text-sparkline-blue flex items-center gap-1 self-start pt-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Angle</span>
                            </button>
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-bold text-slate-500 text-[11px] uppercase mr-2">
                            Suggested CTAs:
                          </span>
                          {msg.callToActionExamples.map((cta, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleCopyText('CTA', cta)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
                            >
                              <span>{cta}</span>
                              <Copy className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIENCE CHANNEL RECOMMENDATIONS */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      Channel Fit & Platform Behavior
                    </h2>
                    <p className="text-xs text-slate-500">
                      Evaluated against the audience&apos;s purchasing psychology and information habits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentAnalysis.channels.map((ch, idx) => (
                      <Card
                        key={idx}
                        className="p-5 bg-white border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-sparkline-midnight">
                              {ch.channelName}
                            </h3>
                            <Badge variant="blue" size="sm">
                              {ch.funnelStageSupported}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed">
                            {ch.suitabilityReason}
                          </p>

                          <div className="p-2.5 rounded-lg bg-slate-50 text-xs space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Audience Platform Behavior
                            </span>
                            <p className="text-slate-600 leading-snug">
                              {ch.targetAudienceBehavior}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-blue-50/50 text-xs space-y-1">
                            <span className="text-[10px] uppercase font-bold text-sparkline-blue block">
                              High-Impact Creative Format
                            </span>
                            <p className="text-slate-800 font-medium leading-snug">
                              {ch.effectiveContent}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700">Target KPIs:</span>
                            <span className="truncate max-w-[150px]">{ch.recommendedKpis[0]}</span>
                          </div>
                          {ch.isAssumption && (
                            <span className="text-[10px] text-amber-700 italic block">
                              * Unverified channel usage hypothesis
                            </span>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: ASSUMPTIONS & LIMITATIONS */}
              {activeTab === 'assumptions' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      Model Assumptions & Empirical Research Roadmap
                    </h2>
                    <p className="text-xs text-slate-500">
                      Transparent delineation of unverified assumptions and data prerequisites.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Unverified Assumptions */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <HelpCircle className="w-4 h-4 text-sparkline-blue" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Unverified Assumptions
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {currentAnalysis.unverifiedAssumptions.map((assump, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue mt-1.5 shrink-0" />
                            <span>{assump}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Limitations & Research Needs */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <ShieldAlert className="w-4 h-4 text-sparkline-orange" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Empirical Research Prerequisites
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {currentAnalysis.limitationsAndMissingData.map((lim, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sparkline-orange mt-1.5 shrink-0" />
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  {/* Quality & Epistemic Boundaries Notice */}
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                    <strong>Epistemic Transparency Notice:</strong> Sparkline Marketing strictly prohibits
                    the fabrication of customer survey figures, demographic percentages, or statistical
                    certainties. All customer personas are fictional archetypes synthesized to structure marketing
                    hypotheses for empirical validation.
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Saved Personas Library Modal */}
      {showSavedPersonasModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-sparkline-purple" />
                <h3 className="text-base font-bold text-sparkline-midnight">
                  Saved Customer Personas ({savedPersonas.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedPersonasModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                Close
              </button>
            </div>

            {savedPersonas.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                No customer personas saved yet. Click &quot;Save Persona&quot; on any persona card in the Personas tab to bookmark them here.
              </p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {savedPersonas.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-sparkline-midnight block">
                        {p.personaName} ({p.segmentName})
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-md">
                        {p.tagline}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        audienceService.deleteSavedPersona(p.id);
                        setSavedPersonas(audienceService.getSavedPersonas());
                        addToast({
                          title: 'Persona Removed',
                          message: `Removed ${p.personaName} from saved collection.`,
                          type: 'info',
                        });
                      }}
                      className="text-xs text-rose-600 hover:underline shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedPersonasModal(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

