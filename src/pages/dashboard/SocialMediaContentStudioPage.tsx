/**
 * Social Media & Content Creation Studio
 * Sparkline Marketing Intelligence Platform — Phase 17
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import {
  contentService,
  CONTENT_TEMPLATES,
} from '@/services/content.service';
import {
  SocialPlatform,
  ContentObjective,
  ContentFormat,
  ContentStatus,
  BrandVoiceTone,
  ContentCategory,
  ContentLanguage,
  VideoDurationType,
  SocialMediaPost,
  ContentVariation,
  ContentIdea,
  ContentTemplate,
  HashtagResult,
  VideoScript,
  CarouselContent,
  ContentPerformance,
  SocialPlatformConnection,
  RepurposedOutput,
  CaptionActionType,
  CaptionAssistResult,
  BrandVoice,
} from '@/types/content';
import { MarketingProject } from '@/types/project';
import {
  Share2,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Target,
  Video,
  Layers,
  Repeat,
  Hash,
  Wand2,
  Heart,
  ShieldCheck,
  Edit,
  Sliders,
  Play,
  Lightbulb,
} from 'lucide-react';

const PLATFORMS: SocialPlatform[] = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Pinterest',
  'X',
];

const OBJECTIVES: ContentObjective[] = [
  'Brand Awareness',
  'Engagement',
  'Website Traffic',
  'Lead Generation',
  'Sales',
  'Customer Education',
  'Community Building',
  'Customer Retention',
];

const FORMATS: ContentFormat[] = [
  'Educational',
  'Promotional',
  'Informational',
  'Storytelling',
  'Problem-Solution',
  'Product Showcase',
  'Behind-the-Scenes',
  'Customer Education',
  'Brand Awareness',
  'Engagement Post',
  'Announcement',
];

const CATEGORIES: ContentCategory[] = [
  'Educational',
  'Promotional',
  'Entertaining',
  'Inspirational',
  'Conversational',
  'Authority Building',
  'Community Building',
];

const TONES: BrandVoiceTone[] = [
  'Professional',
  'Friendly',
  'Conversational',
  'Educational',
  'Bold',
  'Luxury',
  'Minimal',
  'Playful',
  'Custom',
];

const STATUSES: ContentStatus[] = [
  'Idea',
  'Draft',
  'Ready for Review',
  'Approved',
  'Scheduled',
  'Published',
  'Archived',
];

const LANGUAGES: ContentLanguage[] = ['English', 'Urdu', 'Roman Urdu'];

export const SocialMediaContentStudioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  // Active Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'generator'
    | 'calendar'
    | 'ideas'
    | 'assistant'
    | 'hashtags'
    | 'repurpose'
    | 'scripts'
    | 'templates'
    | 'saved'
    | 'voice'
  >('generator');

  // Project Context
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');

  // Posts & Ideas
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [platformConnections, setPlatformConnections] = useState<SocialPlatformConnection[]>([]);

  // Generation Controls
  const [genPlatform, setGenPlatform] = useState<SocialPlatform>('Instagram');
  const [genFormat, setGenFormat] = useState<ContentFormat>('Educational');
  const [genObjective, setGenObjective] = useState<ContentObjective>('Engagement');
  const [genTopic, setGenTopic] = useState<string>('');
  const [genTone, setGenTone] = useState<BrandVoiceTone>('Professional');
  const [genLanguage, setGenLanguage] = useState<ContentLanguage>('English');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedVariations, setGeneratedVariations] = useState<ContentVariation[]>([]);

  // Idea Generator Controls
  const [ideaCategory, setIdeaCategory] = useState<ContentCategory>('Educational');
  const [ideaPlatform, setIdeaPlatform] = useState<SocialPlatform>('Instagram');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);

  // Caption Assistant Controls
  const [assistText, setAssistText] = useState<string>(
    'Stop calculating marketing ROI in messy spreadsheets. Here is how to verify break-even ROAS before spending ad dollars.'
  );
  const [assistAction, setAssistAction] = useState<CaptionActionType>('improve_hook');
  const [assistTone, setAssistTone] = useState<string>('Professional');
  const [assistLanguage, setAssistLanguage] = useState<ContentLanguage>('English');
  const [isAssisting, setIsAssisting] = useState<boolean>(false);
  const [assistResult, setAssistResult] = useState<CaptionAssistResult | null>(null);

  // Hashtag Tool Controls
  const [hashTopic, setHashTopic] = useState<string>('Skincare Routine');
  const [hashIndustry, setHashIndustry] = useState<string>('Beauty & Wellness');
  const [hashPlatform, setHashPlatform] = useState<SocialPlatform>('Instagram');
  const [hashAudience, setHashAudience] = useState<string>('Skincare enthusiasts');
  const [hashtagResult, setHashtagResult] = useState<HashtagResult | null>(null);

  // Repurpose Controls
  const [repurposeSourceText, setRepurposeSourceText] = useState<string>(
    'In 2026, ad targeting is primarily performed by the creative hook rather than manual demographic toggles. Brands that succeed deploy 6 diverse messaging angles (benefit, problem-solution, emotional, promotional, educational, and trust-building) while calculating strict break-even ROAS based on gross margin percentages.'
  );
  const [repurposeSourceType, setRepurposeSourceType] = useState<string>('Blog Article');
  const [repurposePlatforms, setRepurposePlatforms] = useState<SocialPlatform[]>([
    'LinkedIn',
    'Instagram',
    'TikTok',
    'X',
  ]);
  const [repurposedOutputs, setRepurposedOutputs] = useState<RepurposedOutput[]>([]);

  // Video Script & Carousel Controls
  const [scriptSubTab, setScriptSubTab] = useState<'video' | 'carousel'>('video');
  const [videoTitle, setVideoTitle] = useState<string>('How to Fix Your Ad Fatigue in 30 Seconds');
  const [videoDuration, setVideoDuration] = useState<VideoDurationType>('Short (15-30s)');
  const [videoPlatform, setVideoPlatform] = useState<SocialPlatform>('TikTok');
  const [videoCoreMessage, setVideoCoreMessage] = useState<string>('Ad creative fatigue and audience saturation');
  const [videoCta, setVideoCta] = useState<string>('Follow for daily growth tips & test our free studio!');
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);

  const [carouselTitle, setCarouselTitle] = useState<string>('The 5-Step Unit Economics Audit');
  const [carouselTopic, setCarouselTopic] = useState<string>('Marketing Budget');
  const [carouselAudience, setCarouselAudience] = useState<string>('Founders & Growth Marketers');
  const [carouselSlidesCount, setCarouselSlidesCount] = useState<number>(5);
  const [generatedCarousel, setGeneratedCarousel] = useState<CarouselContent | null>(null);

  // Brand Voice State
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(() => contentService.getBrandVoice());

  // Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);

  // Performance Log Modal State
  const [isPerfModalOpen, setIsPerfModalOpen] = useState<boolean>(false);
  const [perfPostTarget, setPerfPostTarget] = useState<SocialMediaPost | null>(null);
  const [perfForm, setPerfForm] = useState<Partial<ContentPerformance>>({
    reach: 5000,
    impressions: 7200,
    likes: 320,
    comments: 28,
    shares: 45,
    saves: 95,
    clicks: 140,
    views: 4500,
    linkClicks: 85,
    leads: 12,
    conversions: 4,
    dataSource: 'manual_entry',
  });

  // Calendar Controls
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list'>('month');
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date(2026, 10, 14)); // Nov 2026

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    const pList = projectService.getProjects();
    setProjects(pList);

    const paramProj = searchParams.get('projectId');
    if (paramProj && pList.some((p) => p.id === paramProj)) {
      setSelectedProjectId(paramProj);
    }

    const postList = contentService.getPosts();
    setPosts(postList);

    const ideaList = contentService.getIdeas();
    setIdeas(ideaList);

    const connections = contentService.getPlatformConnections();
    setPlatformConnections(connections);

    // Initial default hashtag setup
    setHashtagResult(
      contentService.generateHashtags('Growth Marketing', 'SaaS', 'Instagram', 'Growth Marketers')
    );

    // Initial video script & carousel
    setGeneratedScript(
      contentService.generateVideoScript(
        'How to Fix Your Ad Fatigue in 30 Seconds',
        'TikTok',
        'Short (15-30s)',
        'creative hook saturation',
        'Follow for daily growth tips & link in bio!'
      )
    );

    setGeneratedCarousel(
      contentService.generateCarouselContent(
        'The 5-Step Unit Economics Audit',
        'Instagram',
        'Marketing Budget',
        'Founders & Growth Marketers',
        5
      )
    );
  }, [searchParams]);

  // Update brand voice when project changes
  useEffect(() => {
    setBrandVoice(contentService.getBrandVoice(selectedProjectId));
  }, [selectedProjectId]);

  // Active Project Context
  const activeProject = useMemo(() => {
    if (selectedProjectId === 'All') return projects[0] || null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchProj = selectedProjectId === 'All' || p.projectId === selectedProjectId;
      const matchPlatform = filterPlatform === 'All' || p.platform === filterPlatform;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.openingHook.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchPlatform && matchStatus && matchSearch;
    });
  }, [posts, selectedProjectId, filterPlatform, filterStatus, searchQuery]);

  // Scheduled Calendar Items
  const calendarPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchProj = selectedProjectId === 'All' || p.projectId === selectedProjectId;
      const matchPlatform = filterPlatform === 'All' || p.platform === filterPlatform;
      const hasDate = Boolean(p.scheduledDate);
      return matchProj && matchPlatform && hasDate;
    });
  }, [posts, selectedProjectId, filterPlatform]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const projPosts = selectedProjectId === 'All' ? posts : posts.filter((p) => p.projectId === selectedProjectId);
    const scheduled = projPosts.filter((p) => p.status === 'Scheduled').length;
    const published = projPosts.filter((p) => p.status === 'Published').length;
    const postsWithPerf = projPosts.filter((p) => p.performance && p.performance.reach > 0);

    const avgEngagement =
      postsWithPerf.length > 0
        ? Number(
            (
              postsWithPerf.reduce((acc, p) => acc + (p.performance?.engagementRate || 0), 0) /
              postsWithPerf.length
            ).toFixed(2)
          )
        : null;

    const totalReach = postsWithPerf.reduce((acc, p) => acc + (p.performance?.reach || 0), 0);

    return {
      totalPosts: projPosts.length,
      scheduled,
      published,
      avgEngagement,
      totalReach,
      totalIdeas: ideas.length,
    };
  }, [posts, ideas, selectedProjectId]);

  // Handlers
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Content text ready to paste.',
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateVariations = async () => {
    setIsGenerating(true);
    try {
      const vars = await contentService.generateSocialPosts(
        activeProject,
        genPlatform,
        genFormat,
        genObjective,
        genTopic,
        genTone,
        genLanguage
      );
      setGeneratedVariations(vars);
      addToast({
        type: 'success',
        title: 'Content Generated',
        message: `Produced ${vars.length} platform-tailored variations with character validation.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate variations. Using fallback templates.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const generated = await contentService.generateContentIdeas(
        activeProject,
        ideaCategory,
        ideaPlatform,
        genObjective,
        genTone
      );
      setIdeas(generated);
      addToast({
        type: 'success',
        title: 'Content Ideas Generated',
        message: `Created ${generated.length} fresh ideas grounded in ${ideaCategory} strategy.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Idea Generation Error',
        message: 'Using default creative catalog.',
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleAssistCaption = async () => {
    if (!assistText.trim()) return;
    setIsAssisting(true);
    try {
      const res = await contentService.assistCaption(
        assistText,
        assistAction,
        assistTone,
        assistLanguage
      );
      setAssistResult(res);
      addToast({
        type: 'success',
        title: 'Caption Enhanced',
        message: `Action "${assistAction}" completed successfully.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Assistant Error',
        message: 'Unable to enhance text.',
      });
    } finally {
      setIsAssisting(false);
    }
  };

  const handleGenerateHashtags = () => {
    const res = contentService.generateHashtags(
      hashTopic,
      hashIndustry,
      hashPlatform,
      hashAudience
    );
    setHashtagResult(res);
    addToast({
      type: 'info',
      title: 'Hashtag Clusters Generated',
      message: 'Broad, Niche, Product, and Audience tags categorized.',
    });
  };

  const handleRepurpose = () => {
    if (!repurposeSourceText.trim()) return;
    const outputs = contentService.repurposeContent(
      repurposeSourceText,
      repurposeSourceType,
      repurposePlatforms,
      genTone
    );
    setRepurposedOutputs(outputs);
    addToast({
      type: 'success',
      title: 'Content Repurposed',
      message: `Generated ${outputs.length} multi-platform adaptations preserving core message.`,
    });
  };

  const handleGenerateScript = () => {
    const script = contentService.generateVideoScript(
      videoTitle,
      videoPlatform,
      videoDuration,
      videoCoreMessage,
      videoCta
    );
    setGeneratedScript(script);
    addToast({
      type: 'success',
      title: 'Video Script Built',
      message: `${videoDuration} script outline with scene-by-scene timing created.`,
    });
  };

  const handleGenerateCarousel = () => {
    const car = contentService.generateCarouselContent(
      carouselTitle,
      'Instagram',
      carouselTopic,
      carouselAudience,
      carouselSlidesCount
    );
    setGeneratedCarousel(car);
    addToast({
      type: 'success',
      title: 'Carousel Outlined',
      message: `${carouselSlidesCount}-slide carousel with visual direction and cover created.`,
    });
  };

  const handleConvertIdea = (ideaId: string) => {
    const newPost = contentService.convertIdeaToPost(ideaId);
    if (newPost) {
      setPosts(contentService.getPosts());
      setIdeas(contentService.getIdeas());
      addToast({
        type: 'success',
        title: 'Idea Converted to Post',
        message: `Draft created: "${newPost.title}".`,
      });
      setActiveTab('saved');
    }
  };

  const handleSaveVariationAsPost = (variation: ContentVariation) => {
    const newPost: SocialMediaPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      projectId: activeProject?.id || 'default',
      title: `${variation.platform} ${variation.format}: ${variation.openingHook.slice(0, 35)}...`,
      platform: variation.platform,
      format: variation.format,
      objective: genObjective,
      targetAudience: activeProject?.audience?.targetLocations?.join(', ') || 'Target Audience',
      caption: variation.caption,
      openingHook: variation.openingHook,
      mainMessage: variation.mainMessage,
      callToAction: variation.callToAction,
      hashtags: variation.hashtags,
      suggestedVisual: variation.visualDirection,
      status: 'Draft',
      characterCount: variation.characterCount,
      isAiGenerated: true,
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contentService.savePost(newPost);
    setPosts(contentService.getPosts());
    addToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'Variation saved to your Posts Library.',
    });
  };

  const handleUseTemplate = (tmpl: ContentTemplate) => {
    setGenPlatform(tmpl.platform);
    setGenFormat(tmpl.format);
    setAssistText(tmpl.templateCaption);
    addToast({
      type: 'info',
      title: 'Template Selected',
      message: `Loaded "${tmpl.name}" into workspace.`,
    });
    setActiveTab('generator');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      contentService.deletePost(id);
      setPosts(contentService.getPosts());
      addToast({
        type: 'info',
        title: 'Post Removed',
        message: 'Content record deleted.',
      });
    }
  };

  const handleDuplicatePost = (id: string) => {
    const clone = contentService.duplicatePost(id);
    if (clone) {
      setPosts(contentService.getPosts());
      addToast({
        type: 'success',
        title: 'Post Duplicated',
        message: `Created draft copy: "${clone.title}".`,
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: ContentStatus) => {
    contentService.updatePostStatus(id, newStatus);
    setPosts(contentService.getPosts());
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Marked as ${newStatus}.`,
    });
  };

  const handleSavePerformance = () => {
    if (!perfPostTarget) return;
    const computed = contentService.calculatePerformance({
      ...perfForm,
      postId: perfPostTarget.id,
    });
    const updatedPost = { ...perfPostTarget, performance: computed };
    contentService.savePost(updatedPost);
    setPosts(contentService.getPosts());
    setIsPerfModalOpen(false);
    addToast({
      type: 'success',
      title: 'Performance Logged',
      message: `Engagement Rate: ${computed.engagementRate}% | CTR: ${computed.ctr}%.`,
    });
  };

  const handleExportCsv = () => {
    const csv = contentService.exportPostsCsv(filteredPosts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sparkline-content-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Content schedule and performance records downloaded.',
    });
  };

  // Calendar Helpers (Month View)
  const monthDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number | null; dateString: string | null }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateString: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateString: dateStr });
    }
    return days;
  }, [currentCalendarDate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      <SEO
        title="Social Media & Content Studio | Sparkline Marketing"
        description="Create strategic content, generate platform-ready ideas and organize your brand's content workflow in one place."
      />

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sparkline-blue/10 text-sparkline-blue">
              <Share2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-sparkline-blue font-mono">
              PHASE 17 &bull; CONTENT WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Social Media & Content Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Create strategic content, generate platform-ready ideas and organize your brand's content workflow in one place.
          </p>
        </div>

        {/* Project Selector & Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs text-xs">
            <span className="text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent font-bold text-sparkline-midnight focus:outline-none cursor-pointer"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.business.brandName}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="gap-1.5 text-xs h-9"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingPost({
                id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                projectId: activeProject?.id || 'default',
                title: 'New Social Post',
                platform: genPlatform,
                format: genFormat,
                objective: genObjective,
                targetAudience: activeProject?.audience?.targetLocations?.join(', ') || 'Target Audience',
                caption: '',
                openingHook: '',
                mainMessage: '',
                callToAction: '',
                hashtags: ['#Marketing', '#Strategy'],
                suggestedVisual: '',
                status: 'Draft',
                characterCount: 0,
                isAiGenerated: false,
                versions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              setIsPostModalOpen(true);
            }}
            className="gap-1.5 text-xs h-9"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Button>
        </div>
      </div>

      {/* METRICS & PLANNING NOTICE BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Posts
          </span>
          <span className="text-xl font-extrabold text-sparkline-midnight mt-0.5 block">
            {summaryMetrics.totalPosts}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Scheduled
          </span>
          <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">
            {summaryMetrics.scheduled}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Published
          </span>
          <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">
            {summaryMetrics.published}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Content Ideas
          </span>
          <span className="text-xl font-extrabold text-purple-600 mt-0.5 block">
            {summaryMetrics.totalIdeas}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Engagement
          </span>
          <span className="text-xl font-extrabold text-sparkline-midnight mt-0.5 block">
            {summaryMetrics.avgEngagement !== null ? `${summaryMetrics.avgEngagement}%` : '—'}
          </span>
          <span className="text-[10px] text-slate-400">
            {summaryMetrics.avgEngagement !== null ? 'verified logs' : 'no data logged yet'}
          </span>
        </div>

        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-sparkline-blue shrink-0" />
            <span>Studio Mode</span>
          </div>
          <span className="text-[11px] text-blue-900 leading-tight">
            Safe Offline Planning &bull; No unverified live publishing
          </span>
        </div>
      </div>

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
        {[
          { id: 'generator', label: 'Post Generator', icon: Sparkles },
          { id: 'calendar', label: 'Content Calendar', icon: CalendarIcon },
          { id: 'ideas', label: 'Idea Generator', icon: Lightbulb },
          { id: 'assistant', label: 'Copywriting Assistant', icon: Wand2 },
          { id: 'hashtags', label: 'Hashtag Assistant', icon: Hash },
          { id: 'repurpose', label: 'Content Repurposing', icon: Repeat },
          { id: 'scripts', label: 'Video & Carousels', icon: Video },
          { id: 'templates', label: 'Templates Library', icon: Layers },
          { id: 'saved', label: 'Saved Posts & Tracking', icon: FileText },
          { id: 'voice', label: 'Brand Voice & Channels', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-sparkline-blue text-sparkline-blue font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: POST GENERATOR & WORKSPACE
      ========================================================================= */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          {/* Strategy Context Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sparkline-blue" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Content Strategy Parameters & Intelligence Grounding
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Grounding in: {activeProject?.business?.brandName || 'Sparkline Marketing'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Platform</label>
                <select
                  value={genPlatform}
                  onChange={(e) => setGenPlatform(e.target.value as SocialPlatform)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content Format</label>
                <select
                  value={genFormat}
                  onChange={(e) => setGenFormat(e.target.value as ContentFormat)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marketing Objective</label>
                <select
                  value={genObjective}
                  onChange={(e) => setGenObjective(e.target.value as ContentObjective)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                >
                  {OBJECTIVES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Language</label>
                <select
                  value={genLanguage}
                  onChange={(e) => setGenLanguage(e.target.value as ContentLanguage)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Topic, Promotion, or Core Message (Optional)
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Stop calculating ROI in Excel &bull; 5-step break-even audit"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Voice Tone</label>
                <select
                  value={genTone}
                  onChange={(e) => setGenTone(e.target.value as BrandVoiceTone)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateVariations}
                  disabled={isGenerating}
                  className="w-full h-[38px] gap-2 justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Synthesizing...' : 'Generate 3 Variations'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Generated Variations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sparkline-midnight text-sm">
                Generated Platform Variations ({genPlatform} &bull; {genFormat})
              </h3>
              <span className="text-xs text-slate-400">
                Grounded in genuine business models &bull; Zero fabricated testimonials
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(generatedVariations.length > 0
                ? generatedVariations
                : contentService.generateDefaultPostVariations(
                    activeProject?.business?.brandName || 'Sparkline Marketing',
                    activeProject?.products[0]?.name || 'Intelligence Suite',
                    genPlatform,
                    genFormat,
                    genObjective,
                    genTopic || 'Strategic Marketing',
                    genTone,
                    genLanguage
                  )
              ).map((v, i) => (
                <div
                  key={v.id || i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
                >
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                        Variation #{i + 1} &bull; {v.format}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {v.characterCount} chars
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Hook
                      </span>
                      <h4 className="text-sm font-bold text-sparkline-midnight">
                        {v.openingHook}
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Caption Body
                      </span>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px]">
                        {v.caption}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px] text-slate-700 space-y-1">
                      <div>
                        <strong>CTA:</strong> {v.callToAction}
                      </div>
                      <div className="text-slate-500 italic">
                        <strong>Visual:</strong> {v.visualDirection}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {v.hashtags.map((h) => (
                        <span
                          key={h}
                          className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText(v.id, v.caption)}
                      className="flex-1 text-xs gap-1 justify-center"
                    >
                      {copiedId === v.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSaveVariationAsPost(v)}
                      className="flex-1 text-xs gap-1 justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Draft</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CONTENT CALENDAR
      ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Header Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-sparkline-blue rounded-xl">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-sparkline-midnight text-base">
                  {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <span className="text-xs text-slate-400">
                  {calendarPosts.length} posts scheduled &bull; Offline Calendar Planner
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setCalendarView('month')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    calendarView === 'month' ? 'bg-white shadow-xs text-sparkline-midnight font-bold' : 'text-slate-500'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setCalendarView('list')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    calendarView === 'list' ? 'bg-white shadow-xs text-sparkline-midnight font-bold' : 'text-slate-500'
                  }`}
                >
                  List
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prev = new Date(currentCalendarDate);
                  prev.setMonth(prev.getMonth() - 1);
                  setCurrentCalendarDate(prev);
                }}
                className="p-2 h-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentCalendarDate(new Date(2026, 10, 14))}
                className="text-xs h-8"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = new Date(currentCalendarDate);
                  next.setMonth(next.getMonth() + 1);
                  setCurrentCalendarDate(next);
                }}
                className="p-2 h-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {calendarView === 'list' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Upcoming Scheduled Content ({calendarPosts.length})
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {calendarPosts.length === 0 ? (
                  <p className="text-slate-400 py-4">No content scheduled for this period.</p>
                ) : (
                  calendarPosts.map((cp) => (
                    <div key={cp.id} className="py-3 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sparkline-midnight block">{cp.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {cp.scheduledDate} {cp.scheduledTime || ''} &bull; {cp.platform} &bull; {cp.format}
                        </span>
                      </div>
                      <Badge variant="blue" size="sm">
                        {cp.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Month Calendar Grid */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5 text-xs font-bold text-slate-600">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
              {monthDays.map((d, index) => {
                if (!d.dayNumber) {
                  return <div key={`empty-${index}`} className="min-h-[110px] bg-slate-50/40 p-2" />;
                }

                const dayPosts = calendarPosts.filter((p) => p.scheduledDate === d.dateString);

                return (
                  <div
                    key={d.dateString}
                    className="min-h-[110px] p-2 flex flex-col justify-between hover:bg-blue-50/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      setEditingPost({
                        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        projectId: activeProject?.id || 'default',
                        title: `Post for ${d.dateString}`,
                        platform: genPlatform,
                        format: genFormat,
                        objective: genObjective,
                        targetAudience: activeProject?.audience?.targetLocations?.join(', ') || 'Target Audience',
                        caption: '',
                        openingHook: '',
                        mainMessage: '',
                        callToAction: '',
                        hashtags: ['#Marketing', '#Strategy'],
                        suggestedVisual: '',
                        status: 'Scheduled',
                        scheduledDate: d.dateString || undefined,
                        scheduledTime: '10:00',
                        characterCount: 0,
                        isAiGenerated: false,
                        versions: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      });
                      setIsPostModalOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 font-mono">
                        {d.dayNumber}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[75px] scrollbar-none">
                      {dayPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPost(post);
                            setIsPostModalOpen(true);
                          }}
                          className="px-1.5 py-1 rounded bg-blue-50 border border-blue-200/80 text-[10px] font-semibold text-sparkline-midnight truncate flex items-center justify-between hover:bg-blue-100"
                        >
                          <span className="truncate">{post.title}</span>
                          <span className="text-[9px] font-bold text-sparkline-blue uppercase ml-1 shrink-0">
                            {post.platform.slice(0, 2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div />
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: CONTENT IDEA GENERATOR
      ========================================================================= */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sparkline-midnight text-sm">
                Strategic Content Idea Generator
              </h3>
              <p className="text-xs text-slate-500">
                Ground ideas in your product, industry, target customer motivations, and objective.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={ideaPlatform}
                onChange={(e) => setIdeaPlatform(e.target.value as SocialPlatform)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={ideaCategory}
                onChange={(e) => setIdeaCategory(e.target.value as ContentCategory)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c} Ideas
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateIdeas}
                disabled={isGeneratingIdeas}
                className="gap-1.5 text-xs h-9"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingIdeas ? 'Brainstorming...' : 'Generate Ideas'}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
              >
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">
                      {idea.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {idea.suggestedPlatform}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-sparkline-midnight">
                    {idea.title}
                  </h4>

                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    <strong>Concept:</strong> {idea.coreConcept}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                    <div>
                      <strong>Hook:</strong> <span className="italic">"{idea.hook}"</span>
                    </div>
                    <div>
                      <strong>Takeaway:</strong> {idea.mainMessage}
                    </div>
                    <div className="text-slate-500">
                      <strong>Visual Idea:</strong> {idea.suggestedVisual}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConvertIdea(idea.id)}
                    className="w-full text-xs gap-1.5 justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Convert to Post</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      contentService.deleteIdea(idea.id);
                      setIdeas(contentService.getIdeas());
                    }}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CAPTION & COPYWRITING ASSISTANT
      ========================================================================= */}
      {activeTab === 'assistant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input & Action Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-sparkline-blue" />
                  <h3 className="font-extrabold text-sparkline-midnight text-sm">
                    Caption Input & Transformation
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {assistText.length} characters
                </span>
              </div>

              <textarea
                rows={6}
                value={assistText}
                onChange={(e) => setAssistText(e.target.value)}
                placeholder="Enter or paste any caption or post draft..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action</label>
                  <select
                    value={assistAction}
                    onChange={(e) => setAssistAction(e.target.value as CaptionActionType)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="improve_hook">Improve Hook</option>
                    <option value="rewrite">Rewrite & Polish</option>
                    <option value="shorten">Shorten</option>
                    <option value="expand">Expand With Depth</option>
                    <option value="add_cta">Add Strong CTA</option>
                    <option value="change_tone">Change Tone</option>
                    <option value="translate_urdu">Translate to Urdu</option>
                    <option value="translate_roman_urdu">Translate to Roman Urdu</option>
                    <option value="translate_english">Translate to English</option>
                    <option value="improve_readability">Improve Readability</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tone</label>
                  <select
                    value={assistTone}
                    onChange={(e) => setAssistTone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={assistLanguage}
                    onChange={(e) => setAssistLanguage(e.target.value as ContentLanguage)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleAssistCaption}
                disabled={isAssisting}
                className="w-full gap-2 justify-center text-xs h-10"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAssisting ? 'Transforming...' : 'Enhance Copy'}</span>
              </Button>
            </div>

            {/* Output Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-extrabold text-sparkline-midnight text-sm">
                    Enhanced Result
                  </h3>
                </div>
                {assistResult && (
                  <span className="text-[11px] font-mono text-emerald-600">
                    {assistResult.charDifference >= 0
                      ? `+${assistResult.charDifference}`
                      : assistResult.charDifference}{' '}
                    chars
                  </span>
                )}
              </div>

              {assistResult ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl whitespace-pre-line text-slate-800 font-mono text-[11px] leading-relaxed">
                    {assistResult.enhancedText}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyText('assist-main', assistResult.enhancedText)}
                      className="gap-1.5 text-xs"
                    >
                      {copiedId === 'assist-main' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Enhanced Copy</span>
                    </Button>
                  </div>

                  {assistResult.alternativeVariations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Alternative Angles
                      </span>
                      {assistResult.alternativeVariations.map((alt, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 text-[11px] flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{alt}</span>
                          <button
                            onClick={() => handleCopyText(`alt-${i}`, alt)}
                            className="p-1 text-slate-400 hover:text-sparkline-blue shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Wand2 className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs">
                    Choose an action on the left and click "Enhance Copy" to view rewritten, shortened, or translated variations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: HASHTAG & KEYWORD WORKSPACE
      ========================================================================= */}
      {activeTab === 'hashtags' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-sparkline-blue" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Strategic Hashtag Research & Cluster Generator
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Transparent AI Recommendations &bull; No fabricated search volume claims
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Core Topic</label>
                <input
                  type="text"
                  value={hashTopic}
                  onChange={(e) => setHashTopic(e.target.value)}
                  placeholder="e.g. Break-Even ROAS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={hashIndustry}
                  onChange={(e) => setHashIndustry(e.target.value)}
                  placeholder="e.g. SaaS, E-commerce"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Platform</label>
                <select
                  value={hashPlatform}
                  onChange={(e) => setHashPlatform(e.target.value as SocialPlatform)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={hashAudience}
                  onChange={(e) => setHashAudience(e.target.value)}
                  placeholder="e.g. CMOs, Founders"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateHashtags}
                  className="w-full h-[38px] gap-1.5 justify-center"
                >
                  <Hash className="w-4 h-4" />
                  <span>Generate Clusters</span>
                </Button>
              </div>
            </div>
          </div>

          {hashtagResult && (
            <div className="space-y-6">
              {/* Ready-to-Copy Set */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Recommended Balanced Set:</span>
                  <span className="font-mono text-sparkline-blue font-semibold mt-0.5 block">
                    {hashtagResult.suggestedSetString}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyText('hash-set', hashtagResult.suggestedSetString)}
                  className="gap-1.5 text-xs shrink-0"
                >
                  {copiedId === 'hash-set' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Complete Set</span>
                </Button>
              </div>

              {/* Categorized Clusters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Broad Topic Hashtags', tags: hashtagResult.broadTags, color: 'blue' },
                  { title: 'Niche Community Hashtags', tags: hashtagResult.nicheTags, color: 'purple' },
                  { title: 'Product & Tool Hashtags', tags: hashtagResult.productTags, color: 'emerald' },
                  { title: 'Audience & Identity Hashtags', tags: hashtagResult.audienceTags, color: 'amber' },
                ].map((cluster) => (
                  <div
                    key={cluster.title}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{cluster.title}</span>
                      <button
                        onClick={() =>
                          handleCopyText(
                            cluster.title,
                            cluster.tags.map((t) => t.tag).join(' ')
                          )
                        }
                        className="text-slate-400 hover:text-sparkline-blue text-[11px] font-semibold"
                      >
                        Copy Group
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cluster.tags.map((t) => (
                        <span
                          key={t.tag}
                          className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-mono text-[11px] text-slate-700"
                        >
                          {t.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: CONTENT REPURPOSING STUDIO
      ========================================================================= */}
      {activeTab === 'repurpose' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-sparkline-blue" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Omni-Channel Content Repurposing Engine
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                1 Source Asset &rarr; 4+ Native Platform Adaptations
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Source Asset Type</label>
                <div className="flex items-center gap-1.5">
                  {['Blog Article', 'Webinar Notes', 'Product Description', 'Long Video Script'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRepurposeSourceType(type)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        repurposeSourceType === type
                          ? 'bg-sparkline-blue text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={repurposeSourceText}
                onChange={(e) => setRepurposeSourceText(e.target.value)}
                placeholder="Paste your source text, transcript, or article excerpt here..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Target Platforms:</span>
                  {PLATFORMS.slice(0, 5).map((p) => {
                    const isSelected = repurposePlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          if (isSelected) {
                            setRepurposePlatforms(repurposePlatforms.filter((x) => x !== p));
                          } else {
                            setRepurposePlatforms([...repurposePlatforms, p]);
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isSelected
                            ? 'bg-blue-50 border-sparkline-blue text-sparkline-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRepurpose}
                  className="gap-1.5 text-xs h-9"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Repurpose Across Channels</span>
                </Button>
              </div>
            </div>
          </div>

          {repurposedOutputs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repurposedOutputs.map((out) => (
                <div
                  key={out.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                        {out.targetPlatform} &bull; {out.targetFormat}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {out.notes}
                      </span>
                    </div>

                    <h4 className="font-bold text-sparkline-midnight text-sm">
                      {out.openingHook}
                    </h4>

                    <p className="text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px] leading-relaxed">
                      {out.content}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                      <span><strong>CTA:</strong> {out.cta}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(out.id, out.content)}
                    className="w-full gap-1.5 justify-center text-xs"
                  >
                    {copiedId === out.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy {out.targetPlatform} Adaptation</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 7: VIDEO SCRIPTS & CAROUSELS STUDIO
      ========================================================================= */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setScriptSubTab('video')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scriptSubTab === 'video'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Short-Form Video Script Generator
            </button>
            <button
              onClick={() => setScriptSubTab('carousel')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scriptSubTab === 'carousel'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Multi-Slide Carousel Builder
            </button>
          </div>

          {scriptSubTab === 'video' ? (
            <div className="space-y-6">
              {/* Video Controls */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Platform</label>
                  <select
                    value={videoPlatform}
                    onChange={(e) => setVideoPlatform(e.target.value as SocialPlatform)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="TikTok">TikTok (Vertical 9:16)</option>
                    <option value="Instagram">Instagram Reels (9:16)</option>
                    <option value="YouTube">YouTube Shorts / Long (16:9)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value as VideoDurationType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value="Short (15-30s)">Short (15-30 seconds)</option>
                    <option value="Medium (30-60s)">Medium (30-60 seconds)</option>
                    <option value="Long (60-180s)">Long (60-180 seconds)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Video Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Core Topic / Pain Point</label>
                  <input
                    type="text"
                    value={videoCoreMessage}
                    onChange={(e) => setVideoCoreMessage(e.target.value)}
                    placeholder="e.g. Ad fatigue & high CPCs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Call-To-Action (CTA)</label>
                  <input
                    type="text"
                    value={videoCta}
                    onChange={(e) => setVideoCta(e.target.value)}
                    placeholder="e.g. Follow for daily tips & link in bio"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateScript}
                    className="w-full h-[38px] gap-1.5 justify-center"
                  >
                    <Play className="w-4 h-4" />
                    <span>Generate Video Script</span>
                  </Button>
                </div>
              </div>

              {generatedScript && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-mono text-sparkline-blue uppercase tracking-wider block">
                        {generatedScript.platform} &bull; {generatedScript.targetDuration}
                      </span>
                      <h3 className="text-lg font-extrabold text-sparkline-midnight">
                        {generatedScript.title}
                      </h3>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopyText(
                          generatedScript.id,
                          generatedScript.scenes
                            .map(
                              (s) =>
                                `[Scene ${s.sceneNumber} (${s.durationSeconds}s)]\nVisual: ${s.visualDirection}\nSpoken: "${s.spokenDialogue}"\nOn-Screen: "${s.onScreenText}"`
                            )
                            .join('\n\n')
                        )
                      }
                      className="gap-1.5 text-xs"
                    >
                      {copiedId === generatedScript.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Full Script</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {generatedScript.scenes.map((scene) => (
                      <div
                        key={scene.sceneNumber}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 text-xs"
                      >
                        <div className="md:w-36 shrink-0 flex items-center md:flex-col justify-between md:justify-center p-2 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="font-extrabold text-sparkline-midnight">
                            Scene #{scene.sceneNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {scene.durationSeconds} seconds
                          </span>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Spoken Dialogue / Voiceover
                            </span>
                            <p className="font-bold text-sparkline-midnight text-sm">
                              "{scene.spokenDialogue}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-white border border-slate-100 text-slate-600">
                              <strong>Visual Direction:</strong> {scene.visualDirection}
                            </div>
                            <div className="p-2 rounded bg-white border border-slate-100 text-slate-600">
                              <strong>On-Screen Text:</strong> {scene.onScreenText}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Carousel Controls */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Carousel Title</label>
                  <input
                    type="text"
                    value={carouselTitle}
                    onChange={(e) => setCarouselTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={carouselTopic}
                    onChange={(e) => setCarouselTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={carouselAudience}
                    onChange={(e) => setCarouselAudience(e.target.value)}
                    placeholder="e.g. Founders & Marketers"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slide Count</label>
                  <select
                    value={carouselSlidesCount}
                    onChange={(e) => setCarouselSlidesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  >
                    <option value={4}>4 Slides (Compact)</option>
                    <option value={5}>5 Slides (Standard)</option>
                    <option value={6}>6 Slides (Comprehensive)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateCarousel}
                    className="w-full h-[38px] gap-1.5 justify-center"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Build Carousel</span>
                  </Button>
                </div>
              </div>

              {generatedCarousel && (
                <div className="space-y-6">
                  {/* Live Slide Preview Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Cover Slide */}
                    <div className="aspect-square bg-sparkline-midnight text-white p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-card">
                      <span className="text-[10px] font-mono text-sparkline-blue uppercase">
                        Slide 1 &bull; Cover
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold leading-snug">
                          {generatedCarousel.coverSlide.heading}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {generatedCarousel.coverSlide.subtitle}
                        </p>
                      </div>
                      <span className="text-[10px] text-right text-sparkline-blue font-bold">
                        Swipe &rarr;
                      </span>
                    </div>

                    {/* Middle Slides */}
                    {generatedCarousel.slides.map((slide) => (
                      <div
                        key={slide.slideNumber}
                        className="aspect-square bg-white text-slate-800 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs"
                      >
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Slide {slide.slideNumber}
                        </span>
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-bold text-sparkline-midnight">
                            {slide.heading}
                          </h5>
                          <p className="text-[10px] text-slate-600 leading-relaxed">
                            {slide.supportingText}
                          </p>
                        </div>
                        <span className="text-[9px] text-slate-400 italic truncate">
                          {slide.visualDirection}
                        </span>
                      </div>
                    ))}

                    {/* Final CTA Slide */}
                    <div className="aspect-square bg-blue-50 text-sparkline-midnight p-4 rounded-2xl border border-blue-200 flex flex-col justify-between shadow-xs">
                      <span className="text-[10px] font-mono text-sparkline-blue uppercase">
                        Final Slide &bull; CTA
                      </span>
                      <div className="space-y-1 text-center">
                        <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                        <h5 className="text-xs font-extrabold">
                          {generatedCarousel.finalCtaSlide.heading}
                        </h5>
                        <p className="text-[10px] text-slate-600">
                          {generatedCarousel.finalCtaSlide.ctaText}
                        </p>
                      </div>
                      <span className="text-[9px] text-center text-slate-400">
                        Bookmark & Save 📌
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 8: CONTENT TEMPLATES LIBRARY
      ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sparkline-midnight text-sm">
                Curated Content Blueprints
              </h3>
              <p className="text-xs text-slate-500">
                8 battle-tested social media frameworks ready to customize in 1 click.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTENT_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
              >
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                      {tmpl.platform}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {tmpl.format}
                    </span>
                  </div>

                  <h4 className="font-bold text-sparkline-midnight text-sm">
                    {tmpl.name}
                  </h4>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] italic text-slate-700">
                    "{tmpl.sampleHook}"
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tmpl.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUseTemplate(tmpl)}
                  className="w-full text-xs gap-1.5 justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use This Template</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: SAVED POSTS & TRACKING
      ========================================================================= */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex-1 max-w-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, hook, or text..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                <option value="All">All Platforms</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Post Title & Hook</th>
                    <th className="py-3 px-3">Platform</th>
                    <th className="py-3 px-3">Format</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Scheduled Date</th>
                    <th className="py-3 px-3">Performance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-sparkline-midnight block truncate">
                          {post.title}
                        </span>
                        <span className="text-[11px] text-slate-500 italic truncate block">
                          "{post.openingHook}"
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold">{post.platform}</span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-500">
                        {post.format}
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          value={post.status}
                          onChange={(e) => handleStatusChange(post.id, e.target.value as ContentStatus)}
                          className="px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200 bg-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                        {post.scheduledDate ? `${post.scheduledDate} ${post.scheduledTime || ''}` : '—'}
                      </td>

                      <td className="py-3.5 px-3">
                        {post.performance ? (
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <span className="text-emerald-700 font-bold block">
                              {post.performance.engagementRate}% Eng
                            </span>
                            <span className="text-slate-400 text-[10px] block">
                              {post.performance.reach.toLocaleString()} reach
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setPerfPostTarget(post);
                              setIsPerfModalOpen(true);
                            }}
                            className="text-sparkline-blue hover:underline text-[11px] font-semibold"
                          >
                            + Log Metrics
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyText(post.id, post.caption)}
                            className="p-1.5 text-slate-400 hover:text-sparkline-blue"
                            title="Copy Caption"
                          >
                            {copiedId === post.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDuplicatePost(post.id)}
                            className="p-1.5 text-slate-400 hover:text-sparkline-blue"
                            title="Duplicate Post"
                          >
                            <Repeat className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setIsPostModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-sparkline-blue"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: BRAND VOICE & PLATFORM CONNECTIONS
      ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Voice Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sparkline-blue" />
                  <h3 className="font-extrabold text-sparkline-midnight text-sm">
                    Brand Voice Calibration ({activeProject?.business?.brandName || 'Default'})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Updated: {new Date(brandVoice.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Tone</label>
                  <select
                    value={brandVoice.tone}
                    onChange={(e) =>
                      setBrandVoice({ ...brandVoice, tone: e.target.value as BrandVoiceTone })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preferred Phrases & Vocabulary (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={brandVoice.preferredPhrases.join(', ')}
                    onChange={(e) =>
                      setBrandVoice({
                        ...brandVoice,
                        preferredPhrases: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Words & Clichés to Avoid (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={brandVoice.wordsToAvoid.join(', ')}
                    onChange={(e) =>
                      setBrandVoice({
                        ...brandVoice,
                        wordsToAvoid: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand Communication Guidelines
                  </label>
                  <textarea
                    rows={3}
                    value={brandVoice.brandGuidelines}
                    onChange={(e) =>
                      setBrandVoice({ ...brandVoice, brandGuidelines: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    contentService.saveBrandVoice(brandVoice);
                    addToast({
                      type: 'success',
                      title: 'Brand Voice Saved',
                      message: 'Settings attached to project for future generation.',
                    });
                  }}
                  className="w-full text-xs h-9 justify-center"
                >
                  Save Brand Voice Settings
                </Button>
              </div>
            </div>

            {/* Platform Connection Architecture */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sparkline-blue" />
                  <h3 className="font-extrabold text-sparkline-midnight text-sm">
                    Social Platform Connection Architecture
                  </h3>
                </div>
                <Badge variant="neutral" size="sm">
                  Safe Offline Mode
                </Badge>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-sparkline-midnight">
                <strong>Platform Policy:</strong> Sparkline Marketing operates as an offline campaign & content studio. Direct live publishing requires authenticated, user-authorized OAuth tokens from Meta, LinkedIn, or Google.
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {platformConnections.map((conn) => (
                  <div key={conn.platform} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{conn.platform}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-sm">
                        {conn.apiNotice}
                      </span>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {conn.connectionStatus === 'connected' ? 'Connected' : 'Planned Sandbox'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: NEW / EDIT POST MODAL
      ========================================================================= */}
      {isPostModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sparkline-midnight/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-sparkline-midnight">
                {editingPost.id.startsWith('post-') && !posts.some((p) => p.id === editingPost.id)
                  ? 'Create New Social Post'
                  : 'Edit Social Post'}
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Post Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Platform</label>
                  <select
                    value={editingPost.platform}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, platform: e.target.value as SocialPlatform })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format</label>
                  <select
                    value={editingPost.format}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, format: e.target.value as ContentFormat })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingPost.status}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, status: e.target.value as ContentStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Opening Hook</label>
                <input
                  type="text"
                  value={editingPost.openingHook}
                  onChange={(e) => setEditingPost({ ...editingPost, openingHook: e.target.value })}
                  placeholder="Thumb-stopping first sentence..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Caption / Post Body ({editingPost.caption.length} chars)
                </label>
                <textarea
                  rows={5}
                  value={editingPost.caption}
                  onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })}
                  placeholder="Write or edit caption..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={editingPost.scheduledDate || ''}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, scheduledDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={editingPost.scheduledTime || '10:00'}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, scheduledTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Call-To-Action (CTA)</label>
                <input
                  type="text"
                  value={editingPost.callToAction}
                  onChange={(e) => setEditingPost({ ...editingPost, callToAction: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPostModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  contentService.savePost(editingPost);
                  setPosts(contentService.getPosts());
                  setIsPostModalOpen(false);
                  addToast({
                    type: 'success',
                    title: 'Post Saved',
                    message: `"${editingPost.title}" persisted to library.`,
                  });
                }}
              >
                Save Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LOG PERFORMANCE METRICS MODAL
      ========================================================================= */}
      {isPerfModalOpen && perfPostTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sparkline-midnight/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-sparkline-midnight">
                  Log Actual Performance
                </h3>
                <span className="text-xs text-slate-400 truncate block max-w-sm">
                  {perfPostTarget.title} ({perfPostTarget.platform})
                </span>
              </div>
              <button
                onClick={() => setIsPerfModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reach</label>
                <input
                  type="number"
                  value={perfForm.reach}
                  onChange={(e) => setPerfForm({ ...perfForm, reach: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Impressions</label>
                <input
                  type="number"
                  value={perfForm.impressions}
                  onChange={(e) => setPerfForm({ ...perfForm, impressions: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Likes</label>
                <input
                  type="number"
                  value={perfForm.likes}
                  onChange={(e) => setPerfForm({ ...perfForm, likes: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Comments</label>
                <input
                  type="number"
                  value={perfForm.comments}
                  onChange={(e) => setPerfForm({ ...perfForm, comments: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shares</label>
                <input
                  type="number"
                  value={perfForm.shares}
                  onChange={(e) => setPerfForm({ ...perfForm, shares: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Saves</label>
                <input
                  type="number"
                  value={perfForm.saves}
                  onChange={(e) => setPerfForm({ ...perfForm, saves: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clicks</label>
                <input
                  type="number"
                  value={perfForm.clicks}
                  onChange={(e) => setPerfForm({ ...perfForm, clicks: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Leads</label>
                <input
                  type="number"
                  value={perfForm.leads}
                  onChange={(e) => setPerfForm({ ...perfForm, leads: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Conversions</label>
                <input
                  type="number"
                  value={perfForm.conversions}
                  onChange={(e) => setPerfForm({ ...perfForm, conversions: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPerfModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSavePerformance}>
                Calculate & Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
