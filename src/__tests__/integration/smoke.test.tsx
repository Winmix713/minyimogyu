import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import { AuthContext, AuthContextType } from '@/providers/AuthContext';

// Mock all providers to isolate the smoke test
vi.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/providers/FeatureFlagsProvider', () => ({
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/providers/TooltipProvider', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/use-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster Component</div>,
}));

// Mock the main components to focus on initialization
vi.mock('@/components/AppRoutes', () => ({
  AppRoutes: () => <div data-testid="app-routes">App Routes Loaded</div>,
}));

vi.mock('@/components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">
      {children}
    </div>
  ),
}));

describe('Smoke Tests', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );

    vi.clearAllMocks();
  });

  it('app initializes without crashing', () => {
    render(<App />, { wrapper });

    // Check that the main app structure is rendered
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('app renders with basic layout structure', () => {
    render(<App />, { wrapper });

    // The app should render without throwing errors
    const appElement = document.getElementById('root');
    expect(appElement).toBeInTheDocument();
  });

  it('app loads all essential providers', () => {
    render(<App />, { wrapper });

    // Since we're mocking the providers, we just need to ensure
    // the app structure renders without errors
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  it('app handles missing auth gracefully', () => {
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

    const authWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider value={authValue}>
            {children}
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    );

    render(<App />, { wrapper: authWrapper });

    // App should still render even without authentication
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  it('app initializes with authentication state', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      aud: 'authenticated' as const,
      role: 'authenticated' as const,
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
      session: { 
        user: mockUser, 
        access_token: 'test-token', 
        refresh_token: 'test-refresh', 
        expires_in: 3600, 
        token_type: 'bearer' 
      },
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

    const authWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider value={authValue}>
            {children}
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    );

    render(<App />, { wrapper: authWrapper });

    // App should render successfully with authenticated user
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  it('app handles query client initialization', () => {
    // Test with a fresh query client
    const freshQueryClient = new QueryClient();
    
    const freshWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={freshQueryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );

    render(<App />, { wrapper: freshWrapper });

    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  it('app renders without console errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />, { wrapper });

    // Check that no console errors were logged
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('app maintains DOM structure', () => {
    render(<App />, { wrapper });

    // Check that the root element has the correct structure
    const root = document.getElementById('root');
    expect(root).toBeInTheDocument();
    expect(root?.children.length).toBeGreaterThan(0);
  });
});
