/**
 * RelayCore Provider Manager
 * Manages AI providers (OpenAI, Anthropic, Claude, NeuroWeaver)
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { AIRequest, AIResponse, RoutingDecision } from '../models/request';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  models: string[];
  costPerToken: number;
  maxTokens: number;
  available: boolean;
}

export class ProviderManager {
  private providers: Map<string, ProviderConfig> = new Map();
  private httpClients: Map<string, AxiosInstance> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // OpenAI Provider
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY,
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
        costPerToken: 0.002,
        maxTokens: 4096,
        available: true
      });

      this.httpClients.set('openai', axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }));
    }

    // Anthropic Provider
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        apiKey: process.env.ANTHROPIC_API_KEY,
        models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
        costPerToken: 0.0015,
        maxTokens: 4096,
        available: true
      });

      this.httpClients.set('anthropic', axios.create({
        baseURL: 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 30000
      }));
    }

    // NeuroWeaver Provider (Internal)
    if (process.env.NEUROWEAVER_BACKEND_URL) {
      this.providers.set('neuroweaver', {
        name: 'NeuroWeaver',
        baseUrl: process.env.NEUROWEAVER_BACKEND_URL,
        models: ['automotive-specialist-v1', 'service-advisor-v1', 'parts-specialist-v1'],
        costPerToken: 0.001,
        maxTokens: 2048,
        available: true
      });

      this.httpClients.set('neuroweaver', axios.create({
        baseURL: process.env.NEUROWEAVER_BACKEND_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SECRET_KEY}`
        },
        timeout: 30000
      }));
    }

    logger.info(`Initialized ${this.providers.size} AI providers`);
  }

  async routeRequest(request: AIRequest, decision: RoutingDecision): Promise<AIResponse> {
    const provider = this.providers.get(decision.provider);
    if (!provider) {
      throw new Error(`Provider ${decision.provider} not found`);
    }

    const client = this.httpClients.get(decision.provider);
    if (!client) {
      throw new Error(`HTTP client for ${decision.provider} not initialized`);
    }

    const startTime = Date.now();

    try {
      let response;
      
      switch (decision.provider) {
        case 'openai':
          response = await this.callOpenAI(client, request, decision.model);
          break;
        case 'anthropic':
          response = await this.callAnthropic(client, request, decision.model);
          break;
        case 'neuroweaver':
          response = await this.callNeuroWeaver(client, request, decision.model);
          break;
        default:
          throw new Error(`Unsupported provider: ${decision.provider}`);
      }

      const latency = Date.now() - startTime;

      return {
        id: request.id,
        content: response.content,
        model_used: decision.model,
        provider: decision.provider,
        cost: decision.estimated_cost,
        latency,
        confidence: response.confidence || 0.95,
        metadata: response.metadata || {}
      };

    } catch (error) {
      logger.error(`Provider ${decision.provider} request failed:`, error);
      
      // Attempt fallback if configured
      if (decision.fallback_provider) {
        logger.info(`Attempting fallback to ${decision.fallback_provider}`);
        const fallbackDecision = { ...decision, provider: decision.fallback_provider };
        return this.routeRequest(request, fallbackDecision);
      }

      throw error;
    }
  }

  private async callOpenAI(client: AxiosInstance, request: AIRequest, model: string): Promise<any> {
    const response = await client.post('/chat/completions', {
      model,
      messages: [
        { role: 'user', content: request.prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return {
      content: response.data.choices[0].message.content,
      metadata: {
        usage: response.data.usage,
        finish_reason: response.data.choices[0].finish_reason
      }
    };
  }

  private async callAnthropic(client: AxiosInstance, request: AIRequest, model: string): Promise<any> {
    const response = await client.post('/messages', {
      model,
      max_tokens: 1000,
      messages: [
        { role: 'user', content: request.prompt }
      ]
    });

    return {
      content: response.data.content[0].text,
      metadata: {
        usage: response.data.usage,
        stop_reason: response.data.stop_reason
      }
    };
  }

  private async callNeuroWeaver(client: AxiosInstance, request: AIRequest, model: string): Promise<any> {
    const response = await client.post('/api/v1/inference', {
      model,
      prompt: request.prompt,
      context: request.context,
      max_tokens: 1000
    });

    return {
      content: response.data.response,
      confidence: response.data.confidence,
      metadata: {
        model_version: response.data.model_version,
        specialization: response.data.specialization
      }
    };
  }

  async getAvailableProviders(): Promise<ProviderConfig[]> {
    const providers = Array.from(this.providers.values());
    
    // Check provider availability
    for (const provider of providers) {
      try {
        const client = this.httpClients.get(provider.name.toLowerCase());
        if (client) {
          // Simple health check - adjust endpoint based on provider
          await client.get('/models', { timeout: 5000 });
          provider.available = true;
        }
      } catch (error) {
        logger.warn(`Provider ${provider.name} is unavailable:`, error);
        provider.available = false;
      }
    }

    return providers;
  }

  getProvider(name: string): ProviderConfig | undefined {
    return this.providers.get(name);
  }

  isProviderAvailable(name: string): boolean {
    const provider = this.providers.get(name);
    return provider?.available || false;
  }
}