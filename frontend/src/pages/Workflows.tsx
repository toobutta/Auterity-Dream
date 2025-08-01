import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import WorkflowExecutionForm from '../components/WorkflowExecutionForm';
import ExecutionStatus from '../components/ExecutionStatus';
import WorkflowExecutionResults from '../components/WorkflowExecutionResults';
import WorkflowExecutionHistory from '../components/WorkflowExecutionHistory';
import WorkflowErrorDisplay from '../components/WorkflowErrorDisplay';
import { WorkflowExecution } from '../types/workflow';

interface ExecutionState {
  executionId: string | null;
  workflowId: string | null;
  status: 'idle' | 'executing' | 'completed' | 'failed';
  execution: WorkflowExecution | null;
}

const Workflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'execute' | 'history'>('execute');
  const [executionState, setExecutionState] = useState<ExecutionState>({
    executionId: null,
    workflowId: null,
    status: 'idle',
    execution: null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExecutionStart = useCallback((executionId: string, workflowId: string) => {
    setExecutionState({
      executionId,
      workflowId,
      status: 'executing',
      execution: null
    });
    setActiveTab('execute');
  }, []);

  const handleExecutionComplete = useCallback((execution: WorkflowExecution) => {
    setExecutionState(prev => ({
      ...prev,
      status: execution.status === 'completed' ? 'completed' : 'failed',
      execution
    }));
    // Refresh history to show the new execution
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleExecutionSelect = useCallback((execution: WorkflowExecution) => {
    setExecutionState({
      executionId: execution.id,
      workflowId: execution.workflowId,
      status: execution.status === 'completed' ? 'completed' : 'failed',
      execution
    });
    setActiveTab('execute');
  }, []);

  const handleNewExecution = useCallback(() => {
    setExecutionState({
      executionId: null,
      workflowId: null,
      status: 'idle',
      execution: null
    });
  }, []);

  const tabs = [
    { id: 'execute' as const, name: 'Execute Workflow', icon: '▶️' },
    { id: 'history' as const, name: 'Execution History', icon: '📋' }
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Workflow Execution</h1>
          <p className="mt-2 text-gray-600">
            Execute workflows and monitor their progress
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'execute' && (
          <div className="space-y-6">
            {/* Execution Form */}
            {executionState.status === 'idle' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Start New Execution
                </h2>
                <WorkflowExecutionForm
                  onExecutionStart={(executionId) => {
                    // We need to get the workflowId from the form component
                    // For now, we'll use a placeholder - this should be improved
                    handleExecutionStart(executionId, 'workflow-id-placeholder');
                  }}
                  className="max-w-2xl"
                />
              </div>
            )}

            {/* Execution Status */}
            {executionState.executionId && executionState.status === 'executing' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Execution Status
                  </h2>
                  <button
                    onClick={handleNewExecution}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Start New Execution
                  </button>
                </div>
                <ExecutionStatus
                  executionId={executionState.executionId}
                  onComplete={handleExecutionComplete}
                  showTimeline={true}
                  showLogs={true}
                />
              </div>
            )}

            {/* Execution Results */}
            {executionState.executionId && executionState.status === 'completed' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Execution Results
                  </h2>
                  <button
                    onClick={handleNewExecution}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Start New Execution
                  </button>
                </div>
                <WorkflowExecutionResults
                  executionId={executionState.executionId}
                  workflowId={executionState.workflowId || undefined}
                />
              </div>
            )}

            {/* Execution Error */}
            {executionState.executionId && executionState.status === 'failed' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Execution Failed
                  </h2>
                  <button
                    onClick={handleNewExecution}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Start New Execution
                  </button>
                </div>
                <WorkflowErrorDisplay
                  executionId={executionState.executionId}
                  workflowId={executionState.workflowId || undefined}
                  onRetrySuccess={(newExecutionId: string) => {
                    if (executionState.workflowId) {
                      handleExecutionStart(newExecutionId, executionState.workflowId);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Execution History
            </h2>
            <WorkflowExecutionHistory
              onExecutionSelect={handleExecutionSelect}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Workflows;