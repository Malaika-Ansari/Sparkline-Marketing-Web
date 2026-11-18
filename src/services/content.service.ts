/**
 * Social Media & Content Creation Service
 * Sparkline Marketing Intelligence Platform - Phase 17
 */

import {
  SocialPlatform,
  ContentObjective,
  ContentFormat,
  ContentStatus,
  BrandVoiceTone,
  ContentCategory,
  ContentLanguage,
  VideoDurationType,
  BrandVoice,
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
} from '@/types/content';
import { MarketingProject } from '@/types/project';
import { securityService } from './security.service';

const POSTS_STORAGE_KEY = 'sparkline_content_posts';
const IDEAS_STORAGE_KEY = 'sparkline_content_ideas';
const BRAND_VOICES_STORAGE_KEY = 'sparkline_brand_voices';
const CONNECTIONS_STORAGE_KEY = 'sparkline_content_connections';

// Reusable starter templates
export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tmpl-ig-carousel-guide',
    name: 'Instagram Educational Carousel (5-Slide)',
    description: 'High-save framework breaking down complex industry lessons into digestible visual slides.',
    platform: 'Instagram',
    format: 'Educational',
    category: 'Educational',
    sampleHook: 'Stop making this 1 critical mistake with your marketing budget in 2026 🧵👇',
    templateCaption: 'Most growth teams focus on vanity impressions rather than conversion velocity. Swipe through to see the exact 5-step auditing framework we use to identify budget leaks before scaling spend.\n\nSave this for your next campaign review! 📌',
    sampleCta: 'Double-tap if you agree and save for later! What is your biggest hurdle with budget pacing?',
    sampleVisualDirection: 'High-contrast dark background with bright blue accent callouts and step-by-step numbered pagination.',
    tags: ['Carousel', 'SaaS', 'Educational', 'High Saves'],
  },
  {
    id: 'tmpl-li-thought-leadership',
    name: 'LinkedIn Executive Thought Leadership',
    description: 'Contrarian opinion and operational lesson designed for founder and VP engagement.',
    platform: 'LinkedIn',
    format: 'Storytelling',
    category: 'Authority Building',
    sampleHook: 'Over the last 12 months, we evaluated 140+ ad accounts. Here is the uncomfortable truth:',
    templateCaption: 'The businesses winning in 2026 are not outspending their competitors on media.\n\nThey are out-executing them on post-click conversion architecture.\n\nHere are 3 fundamental shifts we observed:\n1. Ad creative now does 70% of the targeting.\n2. Transparent unit economics beat generic discounts every time.\n3. Retention email flows drive the highest blended ROAS.\n\nAgree or disagree? How is your team adapting your acquisition strategy this quarter?',
    sampleCta: 'Join the conversation in the comments below. Reshare if this helped your team.',
    sampleVisualDirection: 'Clean text-only post or executive candid workspace portrait with minimalist aesthetic.',
    tags: ['B2B', 'Thought Leadership', 'LinkedIn', 'Executive'],
  },
  {
    id: 'tmpl-tiktok-hook-script',
    name: 'TikTok Problem-Solution Hook Script',
    description: 'Dynamic 30-second short video script designed for algorithmic curiosity and fast retention.',
    platform: 'TikTok',
    format: 'Problem-Solution',
    category: 'Entertaining',
    sampleHook: 'If you are still calculating your marketing ROI in Excel, stop scrolling right now.',
    templateCaption: 'Here is how to automate your campaign performance diagnostics in under 60 seconds without paying enterprise software prices! 🚀 Link in bio to test it free.',
    sampleCta: 'Follow for daily growth marketing tips! Drop your questions in the comments.',
    sampleVisualDirection: 'Direct-to-camera engaging presenter speaking quickly with dynamic on-screen text overlays and screen demo cutaways.',
    tags: ['Short Video', 'Viral Hook', 'TikTok', 'UGC'],
  },
  {
    id: 'tmpl-x-educational-thread',
    name: 'X (Twitter) Breakdown Thread',
    description: 'Bite-sized tactical breakdown designed for high retweets, bookmarks, and follower growth.',
    platform: 'X',
    format: 'Educational',
    category: 'Authority Building',
    sampleHook: 'How to calculate your true break-even ROAS (most brands do this completely backwards):\n\nA step-by-step masterclass 🧵👇',
    templateCaption: '1/7 Most marketers believe a 2.0x ROAS is profitable. But if your gross margin is 40%, you are actually losing money on every single sale.\n\n2/7 The true formula: Break-even ROAS = 1 / Gross Margin %. For a 40% margin brand, your absolute floor is 2.50x.\n\n3/7 Bookmark this thread to calculate your minimum allowable CPA.',
    sampleCta: 'Retweet the first post if you found this valuable. Follow @SparklineM35552 for weekly growth breakdowns.',
    sampleVisualDirection: 'Thread structure with bulleted clarity and clean formula graphics.',
    tags: ['X Thread', 'Growth Hacks', 'Viral Breakdown'],
  },
  {
    id: 'tmpl-yt-how-to-outline',
    name: 'YouTube In-Depth Tactical Tutorial',
    description: 'Structured 8-12 minute video outline covering problem, walkthrough, mistakes, and CTA.',
    platform: 'YouTube',
    format: 'Educational',
    category: 'Educational',
    sampleHook: 'In this video, I will show you how to structure a multi-platform ad campaign across Meta and Google that generates real qualified leads without burning budget.',
    templateCaption: 'Full walkthrough of setting up your 2026 advertising campaign hierarchy. Download our free Campaign Architecture Template in the description below.\n\nTIMESTAMPS:\n0:00 - Introduction\n1:15 - The Core Problem\n3:40 - Step-by-Step Setup\n7:20 - Optimization Rules\n9:50 - Live Q&A',
    sampleCta: 'Subscribe for in-depth growth engineering masterclasses and leave a comment with your brand.',
    sampleVisualDirection: 'High-production studio lighting, clear screen capture overlays, and dynamic chapter cards.',
    tags: ['Long Form', 'Tutorial', 'YouTube SEO'],
  },
  {
    id: 'tmpl-fb-community-prompt',
    name: 'Facebook Community Discussion Prompt',
    description: 'High-engagement discussion starter encouraging peer-to-peer replies and group sharing.',
    platform: 'Facebook',
    format: 'Engagement Post',
    category: 'Community Building',
    sampleHook: 'Quick question for marketing leads and e-commerce founders in this community:',
    templateCaption: 'Which channel has given your business the most consistent customer acquisition over the past 6 months?\n\n🅰️ Paid Social (Meta, TikTok)\n🅱️ Organic Search & SEO\n🅲️ Email & Lifecycle Retention\n🅳️ Strategic Partnerships / Word-of-Mouth\n\nDrop your vote below and share 1 key lesson you learned this quarter!',
    sampleCta: 'Vote below and let us know why in the comments!',
    sampleVisualDirection: 'Bright branded graphic featuring the four letter options in clean typography.',
    tags: ['Facebook Group', 'Poll', 'Community'],
  },
  {
    id: 'tmpl-pin-infographic-guide',
    name: 'Pinterest High-Intent Visual Pin',
    description: 'Vertical 2:3 infographic pin optimized for Pinterest search intent and website click-throughs.',
    platform: 'Pinterest',
    format: 'Informational',
    category: 'Inspirational',
    sampleHook: 'The Complete Marketing Metrics Cheat Sheet for Beginners',
    templateCaption: 'Understand CTR, CPC, CPA, ROAS, and ROI at a glance. Save this cheat sheet to master your campaign analytics and make smarter business decisions. Click through to explore our free marketing tools!',
    sampleCta: 'Click the link to read the full guide and bookmark this pin for reference!',
    sampleVisualDirection: 'Vertical 1000x1500 infographic with crisp typography, color-coded metric cards, and clean visual hierarchy.',
    tags: ['Infographic', 'Pinterest SEO', 'Cheat Sheet'],
  },
  {
    id: 'tmpl-launch-teaser-post',
    name: 'Omni-Channel Product Launch Teaser',
    description: 'Urgency-building announcement post teasing an upcoming release or feature update.',
    platform: 'Instagram',
    format: 'Announcement',
    category: 'Promotional',
    sampleHook: 'Something big is arriving this Thursday. Here is your first sneak peek 👀',
    templateCaption: 'For the last 6 months, our product team has been building something that will fundamentally change how growth teams plan marketing budgets.\n\nNo more guessing. No more messy spreadsheets. Just pure strategic clarity.\n\nWant early VIP access? Tap the link in our bio to join the waitlist before we go live publicly.',
    sampleCta: 'Tap the link in bio to join the waitlist. What feature do you hope we built?',
    sampleVisualDirection: 'Moody teaser visual showing subtle product UI with glowing blue highlight elements.',
    tags: ['Product Launch', 'Teaser', 'Announcement', 'VIP'],
  },
];

