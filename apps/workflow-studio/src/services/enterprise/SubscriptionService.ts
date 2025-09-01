/**
 * Subscription Service for Auterity Error-IQ
 * Manages subscription tiers, feature entitlements, and billing
 * Supports SaaS Enterprise, White-label, and Self-hosted deployments
 */

import { z } from "zod";

// Types for subscription management
export type SubscriptionTier = 'saas-enterprise' | 'saas-professional' | 'saas-starter' | 'white-label-enterprise' | 'white-label-professional' | 'self-hosted-enterprise' | 'self-hosted-professional' | 'self-hosted-community';

export type DeploymentType = 'saas' | 'white-label' | 'self-hosted';

export type FeatureEntitlement = 'basic' | 'premium' | 'enterprise' | 'disabled';

export interface SubscriptionFeatures {
  // AI Services
  aiModelAccess: FeatureEntitlement;
  customModels: FeatureEntitlement;
  multimodalAI: FeatureEntitlement;
  batchProcessing: FeatureEntitlement;

  // Workflow Features
  workflowCanvas: FeatureEntitlement;
  advancedNodes: FeatureEntitlement;
  workflowTemplates: FeatureEntitlement;
  collaborativeEditing: FeatureEntitlement;

  // Enterprise Features
  temporalWorkflows: FeatureEntitlement;
  weightsAndBiases: FeatureEntitlement;
  postmanPostbot: FeatureEntitlement;
  testSigma: FeatureEntitlement;
  novitaAI: FeatureEntitlement;

  // Analytics & Monitoring
  basicAnalytics: FeatureEntitlement;
  advancedAnalytics: FeatureEntitlement;
  customDashboards: FeatureEntitlement;
  predictiveAnalytics: FeatureEntitlement;

  // Security & Compliance
  basicSecurity: FeatureEntitlement;
  enterpriseSecurity: FeatureEntitlement;
  auditLogs: FeatureEntitlement;
  complianceReporting: FeatureEntitlement;

  // Support & Services
  emailSupport: FeatureEntitlement;
  prioritySupport: FeatureEntitlement;
  dedicatedSupport: FeatureEntitlement;
  customIntegrations: FeatureEntitlement;

  // Limits & Quotas
  maxWorkflows: number;
  maxUsers: number;
  maxAPIRequests: number;
  storageLimit: number; // in GB
  computeHours: number; // monthly
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  deploymentType: DeploymentType;
  features: SubscriptionFeatures;
  pricing: {
    monthly: number;
    annual: number;
    currency: string;
  };
  limits: {
    users: number;
    workflows: number;
    apiCalls: number;
    storage: number;
  };
  isActive: boolean;
  trialDays?: number;
}

export interface Subscription {
  id: string;
  planId: string;
  organizationId: string;
  organizationName: string;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled' | 'trial';
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  billingCycle: 'monthly' | 'annual';
  autoRenew: boolean;
  paymentMethod?: string;
  usage: {
    current: {
      users: number;
      workflows: number;
      apiCalls: number;
      storage: number;
    };
    limits: {
      users: number;
      workflows: number;
      apiCalls: number;
      storage: number;
    };
  };
  metadata?: Record<string, any>;
}

export interface LicenseKey {
  id: string;
  key: string;
  subscriptionId: string;
  deploymentType: DeploymentType;
  features: string[];
  issuedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  isValid: boolean;
  metadata?: Record<string, any>;
}

export class SubscriptionService {
  private subscriptions: Map<string, Subscription> = new Map();
  private plans: Map<string, SubscriptionPlan> = new Map();
  private licenseKeys: Map<string, LicenseKey> = new Map();
  private currentSubscription: Subscription | null = null;

  constructor() {
    this.initializeSubscriptionPlans();
    this.loadCurrentSubscription();
  }

