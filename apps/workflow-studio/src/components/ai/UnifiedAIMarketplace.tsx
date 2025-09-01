/**
 * Unified AI Marketplace Component
 * Visual interface for browsing and selecting AI models
 * Shows cost, performance, and capability comparisons
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@auterity/design-system';
import { Button } from '@auterity/design-system';
import { Badge } from '@auterity/design-system';
import { Progress } from '@auterity/design-system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@auterity/design-system';
import { novitaAIService } from '../../services/enterprise/NovitaAIService';
import { liteLLMService } from '../../services/langchain/LiteLLMService';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'image' | 'audio' | 'multimodal';
  capabilities: string[];
  pricing: {
    inputCost: number;
    outputCost: number;
    currency: string;
  };
  performance: {
    latency: number;
    throughput: number;
    accuracy?: number;
  };
  status: 'available' | 'busy' | 'maintenance';
  usage: {
    requestsToday: number;
    totalRequests: number;
  };
}

const UnifiedAIMarketplace: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [filter, setFilter] = useState({
    type: 'all',
    provider: 'all',
    costRange: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      // Get available models from different services
      const novitaModels = await novitaAIService.getAvailableModels();
      const providerStats = liteLLMService.getAvailableProviders();

      // Transform to unified format
      const unifiedModels: AIModel[] = [
        // OpenAI models
        {
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'OpenAI',
          type: 'text',
          capabilities: ['text-generation', 'code', 'analysis', 'creative-writing'],
          pricing: { inputCost: 0.03, outputCost: 0.06, currency: 'USD' },
          performance: { latency: 800, throughput: 50, accuracy: 95 },
          status: 'available',
          usage: { requestsToday: 1250, totalRequests: 45000 }
        },
        {
          id: 'claude-3',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          type: 'text',
          capabilities: ['text-generation', 'analysis', 'code', 'safety'],
          pricing: { inputCost: 0.015, outputCost: 0.075, currency: 'USD' },
          performance: { latency: 1200, throughput: 40, accuracy: 94 },
          status: 'available',
          usage: { requestsToday: 890, totalRequests: 32000 }
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          provider: 'Google',
          type: 'multimodal',
          capabilities: ['text-generation', 'image-analysis', 'multimodal'],
          pricing: { inputCost: 0.001, outputCost: 0.002, currency: 'USD' },
          performance: { latency: 600, throughput: 80, accuracy: 92 },
          status: 'available',
          usage: { requestsToday: 2100, totalRequests: 78000 }
        },
        // Add Novita AI models
        ...novitaModels.slice(0, 3).map(model => ({
          id: model.id,
          name: model.name,
          provider: 'Novita AI',
          type: model.type as any,
          capabilities: [model.task],
          pricing: { inputCost: model.pricing.inputCost, outputCost: model.pricing.outputCost, currency: 'USD' },
          performance: { latency: model.performance.latency, throughput: model.performance.throughput },
          status: 'available' as const,
          usage: { requestsToday: Math.floor(Math.random() * 500), totalRequests: Math.floor(Math.random() * 10000) }
        }))
      ];

      setModels(unifiedModels);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load models:', error);
      setIsLoading(false);
    }
  };

  const filteredModels = models.filter(model => {
    if (filter.type !== 'all' && model.type !== filter.type) return false;
    if (filter.provider !== 'all' && model.provider !== filter.provider) return false;
    if (filter.costRange === 'low' && model.pricing.inputCost > 0.01) return false;
    if (filter.costRange === 'medium' && (model.pricing.inputCost <= 0.01 || model.pricing.inputCost > 0.05)) return false;
    if (filter.costRange === 'high' && model.pricing.inputCost <= 0.05) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      case 'multimodal': return '🎭';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceScore = (model: AIModel) => {
    // Calculate composite score based on latency, throughput, and cost
    const latencyScore = Math.max(0, 100 - (model.performance.latency / 10));
    const throughputScore = (model.performance.throughput / 100) * 100;
    const costScore = Math.max(0, 100 - (model.pricing.inputCost * 10000));

    return Math.round((latencyScore + throughputScore + costScore) / 3);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Model Marketplace</h2>
          <p className="text-gray-600 mt-1">
            Select and compare AI models for your workflows
          </p>
        </div>
        <Button variant="primary" size="sm">
          Compare Selected
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model Type</label>
              <Select value={filter.type} onValueChange={(value) => setFilter({...filter, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <Select value={filter.provider} onValueChange={(value) => setFilter({...filter, provider: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Anthropic">Anthropic</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Novita AI">Novita AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range</label>
              <Select value={filter.costRange} onValueChange={(value) => setFilter({...filter, costRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Costs</SelectItem>
                  <SelectItem value="low">Low (&lt; $0.01)</SelectItem>
                  <SelectItem value="medium">Medium ($0.01 - $0.05)</SelectItem>
                  <SelectItem value="high">High (&gt; $0.05)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilter({type: 'all', provider: 'all', costRange: 'all'})}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedModel?.id === model.id ? 'ring-2 ring-blue-500' : ''
          }`} onClick={() => setSelectedModel(model)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(model.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-600">{model.provider}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(model.status)}>
                  {model.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Capabilities */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.slice(0, 3).map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                  {model.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{model.capabilities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Performance Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Performance Score</span>
                  <span className="text-sm text-gray-600">{getPerformanceScore(model)}/100</span>
                </div>
                <Progress value={getPerformanceScore(model)} className="h-2" />
              </div>

              {/* Pricing */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Input</p>
                  <p className="text-lg font-semibold">
                    ${model.pricing.inputCost.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Output</p>
                  <p className="text-lg font-semibold">
                    ${model.pricing.outputCost.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Latency</p>
                  <p className="text-lg font-semibold">
                    {model.performance.latency}ms
                  </p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Today: {model.usage.requestsToday.toLocaleString()}</span>
                  <span>Total: {model.usage.totalRequests.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={selectedModel?.id === model.id ? "default" : "outline"}
                size="sm"
              >
                {selectedModel?.id === model.id ? "Selected" : "Select Model"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Detail Panel */}
      {selectedModel && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedModel.name} - Detailed Analysis
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Performance Metrics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-medium">{selectedModel.performance.latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="font-medium">{selectedModel.performance.throughput} req/s</span>
                  </div>
                  {selectedModel.performance.accuracy && (
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">{selectedModel.performance.accuracy}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Cost Analysis</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Input Cost:</span>
                    <span className="font-medium">${selectedModel.pricing.inputCost}/token</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output Cost:</span>
                    <span className="font-medium">${selectedModel.pricing.outputCost}/token</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. 1K tokens:</span>
                    <span className="font-medium">
                      ${(selectedModel.pricing.inputCost + selectedModel.pricing.outputCost) * 1000}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Usage Statistics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Today's Requests:</span>
                    <span className="font-medium">{selectedModel.usage.requestsToday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Requests:</span>
                    <span className="font-medium">{selectedModel.usage.totalRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Capabilities</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedModel.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="primary">
                Use in Workflow
              </Button>
              <Button variant="outline">
                Run Test
              </Button>
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Optimization Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">💡 Cost Optimization Recommendations</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Most Cost Effective</h4>
              <p className="text-sm text-green-700">
                Gemini Pro offers 65% cost savings compared to GPT-4 for similar performance.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Best Performance</h4>
              <p className="text-sm text-blue-700">
                Claude 3 Opus provides the highest accuracy for complex reasoning tasks.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Balanced Choice</h4>
              <p className="text-sm text-purple-700">
                GPT-4 offers the best balance of cost, speed, and capabilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedAIMarketplace;