// Seed starter posts
const SEED_POSTS: SocialMediaPost[] = [
  {
    id: 'post-seed-01',
    projectId: 'proj-vitamin-c',
    title: '5 Dermatologist Secrets for Glowing Skin',
    platform: 'Instagram',
    format: 'Educational',
    objective: 'Engagement',
    targetAudience: 'Skincare enthusiasts aged 24-40 seeking clinical hydration',
    caption: 'Did you know that applying Vitamin C immediately after showering locks in 3x more cellular hydration? 🍊💧\n\nHere are 3 rules our dermatological formulators swear by:\n1. Always apply to slightly damp skin.\n2. Layer under hyaluronic acid before sunscreen.\n3. Store in a cool, dark cabinet away from direct sunlight.\n\nSwipe to see our formula stability tests. Have you tried this routine yet?',
    openingHook: 'Are you applying your Vitamin C serum all wrong? Most people do.',
    mainMessage: 'Proper application sequence dramatically enhances clinical serum absorption and radiance.',
    callToAction: 'Save this post for your morning routine and tag a friend who loves skincare! ✨',
    hashtags: ['#SkincareRoutine', '#VitaminCSerum', '#ClinicalBeauty', '#GlowTips', '#HealthySkin'],
    suggestedVisual: 'Close-up texture macro shot of golden serum droplet on dewy skin with morning natural sunlight.',
    status: 'Scheduled',
    scheduledDate: '2026-11-18',
    scheduledTime: '09:30',
    characterCount: 462,
    isAiGenerated: true,
    versions: [],
    createdAt: '2026-11-14T08:00:00Z',
    updatedAt: '2026-11-14T08:00:00Z',
    performance: {
      id: 'perf-seed-01',
      postId: 'post-seed-01',
      reach: 14500,
      impressions: 19800,
      likes: 840,
      comments: 65,
      shares: 110,
      saves: 380,
      clicks: 340,
      views: 12000,
      linkClicks: 210,
      leads: 28,
      conversions: 12,
      engagementRate: 9.62,
      ctr: 1.72,
      cvr: 3.53,
      totalInteractions: 1395,
      dataSource: 'manual_entry',
      lastUpdated: '2026-11-14T10:00:00Z',
    },
  },
  {
    id: 'post-seed-02',
    projectId: 'proj-apex-cloud',
    title: 'Why Cloud Data Warehouses Fail at Scale',
    platform: 'LinkedIn',
    format: 'Storytelling',
    objective: 'Lead Generation',
    targetAudience: 'CTOs, VP of Engineering, Data Architects in Enterprise SaaS',
    caption: 'Last quarter, a Series C fintech client was spending $48,000/month on unoptimized query compute.\n\nWithin 14 days of auditing their warehouse architecture with Apex Cloud, we discovered:\n\n• 42% of automated queries were querying full tables instead of partitions.\n• Redundant ETL pipelines were running hourly on stale datasets.\n• Inactive user caches were consuming 18TB of premium SSD tier.\n\nBy re-indexing their pipelines, we reduced monthly cloud overhead by 58% while cutting query latency by half.\n\nWhat is your biggest pain point when managing cloud infrastructure costs this year?',
    openingHook: 'If your cloud compute bills grew faster than your revenue last quarter, you are not alone.',
    mainMessage: 'Architecture optimization delivers immediate 50%+ cost reductions without sacrificing database throughput.',
    callToAction: 'Read the full architecture case study in the link in the comments or send a direct message.',
    hashtags: ['#CloudComputing', '#DataEngineering', '#FinOps', '#SaaSArchitecture', '#DevOps'],
    suggestedVisual: 'Clean comparative benchmark chart showing before-and-after query latency and monthly spend curve.',
    status: 'Ready for Review',
    scheduledDate: '2026-11-20',
    scheduledTime: '14:00',
    characterCount: 685,
    isAiGenerated: true,
    versions: [],
    createdAt: '2026-11-14T08:30:00Z',
    updatedAt: '2026-11-14T08:30:00Z',
  },
  {
    id: 'post-seed-03',
    projectId: 'proj-vitamin-c',
    title: 'Behind the Scenes: Clinical Batch Testing',
    platform: 'TikTok',
    format: 'Behind-the-Scenes',
    objective: 'Brand Awareness',
    targetAudience: 'Gen Z and Millennial clean-beauty shoppers',
    caption: 'POV: You asked how we test formula stability without harsh synthetic stabilizers. Come into our ISO-certified lab! 🔬✨ Watch until the end for our oxygen oxidation test.',
    openingHook: 'Ever wonder why your Vitamin C turns dark orange so fast?',
    mainMessage: 'Our nitrogen-flushed amber bottle prevents oxidation for 180 days longer than traditional dropper bottles.',
    callToAction: 'Follow for more science-backed skincare breakdowns! Link in bio to shop.',
    hashtags: ['#CosmeticChemist', '#LabLife', '#SkinScience', '#CleanBeauty', '#SkincareRoutine'],
    suggestedVisual: 'Vertical fast-paced montage of lab pipettes, spectrometer readings, and vibrant serum vials.',
    status: 'Idea',
    characterCount: 198,
    isAiGenerated: false,
    versions: [],
    createdAt: '2026-11-14T09:00:00Z',
    updatedAt: '2026-11-14T09:00:00Z',
  },
];