  /**
   * Initialize all available subscription plans
   */
  private initializeSubscriptionPlans(): void {
    const plans: SubscriptionPlan[] = [
      // SaaS Plans
      {
        id: 'saas-starter',
        name: 'SaaS Starter',
        tier: 'saas-starter',
        deploymentType: 'saas',
        pricing: { monthly: 49, annual: 490, currency: 'USD' },
        limits: { users: 5, workflows: 10, apiCalls: 10000, storage: 5 },
        isActive: true,
        features: this.getStarterFeatures()
      },
      {
        id: 'saas-professional',
        name: 'SaaS Professional',
        tier: 'saas-professional',
        deploymentType: 'saas',
        pricing: { monthly: 199, annual: 1990, currency: 'USD' },
        limits: { users: 25, workflows: 100, apiCalls: 100000, storage: 50 },
        isActive: true,
        features: this.getProfessionalFeatures()
      },
      {
        id: 'saas-enterprise',
        name: 'SaaS Enterprise',
        tier: 'saas-enterprise',
        deploymentType: 'saas',
        pricing: { monthly: 999, annual: 9990, currency: 'USD' },
        limits: { users: 1000, workflows: 1000, apiCalls: 1000000, storage: 500 },
        isActive: true,
        features: this.getEnterpriseFeatures()
      },

      // White-label Plans
      {
        id: 'white-label-professional',
        name: 'White-label Professional',
        tier: 'white-label-professional',
        deploymentType: 'white-label',
        pricing: { monthly: 499, annual: 4990, currency: 'USD' },
        limits: { users: 50, workflows: 200, apiCalls: 250000, storage: 100 },
        isActive: true,
        features: this.getProfessionalFeatures()
      },
      {
        id: 'white-label-enterprise',
        name: 'White-label Enterprise',
        tier: 'white-label-enterprise',
        deploymentType: 'white-label',
        pricing: { monthly: 1999, annual: 19990, currency: 'USD' },
        limits: { users: 5000, workflows: 5000, apiCalls: 5000000, storage: 2000 },
        isActive: true,
        features: this.getEnterpriseFeatures()
      },

      // Self-hosted Plans
      {
        id: 'self-hosted-community',
        name: 'Self-hosted Community',
        tier: 'self-hosted-community',
        deploymentType: 'self-hosted',
        pricing: { monthly: 0, annual: 0, currency: 'USD' },
        limits: { users: 3, workflows: 10, apiCalls: 1000, storage: 1 },
        isActive: true,
        trialDays: 0,
        features: this.getCommunityFeatures()
      },
      {
        id: 'self-hosted-professional',
        name: 'Self-hosted Professional',
        tier: 'self-hosted-professional',
        deploymentType: 'self-hosted',
        pricing: { monthly: 799, annual: 7990, currency: 'USD' },
        limits: { users: 100, workflows: 500, apiCalls: 500000, storage: 1000 },
        isActive: true,
        features: this.getProfessionalFeatures()
      },
      {
        id: 'self-hosted-enterprise',
        name: 'Self-hosted Enterprise',
        tier: 'self-hosted-enterprise',
        deploymentType: 'self-hosted',
        pricing: { monthly: 2999, annual: 29990, currency: 'USD' },
        limits: { users: 10000, workflows: 10000, apiCalls: 10000000, storage: 5000 },
        isActive: true,
        features: this.getEnterpriseFeatures()
      }
    ];

    plans.forEach(plan => {
      this.plans.set(plan.id, plan);
    });

    console.log(`Initialized ${plans.length} subscription plans`);
  }

  /**
   * Get community tier features
   */
  private getCommunityFeatures(): SubscriptionFeatures {
    return {
      // AI Services
      aiModelAccess: 'basic',
      customModels: 'disabled',
      multimodalAI: 'disabled',
      batchProcessing: 'disabled',

      // Workflow Features
      workflowCanvas: 'basic',
      advancedNodes: 'disabled',
      workflowTemplates: 'basic',
      collaborativeEditing: 'disabled',

      // Enterprise Features
      temporalWorkflows: 'disabled',
      weightsAndBiases: 'disabled',
      postmanPostbot: 'disabled',
      testSigma: 'disabled',
      novitaAI: 'disabled',

      // Analytics & Monitoring
      basicAnalytics: 'basic',
      advancedAnalytics: 'disabled',
      customDashboards: 'disabled',
      predictiveAnalytics: 'disabled',

      // Security & Compliance
      basicSecurity: 'basic',
      enterpriseSecurity: 'disabled',
      auditLogs: 'disabled',
      complianceReporting: 'disabled',

      // Support & Services
      emailSupport: 'basic',
      prioritySupport: 'disabled',
      dedicatedSupport: 'disabled',
      customIntegrations: 'disabled',

      // Limits & Quotas
      maxWorkflows: 10,
      maxUsers: 3,
      maxAPIRequests: 1000,
      storageLimit: 1,
      computeHours: 10
    };
  }

