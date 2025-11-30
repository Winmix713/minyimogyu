import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext, AuthContextType, UserProfile, UserRole } from "@/providers/AuthContext";
import { useAuth, useRequireAuth, useRequireRole, useRequireAdmin, useRequireAnalystOrAdmin } from "@/hooks/useAuth";

// Mock user and profile data
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

const mockProfile: UserProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const createWrapper = (value: AuthContextType) =>
  ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );

describe('useAuth', () => {
  it('returns auth state when used within provider', () => {
    const signIn = vi.fn();
    const signUp = vi.fn();
    const signOut = vi.fn();
    const refreshProfile = vi.fn();
    const hasRole = vi.fn();
    const hasAnyRole = vi.fn();
    const isAdmin = vi.fn();
    const isAnalyst = vi.fn();

    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: mockProfile,
      loading: false,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      hasRole,
      hasAnyRole,
      isAdmin,
      isAnalyst,
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(value),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.loading).toBe(false);
    expect(result.current.signIn).toBe(signIn);
    expect(result.current.signUp).toBe(signUp);
    expect(result.current.signOut).toBe(signOut);
  });

  it('throws an error when used outside of AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrowError(
      /useAuth must be used within an AuthProvider/,
    );
  });
});

describe('useRequireAuth', () => {
  it('returns loading state when auth is loading', () => {
    const value: AuthContextType = {
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

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: true,
      authenticated: false,
    });
  });

  it('returns unauthenticated state when no user', () => {
    const value: AuthContextType = {
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

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: false,
      authenticated: false,
    });
  });

  it('returns authenticated state when user exists', () => {
    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: mockProfile,
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

    const { result } = renderHook(() => useRequireAuth(), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: false,
      authenticated: true,
      user: mockUser,
    });
  });
});

describe('useRequireRole', () => {
  it('returns loading state when auth is loading', () => {
    const value: AuthContextType = {
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

    const { result } = renderHook(() => useRequireRole(['admin']), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: true,
      authorized: false,
    });
  });

  it('returns unauthorized when no profile', () => {
    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
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

    const { result } = renderHook(() => useRequireRole(['admin']), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: false,
      authorized: false,
      error: 'No user profile found',
    });
  });

  it('returns authorized when user has required role', () => {
    const adminProfile: UserProfile = {
      ...mockProfile,
      role: 'admin',
    };

    const hasAnyRole = vi.fn().mockReturnValue(true);

    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: adminProfile,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole,
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const { result } = renderHook(() => useRequireRole(['admin']), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: false,
      authorized: true,
      error: null,
    });
    expect(hasAnyRole).toHaveBeenCalledWith(['admin']);
  });

  it('returns unauthorized when user does not have required role', () => {
    const hasAnyRole = vi.fn().mockReturnValue(false);

    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: mockProfile,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole,
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const { result } = renderHook(() => useRequireRole(['admin']), {
      wrapper: createWrapper(value),
    });

    expect(result.current).toEqual({
      loading: false,
      authorized: false,
      error: 'Requires one of these roles: admin',
    });
  });
});

describe('useRequireAdmin', () => {
  it('uses useRequireRole with admin role', () => {
    const hasAnyRole = vi.fn().mockReturnValue(true);

    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: { ...mockProfile, role: 'admin' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole,
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const { result } = renderHook(() => useRequireAdmin(), {
      wrapper: createWrapper(value),
    });

    expect(hasAnyRole).toHaveBeenCalledWith(['admin']);
    expect(result.current.authorized).toBe(true);
  });
});

describe('useRequireAnalystOrAdmin', () => {
  it('uses useRequireRole with analyst and admin roles', () => {
    const hasAnyRole = vi.fn().mockReturnValue(true);

    const value: AuthContextType = {
      user: mockUser,
      session: { user: mockUser, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer' },
      profile: { ...mockProfile, role: 'analyst' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole,
      isAdmin: vi.fn(),
      isAnalyst: vi.fn(),
    };

    const { result } = renderHook(() => useRequireAnalystOrAdmin(), {
      wrapper: createWrapper(value),
    });

    expect(hasAnyRole).toHaveBeenCalledWith(['admin', 'analyst']);
    expect(result.current.authorized).toBe(true);
  });
});
