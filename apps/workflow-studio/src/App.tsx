import React from 'react';
import { UnifiedNavigation } from '@shared/components/Navigation';
import { Button } from '@auterity/design-system';

// System switcher items
const systemItems = [
  {
    id: 'workflow-studio',
    name: 'Workflow Studio',
    icon: '🎨',
    href: '/',
    status: 'active' as const,
    description: 'Visual workflow builder'
  },
  {
    id: 'automatrix',
    name: 'AutoMatrix',
    icon: '⚡',
    href: '/automatrix',
    status: 'active' as const,
    description: 'Workflow execution engine'
  },
  {
    id: 'relaycore',
    name: 'RelayCore',
    icon: '🔄',
    href: '/relaycore',
    status: 'active' as const,
    description: 'AI routing & optimization'
  },
  {
    id: 'neuroweaver',
    name: 'NeuroWeaver',
    icon: '🧠',
    href: '/neuroweaver',
    status: 'active' as const,
    description: 'ML model management'
  }
];

// Navigation items
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/dashboard'
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: '🔧',
    href: '/workflows'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: '📋',
    href: '/templates'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    href: '/analytics',
    badge: '3'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    href: '/settings'
  }
];

const App: React.FC = () => {
  const handleSystemChange = (systemId: string) => {
    console.log('Switching to system:', systemId);
    // In a real implementation, this would navigate to the system
  };

  const handleNavigation = (item: any) => {
    console.log('Navigating to:', item.label);
    // In a real implementation, this would handle navigation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation
        currentSystem="workflow-studio"
        navigationItems={navigationItems}
        systemItems={systemItems}
        user={{
          name: 'John Doe',
          role: 'admin'
        }}
        onSystemChange={handleSystemChange}
        onNavigation={handleNavigation}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Auterity Workflow Studio
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Build and manage your workflows with our unified platform
              </p>

              <div className="space-x-4">
                <Button variant="primary" size="lg">
                  Create New Workflow
                </Button>
                <Button variant="outline" size="lg">
                  Browse Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
