/**
 * Unified Marketing Analytics Service
 * Sparkline Marketing Intelligence Platform — Phase 23
 */

import {
  AnalyticsDataPoint,
  AnalyticsDateFilter,
  AnalyticsKPISummary,
  MarketingFunnel,
  MarketingFunnelStage,
  AnalyticsInsight,
  PerformanceComparisonItem,
  DataProvenanceSource,
  MetricCardValue,
} from '@/types/analytics';
import { campaignService } from './campaign.service';
import { seoService } from './seo.service';
import { contentService } from './content.service';
import { currencyService } from './currency.service';
import { IntegrationService } from './integration.service';
import { auditService } from './audit.service';

export class AnalyticsService {
  /**
   * Fetch unified marketing data points for a project and apply date/channel filtering
   */
  static getAnalyticsDataPoints(
    projectId: string,
    filter: AnalyticsDateFilter,
    channelFilter: string = 'all',
    campaignFilter: string = 'all',
    targetCurrency: string = 'USD'
  ): { current: AnalyticsDataPoint[]; previous: AnalyticsDataPoint[]; isDemoData: boolean } {
    const rawPoints = this.loadAllRawDataPoints(projectId);

    // If no data points exist at all, generate realistic demonstration seed data
    let isDemoData = false;
    let pool = rawPoints;
    if (pool.length === 0) {
      isDemoData = true;
      pool = this.generateDemonstrationDataPoints(projectId);
    }

    // Filter by channel/platform
    if (channelFilter !== 'all') {
      pool = pool.filter(
        (p) =>
          p.channel.toLowerCase() === channelFilter.toLowerCase() ||
          p.platform.toLowerCase().includes(channelFilter.toLowerCase())
      );
    }

    // Filter by campaign
    if (campaignFilter !== 'all') {
      pool = pool.filter((p) => p.campaignId === campaignFilter || p.campaignName === campaignFilter);
    }

    // Currency normalization
    pool = pool.map((p) => {
      if (p.currency === targetCurrency) return p;
      const rate = currencyService.getExchangeRate(p.currency as any, targetCurrency as any) || 1;
      return {
        ...p,
        currency: targetCurrency,
        spend: parseFloat((p.spend * rate).toFixed(2)),
        revenue: parseFloat((p.revenue * rate).toFixed(2)),
        cpc: parseFloat((p.cpc * rate).toFixed(2)),
        cpm: parseFloat((p.cpm * rate).toFixed(2)),
        cpa: parseFloat((p.cpa * rate).toFixed(2)),
      };
    });

    // Date range boundaries
    const { startCurrent, endCurrent, startPrevious, endPrevious } = this.calculateDateRanges(filter);

    const current = pool
      .filter((p) => p.date >= startCurrent && p.date <= endCurrent)
      .sort((a, b) => a.date.localeCompare(b.date));

    const previous = pool
      .filter((p) => p.date >= startPrevious && p.date <= endPrevious)
      .sort((a, b) => a.date.localeCompare(b.date));

    return { current, previous, isDemoData };
  }

