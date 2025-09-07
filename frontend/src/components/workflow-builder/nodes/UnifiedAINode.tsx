// Unified AI Service Node for Workflow Builder
// Integrates the unified AI service with intelligent routing and cost optimization

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Alert, AlertDescription } from '../../ui/alert';
import { Loader2, Zap, Settings, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

import { useUnifiedAIService } from '../../templates/ai-integration';
import { AIServiceRequest, AIServiceResponse } from '../../templates/ai-integration';

interface UnifiedAINodeData {
  label: string;
  description: string;
  config: {
    prompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    serviceType?: 'chat' | 'completion' | 'embedding';
    enableRouting?: boolean;
    enableCostOptimization?: boolean;
    enableCaching?: boolean;
  };
  validationErrors: string[];
}

const UnifiedAINode: React.FC<NodeProps<UnifiedAINodeData>> = ({ data, selected }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIServiceResponse | null>(null);
  const [testPrompt, setTestPrompt] = useState(data.config.prompt || '');
  const [selectedModel, setSelectedModel] = useState(data.config.model || 'gpt-4');

  // Use the unified AI service hook
  const aiService = useUnifiedAIService({
    defaultProvider: selectedModel,
    enableRouting: data.config.enableRouting ?? true,
    enableCostOptimization: data.config.enableCostOptimization ?? true,
    enableCaching: data.config.enableCaching ?? true,
    monitoringEnabled: true
  });

  // Update config when model changes
  useEffect(() => {
    data.config.model = selectedModel;
  }, [selectedModel, data.config]);

  // Handle AI service execution
  const handleExecute = useCallback(async () => {
    if (!testPrompt.trim()) return;

    setIsProcessing(true);
    try {
      const request: AIServiceRequest = {
        prompt: testPrompt,
        model: selectedModel,
        temperature: data.config.temperature || 0.7,
        maxTokens: data.config.maxTokens || 1000,
      };

      const response = await aiService.execute(request);
      setLastResponse(response);

      // Update node data with response
      data.config.prompt = testPrompt;

    } catch (error) {
      console.error('Unified AI execution error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [testPrompt, selectedModel, data.config, aiService]);

  // Handle configuration changes
  const handleConfigChange = useCallback((key: string, value: any) => {
    data.config[key] = value;
  }, [data.config]);

  return (
    <Card className={`w-96 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Zap className="h-4 w-4 text-blue-600" />
          <span>{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Unified AI
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          {data.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4 (High Quality)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Fast)</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus (Balanced)</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Cost Effective)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Service Configuration */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Configuration</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="routing"
                checked={data.config.enableRouting ?? true}
                onChange={(e) => handleConfigChange('enableRouting', e.target.checked)}
                className="w-3 h-3"
              />
              <Label htmlFor="routing" className="text-xs">Smart Routing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cost-opt"
                checked={data.config.enableCostOptimization ?? true}
                onChange={(e) => handleConfigChange('enableCostOptimization', e.target.checked)}
                className="w-3 h-3"
              />
              <Label htmlFor="cost-opt" className="text-xs">Cost Optimization</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="caching"
                checked={data.config.enableCaching ?? true}
                onChange={(e) => handleConfigChange('enableCaching', e.target.checked)}
                className="w-3 h-3"
              />
              <Label htmlFor="caching" className="text-xs">Response Caching</Label>
            </div>
          </div>
        </div>

        {/* Test Prompt Input */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Test Prompt</Label>
          <Textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter a prompt to test the AI service..."
            className="h-20 text-xs resize-none"
          />
        </div>

        {/* Execute Button */}
        <Button
          onClick={handleExecute}
          disabled={isProcessing || !testPrompt.trim()}
          size="sm"
          className="w-full"
        >
          {isProcessing && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
          {isProcessing ? 'Processing...' : 'Execute AI Request'}
        </Button>

        {/* Last Response Summary */}
        {lastResponse && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Last Response</span>
              <Badge variant="outline" className="text-xs">
                {lastResponse.metadata.responseTime.toFixed(1)}s
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded max-h-20 overflow-hidden">
              {lastResponse.content.substring(0, 100)}...
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Provider: {lastResponse.provider}</span>
              </span>
              <span>Cost: ${lastResponse.usage.cost.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {aiService.error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {aiService.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Performance Metrics */}
        {lastResponse && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-1 mb-2">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">Performance</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">{lastResponse.metadata.responseTime.toFixed(1)}s</div>
                <div className="text-muted-foreground">Response</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{lastResponse.usage.totalTokens}</div>
                <div className="text-muted-foreground">Tokens</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">
                  ${(lastResponse.usage.cost * 1000).toFixed(1)}k
                </div>
                <div className="text-muted-foreground">Cost</div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {data.validationErrors && data.validationErrors.length > 0 && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              <ul className="list-disc list-inside">
                {data.validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </Card>
  );
};

export default UnifiedAINode;