  /**
   * Get starter tier features
   */
  private getStarterFeatures(): SubscriptionFeatures {
    return {
      // AI Services
      aiModelAccess: 'basic',
      customModels: 'disabled',
      multimodalAI: 'disabled',
      batchProcessing: 'disabled',

      // Workflow Features
      workflowCanvas: 'basic',
      advancedNodes: 'disabled',
      workflowTemplates: 'basic',
      collaborativeEditing: 'disabled',

      // Enterprise Features
      temporalWorkflows: 'disabled',
      weightsAndBiases: 'disabled',
      postmanPostbot: 'disabled',
      testSigma: 'disabled',
      novitaAI: 'disabled',

      // Analytics & Monitoring
      basicAnalytics: 'basic',
      advancedAnalytics: 'disabled',
      customDashboards: 'disabled',
      predictiveAnalytics: 'disabled',

      // Security & Compliance
      basicSecurity: 'basic',
      enterpriseSecurity: 'disabled',
      auditLogs: 'disabled',
      complianceReporting: 'disabled',

      // Support & Services
      emailSupport: 'basic',
      prioritySupport: 'disabled',
      dedicatedSupport: 'disabled',
      customIntegrations: 'disabled',

      // Limits & Quotas
      maxWorkflows: 10,
      maxUsers: 5,
      maxAPIRequests: 10000,
      storageLimit: 5,
      computeHours: 50
    };
  }

  /**
   * Get professional tier features
   */
  private getProfessionalFeatures(): SubscriptionFeatures {
    return {
      // AI Services
      aiModelAccess: 'premium',
      customModels: 'basic',
      multimodalAI: 'basic',
      batchProcessing: 'basic',

      // Workflow Features
      workflowCanvas: 'premium',
      advancedNodes: 'premium',
      workflowTemplates: 'premium',
      collaborativeEditing: 'premium',

      // Enterprise Features
      temporalWorkflows: 'premium',
      weightsAndBiases: 'premium',
      postmanPostbot: 'premium',
      testSigma: 'premium',
      novitaAI: 'premium',

      // Analytics & Monitoring
      basicAnalytics: 'premium',
      advancedAnalytics: 'premium',
      customDashboards: 'premium',
      predictiveAnalytics: 'basic',

      // Security & Compliance
      basicSecurity: 'premium',
      enterpriseSecurity: 'basic',
      auditLogs: 'premium',
      complianceReporting: 'basic',

      // Support & Services
      emailSupport: 'premium',
      prioritySupport: 'premium',
      dedicatedSupport: 'disabled',
      customIntegrations: 'basic',

      // Limits & Quotas
      maxWorkflows: 100,
      maxUsers: 25,
      maxAPIRequests: 100000,
      storageLimit: 50,
      computeHours: 500
    };
  }

  /**
   * Get enterprise tier features
   */
  private getEnterpriseFeatures(): SubscriptionFeatures {
    return {
      // AI Services
      aiModelAccess: 'enterprise',
      customModels: 'enterprise',
      multimodalAI: 'enterprise',
      batchProcessing: 'enterprise',

      // Workflow Features
      workflowCanvas: 'enterprise',
      advancedNodes: 'enterprise',
      workflowTemplates: 'enterprise',
      collaborativeEditing: 'enterprise',

      // Enterprise Features
      temporalWorkflows: 'enterprise',
      weightsAndBiases: 'enterprise',
      postmanPostbot: 'enterprise',
      testSigma: 'enterprise',
      novitaAI: 'enterprise',

      // Analytics & Monitoring
      basicAnalytics: 'enterprise',
      advancedAnalytics: 'enterprise',
      customDashboards: 'enterprise',
      predictiveAnalytics: 'enterprise',

      // Security & Compliance
      basicSecurity: 'enterprise',
      enterpriseSecurity: 'enterprise',
      auditLogs: 'enterprise',
      complianceReporting: 'enterprise',

      // Support & Services
      emailSupport: 'enterprise',
      prioritySupport: 'enterprise',
      dedicatedSupport: 'enterprise',
      customIntegrations: 'enterprise',

      // Limits & Quotas
      maxWorkflows: 1000,
      maxUsers: 1000,
      maxAPIRequests: 1000000,
      storageLimit: 500,
      computeHours: 5000
    };
  }

