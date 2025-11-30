import { create } from 'zustand';
import { User, Role } from '@/types/user';
import { usersService } from '@/services/usersService';

interface UsersState {
  users: User[];
  roles: Role[];
  loading: boolean;
  error: string | null;
}

interface UsersActions {
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  fetchRoles: () => Promise<void>;
  createUser: (data: Partial<User>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateUserRole: (userId: string, role: User['role']) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
}

type UsersStore = UsersState & UsersActions;

export const useUsersStore = create<UsersStore>((set, get) => ({
  // Initial state
  users: [],
  roles: [],
  loading: false,
  error: null,

  // Actions
  fetchUsers: async () => {
    set({ loading: true, error: null });
    
    try {
      const users = await usersService.getUsers();
      set({ users, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchUserById: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      const user = await usersService.getUserById(id);
      set({ loading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  fetchRoles: async () => {
    set({ loading: true, error: null });
    
    try {
      const roles = await usersService.getRoles();
      set({ roles, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch roles';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  createUser: async (data: Partial<User>) => {
    set({ loading: true, error: null });
    
    try {
      const newUser = await usersService.createUser(data);
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    set({ loading: true, error: null });
    
    try {
      const updatedUser = await usersService.updateUser(id, data);
      set((state) => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  updateUserRole: async (userId: string, role: User['role']) => {
    set({ loading: true, error: null });
    
    try {
      const updatedUser = await usersService.updateUserRole(userId, role);
      set((state) => ({
        users: state.users.map(user => user.id === userId ? updatedUser : user),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    
    try {
      await usersService.deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector hooks
export const useUsers = () => useUsersStore((state) => ({
  users: state.users,
  loading: state.loading,
  error: state.error,
}));

export const useUsersLoading = () => useUsersStore((state) => state.loading);
export const useUsersError = () => useUsersStore((state) => state.error);
export const useRoles = () => useUsersStore((state) => state.roles);

export const useUsersByRole = (role: User['role']) => {
  const users = useUsersStore((state) => state.users);
  return users.filter(user => user.role === role);
};

export const useUsersActions = () => useUsersStore((state) => ({
  fetchUsers: state.fetchUsers,
  fetchUserById: state.fetchUserById,
  fetchRoles: state.fetchRoles,
  createUser: state.createUser,
  updateUser: state.updateUser,
  updateUserRole: state.updateUserRole,
  deleteUser: state.deleteUser,
  clearError: state.clearError,
}));
