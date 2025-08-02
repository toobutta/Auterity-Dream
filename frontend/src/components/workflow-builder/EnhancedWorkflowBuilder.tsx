import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import { WorkflowCanvasProps, Workflow, WorkflowNode } from '../../types/workflow-builder';
import { AUTOMOTIVE_NODE_CATEGORIES } from './templates/automotive-templates';
import { executeWorkflow, createWorkflow, updateWorkflow, getWorkflow } from '../../api/workflows';

import NodePalette from './NodePalette';
import WorkflowCanvas from './WorkflowCanvas';
import NodeEditor from './NodeEditor';
import WorkflowTester from './WorkflowTester';

interface EnhancedWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: Workflow) => void;
  onTest?: (workflow: Workflow) => void;
  className?: string;
}

const EnhancedWorkflowBuilder: React.FC<EnhancedWorkflowBuilderProps> = ({
  workflowId: propWorkflowId,
  onSave,
  onTest,
  className = ''
}) => {
  const { id: routeWorkflowId } = useParams<{ id: string }>();
  const workflowId = propWorkflowId || routeWorkflowId;

  // State management
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing workflow
  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    } else {
      // Initialize with empty workflow
      setWorkflow({
        id: undefined,
        name: 'New Automotive Workflow',
        description: 'Drag nodes from the palette to build your workflow',
        category: 'sales',
        steps: [],
        connections: [],
        triggers: [],
        variables: [],
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedWorkflow = await getWorkflow(id);
      
      // Convert to enhanced workflow format
      const enhancedWorkflow: Workflow = {
        ...loadedWorkflow,
        category: 'sales', // Default category
        triggers: [],
        variables: [],
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setWorkflow(enhancedWorkflow);
    } catch (error) {
      console.error('Failed to load workflow:', error);
      setError('Failed to load workflow. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = useCallback(async (workflowToSave: Workflow) => {
    setIsSaving(true);
    setError(null);
    
    try {
      let savedWorkflow: Workflow;
      
      if (workflowToSave.id) {
        // Update existing workflow
        const updated = await updateWorkflow(workflowToSave.id, workflowToSave);
        savedWorkflow = { ...workflowToSave, ...updated };
      } else {
        // Create new workflow
        const created = await createWorkflow(workflowToSave);
        savedWorkflow = { ...workflowToSave, ...created };
      }
      
      setWorkflow(savedWorkflow);
      onSave?.(savedWorkflow);
      
      // Show success message
      setError(null);
      
    } catch (error) {
      console.error('Failed to save workflow:', error);
      setError('Failed to save workflow. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  const handleTest = useCallback(async (workflowToTest: Workflow) => {
    setError(null);
    onTest?.(workflowToTest);
    setShowTester(true);
  }, [onTest]);

  const handleExecuteWorkflow = useCallback(async (inputData: Record<string, any>): Promise<string> => {
    if (!workflow?.id) {
      throw new Error('Workflow must be saved before execution');
    }

    setIsExecuting(true);
    try {
      const execution = await executeWorkflow(workflow.id, inputData);
      return execution.id;
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [workflow]);

  const handleNodeSelect = useCallback((node: WorkflowNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, nodeData: any) => {
    // Update node in workflow
    if (workflow) {
      const updatedSteps = workflow.steps.map(step => 
        step.id === nodeId 
          ? { ...step, name: nodeData.label, description: nodeData.description, config: nodeData.config }
          : step
      );
      
      setWorkflow({
        ...workflow,
        steps: updatedSteps,
        updated_at: new Date().toISOString()
      });
    }
    
    // Update selected node
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({
        ...selectedNode,
        data: nodeData
      });
    }
  }, [workflow, selectedNode]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    if (workflow) {
      const updatedSteps = workflow.steps.filter(step => step.id !== nodeId);
      const updatedConnections = workflow.connections.filter(conn => 
        conn.source !== nodeId && conn.target !== nodeId
      );
      
      setWorkflow({
        ...workflow,
        steps: updatedSteps,
        connections: updatedConnections,
        updated_at: new Date().toISOString()
      });
    }
    
    // Clear selection if deleted node was selected
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [workflow, selectedNode]);

  const handleNodeDrag = useCallback((dragType: string) => {
    // Handle drag start events if needed
    console.log('Node drag started:', dragType);
  }, []);

  const handleWorkflowNameChange = (name: string) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        name,
        updated_at: new Date().toISOString()
      });
    }
  };

  const handleWorkflowDescriptionChange = (description: string) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        description,
        updated_at: new Date().toISOString()
      });
    }
  };

  const handleCategoryChange = (category: 'sales' | 'service' | 'marketing' | 'inventory') => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        category,
        updated_at: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <svg className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="text-lg font-medium text-gray-900">Loading Workflow...</div>
          <div className="text-sm text-gray-500">Please wait while we load your workflow</div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-lg font-medium text-gray-900 mb-2">Workflow Not Found</div>
          <div className="text-sm text-gray-500">The requested workflow could not be loaded</div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => handleWorkflowNameChange(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Workflow Name"
              />
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  value={workflow.description || ''}
                  onChange={(e) => handleWorkflowDescriptionChange(e.target.value)}
                  className="text-sm text-gray-600 bg-transparent border-none outline-none flex-1 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="Workflow Description"
                />
                <select
                  value={workflow.category}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sales">Sales</option>
                  <option value="service">Service</option>
                  <option value="marketing">Marketing</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTester(!showTester)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  showTester 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {showTester ? 'Hide Tester' : 'Show Tester'}
              </button>
              
              <button
                onClick={() => workflow && handleSave(workflow)}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Node Palette */}
          <NodePalette
            categories={AUTOMOTIVE_NODE_CATEGORIES}
            onNodeDrag={handleNodeDrag}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Canvas */}
          <WorkflowCanvas
            workflowId={workflow.id}
            onSave={handleSave}
            onTest={handleTest}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />

          {/* Node Editor */}
          <NodeEditor
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
          />
        </div>

        {/* Workflow Tester */}
        {showTester && (
          <WorkflowTester
            workflow={workflow}
            onExecute={handleExecuteWorkflow}
            isExecuting={isExecuting}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default EnhancedWorkflowBuilder;