  /**
   * Load current subscription from storage/API
   */
  private async loadCurrentSubscription(): Promise<void> {
    try {
      // In a real implementation, this would load from API or local storage
      // For demo purposes, we'll set a default SaaS Enterprise subscription

      const mockSubscription: Subscription = {
        id: 'sub_demo_001',
        planId: 'saas-enterprise',
        organizationId: 'org_demo',
        organizationName: 'Demo Organization',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        billingCycle: 'monthly',
        autoRenew: true,
        usage: {
          current: {
            users: 45,
            workflows: 125,
            apiCalls: 45000,
            storage: 12
          },
          limits: {
            users: 1000,
            workflows: 1000,
            apiCalls: 1000000,
            storage: 500
          }
        }
      };

      this.subscriptions.set(mockSubscription.id, mockSubscription);
      this.currentSubscription = mockSubscription;

    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  }

  /**
   * Get current subscription
   */
  getCurrentSubscription(): Subscription | null {
    return this.currentSubscription;
  }

  /**
   * Get current subscription plan
   */
  getCurrentPlan(): SubscriptionPlan | null {
    if (!this.currentSubscription) return null;
    return this.plans.get(this.currentSubscription.planId) || null;
  }

  /**
   * Check if a feature is available in current subscription
   */
  isFeatureAvailable(feature: keyof SubscriptionFeatures): boolean {
    const plan = this.getCurrentPlan();
    if (!plan) return false;

    const entitlement = plan.features[feature];
    return entitlement !== 'disabled';
  }

  /**
   * Get feature entitlement level
   */
  getFeatureEntitlement(feature: keyof SubscriptionFeatures): FeatureEntitlement {
    const plan = this.getCurrentPlan();
    if (!plan) return 'disabled';

    return plan.features[feature];
  }

  /**
   * Check if usage is within limits
   */
  checkUsageLimits(): {
    withinLimits: boolean;
    violations: Array<{
      metric: string;
      current: number;
      limit: number;
      percentage: number;
    }>;
  } {
    if (!this.currentSubscription) {
      return { withinLimits: false, violations: [] };
    }

    const { current, limits } = this.currentSubscription.usage;
    const violations = [];

    // Check each metric
    if (current.users > limits.users) {
      violations.push({
        metric: 'users',
        current: current.users,
        limit: limits.users,
        percentage: (current.users / limits.users) * 100
      });
    }

    if (current.workflows > limits.workflows) {
      violations.push({
        metric: 'workflows',
        current: current.workflows,
        limit: limits.workflows,
        percentage: (current.workflows / limits.workflows) * 100
      });
    }

    if (current.apiCalls > limits.apiCalls) {
      violations.push({
        metric: 'apiCalls',
        current: current.apiCalls,
        limit: limits.apiCalls,
        percentage: (current.apiCalls / limits.apiCalls) * 100
      });
    }

    if (current.storage > limits.storage) {
      violations.push({
        metric: 'storage',
        current: current.storage,
        limit: limits.storage,
        percentage: (current.storage / limits.storage) * 100
      });
    }

    return {
      withinLimits: violations.length === 0,
      violations
    };
  }

  /**
   * Get usage analytics
   */
  getUsageAnalytics(): {
    utilization: Record<string, number>;
    trends: Array<{
      date: string;
      users: number;
      workflows: number;
      apiCalls: number;
      storage: number;
    }>;
    predictions: {
      nextMonthUsage: Record<string, number>;
      recommendedPlan?: string;
    };
  } {
    if (!this.currentSubscription) {
      return {
        utilization: {},
        trends: [],
        predictions: { nextMonthUsage: {} }
      };
    }

    const { current, limits } = this.currentSubscription.usage;

    // Calculate utilization percentages
    const utilization = {
      users: (current.users / limits.users) * 100,
      workflows: (current.workflows / limits.workflows) * 100,
      apiCalls: (current.apiCalls / limits.apiCalls) * 100,
      storage: (current.storage / limits.storage) * 100
    };

    // Mock trends data (last 7 days)
    const trends = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      trends.push({
        date: date.toISOString().split('T')[0],
        users: Math.max(1, current.users - Math.floor(Math.random() * 10)),
        workflows: Math.max(1, current.workflows - Math.floor(Math.random() * 20)),
        apiCalls: Math.max(1000, current.apiCalls - Math.floor(Math.random() * 5000)),
        storage: Math.max(1, current.storage - Math.floor(Math.random() * 5))
      });
    }

    // Predict next month usage
    const growthRate = 1.15; // 15% growth
    const nextMonthUsage = {
      users: Math.ceil(current.users * growthRate),
      workflows: Math.ceil(current.workflows * growthRate),
      apiCalls: Math.ceil(current.apiCalls * growthRate),
      storage: Math.ceil(current.storage * growthRate)
    };

    // Recommend plan upgrade if needed
    let recommendedPlan;
    if (nextMonthUsage.users > limits.users * 0.9 ||
        nextMonthUsage.workflows > limits.workflows * 0.9 ||
        nextMonthUsage.apiCalls > limits.apiCalls * 0.9) {
      recommendedPlan = 'Upgrade recommended for increased limits';
    }

    return {
      utilization,
      trends,
      predictions: {
        nextMonthUsage,
        recommendedPlan
      }
    };
  }

