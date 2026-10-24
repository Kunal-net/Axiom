import { describe, it, expect } from 'vitest';
import { contractService } from './contractService';

describe('ContractService (Bootstrap & Workflow Readiness)', () => {
  it('retrieves documents list in mock development mode', async () => {
    const docs = await contractService.getDocuments();
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0]).toHaveProperty('id');
    expect(docs[0]).toHaveProperty('name');
    expect(docs[0]).toHaveProperty('riskCounts');
    expect(docs[0].riskCounts).toHaveProperty('high');
  });

  it('retrieves single document by id', async () => {
    const doc = await contractService.getDocumentById('doc-msa-fintech');
    expect(doc).toBeDefined();
    expect(doc?.id).toBe('doc-msa-fintech');
    expect(doc?.clauses.length).toBeGreaterThan(0);
  });

  it('retrieves comparison diffs for side-by-side analysis', async () => {
    const diffs = await contractService.getComparisonDiffs();
    expect(Array.isArray(diffs)).toBe(true);
    expect(diffs.length).toBeGreaterThan(0);
    expect(diffs[0]).toHaveProperty('clauseTitle');
    expect(diffs[0]).toHaveProperty('originalText');
    expect(diffs[0]).toHaveProperty('revisedText');
  });

  it('marks a clause reviewed', async () => {
    const doc = await contractService.getDocumentById('doc-msa-fintech');
    expect(doc).toBeDefined();
    if (doc && doc.clauses.length > 0) {
      const clauseId = doc.clauses[0].id;
      contractService.markClauseReviewed('doc-msa-fintech', clauseId, true);
      const updated = await contractService.getDocumentById('doc-msa-fintech');
      expect(updated?.clauses.find((c) => c.id === clauseId)?.reviewed).toBe(true);
    }
  });

  it('retrieves user profile configuration', async () => {
    const profile = await contractService.getUserProfile();
    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('riskSensitivity');
    expect(profile).toHaveProperty('explanationStyle');
  });

  it('reports mock mode status and provides health probe', async () => {
    expect(contractService.isMock).toBe(true);
    const health = await contractService.checkHealth();
    expect(health).toBeDefined();
    expect(health?.status).toBe('mock_active');
  });
});
