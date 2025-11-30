import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthContext, AuthContextType, UserProfile, UserRole } from '@/providers/AuthContext';
import { AppRoutes } from '@/components/AppRoutes';
import { usePhaseFlags } from '@/hooks/usePhaseFlags';

// Mock usePhaseFlags
vi.mock('@/hooks/usePhaseFlags', () => ({
  usePhaseFlags: () => ({
    isPhase5Enabled: true,
    isPhase6Enabled: true,
    isPhase7Enabled: true,
    isPhase8Enabled: true,
    isPhase9Enabled: true,
  }),
}));

// Mock PageLoading component
vi.mock('@/components/ui/PageLoading', () => ({
  default: ({ message }: { message: string }) => <div>Loading: {message}</div>,
}));

// Mock AppLayout
vi.mock('@/components/layout/AppLayout', () => ({
  default: ({ children, showSidebar }: { children: React.ReactNode; showSidebar?: boolean }) => (
    <div data-testid="app-layout" data-sidebar={showSidebar}>
      {children}
    </div>
  ),
}));

// Mock lazy loaded components
vi.mock('@/pages/Index', () => ({
  default: () => <div data-testid="index-page">Home Page</div>,
}));

vi.mock('@/pages/Auth/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('@/pages/Auth/Signup', () => ({
  default: () => <div data-testid="signup-page">Signup Page</div>,
}));

vi.mock('@/pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));

vi.mock('@/pages/admin/AdminDashboard', () => ({
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
}));

vi.mock('@/pages/admin/users/UsersPage', () => ({
  default: () => <div data-testid="admin-users">Users Management</div>,
}));

vi.mock('@/pages/Unauthorized', () => ({
  default: () => <div data-testid="unauthorized-page">Unauthorized</div>,
}));

vi.mock('@/pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">404 Not Found</div>,
}));

// Mock other lazy loaded components
vi.mock('@/pages/ModelsPage', () => ({
  default: () => <div data-testid="models-page">Models</div>,
}));

vi.mock('@/pages/CrossLeague', () => ({
  default: () => <div data-testid="crossleague-page">Cross League</div>,
}));

vi.mock('@/pages/Analytics', () => ({
  default: () => <div data-testid="analytics-page">Analytics</div>,
}));

vi.mock('@/pages/MonitoringPage', () => ({
  default: () => <div data-testid="monitoring-page">Monitoring</div>,
}));

vi.mock('@/pages/PredictionAnalyzerPage', () => ({
  default: () => <div data-testid="prediction-analyzer-page">Prediction Analyzer</div>,
}));

vi.mock('@/pages/ScheduledJobsPage', () => ({
  default: () => <div data-testid="scheduled-jobs-page">Scheduled Jobs</div>,
}));

vi.mock('@/pages/admin/jobs/RunningJobsPage', () => ({
  default: () => <div data-testid="admin-jobs">Running Jobs</div>,
}));

vi.mock('@/pages/admin/phase9/Phase9SettingsPage', () => ({
  default: () => <div data-testid="admin-phase9">Phase 9 Settings</div>,
}));

vi.mock('@/pages/admin/HealthDashboard', () => ({
  default: () => <div data-testid="admin-health">Health Dashboard</div>,
}));

vi.mock('@/pages/admin/StatsPage', () => ({
  default: () => <div data-testid="admin-stats">Stats</div>,
}));

vi.mock('@/pages/admin/IntegrationsPage', () => ({
  default: () => <div data-testid="admin-integrations">Integrations</div>,
}));

vi.mock('@/pages/admin/ModelStatusDashboard', () => ({
  default: () => <div data-testid="admin-model-status">Model Status</div>,
}));

vi.mock('@/pages/admin/FeedbackInboxPage', () => ({
  default: () => <div data-testid="admin-feedback">Feedback Inbox</div>,
}));

vi.mock('@/pages/admin/PredictionReviewPage', () => ({
  default: () => <div data-testid="admin-predictions">Prediction Review</div>,
}));

vi.mock('@/pages/EnvVariables', () => ({
  default: () => <div data-testid="admin-environment">Environment Variables</div>,
}));

vi.mock('@/pages/Phase9', () => ({
  default: () => <div data-testid="phase9-page">Phase 9</div>,
}));

vi.mock('@/pages/NewPredictions', () => ({
  default: () => <div data-testid="new-predictions-page">New Predictions</div>,
}));

