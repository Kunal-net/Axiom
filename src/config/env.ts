/**
 * Axiom Environment Configuration & Startup Validator
 *
 * This module parses, validates, and freezes client-side environment configuration.
 * In accordance with Vite conventions, only variables prefixed with 'VITE_' are accessible here.
 * Never place private backend secrets or credentials in client bundles.
 */

export interface AppConfig {
  /** Base URL for the Axiom backend API */
  readonly apiBaseUrl: string;
  /** Whether Axiom is operating with in-memory mock service fixtures */
  readonly useMockData: boolean;
  /** Deployment environment */
  readonly appEnv: 'development' | 'staging' | 'production' | 'test';
  /** Application title for browser header & branding */
  readonly appTitle: string;
}

/**
 * Validates and returns the application configuration.
 * Logs diagnostic information in development mode and warns if suspicious client variables are detected.
 */
export function validateEnv(): AppConfig {
  const rawApiBase = import.meta.env.VITE_API_BASE_URL;
  const rawMock = import.meta.env.VITE_USE_MOCK_DATA;
  const rawEnv = import.meta.env.VITE_APP_ENV || (import.meta.env.DEV ? 'development' : 'production');
  const rawTitle = import.meta.env.VITE_APP_TITLE;

  // Validate API base URL format if provided
  let apiBaseUrl = 'http://localhost:8000';
  if (rawApiBase && typeof rawApiBase === 'string') {
    try {
      const parsed = new URL(rawApiBase);
      apiBaseUrl = parsed.origin;
    } catch {
      console.warn(`[Axiom Config] Invalid VITE_API_BASE_URL: "${rawApiBase}". Falling back to "${apiBaseUrl}".`);
    }
  }

  // Determine mock mode: defaults to true if not explicitly set to 'false'
  const useMockData = rawMock === undefined || rawMock === '' ? true : rawMock === 'true';

  // Determine environment
  let appEnv: 'development' | 'staging' | 'production' | 'test' = 'development';
  if (rawEnv === 'production' || rawEnv === 'staging' || rawEnv === 'test') {
    appEnv = rawEnv;
  }

  const appTitle = rawTitle || 'Axiom — Contract Intelligence for Independent Professionals';

  // Security Audit: Check for potential accidental leak of server secrets into client bundle
  const suspiciousKeys = Object.keys(import.meta.env).filter((key) => {
    const upper = key.toUpperCase();
    return (
      upper.startsWith('VITE_') &&
      (upper.includes('SECRET') ||
        upper.includes('PRIVATE') ||
        upper.includes('DB_PASSWORD') ||
        upper.includes('DATABASE_URL') ||
        upper.includes('API_KEY'))
    );
  });

  if (suspiciousKeys.length > 0) {
    console.error(
      `🚨 [Axiom Security Warning] Potential secret detected in client environment variables: ${suspiciousKeys.join(
        ', '
      )}. Client-side 'VITE_' variables are exposed to all website visitors in JavaScript bundles! Never put backend secrets in VITE_* variables.`
    );
  }

  // Startup diagnostic logging in development
  if (import.meta.env.DEV) {
    console.groupCollapsed('%c[Axiom] System Bootstrap & Configuration', 'color: #1C1B19; font-weight: bold; background: #F7F4EE; padding: 2px 6px; border-radius: 3px;');
    console.log(`Environment: %c${appEnv}`, 'font-weight: bold;');
    console.log(`Mode: %c${useMockData ? 'MOCK SERVICE (In-Memory Simulation)' : 'LIVE BACKEND'}`, useMockData ? 'color: #92530C; font-weight: bold;' : 'color: #286344; font-weight: bold;');
    console.log(`API Base URL: %c${apiBaseUrl}`, 'color: #716B63;');
    console.log(`Title: %c${appTitle}`, 'color: #716B63;');
    console.groupEnd();
  }

  return Object.freeze({
    apiBaseUrl,
    useMockData,
    appEnv,
    appTitle,
  });
}

export const appConfig = validateEnv();
