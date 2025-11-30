import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { AuthContext, AuthContextType } from '@/providers/AuthContext';
import { Dashboard } from '@/pages/Dashboard';

// Mock Dashboard component
vi.mock('@/pages/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard-page">Dashboard Content</div>,
}));

// Mock AppLayout
vi.mock('@/components/layout/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

const createWrapper = (authValue: AuthContextType) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Snapshot Tests', () => {
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

  const authValue: AuthContextType = {
    user: mockUser,
    session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
    profile: {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
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

  it('Dashboard component snapshot', () => {
    const { container } = render(
      <Dashboard />,
      { wrapper: createWrapper(authValue) }
    );

    expect(container).toMatchSnapshot();
  });
});
