export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "manager" | "viewer";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  permissions?: string[];
}

export const mockUsers: MockUser[] = [
  {
    id: "user-001",
    name: "John Administrator",
    email: "john.admin@winmix.com",
    role: "admin",
    status: "active",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    permissions: ["all"],
  },
  {
    id: "user-002",
    name: "Sarah Analyst",
    email: "sarah.analyst@winmix.com",
    role: "analyst",
    status: "active",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    permissions: ["view_data", "create_predictions", "view_analytics"],
  },
  {
    id: "user-003",
    name: "Mike Manager",
    email: "mike.manager@winmix.com",
    role: "manager",
    status: "active",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    permissions: ["view_data", "create_predictions", "manage_users", "view_analytics"],
  },
  {
    id: "user-004",
    name: "Emma Viewer",
    email: "emma.viewer@winmix.com",
    role: "viewer",
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    permissions: ["view_data"],
  },
  {
    id: "user-005",
    name: "Alex Developer",
    email: "alex.dev@winmix.com",
    role: "analyst",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    permissions: ["view_data", "create_predictions", "manage_models", "view_analytics"],
  },
  {
    id: "user-006",
    name: "Lisa Intern",
    email: "lisa.intern@winmix.com",
    role: "viewer",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    permissions: ["view_data"],
  },
];
