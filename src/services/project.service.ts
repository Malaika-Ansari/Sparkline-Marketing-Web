import { MarketingProject, ProjectStatus, ProjectProgressSummary } from '@/types/project';
import { auditService } from './audit.service';
import { securityService } from './security.service';
import { supabaseService } from './supabase.service';

const STORAGE_KEY = 'sparkline_marketing_projects';
const DRAFT_KEY = 'sparkline_marketing_new_project_draft';

export const demoSeedProjects: MarketingProject[] = [
  {
    id: 'proj-vitamin-c',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'In Strategy',
    business: {
      brandName: 'Organic Vitamin C Glow Serum',
      websiteUrl: 'https://radiantglowskincare.com',
      description: 'Clean, clinical-grade antioxidant vitamin C serum formulated for hyperpigmentation and daily skin barrier protection.',
      industry: 'Fashion and Beauty',
      businessType: 'D2C',
      location: 'Los Angeles, California, USA',
      regionsServed: 'United States, Canada, United Kingdom',
      operatingStatus: 'Growing',
      businessSize: 'Small Business',
    },
    products: [
      {
        id: 'prod-1',
        name: 'Organic Vitamin C Glow Serum (30ml)',
        category: 'Facial Skincare / Serums',
        description: '20% L-Ascorbic Acid antioxidant serum stabilized with ferulic acid and hyaluronic acid.',
        features: [
          '20% pure L-Ascorbic Acid concentration',
          'Stabilized with 0.5% Ferulic Acid and Vitamin E',
          'Cruelty-free, vegan and fragrance-free formulation',
          'Amber glass bottle with UV-blocking dropper',
        ],
        benefits: [
          'Visibly fades sunspots and post-acne hyperpigmentation in 28 days',
          'Shields skin from environmental pollution and free radical damage',
          'Delivers deep, non-greasy hydration and luminous skin tone',
        ],
        usp: 'Clinical-strength 20% vitamin C stabilized without synthetic preservatives at an accessible direct-to-consumer price point.',
        sellingPrice: 38,
        currency: 'USD',
        costOfGoods: 10.6,
        availability: 'In Stock',
        pageUrl: 'https://radiantglowskincare.com/products/vitamin-c-serum',
      },
    ],
    audience: {
      targetLocations: ['United States', 'Canada'],
      ageRanges: ['25-34', '35-44'],
      customerType: 'Individuals',
      interests: ['Clean Beauty', 'Skincare Routines', 'Dermatology Ingredients', 'Anti-Aging'],
      needsAndProblems: 'Customers are frustrated by expensive department-store serums that oxidize within weeks or cause stinging and redness.',
      mainPainPoints: [
        'Oxidation and darkening of serum bottles before finishing',
        'High price of competitor clinical brands ($80-$160)',
        'Harsh synthetic fragrances that trigger skin sensitivity',
      ],
      preferredLanguages: ['English'],
      purchasingBehavior: 'Research-heavy',
      existingCustomerSegments: 'Skincare enthusiasts who actively inspect ingredient lists before purchasing.',
    },
    competitors: [
      {
        id: 'comp-1',
        name: 'SkinCeuticals C E Ferulic',
        websiteUrl: 'https://skinceuticals.com',
        alternativeOfferings: 'Premium dermatologist gold-standard serum priced at $182.',
      },
      {
        id: 'comp-2',
        name: 'Mad Hippie Vitamin C Serum',
        websiteUrl: 'https://madhippie.com',
        alternativeOfferings: 'Gentle derivative serum at $34 using sodium ascorbyl phosphate.',
      },
    ],
    marketPosition: {
      currentPosition: 'Challenger',
      whatMakesYouDifferent: 'Delivers SkinCeuticals-level 20% potency and stability at Mad Hippie price levels, backed by third-party stability lab testing.',
      competitiveAdvantages: [
        '72% gross margin enabling aggressive paid acquisition',
        'Direct-to-consumer email subscriber base with high replenishment rate',
        '30-day empty bottle money-back guarantee',
      ],
      knownMarketChallenges: [
        'Rising Meta CPMs in the beauty and personal care vertical',
        'High consumer skepticism around clean beauty marketing claims',
      ],
    },
    marketing: {
      selectedGoals: [
        'Increase sales',
        'Improve website traffic',
        'Increase conversions',
        'Improve brand positioning',
      ],
      primaryObjective: 'Increase sales',
      currentChannels: ['Meta Ads', 'Google Search', 'Email Marketing'],
      existingCampaignStatus: 'Running with mixed results',
      monthlyBudget: 15000,
      budgetCurrency: 'USD',
      preferredAdPlatforms: ['Google Ads', 'Meta (Instagram/Facebook)', 'TikTok'],
      campaignDuration: '3-6 months',
      expectedOutcome: '$60,000 monthly DTC revenue at 3.5x blended ROAS.',
    },
  },
  {
    id: 'proj-apex-cloud',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'Active Flight',
    business: {
      brandName: 'Apex Cloud Security Suite',
      websiteUrl: 'https://apexcloudsecurity.io',
      description: 'Agentless cloud security posture management (CSPM) and Kubernetes runtime threat detection for modern engineering teams.',
      industry: 'Technology',
      businessType: 'B2B',
      location: 'Austin, Texas, USA',
      regionsServed: 'North America, Western Europe',
      operatingStatus: 'Growing',
      businessSize: 'Medium Business',
    },
    products: [
      {
        id: 'prod-apex-1',
        name: 'Apex CSPM Platform',
        category: 'Cybersecurity SaaS',
        description: 'Automated multicloud compliance, IAM risk modeling, and container security telemetry.',
        features: [
          'Sub-15 minute agentless read-only cloud onboarding',
          'Automated SOC2, ISO27001, and HIPAA compliance mapping',
          'Kubernetes runtime anomaly alerts with zero false-positives',
        ],
        benefits: [
          'Reduces audit preparation time from weeks to hours',
          'Prevents public S3 and cloud storage data breaches before deployment',
          'Gives CISOs executive-ready risk dashboards in real-time',
        ],
        usp: 'Fastest time-to-value CSPM on the market with transparent per-asset pricing rather than complex enterprise core licensing.',
        sellingPrice: 1200,
        currency: 'USD',
        availability: 'Continuous Service',
        pageUrl: 'https://apexcloudsecurity.io/platform',
      },
    ],
    audience: {
      targetLocations: ['United States', 'United Kingdom', 'Germany'],
      ageRanges: ['25-34', '35-44', '45-54'],
      customerType: 'Businesses',
      interests: ['Cloud Architecture', 'DevSecOps', 'Kubernetes', 'SOC2 Compliance'],
      needsAndProblems: 'Engineering teams struggle with noisy security alerts and invasive agents that degrade production cluster performance.',
      mainPainPoints: [
        'Agent maintenance overhead and host resource contention',
        'Alert fatigue from hundreds of low-priority CVE notifications',
        'Complex, opaque pricing from legacy enterprise security vendors',
      ],
      preferredLanguages: ['English'],
      purchasingBehavior: 'Research-heavy',
    },
    competitors: [
      {
        id: 'comp-apex-1',
        name: 'Wiz Security',
        websiteUrl: 'https://wiz.io',
        alternativeOfferings: 'Market leader in enterprise CNAPP with high minimum spend contracts.',
      },
      {
        id: 'comp-apex-2',
        name: 'Orca Security',
        websiteUrl: 'https://orca.security',
        alternativeOfferings: 'Agentless multicloud security platform.',
      },
    ],
    marketPosition: {
      currentPosition: 'Challenger',
      whatMakesYouDifferent: 'Targeted mid-market DevSecOps focus with self-serve 14-day trials and transparent pricing starting at $1,200/mo.',
      competitiveAdvantages: [
        'Native integrations with GitHub Actions, GitLab CI, and Terraform',
        'Fast lightweight read-only API connectors',
      ],
      knownMarketChallenges: [
        'Long B2B enterprise procurement cycles (90-180 days)',
        'Budget scrutiny from VP of Infrastructure / CTOs',
      ],
    },
    marketing: {
      selectedGoals: ['Generate leads', 'Increase sales', 'Enter a new market'],
      primaryObjective: 'Generate leads',
      currentChannels: ['LinkedIn ABM', 'Google Search', 'Technical Webinars'],
      existingCampaignStatus: 'Scaling profitably',
      monthlyBudget: 28000,
      budgetCurrency: 'USD',
      preferredAdPlatforms: ['LinkedIn Ads', 'Google Ads'],
      campaignDuration: '6-12 months',
      expectedOutcome: '45 qualified enterprise pipeline demos per month under $600 CAC.',
    },
  },
];

