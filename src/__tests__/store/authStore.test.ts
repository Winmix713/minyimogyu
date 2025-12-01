import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
    });
    
    // Clear localStorage
    localStorage.clear();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAdmin).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should login successfully', async () => {
    const state = useAuthStore.getState();
    
    await state.login({
      email: 'admin@winmix.com',
      password: 'password123',
    });

    const newState = useAuthStore.getState();
    
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toBeDefined();
    expect(newState.user?.email).toBe('admin@winmix.com');
    expect(newState.token).toBeDefined();
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('should set isAdmin for admin users', async () => {
    const state = useAuthStore.getState();
    
    await state.login({
      email: 'admin@winmix.com',
      password: 'password123',
    });

    const newState = useAuthStore.getState();
    expect(newState.isAdmin).toBe(true);
  });

  it('should persist auth to localStorage', async () => {
    const state = useAuthStore.getState();
    
    await state.login({
      email: 'admin@winmix.com',
      password: 'password123',
    });

    expect(localStorage.getItem('auth_token')).toBeDefined();
    expect(localStorage.getItem('user_id')).toBeDefined();
  });

  it('should logout successfully', async () => {
    const state = useAuthStore.getState();
    
    // First login
    await state.login({
      email: 'admin@winmix.com',
      password: 'password123',
    });

    // Then logout
    await state.logout();

    const newState = useAuthStore.getState();
    
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
    expect(newState.isAdmin).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user_id')).toBeNull();
  });

  it('should clear error', () => {
    useAuthStore.setState({ error: 'Some error' });
    
    const state = useAuthStore.getState();
    state.clearError();

    const newState = useAuthStore.getState();
    expect(newState.error).toBeNull();
  });
});
