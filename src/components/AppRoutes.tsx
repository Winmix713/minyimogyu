import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePhaseFlags } from '@/hooks/usePhaseFlags';
import PageLoading from '@/components/ui/PageLoading';
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import PrivateRoute from '@/components/routes/PrivateRoute';
import AdminRoute from '@/components/routes/AdminRoute';

// Public pages
import Index from '@/pages/Index';
import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/Signup';
import PredictionsView from '@/pages/PredictionsView';
import Teams from '@/pages/Teams';
import Leagues from '@/pages/Leagues';
import MatchesPage from '@/pages/MatchesPage';
import MatchDetail from '@/pages/MatchDetail';
import TeamDetail from '@/pages/TeamDetail';
import AIChat from '@/pages/AIChat';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import FeatureFlagsDemo from '@/pages/FeatureFlagsDemo';

// Protected pages
import Dashboard from '@/pages/Dashboard';
import NewPredictions from '@/pages/NewPredictions';
import Phase9 from '@/pages/Phase9';
import Settings from '@/pages/Settings';

// Lazy loaded feature pages
const CrossLeague = React.lazy(() => import('@/pages/CrossLeague'));
const Analytics = React.lazy(() => import('@/pages/Analytics'));
const EnvVariables = React.lazy(() => import('@/pages/EnvVariables'));
const ScheduledJobsPage = React.lazy(() => import('@/pages/ScheduledJobsPage'));
const ModelsPage = React.lazy(() => import('@/pages/ModelsPage'));
const MonitoringPage = React.lazy(() => import('@/pages/MonitoringPage'));
const PredictionAnalyzerPage = React.lazy(() => import('@/pages/PredictionAnalyzerPage'));

// Lazy loaded admin pages
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const UsersPage = React.lazy(() => import('@/pages/admin/users/UsersPage'));
const RunningJobsPage = React.lazy(() => import('@/pages/admin/jobs/RunningJobsPage'));
const Phase9SettingsPage = React.lazy(() => import('@/pages/admin/phase9/Phase9SettingsPage'));
const HealthDashboard = React.lazy(() => import('@/pages/admin/HealthDashboard'));
const IntegrationsPage = React.lazy(() => import('@/pages/admin/IntegrationsPage'));
const StatsPage = React.lazy(() => import('@/pages/admin/StatsPage'));
const ModelStatusDashboard = React.lazy(() => import('@/pages/admin/ModelStatusDashboard'));
const FeedbackInboxPage = React.lazy(() => import('@/pages/admin/FeedbackInboxPage'));
const PredictionReviewPage = React.lazy(() => import('@/pages/admin/PredictionReviewPage'));

// WinmixPro prototype
const WinmixProLayout = React.lazy(() => import('@/winmixpro/WinmixProLayout'));

const AppRoutes: React.FC = () => {
  const { isPhase5Enabled, isPhase6Enabled, isPhase7Enabled, isPhase8Enabled, isPhase9Enabled } = usePhaseFlags();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Index />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="feature-flags" element={<FeatureFlagsDemo />} />
        <Route path="predictions" element={<PredictionsView />} />
        <Route
          path="matches"
          element={
            <Suspense fallback={<PageLoading message="Loading matches..." />}>
              <MatchesPage />
            </Suspense>
          }
        />
        <Route
          path="match/:id"
          element={
            <Suspense fallback={<PageLoading message="Loading match details..." />}>
              <MatchDetail />
            </Suspense>
          }
        />
        <Route path="teams" element={<Teams />} />
        <Route
          path="teams/:teamName"
          element={
            <Suspense fallback={<PageLoading message="Loading team details..." />}>
              <TeamDetail />
            </Suspense>
          }
        />
        <Route path="leagues" element={<Leagues />} />
        <Route
          path="ai-chat"
          element={
            <Suspense fallback={<PageLoading message="Loading AI Chat..." />}>
              <AIChat />
            </Suspense>
          }
        />
        <Route
          path="winmixpro"
          element={
            <Suspense fallback={<PageLoading message="Loading WinmixPro..." />}>
              <WinmixProLayout />
            </Suspense>
          }
        />
      </Route>

      {/* Private routes with dashboard layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predictions/new" element={<NewPredictions />} />
          {isPhase5Enabled && (
            <Route path="/patterns" element={<div>Phase 5 Pattern Detection</div>} />
          )}
          {isPhase6Enabled && (
            <Route
              path="/models"
              element={
                <Suspense fallback={<PageLoading message="Loading models..." />}>
                  <ModelsPage />
                </Suspense>
              }
            />
          )}
          {isPhase7Enabled && (
            <Route
              path="/crossleague"
              element={
                <Suspense fallback={<PageLoading message="Loading cross-league intelligence..." />}>
                  <CrossLeague />
                </Suspense>
              }
            />
          )}
          {isPhase8Enabled && (
            <>
              <Route
                path="/analytics"
                element={
                  <Suspense fallback={<PageLoading message="Loading analytics..." />}>
                    <Analytics />
                  </Suspense>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <Suspense fallback={<PageLoading message="Loading monitoring..." />}>
                    <MonitoringPage />
                  </Suspense>
                }
              />
              <Route
                path="/prediction-analyzer"
                element={
                  <Suspense fallback={<PageLoading message="Loading prediction analyzer..." />}>
                    <PredictionAnalyzerPage />
                  </Suspense>
                }
              />
            </>
          )}
          {isPhase9Enabled && (
            <Route path="/phase9" element={<Phase9 />} />
          )}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoading message="Loading admin dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Suspense fallback={<PageLoading message="Loading user management..." />}>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <Suspense fallback={<PageLoading message="Loading job management..." />}>
                <RunningJobsPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/phase9"
            element={
              <Suspense fallback={<PageLoading message="Loading Phase 9 settings..." />}>
                <Phase9SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/health"
            element={
              <Suspense fallback={<PageLoading message="Loading health dashboard..." />}>
                <HealthDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <Suspense fallback={<PageLoading message="Loading stats..." />}>
                <StatsPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/integrations"
            element={
              <Suspense fallback={<PageLoading message="Loading integrations..." />}>
                <IntegrationsPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/model-status"
            element={
              <Suspense fallback={<PageLoading message="Loading model status..." />}>
                <ModelStatusDashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <Suspense fallback={<PageLoading message="Loading feedback inbox..." />}>
                <FeedbackInboxPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/predictions"
            element={
              <Suspense fallback={<PageLoading message="Loading prediction review..." />}>
                <PredictionReviewPage />
              </Suspense>
            }
          />
          {(isPhase5Enabled || isPhase6Enabled || isPhase7Enabled || isPhase8Enabled) && (
            <Route
              path="/jobs"
              element={
                <Suspense fallback={<PageLoading message="Loading scheduled jobs..." />}>
                  <ScheduledJobsPage />
                </Suspense>
              }
            />
          )}
          {(isPhase6Enabled || isPhase8Enabled) && (
            <Route
              path="/admin/models"
              element={
                <Suspense fallback={<PageLoading message="Loading models..." />}>
                  <ModelsPage />
                </Suspense>
              }
            />
          )}
          {isPhase8Enabled && (
            <>
              <Route
                path="/admin/matches"
                element={
                  <Suspense fallback={<PageLoading message="Loading matches..." />}>
                    <MatchesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/monitoring"
                element={
                  <Suspense fallback={<PageLoading message="Loading monitoring..." />}>
                    <MonitoringPage />
                  </Suspense>
                }
              />
            </>
          )}
          <Route
            path="/admin/environment"
            element={
              <Suspense fallback={<PageLoading message="Loading environment variables..." />}>
                <EnvVariables />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
