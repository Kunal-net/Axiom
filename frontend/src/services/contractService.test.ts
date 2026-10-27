import { describe, it, expect } from 'vitest';
import { ContractService } from './contractService';

describe('ContractService (Mock Enclave & Live Mode Isolation)', () => {
  const mockService = new ContractService({ isMock: true });

  it('retrieves documents list in mock development mode', async () => {
    const docs = await mockService.getDocuments();
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0]).toHaveProperty('id');
    expect(docs[0]).toHaveProperty('name');
    expect(docs[0]).toHaveProperty('riskCounts');
    expect(docs[0].riskCounts).toHaveProperty('high');
  });

  it('retrieves single document by id in mock mode', async () => {
    const doc = await mockService.getDocumentById('doc-msa-fintech');
    expect(doc).toBeDefined();
    expect(doc?.id).toBe('doc-msa-fintech');
    expect(doc?.clauses.length).toBeGreaterThan(0);
  });

  it('retrieves comparison diffs for side-by-side analysis', async () => {
    const diffs = await mockService.getComparisonDiffs();
    expect(Array.isArray(diffs)).toBe(true);
    expect(diffs.length).toBeGreaterThan(0);
    expect(diffs[0]).toHaveProperty('clauseTitle');
    expect(diffs[0]).toHaveProperty('originalText');
    expect(diffs[0]).toHaveProperty('revisedText');
  });

  it('marks a clause reviewed in mock mode', async () => {
    const doc = await mockService.getDocumentById('doc-msa-fintech');
    expect(doc).toBeDefined();
    if (doc && doc.clauses.length > 0) {
      const clauseId = doc.clauses[0].id;
      mockService.markClauseReviewed('doc-msa-fintech', clauseId, true);
      const updated = await mockService.getDocumentById('doc-msa-fintech');
      expect(updated?.clauses.find((c) => c.id === clauseId)?.reviewed).toBe(true);
    }
  });

  it('retrieves user profile configuration', async () => {
    const profile = await mockService.getUserProfile();
    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('riskSensitivity');
    expect(profile).toHaveProperty('explanationStyle');
  });

  it('reports mock mode status and provides health probe', async () => {
    expect(mockService.isMock).toBe(true);
    const health = await mockService.checkHealth();
    expect(health).toBeDefined();
    expect(health?.status).toBe('mock_active');
  });

  it('explicitly brands mock analyses so they cannot masquerade as live analysis', async () => {
    const analyzed = await mockService.analyzeDocument({
      name: 'Contract A - Redstone Retail.pdf',
      size: 1024 * 1024,
    });
    expect(analyzed).toBeDefined();
    // Must be labeled with doc-demo- prefix
    expect(analyzed.id).toMatch(/^doc-demo-/);
    // Must explicitly declare mock provider and simulation model
    expect(analyzed.provider).toBe('mock');
    expect(analyzed.modelName).toBe('demo-in-memory-simulation');
  });

  it('in live mode, fails explicitly and never silently returns mock/sample contracts', async () => {
    // Unreachable endpoint
    const liveService = new ContractService({ isMock: false, apiBaseUrl: 'http://127.0.0.1:59999' });
    expect(liveService.isMock).toBe(false);

    // 1. Analyze must throw on network error, not return PRIMARY_CONTRACT
    await expect(
      liveService.analyzeDocument({ name: 'Contract A.pdf', size: 1024 })
    ).rejects.toThrow();

    // 2. getDocumentById must return undefined, not PRIMARY_CONTRACT
    const doc = await liveService.getDocumentById('doc-msa-fintech');
    expect(doc).toBeUndefined();

    // 3. getDocuments must return empty list, not SAMPLE_DOCUMENTS
    const docs = await liveService.getDocuments();
    expect(docs).toEqual([]);

    // 4. getComparisonDiffs must reject on network error, not return SAMPLE_COMPARISON_DIFFS or mask failure as zero diffs
    await expect(
      liveService.getComparisonDiffs('doc-a', 'doc-b')
    ).rejects.toThrow();
  });
});