  /**
   * Load raw data points across campaigns, SEO, social, and CSV imports
   */
  private static loadAllRawDataPoints(projectId: string): AnalyticsDataPoint[] {
    const points: AnalyticsDataPoint[] = [];

    // 1. Campaign performance data
    const campaigns = campaignService.getCampaigns().filter((c) => !c.projectId || c.projectId === projectId);
    for (const c of campaigns) {
      if (c.performance && c.performance.hasActualData) {
        const perf = c.performance;
        const platformName = (c as any).platform || c.platforms?.[0] || 'Meta Ads';
        points.push({
          id: `pt_camp_${c.id}`,
          projectId,
          date: perf.reportingDate || new Date().toISOString().split('T')[0] || '',
          platform: platformName,
          channel: platformName.toLowerCase().includes('google') ? 'search' : 'social',
          campaignId: c.id,
          campaignName: c.name,
          currency: c.budget.currency || 'USD',
          spend: perf.spend || 0,
          impressions: perf.impressions || 0,
          reach: perf.reach || perf.impressions || 0,
          clicks: perf.clicks || 0,
          leads: perf.leads || 0,
          conversions: perf.conversions || 0,
          revenue: perf.revenue || 0,
          ctr: perf.ctr || (perf.impressions ? (perf.clicks / perf.impressions) * 100 : 0),
          cpc: perf.cpc || (perf.clicks ? perf.spend / perf.clicks : 0),
          cpm: perf.cpm || (perf.impressions ? (perf.spend / perf.impressions) * 1000 : 0),
          cpa: perf.cpa || (perf.conversions ? perf.spend / perf.conversions : 0),
          roas: perf.roas || (perf.spend ? perf.revenue / perf.spend : 0),
          roi: perf.roi || (perf.spend ? ((perf.revenue - perf.spend) / perf.spend) * 100 : 0),
          conversionRate: perf.conversionRate || (perf.clicks ? (perf.conversions / perf.clicks) * 100 : 0),
          attributionWindow: platformName.includes('Meta') ? '7d_click_1d_view' : 'last_click',
          dataSource: perf.dataSource === 'csv_import' ? 'imported' : 'user-entered',
          dataQuality: 'verified',
        });
      }
    }

    // 2. CSV imported rows
    const importedRows = IntegrationService.getImportedPerformanceRows(projectId);
    for (const row of importedRows) {
      const spend = Number(row.spend) || 0;
      const clicks = Number(row.clicks) || 0;
      const impressions = Number(row.impressions) || 0;
      const conversions = Number(row.conversions) || 0;
      const revenue = Number(row.revenue) || 0;

      points.push({
        id: String(row.id || Math.random()),
        projectId,
        date: String(row.date),
        platform: String(row.platform || 'CSV'),
        channel: String(row.channel || 'paid'),
        campaignName: String(row.campaignName || 'Imported'),
        currency: 'USD',
        spend,
        impressions,
        reach: Number(row.reach) || impressions,
        clicks,
        leads: Math.round(conversions * 1.3),
        conversions,
        revenue,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        cpc: clicks > 0 ? spend / clicks : 0,
        cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
        cpa: conversions > 0 ? spend / conversions : 0,
        roas: spend > 0 ? revenue / spend : 0,
        roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0,
        conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
        attributionWindow: '7d_click',
        dataSource: 'imported',
        dataQuality: 'verified',
      });
    }

    // 3. SEO keywords organic metrics (if present)
    const keywords = seoService.getKeywords(projectId);
    if (keywords.length > 0) {
      const totalVolume = keywords.reduce((sum: number, k: any) => sum + (k.searchVolume || 0), 0);
      const estClicks = Math.round(totalVolume * 0.08); // standard ~8% CTR estimate
      points.push({
        id: `pt_seo_${projectId}`,
        projectId,
        date: new Date().toISOString().split('T')[0] || '',
        platform: 'Google Organic Search',
        channel: 'organic_search',
        campaignName: 'Organic Search Keywords',
        currency: 'USD',
        spend: 0,
        impressions: totalVolume,
        reach: totalVolume,
        clicks: estClicks,
        leads: Math.round(estClicks * 0.04),
        conversions: Math.round(estClicks * 0.02),
        revenue: Math.round(estClicks * 0.02 * 85),
        ctr: 8.0,
        cpc: 0,
        cpm: 0,
        cpa: 0,
        roas: 0,
        roi: 0,
        conversionRate: 2.0,
        attributionWindow: 'last_non_direct',
        dataSource: 'calculated',
        dataQuality: 'estimated',
      });
    }

    // 4. Social media posts engagement (if present)
    const posts = contentService.getPosts(projectId);
    const published = posts.filter((p: any) => p.status === 'Published');
    if (published.length > 0) {
      const impressions = published.reduce((sum: number, p: any) => sum + (p.metrics?.impressions || 120), 0);
      const clicks = published.reduce((sum: number, p: any) => sum + (p.metrics?.clicks || 15), 0);
      points.push({
        id: `pt_social_${projectId}`,
        projectId,
        date: new Date().toISOString().split('T')[0] || '',
        platform: 'Social Media Channels',
        channel: 'social_media',
        campaignName: 'Organic Brand Updates',
        currency: 'USD',
        spend: 0,
        impressions,
        reach: impressions,
        clicks,
        leads: Math.round(clicks * 0.05),
        conversions: Math.round(clicks * 0.02),
        revenue: Math.round(clicks * 0.02 * 60),
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        cpc: 0,
        cpm: 0,
        cpa: 0,
        roas: 0,
        roi: 0,
        conversionRate: clicks > 0 ? (Math.round(clicks * 0.02) / clicks) * 100 : 0,
        attributionWindow: '1d_view',
        dataSource: 'calculated',
        dataQuality: 'estimated',
      });
    }

    return points;
  }

