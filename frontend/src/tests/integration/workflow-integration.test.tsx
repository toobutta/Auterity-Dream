/**
 * Simplified workflow integration tests focusing on core functionality
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import WorkflowBuilderPage from "../../pages/WorkflowBuilderPage";
import { AuthProvider } from "../../contexts/AuthContext";
import { ErrorProvider } from "../../contexts/ErrorContext";

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockUseAuth(),
}));

// Mock ReactFlow components
vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-flow">{children}</div>
  ),
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  Panel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="panel">{children}</div>
  ),
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  addEdge: vi.fn(),
  useReactFlow: () => ({
    getNodes: vi.fn(() => []),
    getEdges: vi.fn(() => []),
    setNodes: vi.fn(),
    setEdges: vi.fn(),
  }),
}));

// Mock API modules
vi.mock("../../api/workflows", () => ({
  getWorkflows: vi.fn(),
  createWorkflow: vi.fn(),
  executeWorkflow: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/workflow-builder"]}>
    <ErrorProvider>
      <AuthProvider>{children}</AuthProvider>
    </ErrorProvider>
  </MemoryRouter>
);

describe("Workflow Integration Tests", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup auth mock
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      token: "mock-token",
    });
  });

  it("should render workflow builder component without errors", async () => {
    render(
      <TestWrapper>
        <WorkflowBuilderPage />
      </TestWrapper>
    );

    // Check that the component renders
    await waitFor(() => {
      expect(screen.getByTestId("react-flow")).toBeInTheDocument();
    });
  });

  it("should handle memory constraints without crashing", async () => {
    // Test memory usage by rendering multiple times
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(
        <TestWrapper>
          <WorkflowBuilderPage />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId("react-flow")).toBeInTheDocument();
      });
      
      unmount();
    }
    
    // If we get here without OOM, the test passes
    expect(true).toBe(true);
  });
});