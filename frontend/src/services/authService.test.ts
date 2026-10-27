import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './authService';
import { ApiClient } from './apiClient';

class MockStorage {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.get(key) ?? null; }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
  removeItem(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

describe('AuthService', () => {
  let mockClient: ApiClient;
  let authService: AuthService;

  beforeEach(() => {
    (globalThis as any).sessionStorage = new MockStorage();
    (globalThis as any).window = globalThis;
    mockClient = new ApiClient('http://localhost:8000');
    authService = new AuthService(mockClient);
  });

  it('initializes with unauthenticated state when storage is empty', () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getUser()).toBeNull();
    expect(authService.getToken()).toBeNull();
  });

  it('saves token and user upon successful login', async () => {
    const mockResponse = {
      token: 'test-jwt-token',
      tokenType: 'bearer',
      user: {
        id: 'user-1',
        email: 'alex@example.com',
        name: 'Alex Mercer',
        role: 'Lead Partner',
        organization: 'Studio Mercer',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    };

    vi.spyOn(mockClient, 'post').mockResolvedValueOnce(mockResponse);

    const result = await authService.login({
      email: 'alex@example.com',
      password: 'DevPassword123!',
    });

    expect(result.token).toBe('test-jwt-token');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getUser()?.email).toBe('alex@example.com');
    expect(authService.getToken()).toBe('test-jwt-token');
    expect(sessionStorage.getItem('axiom_auth_token')).toBe('test-jwt-token');
  });

  it('saves token and user upon registration', async () => {
    const mockResponse = {
      token: 'reg-token-456',
      tokenType: 'bearer',
      user: {
        id: 'user-2',
        email: 'newbie@example.com',
        name: 'New User',
        role: 'Associate',
        organization: 'Independent',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    };

    vi.spyOn(mockClient, 'post').mockResolvedValueOnce(mockResponse);

    const result = await authService.register({
      email: 'newbie@example.com',
      password: 'StrongPassword123!',
      name: 'New User',
    });

    expect(result.token).toBe('reg-token-456');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getUser()?.name).toBe('New User');
  });

  it('clears storage and state upon logout', async () => {
    sessionStorage.setItem('axiom_auth_token', 'token-to-clear');
    sessionStorage.setItem('axiom_auth_user', JSON.stringify({ email: 'test@example.com' }));

    const service = new AuthService(mockClient);
    vi.spyOn(mockClient, 'post').mockResolvedValueOnce({ message: 'Logged out successfully' });

    await service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getUser()).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(sessionStorage.getItem('axiom_auth_token')).toBeNull();
  });

  it('validates session via checkAuth probe', async () => {
    const mockUser = {
      id: 'user-check-1',
      email: 'probe@example.com',
      name: 'Probe User',
      role: 'Auditor',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
    };

    vi.spyOn(mockClient, 'get').mockResolvedValueOnce(mockUser);

    const user = await authService.checkAuth();
    expect(user?.email).toBe('probe@example.com');
    expect(authService.isAuthenticated()).toBe(true);
  });
});