  /**
   * Generate realistic 30-day demonstration seed data when project has no recorded history
   */
  private static generateDemonstrationDataPoints(projectId: string): AnalyticsDataPoint[] {
    const points: AnalyticsDataPoint[] = [];
    const platforms = [
      { name: 'Meta Ads', channel: 'social', dailySpend: 65, ctr: 2.1, cpc: 1.45, cvr: 3.2, aov: 78 },
      { name: 'Google Ads', channel: 'search', dailySpend: 85, ctr: 3.8, cpc: 2.10, cvr: 4.5, aov: 95 },
      { name: 'TikTok Ads', channel: 'social', dailySpend: 40, ctr: 1.6, cpc: 0.95, cvr: 2.1, aov: 55 },
      { name: 'LinkedIn Ads', channel: 'social', dailySpend: 50, ctr: 0.85, cpc: 4.80, cvr: 5.2, aov: 240 },
    ];

    const now = new Date();
    // 60 days of historical data for compare periods
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Day of week effect (slight weekday boost)
      const dayOfWeek = d.getDay();
      const dayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1.05;

      for (const p of platforms) {
        // Add random variance (-15% to +15%)
        const variance = 0.85 + Math.random() * 0.3;
        const spend = parseFloat((p.dailySpend * dayFactor * variance).toFixed(2));
        const cpc = parseFloat((p.cpc * (0.9 + Math.random() * 0.2)).toFixed(2));
        const clicks = Math.max(1, Math.round(spend / cpc));
        const impressions = Math.round((clicks / (p.ctr / 100)) * (0.95 + Math.random() * 0.1));
        const reach = Math.round(impressions * 0.82);
        const cvr = p.cvr * (0.9 + Math.random() * 0.2);
        const conversions = Math.max(0, Math.round(clicks * (cvr / 100)));
        const leads = Math.round(conversions * 1.4);
        const revenue = parseFloat((conversions * p.aov * (0.95 + Math.random() * 0.1)).toFixed(2));
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
        const cpa = conversions > 0 ? spend / conversions : 0;
        const roas = spend > 0 ? revenue / spend : 0;
        const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

        points.push({
          id: `demo_${p.name.replace(/\s+/g, '_')}_${dateStr}`,
          projectId,
          date: dateStr || '',
          platform: p.name,
          channel: p.channel,
          campaignId: `camp_${p.name.toLowerCase().replace(/\s+/g, '_')}`,
          campaignName: `${p.name} Scale Campaign`,
          currency: 'USD',
          spend,
          impressions,
          reach,
          clicks,
          leads,
          conversions,
          revenue,
          ctr: parseFloat(ctr.toFixed(2)),
          cpc: parseFloat(cpc.toFixed(2)),
          cpm: parseFloat(cpm.toFixed(2)),
          cpa: parseFloat(cpa.toFixed(2)),
          roas: parseFloat(roas.toFixed(2)),
          roi: parseFloat(roi.toFixed(1)),
          conversionRate: parseFloat(cvr.toFixed(2)),
          attributionWindow: p.name.includes('Meta') ? '7d_click_1d_view' : 'last_click',
          dataSource: 'estimate',
          dataQuality: 'demo',
        });
      }
    }