// Seed starter ideas
const SEED_IDEAS: ContentIdea[] = [
  {
    id: 'idea-01',
    projectId: 'proj-vitamin-c',
    title: 'Myth Busters: Does Vitamin C cause skin purging?',
    coreConcept: 'Address common customer hesitation about temporary redness vs actual purging.',
    targetAudience: 'New customers hesitating to start active skincare acids',
    suggestedPlatform: 'Instagram',
    format: 'Educational',
    hook: 'Is your serum actually breaking you out, or is your skin just purging? Here is how to tell the difference in 30 seconds.',
    mainMessage: 'Purging happens only in areas where you normally get blemishes; allergic reaction appears everywhere immediately.',
    callToAction: 'Save this guide and consult our certified esthetician in the DMs.',
    objective: 'Customer Education',
    suggestedVisual: 'Side-by-side illustrated facial graphic showing purge zones vs irritation zones.',
    category: 'Educational',
    isSaved: true,
    createdAt: '2026-11-14T07:30:00Z',
  },
  {
    id: 'idea-02',
    projectId: 'proj-apex-cloud',
    title: 'The Real Cost of Cloud Outages in 2026',
    coreConcept: 'Industry benchmark survey showing average hourly cost of downtime across SaaS tiers.',
    targetAudience: 'Enterprise Data Leaders & Site Reliability Engineers',
    suggestedPlatform: 'LinkedIn',
    format: 'Informational',
    hook: 'The average enterprise SaaS outage now costs $300,000 per hour in lost ARR and SLA penalties.',
    mainMessage: 'Automated multi-region failovers are no longer optional insurance; they are fundamental operational hygiene.',
    callToAction: 'Download our 2026 Disaster Recovery Playbook.',
    objective: 'Brand Awareness',
    suggestedVisual: 'Infographic summarizing downtime costs by company employee size.',
    category: 'Authority Building',
    isSaved: true,
    createdAt: '2026-11-14T07:45:00Z',
  },
  {
    id: 'idea-03',
    projectId: 'proj-vitamin-c',
    title: 'Morning Skincare Routine ASMR Reel',
    coreConcept: 'Soothing sensory audio video showcasing glass dropper, liquid clicks, and packaging aesthetics.',
    targetAudience: 'Aesthetic skincare community on TikTok and Instagram',
    suggestedPlatform: 'TikTok',
    format: 'Product Showcase',
    hook: 'Unbox and prep your morning skin with pure sensory ASMR 🫧',
    mainMessage: 'Luxury texture and clinical efficacy can coexist in a daily routine.',
    callToAction: 'Tap sound to save or shop the routine in bio.',
    objective: 'Brand Awareness',
    suggestedVisual: 'Crisp microphone audio of packaging unboxing, serum droplet drops, and frosted glass.',
    category: 'Entertaining',
    isSaved: false,
    createdAt: '2026-11-14T08:15:00Z',
  },
];

// Pre-seeded brand voice
const DEFAULT_BRAND_VOICE: BrandVoice = {
  id: 'bv-default',
  projectId: 'default',
  tone: 'Professional',
  preferredPhrases: [
    'data-backed strategy',
    'verified growth',
    'clear unit economics',
    'strategic clarity',
    'actionable intelligence',
  ],
  wordsToAvoid: [
    'guaranteed overnight riches',
    'secret hack',
    'insane results',
    'cheat code',
    'miracle solution',
  ],
  writingExamples: [
    'We focus on sustainable customer acquisition backed by verifiable unit economics and transparent metrics.',
    'Scaling marketing requires systematic testing of hypotheses rather than unmeasured ad spend.',
  ],
  brandGuidelines: 'Maintain an authoritative yet accessible voice. Back assertions with data or clear reasoning. Never fabricate fake testimonials, fake discounts, or unrealistic promises.',
  audienceCommunicationPreferences: 'Value clarity, precision, transparent formulas, and practical step-by-step guidance.',
  updatedAt: '2026-11-14T09:00:00Z',
};

class ContentService {
  // Posts CRUD
  getPosts(projectId?: string): SocialMediaPost[] {
    try {
      const stored = localStorage.getItem(POSTS_STORAGE_KEY);
      let posts: SocialMediaPost[] = stored ? JSON.parse(stored) : [];
      if (posts.length === 0) {
        posts = SEED_POSTS;
        this.saveAllPosts(posts);
      }
      if (projectId && projectId !== 'All') {
        return posts.filter((p) => p.projectId === projectId);
      }
      return posts;
    } catch {
      return SEED_POSTS;
    }
  }

  savePost(post: SocialMediaPost): void {
    const list = this.getPosts();
    const idx = list.findIndex((p) => p.id === post.id);
    const updatedPost: SocialMediaPost = {
      ...post,
      updatedAt: new Date().toISOString(),
      characterCount: post.caption.length,
    };

    if (idx >= 0) {
      // Record version if caption changed
      const prev = list[idx];
      if (prev && prev.caption !== post.caption) {
        const newVersion = {
          id: `v-${Date.now()}`,
          versionNumber: (prev.versions?.length || 0) + 1,
          caption: prev.caption,
          openingHook: prev.openingHook,
          callToAction: prev.callToAction,
          modifiedAt: new Date().toISOString(),
          changeNote: 'Updated caption',
        };
        updatedPost.versions = [...(prev.versions || []), newVersion];
      }
      list[idx] = updatedPost;
    } else {
      list.unshift(updatedPost);
    }
    this.saveAllPosts(list);
  }

  deletePost(id: string): void {
    const list = this.getPosts().filter((p) => p.id !== id);
    this.saveAllPosts(list);
  }

  duplicatePost(id: string): SocialMediaPost | null {
    const list = this.getPosts();
    const original = list.find((p) => p.id === id);
    if (!original) return null;

    const clone: SocialMediaPost = {
      ...original,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      scheduledDate: undefined,
      scheduledTime: undefined,
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(clone);
    this.saveAllPosts(list);
    return clone;
  }

  updatePostStatus(id: string, status: ContentStatus): void {
    const list = this.getPosts();
    const post = list.find((p) => p.id === id);
    if (post) {
      post.status = status;
      post.updatedAt = new Date().toISOString();
      if (status === 'Published' && !post.publishedDate) {
        post.publishedDate = new Date().toISOString().split('T')[0];
      }
      this.saveAllPosts(list);
    }
  }

  updatePostSchedule(id: string, date: string, time?: string): void {
    const list = this.getPosts();
    const post = list.find((p) => p.id === id);
    if (post) {
      post.scheduledDate = date;
      if (time) post.scheduledTime = time;
      if (post.status === 'Idea' || post.status === 'Draft') {
        post.status = 'Scheduled';
      }
      post.updatedAt = new Date().toISOString();
      this.saveAllPosts(list);
    }
  }

  private saveAllPosts(posts: SocialMediaPost[]): void {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to persist social posts:', e);
    }
  }

  // Ideas CRUD
  getIdeas(projectId?: string): ContentIdea[] {
    try {
      const stored = localStorage.getItem(IDEAS_STORAGE_KEY);
      let ideas: ContentIdea[] = stored ? JSON.parse(stored) : [];
      if (ideas.length === 0) {
        ideas = SEED_IDEAS;
        this.saveAllIdeas(ideas);
      }
      if (projectId && projectId !== 'All') {
        return ideas.filter((i) => i.projectId === projectId);
      }
      return ideas;
    } catch {
      return SEED_IDEAS;
    }
  }

  saveIdea(idea: ContentIdea): void {
    const list = this.getIdeas();
    const idx = list.findIndex((i) => i.id === idea.id);
    if (idx >= 0) {
      list[idx] = idea;
    } else {
      list.unshift(idea);
    }
    this.saveAllIdeas(list);
  }

  deleteIdea(id: string): void {
    const list = this.getIdeas().filter((i) => i.id !== id);
    this.saveAllIdeas(list);
  }

  convertIdeaToPost(ideaId: string): SocialMediaPost | null {
    const ideas = this.getIdeas();
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return null;

    const newPost: SocialMediaPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      projectId: idea.projectId,
      title: idea.title,
      platform: idea.suggestedPlatform,
      format: idea.format,
      objective: idea.objective,
      targetAudience: idea.targetAudience,
      caption: `${idea.hook}\n\n${idea.mainMessage}\n\n${idea.callToAction}`,
      openingHook: idea.hook,
      mainMessage: idea.mainMessage,
      callToAction: idea.callToAction,
      hashtags: ['#GrowthMarketing', '#Strategy', '#Sparkline'],
      suggestedVisual: idea.suggestedVisual,
      status: 'Draft',
      characterCount: (idea.hook + idea.mainMessage + idea.callToAction).length,
      isAiGenerated: true,
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    idea.convertedToPostId = newPost.id;
    this.saveAllIdeas(ideas);
    this.savePost(newPost);
    return newPost;
  }

