import { mockUsers, type MockUser } from "@/mocks/mockUsers";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserFormData {
  name: string;
  email: string;
  role: MockUser["role"];
}

export const userService = {
  async getUsers(): Promise<MockUser[]> {
    await delay(500);
    return [...mockUsers];
  },

  async getUserById(id: string): Promise<MockUser | null> {
    await delay(300);
    return mockUsers.find((user) => user.id === id) || null;
  },

  async getUsersByRole(role: MockUser["role"]): Promise<MockUser[]> {
    await delay(400);
    return mockUsers.filter((u) => u.role === role);
  },

  async createUser(data: UserFormData): Promise<MockUser> {
    await delay(1000);
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
      permissions: ["view_data"],
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateUser(id: string, data: Partial<UserFormData>): Promise<MockUser | null> {
    await delay(800);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    
    Object.assign(user, data);
    return user;
  },

  async deleteUser(id: string): Promise<boolean> {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;
    
    mockUsers.splice(index, 1);
    return true;
  },

  async activateUser(id: string): Promise<MockUser | null> {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    
    user.status = "active";
    user.lastLogin = new Date().toISOString();
    return user;
  },

  async deactivateUser(id: string): Promise<MockUser | null> {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    
    user.status = "inactive";
    return user;
  },

  async updateUserRole(id: string, role: MockUser["role"]): Promise<MockUser | null> {
    await delay(600);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    
    user.role = role;
    return user;
  },

  async updateUserPermissions(id: string, permissions: string[]): Promise<MockUser | null> {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) return null;
    
    user.permissions = permissions;
    return user;
  },
};