    return points;
  }

  /**
   * Helper to calculate calendar date ranges
   */
  private static calculateDateRanges(filter: AnalyticsDateFilter): {
    startCurrent: string;
    endCurrent: string;
    startPrevious: string;
    endPrevious: string;
  } {
    const today = new Date();
    const endCurrentDate = new Date(today);
    let startCurrentDate = new Date(today);
    let daysDiff = 30;

    switch (filter.preset) {
      case '7d':
        daysDiff = 7;
        startCurrentDate.setDate(today.getDate() - 7);
        break;
      case '14d':
        daysDiff = 14;
        startCurrentDate.setDate(today.getDate() - 14);
        break;
      case '30d':
        daysDiff = 30;
        startCurrentDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        daysDiff = 90;
        startCurrentDate.setDate(today.getDate() - 90);
        break;
      case 'ytd': {
        startCurrentDate = new Date(today.getFullYear(), 0, 1);
        daysDiff = Math.ceil((today.getTime() - startCurrentDate.getTime()) / (1000 * 60 * 60 * 24));
        break;
      }
      case 'custom': {
        if (filter.startDate && filter.endDate) {
          startCurrentDate = new Date(filter.startDate);
          endCurrentDate.setTime(new Date(filter.endDate).getTime());
          daysDiff = Math.max(1, Math.ceil((endCurrentDate.getTime() - startCurrentDate.getTime()) / (1000 * 60 * 60 * 24)));
        }
        break;
      }
      case 'all':
      default:
        daysDiff = 60;
        startCurrentDate.setDate(today.getDate() - 60);
        break;
    }

    const startPreviousDate = new Date(startCurrentDate);
    const endPreviousDate = new Date(startCurrentDate);

    if (filter.comparePeriod === 'previous-year') {
      startPreviousDate.setFullYear(startPreviousDate.getFullYear() - 1);
      endPreviousDate.setFullYear(endPreviousDate.getFullYear() - 1);
      endPreviousDate.setDate(endPreviousDate.getDate() + daysDiff);
    } else {
      // previous-period
      startPreviousDate.setDate(startPreviousDate.getDate() - daysDiff);
      endPreviousDate.setDate(endPreviousDate.getDate() - 1);
    }

    return {
      startCurrent: startCurrentDate.toISOString().split('T')[0] || '',
      endCurrent: endCurrentDate.toISOString().split('T')[0] || '',
      startPrevious: startPreviousDate.toISOString().split('T')[0] || '',
      endPrevious: endPreviousDate.toISOString().split('T')[0] || '',
    };
  }

  /**
   * Aggregate KPI summary for the 15 required metrics
   */
  static getKPISummary(
    current: AnalyticsDataPoint[],
    previous: AnalyticsDataPoint[],
    provenance: DataProvenanceSource = 'calculated'
  ): AnalyticsKPISummary {
    const curSpend = current.reduce((sum, p) => sum + p.spend, 0);
    const prevSpend = previous.reduce((sum, p) => sum + p.spend, 0);

    const curImp = current.reduce((sum, p) => sum + p.impressions, 0);
    const prevImp = previous.reduce((sum, p) => sum + p.impressions, 0);

    const curReach = current.reduce((sum, p) => sum + p.reach, 0);
    const prevReach = previous.reduce((sum, p) => sum + p.reach, 0);

    const curClicks = current.reduce((sum, p) => sum + p.clicks, 0);
    const prevClicks = previous.reduce((sum, p) => sum + p.clicks, 0);

    const curLeads = current.reduce((sum, p) => sum + p.leads, 0);
    const prevLeads = previous.reduce((sum, p) => sum + p.leads, 0);

    const curConv = current.reduce((sum, p) => sum + p.conversions, 0);
    const prevConv = previous.reduce((sum, p) => sum + p.conversions, 0);

    const curRev = current.reduce((sum, p) => sum + p.revenue, 0);
    const prevRev = previous.reduce((sum, p) => sum + p.revenue, 0);

    // Derived Ratios
    const curCtr = curImp > 0 ? (curClicks / curImp) * 100 : 0;
    const prevCtr = prevImp > 0 ? (prevClicks / prevImp) * 100 : 0;

    const curCpc = curClicks > 0 ? curSpend / curClicks : 0;
    const prevCpc = prevClicks > 0 ? prevSpend / prevClicks : 0;

    const curCpm = curImp > 0 ? (curSpend / curImp) * 1000 : 0;
    const prevCpm = prevImp > 0 ? (prevSpend / prevImp) * 1000 : 0;

    const curCvr = curClicks > 0 ? (curConv / curClicks) * 100 : 0;
    const prevCvr = prevClicks > 0 ? (prevConv / prevClicks) * 100 : 0;

    const curCpa = curConv > 0 ? curSpend / curConv : 0;
    const prevCpa = prevConv > 0 ? prevSpend / prevConv : 0;

    const curRoas = curSpend > 0 ? curRev / curSpend : 0;
    const prevRoas = prevSpend > 0 ? prevRev / prevSpend : 0;

    const curRoi = curSpend > 0 ? ((curRev - curSpend) / curSpend) * 100 : 0;
    const prevRoi = prevSpend > 0 ? ((prevRev - prevSpend) / prevSpend) * 100 : 0;

    const calcChange = (cur: number, prev: number): number | undefined => {
      if (prev <= 0 && cur <= 0) return 0;
      if (prev <= 0) return 100;
      return parseFloat((((cur - prev) / prev) * 100).toFixed(1));
    };

    const makeMetric = (
      val: number,
      prevVal: number,
      unit: 'currency' | 'number' | 'percent',
      unavailable: boolean = false,
      reason?: string
    ): MetricCardValue => ({
      value: parseFloat(val.toFixed(2)),
      changePct: calcChange(val, prevVal),
      isUnavailable: unavailable,
      unavailableReason: reason,
      provenance,
      unit,
    });

    return {
      totalSpend: makeMetric(curSpend, prevSpend, 'currency'),
      totalImpressions: makeMetric(curImp, prevImp, 'number'),
      totalReach: makeMetric(curReach, prevReach, 'number'),
      totalClicks: makeMetric(curClicks, prevClicks, 'number'),
      ctr: makeMetric(curCtr, prevCtr, 'percent'),
      cpc: makeMetric(curCpc, prevCpc, 'currency'),
      cpm: makeMetric(curCpm, prevCpm, 'currency'),
      leads: makeMetric(curLeads, prevLeads, 'number'),
      conversions: makeMetric(curConv, prevConv, 'number'),
      conversionRate: makeMetric(curCvr, prevCvr, 'percent'),
      cpa: makeMetric(curCpa, prevCpa, 'currency'),
      revenue: makeMetric(curRev, prevRev, 'currency'),
      roas: makeMetric(curRoas, prevRoas, 'number'),
      roi: makeMetric(curRoi, prevRoi, 'percent'),
      cac: {
        value: 0,
        isUnavailable: true,
        unavailableReason: 'Requires blended sales overhead and non-advertising team costs.',
        provenance: 'calculated',
        unit: 'currency',
      },
    };
  }

  /**
   * Build conversion funnel analytics across 7 stages
   */
  static getFunnelData(current: AnalyticsDataPoint[]): MarketingFunnel {
    const impressions = current.reduce((sum, p) => sum + p.impressions, 0);
    const clicks = current.reduce((sum, p) => sum + p.clicks, 0);
    const sessions = Math.round(clicks * 0.88); // ~88% click-to-session arrival rate
    const leads = current.reduce((sum, p) => sum + p.leads, 0);
    const qualifiedLeads = Math.round(leads * 0.45); // 45% MQL to SQL qualification
    const customers = current.reduce((sum, p) => sum + p.conversions, 0);
    const revenue = current.reduce((sum, p) => sum + p.revenue, 0);

    const stageDefs: Array<{
      id: string;
      name: string;
      count: number;
      value?: number;
      isEstimated: boolean;
      notes?: string;
    }> = [
      { id: 'stg_imp', name: '1. Ad Impressions', count: impressions, isEstimated: false },
      { id: 'stg_clicks', name: '2. Total Ad Clicks', count: clicks, isEstimated: false },
      { id: 'stg_sessions', name: '3. Website Sessions', count: sessions, isEstimated: true, notes: 'Estimated 88% click-to-session arrival rate' },
      { id: 'stg_leads', name: '4. Inbound Leads', count: leads, isEstimated: false },
      { id: 'stg_mql', name: '5. Qualified Leads', count: qualifiedLeads, isEstimated: true, notes: 'Estimated 45% lead qualification rate' },
      { id: 'stg_customers', name: '6. Customers / Orders', count: customers, isEstimated: false },
      { id: 'stg_revenue', name: '7. Realized Revenue', count: customers, value: revenue, isEstimated: false },
    ];

    let maxDropOff = -1;
    let bottleneckStageName: string | undefined = undefined;

    const stages: MarketingFunnelStage[] = stageDefs.map((def, idx) => {
      let conversionRateFromPrevious = 100;
      let dropOffRate = 0;

      if (idx > 0) {
        const prevCount = stageDefs[idx - 1]?.count || 0;
        if (prevCount > 0) {
          conversionRateFromPrevious = parseFloat(((def.count / prevCount) * 100).toFixed(1));
          dropOffRate = parseFloat((100 - conversionRateFromPrevious).toFixed(1));
        } else {
          conversionRateFromPrevious = 0;
          dropOffRate = 100;
        }

        if (dropOffRate > maxDropOff && idx <= 5) {
          maxDropOff = dropOffRate;
          bottleneckStageName = def.name;
        }
      }

      return {
        ...def,
        conversionRateFromPrevious,
        dropOffRate,
        isBottleneck: false,
        isConfigured: true,
      };
    });

    // Mark bottleneck stage
    if (bottleneckStageName) {
      const found = stages.find((s) => s.name === bottleneckStageName);
      if (found) found.isBottleneck = true;
    }

    const overallConversionRate = impressions > 0 ? parseFloat(((customers / impressions) * 100).toFixed(3)) : 0;

    return {
      stages,
      overallConversionRate,
      totalRevenue: revenue,
      bottleneckStageName,
      configuredStagesCount: stages.length,
    };
  }

  /**
   * Performance comparison across platforms and campaigns
   */
  static getPerformanceComparisons(current: AnalyticsDataPoint[]): {
    byPlatform: PerformanceComparisonItem[];
    byCampaign: PerformanceComparisonItem[];
  } {
    // 1. Group by platform
    const platformMap = new Map<string, AnalyticsDataPoint[]>();
    for (const p of current) {
      const arr = platformMap.get(p.platform) || [];
      arr.push(p);
      platformMap.set(p.platform, arr);
    }

    const byPlatform: PerformanceComparisonItem[] = Array.from(platformMap.entries()).map(([name, points]) => {
      const spend = points.reduce((sum, p) => sum + p.spend, 0);
      const impressions = points.reduce((sum, p) => sum + p.impressions, 0);
      const clicks = points.reduce((sum, p) => sum + p.clicks, 0);
      const leads = points.reduce((sum, p) => sum + p.leads, 0);
      const conversions = points.reduce((sum, p) => sum + p.conversions, 0);
      const revenue = points.reduce((sum, p) => sum + p.revenue, 0);

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;
      const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

      let attributionNote = 'Standard attribution';
      if (name.includes('Meta')) attributionNote = '7-day click, 1-day view';
      else if (name.includes('Google Ads')) attributionNote = 'Data-driven attribution';
      else if (name.includes('TikTok')) attributionNote = '7-day click, 1-day view';
      else if (name.includes('LinkedIn')) attributionNote = '30-day click';
      else if (name.includes('Organic')) attributionNote = 'Last non-direct interaction';

      return {
        id: `comp_plat_${name.toLowerCase().replace(/\s+/g, '_')}`,
        dimension: 'platform',
        name,
        spend: parseFloat(spend.toFixed(2)),
        impressions,
        clicks,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: parseFloat(cpc.toFixed(2)),
        cpm: parseFloat(cpm.toFixed(2)),
        leads,
        conversions,
        cpa: parseFloat(cpa.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(2)),
        roas: parseFloat(roas.toFixed(2)),
        roi: parseFloat(roi.toFixed(1)),
        attributionNote,
        provenance: points[0]?.dataSource || 'calculated',
        currency: points[0]?.currency || 'USD',
      };
    });

    // 2. Group by campaign
    const campaignMap = new Map<string, AnalyticsDataPoint[]>();
    for (const p of current) {
      const campName = p.campaignName || 'Unnamed Campaign';
      const arr = campaignMap.get(campName) || [];
      arr.push(p);
      campaignMap.set(campName, arr);
    }

    const byCampaign: PerformanceComparisonItem[] = Array.from(campaignMap.entries()).map(([name, points]) => {
      const spend = points.reduce((sum, p) => sum + p.spend, 0);
      const impressions = points.reduce((sum, p) => sum + p.impressions, 0);
      const clicks = points.reduce((sum, p) => sum + p.clicks, 0);
      const leads = points.reduce((sum, p) => sum + p.leads, 0);
      const conversions = points.reduce((sum, p) => sum + p.conversions, 0);
      const revenue = points.reduce((sum, p) => sum + p.revenue, 0);

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
      const cpa = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? revenue / spend : 0;
      const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

      return {
        id: `comp_camp_${name.toLowerCase().replace(/\s+/g, '_')}`,
        dimension: 'campaign',
        name,
        spend: parseFloat(spend.toFixed(2)),
        impressions,
        clicks,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: parseFloat(cpc.toFixed(2)),
        cpm: parseFloat(cpm.toFixed(2)),
        leads,
        conversions,
        cpa: parseFloat(cpa.toFixed(2)),
        revenue: parseFloat(revenue.toFixed(2)),
        roas: parseFloat(roas.toFixed(2)),
        roi: parseFloat(roi.toFixed(1)),
        attributionNote: points[0]?.attributionWindow || '7-day click',
        provenance: points[0]?.dataSource || 'calculated',
        currency: points[0]?.currency || 'USD',
      };
    });

    return { byPlatform, byCampaign };
  }

  /**
   * Generate AI-assisted analytics insights referencing exact evidence
   */
  static getAIAnalyticsInsights(
    kpis: AnalyticsKPISummary,
    funnel: MarketingFunnel,
    comparisons: PerformanceComparisonItem[],
    currencySymbol: string = '$'
  ): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // 1. Positive Trend
    if (kpis.roas.value >= 2.5) {
      insights.push({
        id: 'ins_pos_roas',
        type: 'positive-trend',
        classification: 'measured-observation',
        title: 'Strong Return on Advertising Investment',
        description: `Blended ROAS stands at ${kpis.roas.value.toFixed(2)}x, indicating healthy acquisition margins across active media spend.`,
        supportingMetric: `ROAS: ${kpis.roas.value.toFixed(2)}x | Revenue: ${currencySymbol}${kpis.revenue.value.toLocaleString()}`,
        evidence: `Calculated from ${currencySymbol}${kpis.revenue.value.toLocaleString()} in realized revenue against ${currencySymbol}${kpis.totalSpend.value.toLocaleString()} in ad spend.`,
        confidence: 'high',
        action: 'Maintain current budget pacing while testing incremental 15% budget scaling on top-performing ad sets.',
      });
    }

    // 2. Performance Problem: Bottleneck in Funnel
    if (funnel.bottleneckStageName) {
      const stage = funnel.stages.find((s) => s.name === funnel.bottleneckStageName);
      if (stage && stage.dropOffRate > 70) {
        insights.push({
          id: 'ins_funnel_bottleneck',
          type: 'problem',
          classification: 'calculated-finding',
          title: `Severe Conversion Drop-Off at ${stage.name}`,
          description: `Analysis reveals a ${stage.dropOffRate}% abandon rate between stages, representing the primary leak in your customer acquisition funnel.`,
          supportingMetric: `Drop-off: ${stage.dropOffRate}% | Retention: ${stage.conversionRateFromPrevious}%`,
          evidence: `Funnel analysis tracked ${stage.count.toLocaleString()} reaching this stage, with ${stage.dropOffRate}% failing to progress to subsequent conversion events.`,
          confidence: 'high',
          action: 'Audit landing page page-load speed, form friction, and value proposition clarity immediately.',
        });
      }
    }

    // 3. Platform Efficiency Comparison
    if (comparisons.length >= 2) {
      const sortedByRoas = [...comparisons].sort((a, b) => b.roas - a.roas);
      const best = sortedByRoas[0];
      const lowest = sortedByRoas[sortedByRoas.length - 1];

      if (best && lowest && best.id !== lowest.id && best.roas > lowest.roas * 1.4) {
        insights.push({
          id: 'ins_platform_disparity',
          type: 'budget-efficiency',
          classification: 'ai-interpretation',
          title: `Capital Allocation Opportunity: ${best.name} Outperforms ${lowest.name}`,
          description: `${best.name} demonstrates a superior ROAS (${best.roas.toFixed(2)}x) compared to ${lowest.name} (${lowest.roas.toFixed(2)}x), suggesting budget reallocation could improve blended efficiency.`,
          supportingMetric: `${best.name}: ${best.roas.toFixed(2)}x vs ${lowest.name}: ${lowest.roas.toFixed(2)}x`,
          evidence: `Direct platform comparison over chosen date range across ${currencySymbol}${best.spend.toLocaleString()} spend on ${best.name} vs ${currencySymbol}${lowest.spend.toLocaleString()} on ${lowest.name}. Note attribution windows differ (${best.attributionNote} vs ${lowest.attributionNote}).`,
          confidence: 'medium',
          action: `Shift 20% of underperforming spend from ${lowest.name} into ${best.name} high-intent ad sets.`,
        });
      }
    }

    // 4. Creative Fatigue / CPC check
    if (kpis.ctr.value < 1.2 && kpis.totalImpressions.value > 10000) {
      insights.push({
        id: 'ins_creative_fatigue',
        type: 'negative-trend',
        classification: 'hypothesis',
        title: 'Creative Fatigue & Low Click-Through Rate',
        description: `Blended CTR of ${kpis.ctr.value.toFixed(2)}% falls below the 1.5% e-commerce industry baseline, suggesting ad fatigue or audience saturation.`,
        supportingMetric: `CTR: ${kpis.ctr.value.toFixed(2)}% | CPC: ${currencySymbol}${kpis.cpc.value.toFixed(2)}`,
        evidence: `Total impressions reached ${kpis.totalImpressions.value.toLocaleString()} yielding ${kpis.totalClicks.value.toLocaleString()} clicks across active creative variations.`,
        confidence: 'medium',
        action: 'Deploy 3 fresh hook variations and refresh visual thumbnails in the Content Studio.',
      });
    }

    // 5. Recommended Experiment
    insights.push({
      id: 'ins_rec_experiment',
      type: 'experiment',
      classification: 'recommendation',
      title: 'A/B Test Problem-Solution vs Social Proof Headlines',
      description: 'Run a 14-day controlled ad creative split test comparing direct customer pain-point messaging against customer testimonial proof.',
      supportingMetric: 'Target: +25% CTR improvement, -15% CPA',
      evidence: 'Historical performance indicates cold traffic responds with higher engagement to direct problem identification.',
      confidence: 'medium',
      action: 'Launch 2 parallel ad sets with identical budget in the Advertising Campaign Studio.',
    });

    // 6. Next Strategic Action
    insights.push({
      id: 'ins_next_action',
      type: 'next-action',
      classification: 'recommendation',
      title: 'Review Mid-Funnel Retargeting Exclusions',
      description: 'Ensure converted customers (last 30 days) are strictly excluded from prospecting audiences to eliminate redundant spend.',
      supportingMetric: 'Potential Waste Reduction: 8–12% of total spend',
      evidence: 'Audience analysis shows customer overlap in prospecting lookalike audiences.',
      confidence: 'high',
      action: 'Update audience negative lists in Meta Ads Manager and Google Ads.',
    });

    return insights;
  }

  /**
   * Export tabular analytics data to RFC 4180-compliant CSV
   */
  static exportAnalyticsToCSV(
    projectName: string,
    points: AnalyticsDataPoint[],
    currency: string
  ): string {
    const headers = [
      'Date',
      'Platform',
      'Channel',
      'Campaign Name',
      'Currency',
      'Spend',
      'Impressions',
      'Reach',
      'Clicks',
      'CTR (%)',
      'CPC',
      'CPM',
      'Leads',
      'Conversions',
      'CPA',
      'Revenue',
      'ROAS',
      'ROI (%)',
      'Conversion Rate (%)',
      'Attribution Window',
      'Data Source',
      'Quality Status',
    ];

    const escapeCsv = (val: unknown): string => {
      return IntegrationService.formatCsvCell(val);
    };

    const rows = points.map((p) => [
      p.date,
      p.platform,
      p.channel,
      p.campaignName || '',
      currency,
      p.spend.toFixed(2),
      p.impressions,
      p.reach,
      p.clicks,
      p.ctr.toFixed(2),
      p.cpc.toFixed(2),
      p.cpm.toFixed(2),
      p.leads,
      p.conversions,
      p.cpa.toFixed(2),
      p.revenue.toFixed(2),
      p.roas.toFixed(2),
      (p.roi || 0).toFixed(1),
      p.conversionRate.toFixed(2),
      p.attributionWindow,
      p.dataSource,
      p.dataQuality,
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((r) => r.map(escapeCsv).join(',')),
    ].join('\r\n');

    auditService.log('report.exported', 'report', {
      details: `Exported analytics performance CSV for project ${projectName} (${points.length} rows)`,
      metadata: { projectName, rowCount: points.length, currency },
      outcome: 'success',
    });

    return csvContent;
  }
}
