import { httpClient, unwrapResponse } from './api';
import { User } from '@/types/user';
import { mockUsers } from './mockData';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Mock auth service - accepts any email/password in dev mode
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Find user by email or use first admin user as default
    const user = mockUsers.find(u => u.email === credentials.email) || mockUsers[0];
    
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials, {
      user,
      token: mockToken,
    });
    
    return unwrapResponse(response);
  },

  logout: async (): Promise<void> => {
    await httpClient.post<void>('/auth/logout', {}, undefined);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }

    // Parse user from token (in mock mode, extract user ID from token)
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      return null;
    }

    const user = mockUsers.find(u => u.id === userId) || null;
    
    const response = await httpClient.get<User>('/auth/me', user || undefined);
    return unwrapResponse(response);
  },

  refreshToken: async (): Promise<string> => {
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const response = await httpClient.post<{ token: string }>('/auth/refresh', {}, { token: mockToken });
    return unwrapResponse(response).token;
  },
};
