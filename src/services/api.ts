import { ApiResponse, ApiError } from '@/types/api';

const MOCK_DELAY_MIN = 200;
const MOCK_DELAY_MAX = 500;

// Simulates network delay
const simulateDelay = () => {
  const delay = Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN + 1)) + MOCK_DELAY_MIN;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock HTTP client that simulates API calls
export const mockFetch = async <T>(
  endpoint: string,
  options?: {
    method?: string;
    data?: unknown;
    mockResponse?: T;
    mockError?: ApiError;
  }
): Promise<ApiResponse<T>> => {
  console.log(`[MOCK API] ${options?.method || 'GET'} ${endpoint}`, options?.data);
  
  await simulateDelay();

  // Simulate error responses
  if (options?.mockError) {
    console.error(`[MOCK API] Error:`, options.mockError);
    return {
      success: false,
      error: options.mockError,
      timestamp: new Date().toISOString(),
    };
  }

  // Success response
  const response: ApiResponse<T> = {
    success: true,
    data: options?.mockResponse as T,
    timestamp: new Date().toISOString(),
  };

  console.log(`[MOCK API] Response:`, response);
  return response;
};

// HTTP client wrapper for easy migration to real API
export const httpClient = {
  get: async <T>(endpoint: string, mockResponse?: T): Promise<ApiResponse<T>> => {
    return mockFetch<T>(endpoint, { method: 'GET', mockResponse });
  },

  post: async <T>(endpoint: string, data: unknown, mockResponse?: T): Promise<ApiResponse<T>> => {
    return mockFetch<T>(endpoint, { method: 'POST', data, mockResponse });
  },

  put: async <T>(endpoint: string, data: unknown, mockResponse?: T): Promise<ApiResponse<T>> => {
    return mockFetch<T>(endpoint, { method: 'PUT', data, mockResponse });
  },

  patch: async <T>(endpoint: string, data: unknown, mockResponse?: T): Promise<ApiResponse<T>> => {
    return mockFetch<T>(endpoint, { method: 'PATCH', data, mockResponse });
  },

  delete: async <T>(endpoint: string, mockResponse?: T): Promise<ApiResponse<T>> => {
    return mockFetch<T>(endpoint, { method: 'DELETE', mockResponse });
  },
};

// Helper to extract data from API response
export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success || response.error) {
    throw new Error(response.error?.message || 'API request failed');
  }
  return response.data as T;
};