  private saveAllIdeas(ideas: ContentIdea[]): void {
    try {
      localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
    } catch (e) {
      console.error('Failed to persist content ideas:', e);
    }
  }

  // Brand Voice CRUD
  getBrandVoice(projectId: string = 'default'): BrandVoice {
    try {
      const stored = localStorage.getItem(BRAND_VOICES_STORAGE_KEY);
      const voices: Record<string, BrandVoice> = stored ? JSON.parse(stored) : {};
      return (
        voices[projectId] || {
          ...DEFAULT_BRAND_VOICE,
          id: `bv-${projectId}`,
          projectId,
        }
      );
    } catch {
      return { ...DEFAULT_BRAND_VOICE, projectId };
    }
  }

  saveBrandVoice(voice: BrandVoice): void {
    try {
      const stored = localStorage.getItem(BRAND_VOICES_STORAGE_KEY);
      const voices: Record<string, BrandVoice> = stored ? JSON.parse(stored) : {};
      voices[voice.projectId] = {
        ...voice,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(BRAND_VOICES_STORAGE_KEY, JSON.stringify(voices));
    } catch (e) {
      console.error('Failed to save brand voice:', e);
    }
  }

  // Platform Connections Architecture
  getPlatformConnections(): SocialPlatformConnection[] {
    const defaultConnections: SocialPlatformConnection[] = [
      {
        platform: 'Instagram',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
        apiNotice: 'Meta Graph API v19.0. Safe planning mode active. Direct publishing requires verified OAuth tokens.',
      },
      {
        platform: 'LinkedIn',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['w_member_social', 'r_organization_social', 'w_organization_social'],
        apiNotice: 'LinkedIn Community Management API. Direct publishing requires authenticated company admin access.',
      },
      {
        platform: 'TikTok',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['video.upload', 'video.publish', 'user.info.basic'],
        apiNotice: 'TikTok Content Posting API. Video concept and script staging active in offline sandbox.',
      },
      {
        platform: 'YouTube',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['https://www.googleapis.com/auth/youtube.upload'],
        apiNotice: 'YouTube Data API v3. Title, description and thumbnail metadata planner active.',
      },
      {
        platform: 'Facebook',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['pages_manage_posts', 'pages_read_engagement'],
        apiNotice: 'Meta Graph API. Community discussion prompts and scheduled calendar items active.',
      },
      {
        platform: 'Pinterest',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['pins:read', 'pins:write', 'boards:read'],
        apiNotice: 'Pinterest API v5. High-intent keyword pin descriptions and image concepts staged.',
      },
      {
        platform: 'X',
        isConnected: false,
        connectionStatus: 'disconnected',
        permissions: ['tweet.read', 'tweet.write', 'users.read'],
        apiNotice: 'X API v2. Short-form thread outlines and character-counter validation active.',
      },
    ];

    try {
      const stored = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultConnections;
    } catch {
      return defaultConnections;
    }
  }

  // Deterministic Performance Calculations
  calculatePerformance(data: Partial<ContentPerformance>): ContentPerformance {
    const reach = Math.max(0, Number(data.reach) || 0);
    const impressions = Math.max(0, Number(data.impressions) || 0);
    const likes = Math.max(0, Number(data.likes) || 0);
    const comments = Math.max(0, Number(data.comments) || 0);
    const shares = Math.max(0, Number(data.shares) || 0);
    const saves = Math.max(0, Number(data.saves) || 0);
    const clicks = Math.max(0, Number(data.clicks) || 0);
    const views = Math.max(0, Number(data.views) || 0);
    const linkClicks = Math.max(0, Number(data.linkClicks) || 0);
    const leads = Math.max(0, Number(data.leads) || 0);
    const conversions = Math.max(0, Number(data.conversions) || 0);

    const totalInteractions = likes + comments + shares + saves;

    // Engagement Rate: (total interactions / reach or impressions) * 100
    const engagementDenominator = reach > 0 ? reach : impressions;
    const engagementRate =
      engagementDenominator > 0
        ? Number(((totalInteractions / engagementDenominator) * 100).toFixed(2))
        : 0;

    // CTR: (clicks / impressions) * 100
    const ctr =
      impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

    // CVR: (conversions / clicks) * 100
    const cvr =
      clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0;

    return {
      id: data.id || `perf-${Date.now()}`,
      postId: data.postId || '',
      reach,
      impressions,
      likes,
      comments,
      shares,
      saves,
      clicks,
      views,
      linkClicks,
      leads,
      conversions,
      engagementRate,
      ctr,
      cvr,
      totalInteractions,
      dataSource: data.dataSource || 'manual_entry',
      lastUpdated: new Date().toISOString(),
    };
  }

  // Export to CSV with formula injection defense
  exportPostsCsv(posts: SocialMediaPost[]): string {
    const headers = [
      'Post ID',
      'Title',
      'Platform',
      'Format',
      'Objective',
      'Status',
      'Scheduled Date',
      'Scheduled Time',
      'Opening Hook',
      'Caption',
      'CTA',
      'Hashtags',
      'Impressions',
      'Reach',
      'Likes',
      'Comments',
      'Clicks',
      'Conversions',
      'Engagement Rate %',
    ];

    const rows = posts.map((p) => [
      securityService.formatCsvCell(p.id),
      securityService.formatCsvCell(p.title),
      securityService.formatCsvCell(p.platform),
      securityService.formatCsvCell(p.format),
      securityService.formatCsvCell(p.objective),
      securityService.formatCsvCell(p.status),
      securityService.formatCsvCell(p.scheduledDate || ''),
      securityService.formatCsvCell(p.scheduledTime || ''),
      securityService.formatCsvCell(p.openingHook),
      securityService.formatCsvCell(p.caption),
      securityService.formatCsvCell(p.callToAction),
      securityService.formatCsvCell(p.hashtags.join(' ')),
      securityService.formatCsvCell(p.performance?.impressions || 0),
      securityService.formatCsvCell(p.performance?.reach || 0),
      securityService.formatCsvCell(p.performance?.likes || 0),
      securityService.formatCsvCell(p.performance?.comments || 0),
      securityService.formatCsvCell(p.performance?.clicks || 0),
      securityService.formatCsvCell(p.performance?.conversions || 0),
      securityService.formatCsvCell(p.performance?.engagementRate || 0),
    ]);

    return [headers.map((h) => securityService.formatCsvCell(h)).join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // Hashtag & Keyword Assistant
  generateHashtags(
    topic: string,
    industry: string,
    platform: SocialPlatform,
    audience: string
  ): HashtagResult {
    const cleanTopic = topic.trim().replace(/[^a-zA-Z0-9]/g, '');
    const cleanIndustry = industry.trim().replace(/[^a-zA-Z0-9]/g, '');
    const cleanAudience = audience ? audience.trim().replace(/[^a-zA-Z0-9]/g, '') : '';

    const broad: string[] = [
      `#${cleanIndustry || 'Marketing'}`,
      `#${cleanTopic || 'Growth'}`,
      '#BusinessStrategy',
      '#DigitalMarketing',
      '#Innovation',
    ];

    const niche: string[] = [
      `#${cleanTopic}Strategy`,
      `#${cleanIndustry}Insights`,
      '#GrowthMetrics',
      '#ModernMarketing',
      '#ConversionOptimization',
    ];

    const product: string[] = [
      `#${cleanTopic}App`,
      `#${cleanIndustry}Pro`,
      '#StrategicTools',
      '#SmartSoftware',
      '#WorkflowEngine',
    ];

    const aud: string[] = [
      `#${cleanAudience || 'GrowthMarketers'}`,
      `#${cleanIndustry}Leaders`,
      '#FoundersCommunity',
      '#MarketingTeams',
      '#EntrepreneursOfInstagram',
    ];

    const campaign: string[] = [
      `#${cleanTopic}2026`,
      '#SparklineStrategy',
      '#MarketSmarter',
      '#PredictGrowth',
    ];

    const mapTags = (arr: string[], cat: 'broad' | 'niche' | 'product' | 'audience' | 'campaign') =>
      arr.map((t) => ({
        tag: t,
        category: cat,
        relevanceNotes: `Curated for ${cat} reach on ${platform}.`,
        isAiSuggested: true,
      }));

    const broadTags = mapTags(broad, 'broad');
    const nicheTags = mapTags(niche, 'niche');
    const productTags = mapTags(product, 'product');
    const audienceTags = mapTags(aud, 'audience');
    const campaignTags = mapTags(campaign, 'campaign');

    const suggestedSetString = [
      ...broad.slice(0, 3),
      ...niche.slice(0, 3),
      ...product.slice(0, 2),
      ...campaign.slice(0, 2),
    ].join(' ');

    return {
      topic,
      industry,
      platform,
      broadTags,
      nicheTags,
      productTags,
      audienceTags,
      campaignTags,
      suggestedSetString,
    };
  }

  // Content Repurposing Engine
  repurposeContent(
    sourceText: string,
    sourceType: string,
    targetPlatforms: SocialPlatform[],
    brandTone: string
  ): RepurposedOutput[] {
    const firstSentence = sourceText.split(/[.!?\n]/)[0] || 'Strategic Marketing Lesson';
    const cleanSnippet = sourceText.slice(0, 300);

    return targetPlatforms.map((platform) => {
      let format: ContentFormat = 'Educational';
      let hook = '';
      let content = '';
      let cta = '';
      let hashtags: string[] = [];

      switch (platform) {
        case 'LinkedIn':
          format = 'Storytelling';
          hook = `We adapted our key insight from our recent ${sourceType.toLowerCase()}:`;
          content = `${hook}\n\n"${firstSentence}."\n\nHere are the 3 major strategic implications for growth leaders:\n\n1. Focus on verifiable ROI rather than vanity visibility.\n2. Align your creative assets directly with commercial intent.\n3. Implement structured testing matrices.\n\nSummary takeaway:\n${cleanSnippet}...\n\nWhat are your thoughts on this approach?`;
          cta = 'Drop your reaction below or reshare if this helped your leadership team.';
          hashtags = ['#MarketingStrategy', '#Leadership', '#SaaS', '#Growth'];
          break;

        case 'Instagram':
          format = 'Educational';
          hook = `Quick takeaway from our latest ${sourceType.toLowerCase()} 👇`;
          content = `${hook}\n\n${firstSentence}!\n\nHere is what you need to remember:\n• Strategy precedes ad spend.\n• Clean unit economics win every time.\n• Test 6 messaging angles.\n\nSave this post to reference during your next team sprint! 📌`;
          cta = 'Double-tap if this resonates and save for later! ✨';
          hashtags = ['#MarketingTips', '#GrowthHacks', '#BusinessAdvice', '#SmartMarketing'];
          break;

        case 'TikTok':
          format = 'Problem-Solution';
          hook = `POV: You just read our ${sourceType.toLowerCase()} and realized you are doing this wrong:`;
          content = `[HOOK (0-3s)]: Direct to camera with bold on-screen text.\n"Stop scrolling if you want to fix your marketing workflow."\n\n[CORE (4-20s)]: Break down "${firstSentence}." Show rapid screencast.\n\n[CTA (21-30s)]: "Hit follow for daily marketing breakdowns and tap link in bio to test it!"`;
          cta = 'Follow for daily growth tips & check link in bio!';
          hashtags = ['#MarketingTikTok', '#BusinessTips', '#GrowthTips', '#LearnOnTikTok'];
          break;

        case 'X':
          format = 'Informational';
          hook = `Key lesson from our ${sourceType.toLowerCase()}:`;
          content = `${hook}\n\n"${firstSentence}."\n\nWhy this matters in 2026 🧵👇\n\n1/3 Most growth teams fail not from poor products, but from disjointed messaging.\n\n2/3 When you align creative hooks with target pain points, conversion rates double.\n\n3/3 Bookmark this to audit your current campaigns.`;
          cta = 'RT if you found this valuable. Follow @SparklineM35552 for weekly breakdowns.';
          hashtags = ['#MarketingStrategy', '#Growth'];
          break;

        case 'YouTube':
          format = 'Customer Education';
          hook = `How to Master: ${firstSentence}`;
          content = `Video Title: How We Solved This Critical Marketing Bottleneck (${sourceType} Breakdown)\n\nDescription:\nIn this video, we break down "${firstSentence}" with actionable diagrams and implementation frameworks.\n\nChapters:\n0:00 Introduction & Problem\n1:45 The Core Strategy\n4:20 Actionable Steps\n6:30 Summary & Next Steps`;
          cta = 'Subscribe and check the description for the free blueprint download.';
          hashtags = ['#Tutorial', '#MarketingStrategy', '#BusinessGrowth'];
          break;

        case 'Pinterest':
          format = 'Informational';
          hook = `${firstSentence} | Marketing Strategy Guide`;
          content = `Pin Title: ${firstSentence} (Infographic Guide)\n\nPin Description: Discover how modern growth teams apply strategic marketing principles to maximize conversions. Pin this to your Marketing Board for future campaign planning!`;
          cta = 'Click through to read the full case study on our site!';
          hashtags = ['#MarketingInfographic', '#BusinessTips', '#Entrepreneurship'];
          break;

        case 'Facebook':
          format = 'Engagement Post';
          hook = `We were reviewing our recent ${sourceType.toLowerCase()} and wanted to ask the group:`;
          content = `${hook}\n\n"${firstSentence}."\n\nDo you see this happening in your industry as well? How is your team handling this shift? Let us know in the comments!`;
          cta = 'Share your perspective in the comments below!';
          hashtags = ['#MarketingDiscussion', '#BusinessCommunity'];
          break;
      }

      return {
        id: `repurpose-${platform.toLowerCase()}-${Date.now()}`,
        targetPlatform: platform,
        targetFormat: format,
        title: `${platform} Adaptation from ${sourceType}`,
        openingHook: hook,
        content,
        cta,
        hashtags,
        notes: `Adapted with ${brandTone} tone. Original core message strictly preserved.`,
      };
    });
  }

  // Video Script Generator
  generateVideoScript(
    title: string,
    platform: SocialPlatform,
    duration: VideoDurationType,
    coreMessage: string,
    cta: string
  ): VideoScript {
    let scenes = [];

    if (duration === 'Short (15-30s)') {
      scenes = [
        {
          sceneNumber: 1,
          durationSeconds: 4,
          visualDirection: 'Fast dynamic zoom on presenter with vibrant animated text hook overlay.',
          spokenDialogue: `Stop scrolling if you are still struggling with ${coreMessage}.`,
          onScreenText: `Fix Your ${coreMessage} in 30s ⚡`,
        },
        {
          sceneNumber: 2,
          durationSeconds: 16,
          visualDirection: 'Screen recording / split screen demonstration of the solution in action.',
          spokenDialogue: 'Here is what 90% of brands miss: instead of guessing, you need structured strategy and verified benchmarks.',
          onScreenText: 'Step 1: Audit Benchmarks 📊\nStep 2: Optimize Creative 🎯',
        },
        {
          sceneNumber: 3,
          durationSeconds: 6,
          visualDirection: 'Presenter points down to bio link with branded logo card outro.',
          spokenDialogue: cta || 'Tap the link in bio to test our free strategy studio!',
          onScreenText: 'Link in Bio! 🚀',
        },
      ];
    } else if (duration === 'Medium (30-60s)') {
      scenes = [
        {
          sceneNumber: 1,
          durationSeconds: 5,
          visualDirection: 'Direct-to-camera eye contact with bold text question overlay.',
          spokenDialogue: `What if I told you that your ${coreMessage} could be 3x more effective with one shift?`,
          onScreenText: 'The 1 Shift You Need 💡',
        },
        {
          sceneNumber: 2,
          durationSeconds: 15,
          visualDirection: 'B-roll cutaway showing frustrating spreadsheet vs clean Sparkline dashboard.',
          spokenDialogue: 'Most teams waste thousands on unoptimized channels because they lack transparent cross-channel attribution.',
          onScreenText: 'The Problem: Channel Dilution 📉',
        },
        {
          sceneNumber: 3,
          durationSeconds: 25,
          visualDirection: 'Live product screencast showing 6 messaging angles and deterministic ROI calculator.',
          spokenDialogue: 'When you test multiple messaging angles and ground budgets in verified unit economics, your cost per acquisition drops naturally.',
          onScreenText: 'The Solution: Grounded Strategy 📈',
        },
        {
          sceneNumber: 4,
          durationSeconds: 10,
          visualDirection: 'Presenter return with animated CTA button overlay.',
          spokenDialogue: cta || 'Follow for more data-backed growth tactics and visit our website today.',
          onScreenText: 'Follow @Sparkline & Start Free 🔗',
        },
      ];
    } else {
      // Long (60-180s)
      scenes = [
        {
          sceneNumber: 1,
          durationSeconds: 10,
          visualDirection: 'Cinematic intro with studio lighting and high-clarity title card.',
          spokenDialogue: `Welcome back. Today we are doing a deep dive into ${coreMessage} and why modern marketing teams are rethinking their entire playbook.`,
          onScreenText: `Mastering ${coreMessage} in 2026 🎬`,
        },
        {
          sceneNumber: 2,
          durationSeconds: 30,
          visualDirection: 'Slide diagram illustrating the 3 main failure points in traditional marketing.',
          spokenDialogue: 'First, let us examine the numbers. When ad costs rise by 20% year over year, relying on brute-force bidding destroys margins. You need creative differentiation.',
          onScreenText: 'Why Old Ad Tactics Fail ❌',
        },
        {
          sceneNumber: 3,
          durationSeconds: 45,
          visualDirection: 'Detailed screencast walkthrough of the Sparkline Marketing Campaign Studio.',
          spokenDialogue: 'Here is how you set up platform-aware hierarchies for Meta and Google Ads, calculate break-even ROAS, and generate production-ready creative briefs.',
          onScreenText: 'Step-by-Step Architecture 🛠️',
        },
        {
          sceneNumber: 4,
          durationSeconds: 25,
          visualDirection: 'Presenter recap with key takeaway bullet points on screen.',
          spokenDialogue: 'Remember: measure what matters, avoid vanity metrics, and protect your cash flow pacing.',
          onScreenText: 'Key Takeaways: Strategy > Spend 💡',
        },
        {
          sceneNumber: 5,
          durationSeconds: 15,
          visualDirection: 'End screen with subscribe button, related video card, and download link.',
          spokenDialogue: cta || 'Subscribe to the channel, grab the free blueprint in the description, and leave your questions below.',
          onScreenText: 'Subscribe & Download Below 👇',
        },
      ];
    }

    return {
      id: `script-${Date.now()}`,
      title,
      platform,
      targetDuration: duration,
      openingHook: scenes[0]?.spokenDialogue || `Mastering ${title}`,
      scenes,
      callToAction: cta,
      overallVisualNotes: `Designed for high retention on ${platform}. Keep cuts dynamic every 3-5 seconds.`,
      createdAt: new Date().toISOString(),
    };
  }

  // Carousel Builder
  generateCarouselContent(
    title: string,
    platform: SocialPlatform,
    topic: string,
    audience: string,
    slidesCount: number = 5
  ): CarouselContent {
    const slides = [
      {
        slideNumber: 2,
        heading: '1. The Core Misconception',
        supportingText: `Most ${audience || 'teams'} focus on top-of-funnel reach while ignoring post-click conversion friction. Without clear positioning, traffic bounces.`,
        visualDirection: 'Split graphic showing leaky bucket illustration vs focused funnel.',
      },
      {
        slideNumber: 3,
        heading: '2. The Data-Backed Shift',
        supportingText: 'Measure your true unit economics first. Calculate break-even ROAS based on gross margins rather than arbitrary revenue targets.',
        visualDirection: 'Formula card highlighting: Break-even ROAS = 1 / Gross Margin % with clean typography.',
      },
      {
        slideNumber: 4,
        heading: '3. Execute the 6-Angle Matrix',
        supportingText: 'Deploy Benefit, Problem-Solution, Emotional, Promotional, Educational, and Trust-building copy. Let real customer response guide scaling.',
        visualDirection: '6-box grid diagram with high-contrast badge icons.',
      },
    ];

    if (slidesCount >= 5) {
      slides.push({
        slideNumber: 5,
        heading: '4. Continuous Diagnostic Checks',
        supportingText: 'Audit CPC, CTR, CPA, and CVR weekly. Pause underperforming ad sets and reallocate spend to winning creative hooks.',
        visualDirection: 'Checklist graphic with clean checkmarks and metric thresholds.',
      });
    }

    const fullCaption = `${title}\n\nSwipe through for the complete strategic breakdown. Most ${audience || 'marketers'} overlook step 2!\n\nSave this carousel for your next campaign review 📌\n\n#${topic.replace(/\s+/g, '')} #MarketingTips #GrowthStrategy #Sparkline`;

    return {
      id: `carousel-${Date.now()}`,
      title,
      platform,
      coverSlide: {
        heading: title,
        subtitle: `A step-by-step breakdown for ${audience || 'growth marketers'}`,
        visualDirection: 'Bold dark navy background with bright electric blue headline and swipe indicator arrow.',
      },
      slides,
      finalCtaSlide: {
        heading: 'Save This Carousel & Share',
        ctaText: 'Follow @SparklineM35552 for weekly growth frameworks!',
        visualDirection: 'Bookmark icon animation prompt and profile photo with clean verified badge.',
      },
      fullCaption,
      hashtags: ['#GrowthStrategy', '#MarketingCarousel', '#SaaSMarketing', '#BusinessTips'],
      createdAt: new Date().toISOString(),
    };
  }

  // Caption Assistant (Rewriting, shortening, expanding, translating, etc.)
  async assistCaption(
    text: string,
    action: CaptionActionType,
    tone: string,
    language: ContentLanguage
  ): Promise<CaptionAssistResult> {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        action,
        originalText: text,
        enhancedText: 'Please enter text to enhance.',
        alternativeVariations: [],
        charDifference: 0,
        targetLanguage: language,
        toneApplied: tone,
      };
    }

    try {
      const res = await fetch('/api/assist-content-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, action, tone, language }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.result) {
          return json.result;
        }
      }
    } catch {
      // Fall through to algorithmic enhancement
    }

    // High quality deterministic fallback
    let enhanced = '';
    const alternatives: string[] = [];

    switch (action) {
      case 'shorten':
        enhanced = trimmed
          .split(/[.!?\n]/)
          .slice(0, 2)
          .join('. ')
          .trim() + '.';
        alternatives.push(trimmed.slice(0, Math.floor(trimmed.length * 0.6)) + '...');
        break;

      case 'expand':
        enhanced = `${trimmed}\n\nHere is why this matters: When teams align strategic planning with clear unit economics, long-term acquisition costs decrease while customer retention compounds.\n\nKey takeaways:\n• Strategy precedes ad spend.\n• Measure actual conversion velocity.\n• Continuously test your messaging angles.`;
        alternatives.push(`${trimmed}\n\nDeep dive: Modern growth engineering requires empirical evidence rather than gut feeling. Implement this in your next sprint.`);
        break;

      case 'improve_hook':
        enhanced = `Stop scrolling if you care about your marketing ROI: ${trimmed}`;
        alternatives.push(`The biggest mistake brands make with this: ${trimmed}`);
        alternatives.push(`Here is the honest truth about this: ${trimmed}`);
        break;

      case 'add_cta':
        enhanced = `${trimmed}\n\n👉 What is your take on this? Let us know in the comments below! Save this post for later.`;
        alternatives.push(`${trimmed}\n\n🚀 Tap the link in bio to explore our free marketing tools!`);
        break;

      case 'change_tone':
        enhanced = `[${tone} Tone]: ${trimmed} We invite you to explore the data and test these insights with your team.`;
        alternatives.push(`Empirical perspective: ${trimmed}`);
        break;

      case 'translate_urdu':
        enhanced = `یہ ہے آپ کی مارکیٹنگ کی حکمت عملی کو بہتر بنانے کا طریقہ: ${trimmed}۔ مزید تفصیلی رہنمائی کے لیے ہمارے ساتھ جڑے رہیں۔`;
        alternatives.push(`مارکیٹنگ میں کامیابی کے لیے درست حکمت عملی ضروری ہے: ${trimmed}۔`);
        break;

      case 'translate_roman_urdu':
        enhanced = `Yeh hai aap ki marketing strategy behtar bananay ka tariqa: ${trimmed}. Mazeed details ke liye humaray sath juray rahain!`;
        alternatives.push(`Marketing mein kamyabi ke liye sahi planning zaroori hai: ${trimmed}.`);
        break;

      case 'translate_english':
        enhanced = `Here is the strategic perspective: ${trimmed}. Follow for weekly marketing breakdowns.`;
        alternatives.push(`The core insight: ${trimmed}.`);
        break;

      case 'improve_readability':
      case 'rewrite':
      default:
        enhanced = trimmed
          .split('\n')
          .filter(Boolean)
          .map((line) => line.trim())
          .join('\n\n');
        alternatives.push(`Reframed: ${trimmed}`);
        break;
    }

    return {
      action,
      originalText: trimmed,
      enhancedText: enhanced,
      alternativeVariations: alternatives,
      charDifference: enhanced.length - trimmed.length,
      targetLanguage: language,
      toneApplied: tone,
    };
  }

