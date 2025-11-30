export type UserRole = 'admin' | 'analyst' | 'user';

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface Role {
  id: string;
  name: UserRole;
  description?: string;
  permissions: Permission[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  created_at: string;
  updated_at?: string | null;
}
