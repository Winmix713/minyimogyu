# State Management Architecture

## Overview

This project uses **Zustand** for centralized state management with a clean separation of concerns:

```
UI Components → Custom Hooks → Zustand Stores → Services → Mock/Real API
```

## Architecture Layers

### 1. Services Layer (`src/services/`)

The service layer provides an abstraction over API calls. Currently uses **mock data** with simulated network delays, but can be easily swapped to real API calls.

**Key Files:**
- `api.ts` - Base HTTP client with mock capabilities
- `mockData.ts` - Mock data for development
- `authService.ts` - Authentication operations
- `jobsService.ts` - Job management operations
- `modelsService.ts` - Model management operations
- `predictionsService.ts` - Prediction operations
- `analyticsService.ts` - Analytics data operations
- `usersService.ts` - User management (admin)
- `notificationsService.ts` - Notification operations

**Example Service:**
```typescript
import { jobsService } from '@/services/jobsService';

// Fetch all jobs
const jobs = await jobsService.getJobs();

// Create a new job
const newJob = await jobsService.createJob({
  job_name: 'my-job',
  job_type: 'prediction',
  cron_schedule: '0 6 * * *',
});
```

### 2. Zustand Stores (`src/store/`)

Centralized state management with Zustand. Each store manages a specific domain.

**Available Stores:**
- `authStore.ts` - Authentication state (persisted to localStorage)
- `jobsStore.ts` - Jobs state
- `modelsStore.ts` - Models state
- `predictionsStore.ts` - Predictions state
- `analyticsStore.ts` - Analytics state
- `usersStore.ts` - Users state (admin)
- `notificationsStore.ts` - Notifications state

**Example Store Usage:**
```typescript
import { useAuthStore, useAuth, useAuthActions } from '@/store/authStore';

function MyComponent() {
  // Use selector hooks
  const { user, isAuthenticated, loading } = useAuth();
  const { login, logout } = useAuthActions();

  // Or use the store directly
  const isAdmin = useAuthStore(state => state.isAdmin);

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login({ email, password })}>Login</button>
      )}
    </div>
  );
}
```

### 3. Custom Hooks (`src/hooks/`)

Convenience hooks that combine store actions with React lifecycle.

**Available Hooks:**
- `useStoreJobs` - Jobs with auto-fetch and refetch
- `useStoreModels` - Models with auto-fetch
- `useStorePredictions` - Predictions with filters
- `useStoreAnalytics` - Analytics with time range
- `useStoreNotifications` - Notifications with auto-refresh
- `useStoreUsers` - Users management
- `useApi` - Generic API call wrapper

**Example Hook Usage:**
```typescript
import { useStoreJobs } from '@/hooks/useStoreJobs';

function JobsPage() {
  const { jobs, loading, error, refetch } = useStoreJobs({
    autoFetch: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Store Features

### State Persistence

The `authStore` automatically persists to localStorage:

```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isAdmin: boolean
}
```

### Loading & Error States

All stores include loading and error states:

```typescript
const { data, loading, error } = useStore();

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

### Optimistic Updates

Stores update local state immediately, then sync with the server:

```typescript
const { deleteJob } = useJobsActions();

// Immediately removes from UI, then calls API
await deleteJob(jobId);
```

## Mock API Layer

### Network Delay Simulation

Mock API calls include realistic delays (200-500ms):

```typescript
// In api.ts
const simulateDelay = () => {
  const delay = Math.random() * 300 + 200; // 200-500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};
```

### Mock Data Volume

- **Jobs**: 6 sample jobs with various statuses
- **Models**: 5 models (champion, challenger, retired)
- **Predictions**: 100 predictions across different matches
- **Users**: 5 users with different roles
- **Notifications**: 5 notifications
- **Analytics**: Metrics and charts

### Logging

All mock API calls are logged to console:

```
[MOCK API] GET /jobs
[MOCK API] Response: { success: true, data: [...] }
```

## Migration to Real API

### Step 1: Update Service Functions

Replace mock responses with real API calls:

```typescript
// Before (Mock)
export const jobsService = {
  getJobs: async () => {
    const response = await httpClient.get('/jobs', mockJobs);
    return unwrapResponse(response);
  },
};

// After (Real API)
export const jobsService = {
  getJobs: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
    
    if (error) throw error;
    return data;
  },
};
```

### Step 2: Update HTTP Client

Replace `mockFetch` with real `fetch` or `axios`:

```typescript
// In api.ts
export const httpClient = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();
    return { success: response.ok, data };
  },
};
```

### Step 3: No Store Changes Required

Stores remain unchanged! They only interact with services.

## Type Safety

All stores and services are fully typed:

```typescript
// Types defined in src/types/
import { User } from '@/types/user';
import { Job } from '@/types/jobs';
import { Model } from '@/types/models';
import { Prediction } from '@/types/prediction';
```

## Best Practices

### 1. Use Selector Hooks

Instead of subscribing to entire store:

```typescript
// Good ✓
const isAdmin = useIsAdmin();
const user = useUser();

// Avoid ✗
const { user, token, isAuthenticated, isAdmin, loading, error } = useAuthStore();
```

### 2. Separate Actions from State

```typescript
const { jobs, loading } = useJobs(); // State
const { fetchJobs, deleteJob } = useJobsActions(); // Actions
```

### 3. Handle Errors Gracefully

```typescript
try {
  await createJob(jobData);
  toast.success('Job created');
} catch (error) {
  toast.error('Failed to create job');
}
```

### 4. Clear Errors After Display

```typescript
const { error, clearError } = useJobs();

useEffect(() => {
  if (error) {
    toast.error(error);
    clearError();
  }
}, [error]);
```

## Testing

### Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useJobsStore } from '@/store/jobsStore';

test('fetchJobs updates state', async () => {
  const { result } = renderHook(() => useJobsStore());

  await act(async () => {
    await result.current.fetchJobs();
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.jobs.length).toBeGreaterThan(0);
});
```

### Testing Services

```typescript
import { jobsService } from '@/services/jobsService';

test('getJobs returns jobs', async () => {
  const jobs = await jobsService.getJobs();
  expect(jobs).toBeDefined();
  expect(Array.isArray(jobs)).toBe(true);
});
```

## Performance

### Selective Re-renders

Zustand only re-renders components that use changed state:

```typescript
// Only re-renders when user changes
const user = useUser();

// Only re-renders when loading changes
const loading = useJobsLoading();
```

### Memoization

Use selector functions for derived state:

```typescript
const activeJobs = useJobsStore(state => 
  state.jobs.filter(job => job.enabled)
);
```

## Debugging

### Redux DevTools

Zustand supports Redux DevTools:

```typescript
import { devtools } from 'zustand/middleware';

export const useJobsStore = create(
  devtools(
    (set, get) => ({
      // store implementation
    }),
    { name: 'JobsStore' }
  )
);
```

### Console Logging

Mock API calls are automatically logged. Enable verbose logging:

```typescript
console.log('[Store] Jobs fetched:', jobs);
console.log('[Service] API call:', endpoint, data);
```

## Future Enhancements

- [ ] Add optimistic UI updates
- [ ] Implement request cancellation
- [ ] Add request deduplication
- [ ] Cache management with TTL
- [ ] Offline support with sync
- [ ] Real-time updates via WebSockets
- [ ] Store hydration from SSR