  // Generate Platform Posts (AI proxy with robust fallback)
  async generateSocialPosts(
    project: MarketingProject | null,
    platform: SocialPlatform,
    format: ContentFormat,
    objective: ContentObjective,
    customTopic: string,
    brandTone: BrandVoiceTone,
    language: ContentLanguage
  ): Promise<ContentVariation[]> {
    const brandName = project?.business?.brandName || 'Sparkline Marketing';
    const prodName = project?.products[0]?.name || 'Intelligence Suite';
    const topic = customTopic || `Strategic growth and ${format.toLowerCase()} marketing`;

    try {
      const res = await fetch('/api/generate-social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          platform,
          format,
          objective,
          customTopic: topic,
          brandTone,
          language,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.variations) && json.variations.length > 0) {
          return json.variations;
        }
      }
    } catch {
      // Fall through to algorithmic generation
    }

    return this.generateDefaultPostVariations(
      brandName,
      prodName,
      platform,
      format,
      objective,
      topic,
      brandTone,
      language
    );
  }

  // Deterministic Variations Generator
  generateDefaultPostVariations(
    brandName: string,
    prodName: string,
    platform: SocialPlatform,
    format: ContentFormat,
    objective: ContentObjective,
    topic: string,
    brandTone: BrandVoiceTone,
    language: ContentLanguage
  ): ContentVariation[] {
    const isUrdu = language === 'Urdu';
    const isRoman = language === 'Roman Urdu';

    const hook1 = isUrdu
      ? `کیا آپ کی مارکیٹنگ ٹیم ${topic} میں یہ غلطی کر رہی ہے؟`
      : isRoman
      ? `Kya aap ki marketing team ${topic} mein yeh ghalti kar rahi hai?`
      : `Stop making this critical mistake with ${topic} in 2026.`;

    const hook2 = isUrdu
      ? `${brandName} کے ساتھ ${prodName} کے حقیقی نتائج حاصل کریں۔`
      : isRoman
      ? `${brandName} ke sath ${prodName} ke genuine results hasil karein.`
      : `How top growth teams leverage ${prodName} to scale ${objective.toLowerCase()}.`;

    const hook3 = isUrdu
      ? `ڈیٹا پر مبنی حکمت عملی: ${topic} کو کیسے بہتر بنائیں؟`
      : isRoman
      ? `Data-backed strategy: ${topic} ko kaisay scale karein?`
      : `The uncomfortable truth about ${topic} that most brands ignore.`;

    const body1 = isUrdu
      ? `زیادہ تر کاروبار صرف اندازوں پر خرچ کرتے ہیں۔ ${brandName} کا ${prodName} آپ کو واضح اعداد و شمار اور باقاعدہ منصوبہ بندی فراہم کرتا ہے تاکہ ہر پیسہ درست جگہ استعمال ہو۔`
      : isRoman
      ? `Ziyada tar brands sirf andazon par ad spend kartay hain. ${brandName} ka ${prodName} aap ko clear analytics aur step-by-step strategy deta hai takay har dollar sahi jagah invest ho.`
      : `Most businesses burn ad spend on vanity impressions without verifying post-click conversion friction. With ${brandName}'s ${prodName}, you can systematically plan campaigns, test 6 distinct messaging angles, and protect your margins before scaling budget.`;

    const body2 = isUrdu
      ? `ہم نے دیکھا ہے کہ پائیدار ترقی کے لیے 3 بنیادی اصول ضروری ہیں: 1. درست ہدف بندی، 2. تخلیقی پیغامات کا تسلسل، اور 3. حقیقی ROI کا تخمینہ۔`
      : isRoman
      ? `Hum ne dekha hai ke sustainable growth ke liye 3 cheezain zaroori hain: 1. Clear targeting, 2. Creative testing, aur 3. Real ROI calculation.`
      : `Here are 3 rules we enforce across every client account:\n\n1. Strategy precedes spend: Never scale a channel without break-even calculations.\n2. Creative does the targeting: Test problem-solution and educational angles side-by-side.\n3. Measure deterministic metrics: Audit CTR, CPC, and CPA weekly.`;

    const body3 = isUrdu
      ? `اگر آپ اپنی سیلز اور کسٹمر لائلٹی بڑھانا چاہتے ہیں تو آج ہی جدید ترین مارکیٹنگ ٹولز آزمائیں۔`
      : isRoman
      ? `Agar aap apni sales aur conversions barhana chahtay hain to aaj hi smart marketing tools explore karein.`
      : `When your positioning is sharp, customer resistance drops naturally. See how modern marketing teams run 4x more experiments in half the time with structured planning.`;

    const cta1 = isUrdu
      ? 'مزید معلومات کے لیے بائیو میں دیے گئے لنک پر کلک کریں! 🔗'
      : isRoman
      ? 'Mazeed maloomat ke liye bio mein link par click karein! 🚀'
      : 'Save this post for your next campaign review and tap the link in bio! 📌';

    const cta2 = isUrdu
      ? 'کمنٹس میں اپنی رائے ضرور بتائیں۔'
      : isRoman
      ? 'Comments mein apni raye zaroor dein!'
      : 'What is your biggest hurdle with this? Drop your perspective in the comments below! 👇';

    const cta3 = isUrdu
      ? 'آج ہی مفت ٹرائل شروع کریں۔'
      : isRoman
      ? 'Aaj hi free test karein!'
      : 'Explore the full walkthrough on our website today.';

    const hashtags = [
      `#${brandName.replace(/\s+/g, '')}`,
      `#${platform.replace(/\s+/g, '')}Marketing`,
      '#GrowthStrategy',
      '#MarketingIntelligence',
      '#DigitalMarketing',
    ];

    return [
      {
        id: `var-1-${Date.now()}`,
        platform,
        format,
        openingHook: hook1,
        caption: `${hook1}\n\n${body1}\n\n${cta1}`,
        mainMessage: body1,
        callToAction: cta1,
        hashtags,
        visualDirection: `Clean, high-contrast visual for ${platform}. Highlight the bold hook in clear typography with brand colors.`,
        tone: brandTone,
        characterCount: (hook1 + body1 + cta1).length,
      },
      {
        id: `var-2-${Date.now()}`,
        platform,
        format,
        openingHook: hook2,
        caption: `${hook2}\n\n${body2}\n\n${cta2}`,
        mainMessage: body2,
        callToAction: cta2,
        hashtags,
        visualDirection: `Step-by-step 3-point diagram or carousel cover slide suitable for ${platform}.`,
        tone: brandTone,
        characterCount: (hook2 + body2 + cta2).length,
      },
      {
        id: `var-3-${Date.now()}`,
        platform,
        format,
        openingHook: hook3,
        caption: `${hook3}\n\n${body3}\n\n${cta3}`,
        mainMessage: body3,
        callToAction: cta3,
        hashtags,
        visualDirection: `Engaging candid aesthetic or workspace preview emphasizing strategic clarity and professional authority.`,
        tone: brandTone,
        characterCount: (hook3 + body3 + cta3).length,
      },
    ];
  }

  // Generate Content Ideas (AI proxy with fallback)
  async generateContentIdeas(
    project: MarketingProject | null,
    category: ContentCategory,
    platform: SocialPlatform,
    objective: ContentObjective,
    brandTone: BrandVoiceTone
  ): Promise<ContentIdea[]> {
    const brandName = project?.business?.brandName || 'Sparkline Marketing';
    const prodName = project?.products[0]?.name || 'Marketing Intelligence';
    const projId = project?.id || 'default';

    try {
      const res = await fetch('/api/generate-content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, category, platform, objective, brandTone }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.ideas) && json.ideas.length > 0) {
          return json.ideas;
        }
      }
    } catch {
      // Fall through to fallback ideas
    }

    // High quality deterministic ideas across categories
    return [
      {
        id: `idea-gen-1-${Date.now()}`,
        projectId: projId,
        title: `The 5-Minute ${brandName} Audit Framework`,
        coreConcept: `Step-by-step breakdown helping customers inspect their current marketing workflows before spending.`,
        targetAudience: `Founders and marketing leads seeking efficiency`,
        suggestedPlatform: platform,
        format: 'Educational',
        hook: `Are you leaking ad spend? Here is the 5-minute audit we run before scaling any campaign.`,
        mainMessage: `By verifying CTR, CPC, and break-even ROAS benchmarks upfront, teams avoid costly auction mistakes.`,
        callToAction: `Save this post and run the audit with your team this week!`,
        objective,
        suggestedVisual: `Numbered step-by-step checklist card with clean contrast.`,
        category: 'Educational',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `idea-gen-2-${Date.now()}`,
        projectId: projId,
        title: `Behind the Strategy: How We Built ${prodName}`,
        coreConcept: `Transparent founder/team story highlighting the authentic challenges that inspired this solution.`,
        targetAudience: `Tech-savvy creators, entrepreneurs, and product builders`,
        suggestedPlatform: platform,
        format: 'Behind-the-Scenes',
        hook: `We built ${prodName} because spreadsheets were failing our marketing team every Monday.`,
        mainMessage: `Real innovation comes from eliminating daily operational friction. Here is how we engineered the architecture.`,
        callToAction: `Tell us in the comments: What is the most tedious part of your current marketing routine?`,
        objective,
        suggestedVisual: `Candid team workshop photo or early UI wireframe sketch comparison.`,
        category: 'Inspirational',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `idea-gen-3-${Date.now()}`,
        projectId: projId,
        title: `Contrarian Take: Why 'More Traffic' Won't Fix Your Sales`,
        coreConcept: `Debunks the common belief that top-of-funnel volume cures poor conversion architecture.`,
        targetAudience: `E-commerce operators and B2B growth marketers`,
        suggestedPlatform: platform,
        format: 'Storytelling',
        hook: `Sending more ad traffic to a broken funnel is like pouring water into a bucket full of holes.`,
        mainMessage: `Fix your messaging hooks, offer clarity, and landing page friction before increasing daily ad budgets.`,
        callToAction: `Drop your thoughts below. Do you agree or disagree?`,
        objective,
        suggestedVisual: `Clean comparative funnel graphic showing traffic retention difference.`,
        category: 'Authority Building',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `idea-gen-4-${Date.now()}`,
        projectId: projId,
        title: `Community Poll: Which Platform Yields Your Best ROAS?`,
        coreConcept: `Interactive survey question driving high comment volume and community consensus.`,
        targetAudience: `Active marketing practitioners and community members`,
        suggestedPlatform: platform,
        format: 'Engagement Post',
        hook: `Honest question for modern growth teams: Meta Ads or Google Search?`,
        mainMessage: `Every business experiences different channel efficiency depending on search intent vs discovery.`,
        callToAction: `Vote 🅰️ for Meta, 🅱️ for Google, or 🅲️ for Organic in the comments!`,
        objective: 'Community Building',
        suggestedVisual: 'Bold split typography graphic comparing the two options.',
        category: 'Community Building',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `idea-gen-5-${Date.now()}`,
        projectId: projId,
        title: `Feature Showcase: Predict Your ROI Before Investing`,
        coreConcept: `Direct demonstration of Sparkline's deterministic break-even calculations.`,
        targetAudience: `Budget decision-makers and financial planners`,
        suggestedPlatform: platform,
        format: 'Product Showcase',
        hook: `What if you could simulate 3 marketing growth scenarios before allocating a single dollar?`,
        mainMessage: `Our Results Predictor calculates exact break-even ROAS and sensitivity curves with zero guesswork.`,
        callToAction: `Tap the link to model your next campaign free!`,
        objective: 'Sales',
        suggestedVisual: `Slick dashboard mockup highlighting scenario comparison table.`,
        category: 'Promotional',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export const contentService = new ContentService();
