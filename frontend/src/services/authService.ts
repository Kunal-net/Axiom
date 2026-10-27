import { apiClient, ApiClient } from './apiClient';
import { AuthUser, TokenResponse, LoginCredentials, RegisterData } from '../types/contract';
import { appConfig } from '../config/env';

const TOKEN_STORAGE_KEY = 'axiom_auth_token';
const USER_STORAGE_KEY = 'axiom_auth_user';

export class AuthService {
  private client: ApiClient;
  private currentUser: AuthUser | null = null;
  private token: string | null = null;
  private isInitialized = false;
  private initPromise: Promise<AuthUser | null> | null = null;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);

      if (storedToken) {
        this.token = storedToken;
        this.client.setToken(storedToken);
      }

      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('[AuthService] Failed to load session from sessionStorage:', e);
    }
  }

  private saveToStorage(token: string, user: AuthUser): void {
    if (typeof window === 'undefined') return;
    try {
      this.token = token;
      this.currentUser = user;
      this.client.setToken(token);
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[AuthService] Failed to save session to sessionStorage:', e);
    }
  }

  private clearStorage(): void {
    this.token = null;
    this.currentUser = null;
    this.client.setToken(null);
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('[AuthService] Failed to clear sessionStorage:', e);
    }
  }

  /**
   * Check authentication status and validate session with backend.
   * Probes /auth/me to verify both bearer token and HttpOnly cookie.
   */
  public async checkAuth(): Promise<AuthUser | null> {
    if (this.isInitialized && this.currentUser) {
      return this.currentUser;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      // In mock mode without live backend, maintain simulated session
      if (appConfig.useMockData) {
        if (!this.currentUser) {
          const demoUser: AuthUser = {
            id: 'mock-user-1',
            email: 'kunal@axiom.legal',
            name: 'Kunal Suryanshi',
            role: 'Student',
            organization: 'Axiom Workspace',
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          this.currentUser = demoUser;
        }
        this.isInitialized = true;
        return this.currentUser;
      }

      try {
        const user = await this.client.get<AuthUser>('/auth/me', { timeoutMs: 4000 });
        this.currentUser = user;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
        this.isInitialized = true;
        return user;
      } catch {
        // Unauthenticated or network error
        this.clearStorage();
        this.isInitialized = true;
        return null;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Authenticate user with email and password
   */
  public async login(credentials: LoginCredentials): Promise<TokenResponse> {
    if (appConfig.useMockData) {
      const mockResponse: TokenResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        tokenType: 'bearer',
        user: {
          id: 'user-demo-1',
          email: credentials.email,
          name: credentials.email.split('@')[0].replace('.', ' '),
          role: 'Principal Counsel',
          organization: 'Axiom Client Studio',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      };
      this.saveToStorage(mockResponse.token, mockResponse.user);
      return mockResponse;
    }

    const response = await this.client.post<TokenResponse>('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    this.saveToStorage(response.token, response.user);
    return response;
  }

  /**
   * Register a new user
   */
  public async register(data: RegisterData): Promise<TokenResponse> {
    if (appConfig.useMockData) {
      const mockResponse: TokenResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        tokenType: 'bearer',
        user: {
          id: 'user-' + Date.now(),
          email: data.email,
          name: data.name,
          role: data.role || 'Design Counsel',
          organization: data.organization || 'Independent Practice',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      };
      this.saveToStorage(mockResponse.token, mockResponse.user);
      return mockResponse;
    }

    const response = await this.client.post<TokenResponse>('/auth/register', {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      name: data.name.trim(),
      role: data.role?.trim() || undefined,
      organization: data.organization?.trim() || undefined,
    });

    this.saveToStorage(response.token, response.user);
    return response;
  }

  /**
   * Log out current user, invalidate session, and clear cookies
   */
  public async logout(): Promise<void> {
    try {
      if (!appConfig.useMockData) {
        await this.client.post('/auth/logout');
      }
    } catch (err) {
      console.warn('[AuthService] Logout API request returned an error, proceeding with local cleanup:', err);
    } finally {
      this.clearStorage();
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }

  public getUser(): AuthUser | null {
    return this.currentUser;
  }

  public getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
