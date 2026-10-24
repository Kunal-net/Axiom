import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateEnv } from './env';

describe('Axiom Environment Configuration Validator', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('provides default development configuration when environment is unset', () => {
    const config = validateEnv();
    expect(config).toBeDefined();
    expect(typeof config.apiBaseUrl).toBe('string');
    expect(typeof config.useMockData).toBe('boolean');
    expect(['development', 'staging', 'production', 'test']).toContain(config.appEnv);
  });

  it('correctly reports mock mode state', () => {
    const config = validateEnv();
    // Default in development is true
    expect(config.useMockData).toBe(true);
  });

  it('freezes the returned configuration object to prevent runtime tampering', () => {
    const config = validateEnv();
    expect(Object.isFrozen(config)).toBe(true);
  });
});
