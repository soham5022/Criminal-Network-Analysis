import { fetchApi } from './api';

export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  badge_number: string;
  department: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_KEY = 'nexus_intel_jwt_token';
const USER_KEY = 'nexus_intel_user';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser(): User | null {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async login(email: string, password: string): Promise<TokenResponse> {
    const res = await fetchApi<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.access_token);
    this.setUser(res.user);
    return res;
  },

  async getMe(): Promise<User> {
    return fetchApi<User>('/auth/me');
  }
};
