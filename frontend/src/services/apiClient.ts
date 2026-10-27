import { appConfig } from '../config/env';
import { ApiErrorDetail } from '../types/contract';

/**
 * Standard typed application error carrying HTTP status and backend error codes
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(status: number, errorDetail: ApiErrorDetail) {
    super(errorDetail.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = errorDetail.code;
    this.details = errorDetail.details;
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Axiom REST API Client
 * Lightweight fetch wrapper with base URL prepending, timeouts, and standardized error parsing.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private token: string | null = null;
  private unauthorizedListeners: Array<() => void> = [];

  constructor(customBaseUrl?: string) {
    const raw = customBaseUrl || appConfig.apiBaseUrl;
    this.baseUrl = `${raw.replace(/\/api\/v1\/?$/, '')}/api/v1`;
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public onUnauthorized(listener: () => void): () => void {
    this.unauthorizedListeners.push(listener);
    return () => {
      this.unauthorizedListeners = this.unauthorizedListeners.filter((l) => l !== listener);
    };
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 15000, headers = {}, ...customConfig } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const mergedHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(headers as Record<string, string>),
    };

    if (this.token && !mergedHeaders['Authorization']) {
      mergedHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      credentials: 'include',
      ...customConfig,
      headers: mergedHeaders,
      signal: controller.signal,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          this.unauthorizedListeners.forEach((fn) => {
            try {
              fn();
            } catch {
              // Ignore subscriber errors
            }
          });
        }

        let errorData: ApiErrorDetail;
        try {
          const body = await response.json();
          errorData = body.error || {
            code: 'HTTP_ERROR',
            message: `Request failed with status ${response.status}`,
          };
        } catch {
          errorData = {
            code: 'HTTP_ERROR',
            message: `Server returned ${response.status} ${response.statusText}`,
          };
        }
        throw new ApiError(response.status, errorData);
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError(408, {
          code: 'REQUEST_TIMEOUT',
          message: `Request to ${endpoint} timed out after ${timeoutMs}ms.`,
        });
      }
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      throw new ApiError(0, {
        code: 'NETWORK_ERROR',
        message,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      timeoutMs: options?.timeoutMs || 60000,
    });
  }
}

export const apiClient = new ApiClient();