class ProjectService {
  /**
   * Retrieve all saved projects from localStorage, falling back to seed demo projects
   */
  getProjects(userId?: string): MarketingProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (userId) {
            const userOwned = parsed.filter(
              (p: MarketingProject) => !p.userId || p.userId === userId
            );
            return userOwned;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read projects from localStorage:', e);
    }
    // Seed default projects if empty
    this.saveAllProjects(demoSeedProjects);
    return demoSeedProjects;
  }

  /**
   * Find project by unique identifier with strict multi-tenant IDOR defense
   */
  getProjectById(id: string, requestingUserId?: string): MarketingProject | undefined {
    const projects = this.getProjects();
    const target = projects.find((p) => p.id === id);
    if (!target) return undefined;

    // Strict IDOR ownership defense:
    // If the project belongs to a user, forbid access if requesting user does not match or is unauthenticated
    if (target.userId) {
      if (!requestingUserId || target.userId !== requestingUserId) {
        auditService.log('security.access_denied', 'marketing_project', {
          userId: requestingUserId,
          resourceId: id,
          outcome: 'denied',
          metadata: { attemptedAction: 'get_project_by_id', ownerId: target.userId },
        });
        return undefined;
      }
    }

    return target;
  }

  /**
   * Save or update an existing project
   */
  saveProject(project: MarketingProject, userId?: string): MarketingProject {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    const existing = existingIndex >= 0 ? projects[existingIndex] : null;

    // Authorization verification: if existing project belongs to another user, forbid edit
    if (existing && existing.userId && userId && existing.userId !== userId) {
      auditService.log('security.access_denied', 'marketing_project', {
        userId,
        resourceId: project.id,
        outcome: 'denied',
        metadata: { attemptedAction: 'save_project', ownerId: existing.userId },
      });
      throw new Error('Access denied: You do not have permission to modify this private project.');
    }

    // Input sanitization against XSS & HTML injection
    if (project.business) {
      project.business.brandName = securityService.sanitizeText(project.business.brandName);
      project.business.description = securityService.sanitizeText(project.business.description);
    }

    const isNew = existingIndex < 0;
    const projectToSave: MarketingProject = {
      ...project,
      userId: existing?.userId || project.userId || userId,
      updatedAt: new Date().toISOString(),
    };

    let updatedProjects: MarketingProject[];
    if (existingIndex >= 0) {
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = projectToSave;
    } else {
      updatedProjects = [
        {
          ...projectToSave,
          createdAt: project.createdAt || new Date().toISOString(),
        },
        ...projects,
      ];
    }

    this.saveAllProjects(updatedProjects);
    this.clearDraft();

    // Async sync with Supabase cloud PostgreSQL if configured
    if (supabaseService.isConfigured() && projectToSave.userId) {
      supabaseService.saveProject(projectToSave, projectToSave.userId).catch((err) => {
        console.warn('Supabase project sync failed:', err);
      });
    }

    auditService.log(isNew ? 'project.created' : 'project.updated', 'marketing_project', {
      userId: projectToSave.userId || userId,
      resourceId: projectToSave.id,
      outcome: 'success',
      metadata: { brandName: projectToSave.business.brandName, status: projectToSave.status },
    });

    return projectToSave;
  }

  /**
   * Duplicate a project with explicit option controls and strict IDOR defense
   */
  duplicateProject(
    sourceId: string,
    options: {
      newName?: string;
      copyStrategy?: boolean;
      copyBudget?: boolean;
      copyCampaigns?: boolean;
    } = {},
    userId?: string
  ): MarketingProject | null {
    const source = this.getProjectById(sourceId, userId);
    if (!source) return null;

    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const duplicated: MarketingProject = {
      ...source,
      id: newId,
      userId: userId || source.userId,
      createdAt: now,
      updatedAt: now,
      status: 'Draft',
      business: {
        ...source.business,
        brandName: options.newName?.trim() || `${source.business.brandName} (Copy)`,
      },
      // Intentionally do not copy sensitive credentials or historical flight telemetry
    };

    const saved = this.saveProject(duplicated, userId);

    auditService.log('project.duplicated', 'marketing_project', {
      userId: saved.userId,
      resourceId: saved.id,
      outcome: 'success',
      metadata: { sourceId, newBrandName: saved.business.brandName },
    });

    return saved;
  }

  /**
   * Update project status with strict multi-tenant IDOR defense
   */
  updateProjectStatus(id: string, status: ProjectStatus, requestingUserId?: string): MarketingProject | undefined {
    const project = this.getProjectById(id, requestingUserId);
    if (!project) return undefined;

    const updated: MarketingProject = {
      ...project,
      status,
      updatedAt: new Date().toISOString(),
    };
    return this.saveProject(updated, requestingUserId);
  }

  /**
   * Archive a project with IDOR defense
   */
  archiveProject(id: string, requestingUserId?: string): boolean {
    const updated = this.updateProjectStatus(id, 'Archived', requestingUserId);
    if (updated) {
      auditService.log('project.archived', 'marketing_project', {
        userId: updated.userId,
        resourceId: updated.id,
        outcome: 'success',
      });
    }
    return Boolean(updated);
  }

  /**
   * Restore an archived project back to Active with IDOR defense
   */
  restoreProject(id: string, requestingUserId?: string): boolean {
    const updated = this.updateProjectStatus(id, 'Active', requestingUserId);
    if (updated) {
      auditService.log('project.restored', 'marketing_project', {
        userId: updated.userId,
        resourceId: updated.id,
        outcome: 'success',
      });
    }
    return Boolean(updated);
  }

  /**
   * Compute comprehensive project progress across all 10 marketing modules
   */
  computeProjectProgress(project: MarketingProject): ProjectProgressSummary {
    const checks: Record<string, boolean> = {
      businessProfile: Boolean(project.business?.brandName && project.business?.description),
      productCatalog: Boolean(project.products && project.products.length > 0),
      audiencePersona: Boolean(
        project.audience?.targetLocations?.length && project.audience?.mainPainPoints?.length
      ),
      competitorResearch: Boolean(
        (project.competitors && project.competitors.length > 0) ||
          project.marketPosition?.currentPosition
      ),
      marketingObjectives: Boolean(
        project.marketing?.primaryObjective && project.marketing?.monthlyBudget
      ),
      strategyActionPlan: false,
      budgetAllocation: false,
      forecastScenario: false,
      advertisingCampaigns: false,
      contentCalendar: false,
      seoAudit: false,
      executiveReport: false,
    };

    try {
      // Check Strategy
      const stratRaw = localStorage.getItem('sparkline_marketing_unified_strategies');
      if (stratRaw) {
        const strats = JSON.parse(stratRaw);
        if (Array.isArray(strats) && strats.some((s: any) => s.projectId === project.id)) {
          checks.strategyActionPlan = true;
        }
      }

      // Check Budget
      const budgetRaw = localStorage.getItem('sparkline_marketing_budget_plans');
      if (budgetRaw) {
        const budgets = JSON.parse(budgetRaw);
        if (Array.isArray(budgets) && budgets.some((b: any) => b.projectId === project.id)) {
          checks.budgetAllocation = true;
        }
      }

      // Check Forecasts
      const forecastRaw = localStorage.getItem('sparkline_marketing_forecasts');
      if (forecastRaw) {
        const forecasts = JSON.parse(forecastRaw);
        if (Array.isArray(forecasts) && forecasts.some((f: any) => f.projectId === project.id)) {
          checks.forecastScenario = true;
        }
      }

      // Check Campaigns
      const campaignRaw = localStorage.getItem('sparkline_marketing_campaigns');
      if (campaignRaw) {
        const campaigns = JSON.parse(campaignRaw);
        if (Array.isArray(campaigns) && campaigns.some((c: any) => c.projectId === project.id)) {
          checks.advertisingCampaigns = true;
        }
      }

      // Check Content
      const contentRaw = localStorage.getItem('sparkline_content_posts');
      if (contentRaw) {
        const posts = JSON.parse(contentRaw);
        if (Array.isArray(posts) && posts.some((p: any) => p.projectId === project.id)) {
          checks.contentCalendar = true;
        }
      }

      // Check SEO
      const seoRaw = localStorage.getItem('sparkline_seo_audits');
      if (seoRaw) {
        const audits = JSON.parse(seoRaw);
        if (Array.isArray(audits) && audits.length > 0) {
          checks.seoAudit = true;
        }
      }

      // Check Reports
      const reportRaw = localStorage.getItem('sparkline_marketing_reports');
      if (reportRaw) {
        const reports = JSON.parse(reportRaw);
        if (Array.isArray(reports) && reports.some((r: any) => r.projectId === project.id)) {
          checks.executiveReport = true;
        }
      }
    } catch {
      // Ignore reading error
    }

    const totalModules = Object.keys(checks).length;
    const completedCount = Object.values(checks).filter(Boolean).length;
    const overallPercentage = Math.round((completedCount / totalModules) * 100);

    return {
      overallPercentage,
      completedModulesCount: completedCount,
      totalModulesCount: totalModules,
      moduleStatuses: checks,
    };
  }

  /**
   * Delete a project by ID with strict multi-tenant ownership validation
   */
  deleteProject(id: string, requestingUserId?: string): boolean {
    const projects = this.getProjects();
    const target = projects.find((p) => p.id === id);
    if (!target) return false;

    // Strict ownership verification:
    // If project has an owner, require exact requestingUserId match.
    // Anonymous/unauthenticated attempts or cross-user attempts are strictly rejected.
    if (target.userId) {
      if (!requestingUserId || target.userId !== requestingUserId) {
        auditService.log('security.access_denied', 'marketing_project', {
          userId: requestingUserId,
          resourceId: id,
          outcome: 'denied',
          metadata: { attemptedAction: 'delete', ownerId: target.userId },
        });
        return false;
      }
    }

    const filtered = projects.filter((p) => p.id !== id);
    this.saveAllProjects(filtered);

    // Async sync with Supabase cloud PostgreSQL if configured
    if (supabaseService.isConfigured() && target.userId) {
      supabaseService.deleteProject(id, target.userId).catch((err) => {
        console.warn('Supabase project delete failed:', err);
      });
    }

    auditService.log('project.deleted', 'marketing_project', {
      userId: target.userId || requestingUserId,
      resourceId: id,
      outcome: 'success',
      metadata: { brandName: target.business.brandName },
    });

    return true;
  }

  /**
   * Save incomplete multi-step form draft
   */
  saveDraft(draft: Partial<MarketingProject>): void {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not save draft to localStorage:', e);
    }
  }

  /**
   * Retrieve active draft if present
   */
  getDraft(): Partial<MarketingProject> | null {
    try {
      const data = localStorage.getItem(DRAFT_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage:', e);
    }
    return null;
  }

  /**
   * Clear active draft
   */
  clearDraft(): void {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.warn('Could not clear draft from localStorage:', e);
    }
  }

  /**
   * Internal helper to write projects list
   */
  private saveAllProjects(projects: MarketingProject[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not write projects to localStorage:', e);
    }
  }
}

export const projectService = new ProjectService();