vi.mock('@/pages/PredictionsView', () => ({
  default: () => <div data-testid="predictions-view">Predictions View</div>,
}));

vi.mock('@/pages/Teams', () => ({
  default: () => <div data-testid="teams-page">Teams</div>,
}));

vi.mock('@/pages/Leagues', () => ({
  default: () => <div data-testid="leagues-page">Leagues</div>,
}));

vi.mock('@/pages/MatchesPage', () => ({
  default: () => <div data-testid="matches-page">Matches</div>,
}));

vi.mock('@/pages/MatchDetail', () => ({
  default: () => <div data-testid="match-detail-page">Match Detail</div>,
}));

vi.mock('@/pages/TeamDetail', () => ({
  default: () => <div data-testid="team-detail-page">Team Detail</div>,
}));

vi.mock('@/pages/AIChat', () => ({
  default: () => <div data-testid="ai-chat-page">AI Chat</div>,
}));

vi.mock('@/pages/FeatureFlagsDemo', () => ({
  default: () => <div data-testid="feature-flags-page">Feature Flags</div>,
}));

vi.mock('@/winmixpro/WinmixProLayout', () => ({
  default: () => <div data-testid="winmixpro-page">WinmixPro</div>,
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  factors: [],
};

const createMockProfile = (role: UserRole): UserProfile => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  role,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const createWrapper = (authValue: AuthContextType) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('Auth Flow Integration Tests', () => {
  it('redirects to login when accessing protected route without authentication', () => {
    const authValue: AuthContextType = {
      user: null,
      session: null,
      profile: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/dashboard',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/dashboard'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('allows access to protected route when authenticated', () => {
    const authValue: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: createMockProfile('user'),
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/dashboard',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/dashboard'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('redirects to unauthorized when accessing admin route without admin role', () => {
    const authValue: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: createMockProfile('user'),
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
      hasAnyRole: vi.fn().mockReturnValue(false),
      isAdmin: vi.fn().mockReturnValue(false),
      isAnalyst: vi.fn().mockReturnValue(false),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/admin/users',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/admin/users'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('unauthorized-page')).toBeInTheDocument();
  });

  it('allows access to admin route when user has admin role', () => {
    const authValue: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: createMockProfile('admin'),
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn().mockReturnValue(true),
      hasAnyRole: vi.fn().mockReturnValue(true),
      isAdmin: vi.fn().mockReturnValue(true),
      isAnalyst: vi.fn().mockReturnValue(false),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/admin/users',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/admin/users'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('admin-users')).toBeInTheDocument();
  });

  it('allows access to admin routes when user has analyst role', () => {
    const authValue: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: createMockProfile('analyst'),
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn().mockReturnValue(false),
      hasAnyRole: vi.fn().mockReturnValue(true),
      isAdmin: vi.fn().mockReturnValue(false),
      isAnalyst: vi.fn().mockReturnValue(true),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/admin/jobs',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/admin/jobs'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('admin-jobs')).toBeInTheDocument();
  });
});

describe('Routing Integration Tests', () => {
  it('allows access to public pages without authentication', () => {
    const authValue: AuthContextType = {
      user: null,
      session: null,
      profile: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AppRoutes />,
        },
        {
          path: '/login',
          element: <AppRoutes />,
        },
        {
          path: '/signup',
          element: <AppRoutes />,
        },
        {
          path: '/predictions',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  it('shows 404 page for unknown routes', () => {
    const authValue: AuthContextType = {
      user: null,
      session: null,
      profile: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '*',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/unknown-route'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('shows loading state during authentication check', () => {
    const authValue: AuthContextType = {
      user: null,
      session: null,
      profile: null,
      loading: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/dashboard',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/dashboard'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Loading: Checking permissions...')).toBeInTheDocument();
  });

  it('loads phase-specific routes when phases are enabled', () => {
    const authValue: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: createMockProfile('user'),
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const router = createMemoryRouter(
      [
        {
          path: '/models',
          element: <AppRoutes />,
        },
        {
          path: '/crossleague',
          element: <AppRoutes />,
        },
        {
          path: '/analytics',
          element: <AppRoutes />,
        },
        {
          path: '/phase9',
          element: <AppRoutes />,
        },
      ],
      { initialEntries: ['/models'] }
    );

    render(
      <AuthContext.Provider value={authValue}>
        <QueryClientProvider client={new QueryClient()}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('models-page')).toBeInTheDocument();
  });
});
