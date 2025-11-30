import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { authService, LoginCredentials } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null });
        
        try {
          const { user, token } = await authService.login(credentials);
          
          // Store in localStorage for persistence
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_id', user.id);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            loading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        
        try {
          await authService.logout();
          
          // Clear localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Logout failed';
          set({
            loading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
        });
      },

      setToken: (token: string | null) => {
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
        set({ token });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          return;
        }

        set({ loading: true });

        try {
          const user = await authService.getCurrentUser();
          
          if (user) {
            set({
              user,
              token,
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
              loading: false,
            });
          } else {
            // Token invalid, clear auth
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isAdmin: false,
              loading: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

// Selector hooks
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
  isAdmin: state.isAdmin,
  loading: state.loading,
  error: state.error,
}));

export const useIsAdmin = () => useAuthStore((state) => state.isAdmin);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  checkAuth: state.checkAuth,
  clearError: state.clearError,
}));
