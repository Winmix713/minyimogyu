import { httpClient, unwrapResponse } from './api';
import { User, Role } from '@/types/user';
import { mockUsers } from './mockData';

// In-memory mock storage
let usersData = [...mockUsers];

// Mock roles
const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'admin',
    description: 'Full system access',
    permissions: [],
  },
  {
    id: 'role-2',
    name: 'analyst',
    description: 'Data analysis and reporting',
    permissions: [],
  },
  {
    id: 'role-3',
    name: 'user',
    description: 'Basic access',
    permissions: [],
  },
];

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await httpClient.get<User[]>('/users', usersData);
    return unwrapResponse(response);
  },

  getUserById: async (id: string): Promise<User> => {
    const user = usersData.find(u => u.id === id);
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const response = await httpClient.get<User>(`/users/${id}`, user);
    return unwrapResponse(response);
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email || '',
      full_name: data.full_name || null,
      role: data.role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    usersData.push(newUser);

    const response = await httpClient.post<User>('/users', data, newUser);
    return unwrapResponse(response);
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const index = usersData.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    usersData[index] = {
      ...usersData[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    const response = await httpClient.put<User>(`/users/${id}`, data, usersData[index]);
    return unwrapResponse(response);
  },

  deleteUser: async (id: string): Promise<void> => {
    const index = usersData.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    usersData.splice(index, 1);

    await httpClient.delete<void>(`/users/${id}`, undefined);
  },

  updateUserRole: async (userId: string, role: User['role']): Promise<User> => {
    return usersService.updateUser(userId, { role });
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await httpClient.get<Role[]>('/roles', mockRoles);
    return unwrapResponse(response);
  },
};
