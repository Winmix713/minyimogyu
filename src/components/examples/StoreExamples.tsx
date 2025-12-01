import { useStoreJobs } from '@/hooks/useStoreJobs';
import { useStoreModels } from '@/hooks/useStoreModels';
import { useAuth, useAuthActions } from '@/store/authStore';
import { useJobsActions } from '@/store/jobsStore';
import { useModelsActions } from '@/store/modelsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function AuthExample() {
  const { user, isAuthenticated, loading } = useAuth();
  const { login, logout } = useAuthActions();

  const handleLogin = async () => {
    try {
      await login({
        email: 'admin@winmix.com',
        password: 'password123',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Store Example</CardTitle>
        <CardDescription>Using Zustand auth store</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAuthenticated ? (
          <div className="space-y-2">
            <p>Logged in as: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>Login as Admin</Button>
        )}
      </CardContent>
    </Card>
  );
}

export function JobsExample() {
  const { jobs, loading, error, refetch } = useStoreJobs({
    autoFetch: true,
  });
  const { toggleJob } = useJobsActions();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs Store Example</CardTitle>
        <CardDescription>
          {jobs.length} jobs loaded from mock API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium">{job.job_name}</p>
                <p className="text-sm text-muted-foreground">
                  {job.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleJob(job.id)}
              >
                Toggle
              </Button>
            </div>
          ))}
          <Button onClick={refetch} className="w-full mt-4">
            Refresh Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModelsExample() {
  const { models, loading, error } = useStoreModels({
    autoFetch: true,
  });
  const { activateModel, deactivateModel } = useModelsActions();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Models Store Example</CardTitle>
        <CardDescription>
          {models.length} models loaded from mock API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {models.slice(0, 3).map((model) => (
            <div key={model.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium">{model.model_name}</p>
                <p className="text-sm text-muted-foreground">
                  Type: {model.model_type} | Active: {model.is_active ? 'Yes' : 'No'}
                </p>
                {model.accuracy && (
                  <p className="text-sm">
                    Accuracy: {(model.accuracy * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  model.is_active
                    ? deactivateModel(model.id)
                    : activateModel(model.id)
                }
              >
                {model.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StoreExamplesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Zustand Store Examples</h1>
        <p className="text-muted-foreground">
          Demonstrating the new state management layer with mock API
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AuthExample />
        <JobsExample />
        <ModelsExample />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Architecture</h3>
            <code className="text-sm bg-muted p-2 rounded block">
              UI Components → Hooks → Zustand Stores → Services → Mock/Real API
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Mock API with simulated delays (200-500ms)</li>
              <li>Persistent auth state (localStorage)</li>
              <li>Type-safe stores and services</li>
              <li>Loading and error states</li>
              <li>Auto-fetch and refetch intervals</li>
              <li>Easy migration to real API</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Check Browser Console</h3>
            <p className="text-sm text-muted-foreground">
              Open DevTools to see mock API calls being logged
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
