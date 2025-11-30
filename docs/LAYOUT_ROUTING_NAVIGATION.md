# Layout, Routing, and Navigation Documentation

## Overview

This document describes the layout, routing, and navigation system implemented for WinMix TipsterHub. The system is built with React Router v6+, Tailwind CSS, and shadcn/ui components.

## Architecture

### 1. Route Structure

The application uses a nested routing architecture with three main layouts:

#### Public Routes (PublicLayout)
- `/` - Landing page
- `/login` - Login page
- `/signup` - Registration page
- `/predictions` - Public predictions view
- `/matches` - Matches listing
- `/teams` - Teams listing
- `/leagues` - Leagues listing
- `/ai-chat` - AI Chat interface
- `/unauthorized` - Access denied page
- `*` - 404 Not Found

#### Protected Routes (DashboardLayout)
Requires authentication:
- `/dashboard` - User dashboard
- `/predictions/new` - New prediction creation
- `/models` - Model management (Phase 6+)
- `/crossleague` - Cross-league intelligence (Phase 7+)
- `/analytics` - Analytics dashboard (Phase 8+)
- `/monitoring` - System monitoring (Phase 8+)
- `/prediction-analyzer` - Prediction analysis tool (Phase 8+)
- `/phase9` - Phase 9 features (Phase 9+)
- `/settings` - User settings

#### Admin Routes (AdminLayout)
Requires authentication + admin/analyst role:
- `/admin` - Admin dashboard
- `/admin/users` - User management (admin only)
- `/admin/jobs` - Job management
- `/admin/models` - Model administration
- `/admin/phase9` - Phase 9 settings
- `/admin/health` - System health dashboard
- `/admin/stats` - Statistics dashboard
- `/admin/integrations` - Integration management
- `/admin/model-status` - Model status overview
- `/admin/feedback` - Feedback inbox
- `/admin/predictions` - Prediction review
- `/admin/environment` - Environment variables (admin only)

### 2. Layout Components

#### PublicLayout (`src/components/layouts/PublicLayout.tsx`)
- **Components**: Navbar, Footer
- **Features**: 
  - Responsive navigation with mobile hamburger menu
  - User authentication state-aware (shows login/signup or user menu)
  - Public navigation links

#### DashboardLayout (`src/components/layouts/DashboardLayout.tsx`)
- **Components**: Sidebar, Breadcrumb, UserMenu
- **Features**:
  - Collapsible sidebar (desktop)
  - Mobile sidebar overlay
  - Top navigation bar with breadcrumb trail
  - User profile dropdown
  - Responsive design (mobile-first)

#### AdminLayout (`src/components/layouts/AdminLayout.tsx`)
- **Components**: Sidebar, Breadcrumb, UserMenu, Admin Badge
- **Features**:
  - Extends DashboardLayout functionality
  - Admin indicator badge in top navbar
  - Same sidebar and responsive features

### 3. Navigation Components

#### Navbar (`src/components/navigation/Navbar.tsx`)
Public-facing navigation bar with:
- Logo and branding
- Navigation links (Predictions, Matches, Teams, Leagues)
- Authentication buttons (Login/Signup) or UserMenu
- Mobile hamburger menu
- Responsive design

#### Sidebar (`src/components/navigation/Sidebar.tsx`)
Main application sidebar with:
- **Desktop**: 
  - Collapsible (w-64 expanded, w-20 collapsed)
  - Grouped navigation items (Main, Admin)
  - Role-based filtering
  - Phase-flag filtering
  - Active route highlighting
- **Mobile**: 
  - Overlay sidebar (w-72)
  - Touch-friendly navigation
  - Close on navigation

#### Breadcrumb (`src/components/navigation/Breadcrumb.tsx`)
Dynamic breadcrumb trail:
- Generated from current route path
- Clickable navigation to parent routes
- Custom route name mapping
- Home icon for root

#### UserMenu (`src/components/navigation/UserMenu.tsx`)
User profile dropdown menu:
- User avatar with initials
- Dashboard link
- Admin link (for admin users)
- Settings link
- Logout button
- Mobile-friendly alternative view

### 4. Route Protection

#### PrivateRoute (`src/components/routes/PrivateRoute.tsx`)
- Checks authentication state
- Redirects to `/login` if not authenticated
- Shows loading state during auth check
- Preserves intended destination in location state

#### AdminRoute (`src/components/routes/AdminRoute.tsx`)
- Checks authentication state
- Checks for admin/analyst role
- Redirects to `/login` if not authenticated
- Redirects to `/unauthorized` if insufficient permissions
- Shows loading state during checks

### 5. Authentication Integration

The navigation system integrates with the existing Supabase authentication:

```tsx
// From AuthProvider
const { user, profile, signIn, signOut, hasRole, hasAnyRole, isAdmin } = useAuth();
```

#### Auth State
- `user`: Current authenticated user
- `profile`: User profile with role information
- `isAdmin()`: Check if user has admin role
- `hasAnyRole(['admin', 'analyst'])`: Check for multiple roles

