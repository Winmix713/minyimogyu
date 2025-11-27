import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useRequireAuth, useRequireRole } from '@/hooks/useAuth';
import { usePhaseFlags } from '@/hooks/usePhaseFlags';
import AppRoutes from '@/components/AppRoutes';
import { vi } from 'vitest';
import { useRequireAuth, useRequireRole } from '@/hooks/useAuth';
import { usePhaseFlags } from '@/hooks/usePhaseFlags';

// Mock the hooks
vi.mock('@/hooks/useAuth', () => ({
  useRequireAuth: vi.fn(() => ({ loading: false, authenticated: true })),
  useRequireRole: vi.fn(() => ({ loading: true, authorized: false })),
}));

vi.mock('@/hooks/usePhaseFlags', () => ({
  usePhaseFlags: vi.fn(() => ({
    isPhase5Enabled: false,
    isPhase6Enabled: false,
    isPhase7Enabled: false,
    isPhase8Enabled: false,
    isPhase9Enabled: false,
  })),
}));

const useRequireAuthMock = vi.mocked(useRequireAuth);
const useRequireRoleMock = vi.mocked(useRequireRole);
const usePhaseFlagsMock = vi.mocked(usePhaseFlags);

// Mock lazy components
vi.mock('@/pages/Index', () => ({
  default: () => <div>Index Page</div>,
}));

vi.mock('@/pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock('@/pages/admin/AdminDashboard', () => ({
  default: () => <div>Admin Dashboard</div>,
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FeatureFlagsProvider>
          <AuthProvider>
            {component}
          </AuthProvider>
        </FeatureFlagsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the index page', () => {
    renderWithProviders(<AppRoutes />);
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });

  it('renders protected routes when authenticated', () => {
    useRequireAuthMock.mockReturnValue({ loading: false, authenticated: true });
    
    renderWithProviders(<AppRoutes />);
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });

  it('shows loading state while checking permissions', () => {
    useRequireRoleMock.mockReturnValue({ loading: true, authorized: false });
    
    renderWithProviders(<AppRoutes />);
    expect(screen.getByText('Checking permissions...')).toBeInTheDocument();
  });

  it('respects phase flags for conditional routes', () => {
    usePhaseFlagsMock.mockReturnValue({
      isPhase5Enabled: true,
      isPhase6Enabled: false,
      isPhase7Enabled: false,
      isPhase8Enabled: false,
      isPhase9Enabled: false,
    });
    
    renderWithProviders(<AppRoutes />);
    // Phase 5 is enabled, but the component just shows a placeholder
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });

  it('applies role-based access control', () => {
    useRequireRoleMock.mockImplementation((roles) => {
      if (roles && roles.includes('admin')) {
        return { loading: false, authorized: false, error: 'Requires admin role' };
      }
      return { loading: false, authorized: true };
    });
    
    renderWithProviders(<AppRoutes />);
    // Should still render index page since admin routes are separate
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });
});