  /**
   * Create license key for white-label/self-hosted deployments
   */
  createLicenseKey(subscriptionId: string, deploymentType: DeploymentType, features: string[], expiresAt?: Date): string {
    const licenseKey: LicenseKey = {
      id: `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: this.generateLicenseKey(),
      subscriptionId,
      deploymentType,
      features,
      issuedAt: new Date(),
      expiresAt,
      isValid: true
    };

    this.licenseKeys.set(licenseKey.id, licenseKey);
    console.log(`Created license key: ${licenseKey.key} for ${deploymentType}`);

    return licenseKey.key;
  }

  /**
   * Validate license key
   */
  validateLicenseKey(key: string): {
    isValid: boolean;
    subscription?: Subscription;
    plan?: SubscriptionPlan;
    deploymentType?: DeploymentType;
    features?: string[];
    expiresAt?: Date;
    error?: string;
  } {
    const licenseKey = Array.from(this.licenseKeys.values()).find(lk => lk.key === key);

    if (!licenseKey) {
      return { isValid: false, error: 'License key not found' };
    }

    if (!licenseKey.isValid) {
      return { isValid: false, error: 'License key has been revoked' };
    }

    if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
      return { isValid: false, error: 'License key has expired' };
    }

    const subscription = this.subscriptions.get(licenseKey.subscriptionId);
    const plan = subscription ? this.plans.get(subscription.planId) : null;

    return {
      isValid: true,
      subscription: subscription || undefined,
      plan: plan || undefined,
      deploymentType: licenseKey.deploymentType,
      features: licenseKey.features,
      expiresAt: licenseKey.expiresAt
    };
  }

  /**
   * Get all available plans
   */
  getAvailablePlans(deploymentType?: DeploymentType): SubscriptionPlan[] {
    const plans = Array.from(this.plans.values()).filter(plan => plan.isActive);

    if (deploymentType) {
      return plans.filter(plan => plan.deploymentType === deploymentType);
    }

    return plans;
  }

  /**
   * Upgrade subscription
   */
  async upgradeSubscription(newPlanId: string): Promise<boolean> {
    try {
      if (!this.currentSubscription) {
        throw new Error('No active subscription found');
      }

      const newPlan = this.plans.get(newPlanId);
      if (!newPlan) {
        throw new Error('Invalid plan ID');
      }

      // Update subscription
      this.currentSubscription.planId = newPlanId;
      this.currentSubscription.usage.limits = {
        users: newPlan.limits.users,
        workflows: newPlan.limits.workflows,
        apiCalls: newPlan.limits.apiCalls,
        storage: newPlan.limits.storage
      };

      console.log(`Subscription upgraded to ${newPlan.name}`);
      return true;

    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      return false;
    }
  }

  /**
   * Generate a license key
   */
  private generateLicenseKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];

    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 5; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }

    return segments.join('-');
  }

  /**
   * Get subscription billing information
   */
  getBillingInfo(): {
    currentPlan: SubscriptionPlan | null;
    nextBillingDate: Date | null;
    amountDue: number;
    billingHistory: Array<{
      date: Date;
      amount: number;
      status: 'paid' | 'pending' | 'failed';
      invoiceId: string;
    }>;
  } {
    if (!this.currentSubscription) {
      return {
        currentPlan: null,
        nextBillingDate: null,
        amountDue: 0,
        billingHistory: []
      };
    }

    const plan = this.getCurrentPlan();
    if (!plan) {
      return {
        currentPlan: null,
        nextBillingDate: null,
        amountDue: 0,
        billingHistory: []
      };
    }

    // Calculate next billing date
    const nextBillingDate = new Date(this.currentSubscription.startDate);
    if (this.currentSubscription.billingCycle === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // Mock billing history
    const billingHistory = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const billDate = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
      billingHistory.push({
        date: billDate,
        amount: this.currentSubscription.billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual,
        status: 'paid',
        invoiceId: `INV-${billDate.getTime()}`
      });
    }

    return {
      currentPlan: plan,
      nextBillingDate,
      amountDue: this.currentSubscription.billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual,
      billingHistory
    };
  }

  /**
   * Get subscription health status
   */
  getSubscriptionHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
    nextRenewal: Date | null;
    utilizationAlerts: Array<{
      metric: string;
      level: 'low' | 'medium' | 'high';
      message: string;
    }>;
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const utilizationAlerts: Array<{ metric: string; level: 'low' | 'medium' | 'high'; message: string }> = [];

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (!this.currentSubscription) {
      return {
        status: 'critical',
        issues: ['No active subscription found'],
        recommendations: ['Contact support to activate subscription'],
        nextRenewal: null,
        utilizationAlerts: []
      };
    }

    const { current, limits } = this.currentSubscription.usage;
    const plan = this.getCurrentPlan();

    // Check utilization
    const userUtilization = (current.users / limits.users) * 100;
    const workflowUtilization = (current.workflows / limits.workflows) * 100;
    const apiUtilization = (current.apiCalls / limits.apiCalls) * 100;
    const storageUtilization = (current.storage / limits.storage) * 100;

    if (userUtilization > 90) {
      status = 'warning';
      utilizationAlerts.push({
        metric: 'users',
        level: userUtilization > 95 ? 'high' : 'medium',
        message: `User utilization at ${userUtilization.toFixed(1)}%`
      });
    }

    if (workflowUtilization > 90) {
      status = 'warning';
      utilizationAlerts.push({
        metric: 'workflows',
        level: workflowUtilization > 95 ? 'high' : 'medium',
        message: `Workflow utilization at ${workflowUtilization.toFixed(1)}%`
      });
    }

    if (apiUtilization > 90) {
      status = 'warning';
      utilizationAlerts.push({
        metric: 'apiCalls',
        level: apiUtilization > 95 ? 'high' : 'medium',
        message: `API utilization at ${apiUtilization.toFixed(1)}%`
      });
    }

    if (storageUtilization > 90) {
      status = 'warning';
      utilizationAlerts.push({
        metric: 'storage',
        level: storageUtilization > 95 ? 'high' : 'medium',
        message: `Storage utilization at ${storageUtilization.toFixed(1)}%`
      });
    }

    // Check trial status
    if (this.currentSubscription.status === 'trial' && this.currentSubscription.trialEndDate) {
      const daysLeft = Math.ceil((this.currentSubscription.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        status = 'warning';
        issues.push(`Trial expires in ${daysLeft} days`);
        recommendations.push('Consider upgrading to a paid plan');
      }
    }

    // Check renewal
    let nextRenewal = null;
    if (this.currentSubscription.endDate) {
      nextRenewal = this.currentSubscription.endDate;
      const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilRenewal <= 30) {
        if (daysUntilRenewal <= 7) status = 'critical';
        else if (daysUntilRenewal <= 14) status = 'warning';

        issues.push(`Subscription renews in ${daysUntilRenewal} days`);
        recommendations.push('Review auto-renewal settings or prepare payment method');
      }
    }

    // General recommendations
    if (plan && plan.tier.includes('starter')) {
      recommendations.push('Consider upgrading to Professional for advanced features');
    }

    return {
      status,
      issues,
      recommendations,
      nextRenewal,
      utilizationAlerts
    };
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