#### Auth Actions
- `signIn(email, password)`: Authenticate user
- `signOut()`: Sign out current user
- Auto-redirects after login to intended destination

### 6. Phase Flags Integration

Navigation items are conditionally rendered based on feature flags:

```tsx
const { isPhase5Enabled, isPhase6Enabled, isPhase7Enabled, isPhase8Enabled, isPhase9Enabled } = usePhaseFlags();
```

- Phase 5: Pattern detection
- Phase 6: Model management
- Phase 7: Cross-league intelligence
- Phase 8: Analytics, monitoring, prediction analyzer
- Phase 9: Phase 9 features

### 7. Responsive Design

#### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px (sidebar shows)
- `lg`: 1024px
- `xl`: 1280px

#### Mobile Design
- Sidebar hidden on mobile (`hidden md:flex`)
- Overlay sidebar triggered by hamburger menu
- Bottom navigation bar alternative (optional)
- Touch-friendly tap targets
- Swipe gestures (future enhancement)

#### Desktop Design
- Fixed sidebar with collapse functionality
- Sticky top navigation
- Breadcrumb navigation
- Hover tooltips on icons

### 8. Styling Guidelines

#### Color Scheme
- Primary: Brand color for active states
- Muted: Secondary text and inactive states
- Border: Subtle borders and dividers
- Background: Page backgrounds with backdrop blur

#### Component Patterns
- Card-based layouts for content
- Consistent spacing (p-4, sm:p-6, lg:p-8)
- Hover states on interactive elements
- Smooth transitions (transition-all duration-300)
- Focus states for accessibility

### 9. Key Files

```
src/
├── components/
│   ├── AppRoutes.tsx                 # Main routing configuration
│   ├── layouts/
│   │   ├── PublicLayout.tsx         # Public pages layout
│   │   ├── DashboardLayout.tsx      # Protected pages layout
│   │   └── AdminLayout.tsx          # Admin pages layout
│   ├── navigation/
│   │   ├── Navbar.tsx               # Public navbar
│   │   ├── Sidebar.tsx              # Main sidebar
│   │   ├── Breadcrumb.tsx           # Breadcrumb navigation
│   │   └── UserMenu.tsx             # User profile menu
│   └── routes/
│       ├── PrivateRoute.tsx         # Auth route guard
│       └── AdminRoute.tsx           # Admin route guard
├── pages/
│   ├── Index.tsx                    # Landing page
│   ├── Dashboard.tsx                # User dashboard
│   ├── Settings.tsx                 # Settings page
│   ├── Auth/
│   │   ├── Login.tsx                # Login page
│   │   └── Signup.tsx               # Registration page
│   └── ...                          # Other pages
└── providers/
    └── AuthProvider.tsx             # Authentication provider
```

### 10. Usage Examples

#### Adding a New Public Page
```tsx
// In AppRoutes.tsx
<Route path="/" element={<PublicLayout />}>
  <Route path="new-page" element={<NewPage />} />
</Route>
```

#### Adding a New Protected Page
```tsx
<Route element={<PrivateRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/new-feature" element={<NewFeature />} />
  </Route>
</Route>
```

#### Adding a New Admin Page
```tsx
<Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/new-tool" element={<NewTool />} />
  </Route>
</Route>
```

#### Adding a Sidebar Link
```tsx
// In Sidebar.tsx navigationItems array
{ 
  key: "newFeature", 
  to: "/new-feature", 
  label: "New Feature", 
  section: "main",
  requiredRoles: ["admin"], // Optional
  phase: 8                  // Optional
}
```

### 11. Testing Routes

All routes should be tested for:
- ✅ Correct rendering of layout
- ✅ Authentication requirements
- ✅ Role-based access control
- ✅ Breadcrumb generation
- ✅ Active state highlighting
- ✅ Mobile responsiveness
- ✅ Loading states

### 12. Future Enhancements

- [ ] Keyboard shortcuts for navigation
- [ ] Search within sidebar
- [ ] Recently visited pages
- [ ] Pinned/favorite routes
- [ ] Custom sidebar organization
- [ ] Dark mode toggle in settings
- [ ] Multi-language support
- [ ] Sidebar resize with drag
- [ ] PWA navigation drawer

## Acceptance Criteria

✅ React Router v6+ fully configured, routes accessible  
✅ Public layout renders on "/" and "/login"  
✅ PrivateRoute redirects unauthenticated users to /login  
✅ Admin routes require admin role (enforced)  
✅ Sidebar toggles on mobile (hamburger menu works)  
✅ Navbar visible and functional on all pages  
✅ Breadcrumb renders correctly based on current route  
✅ Auth state persists in session (Supabase)  
✅ Login page form submits, sets auth state, redirects to /dashboard  
✅ Logout button clears auth, redirects to /login  
✅ No TypeScript errors  
✅ Responsive design mobile, tablet, desktop (Tailwind breakpoints)  
✅ All pages accessible: / → /login → /dashboard → /admin → 404  

## Notes

- This routing/navigation setup is the foundation for all future features
- Do not modify the core layout structure without careful consideration
- All new features should fit within this established pattern
- The visual design follows the project's design system in docs/
