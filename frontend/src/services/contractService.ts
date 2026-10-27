import { 
  ContractDocument, 
  DocumentDiff, 
  UserProfile, 
  ContractTemplate, 
  DocumentListResponse, 
  DocumentComparisonResponse,
  HealthCheckResponse
} from '../types/contract';
import { 
  PRIMARY_CONTRACT, 
  SAMPLE_DOCUMENTS, 
  SAMPLE_COMPARISON_DIFFS, 
  INITIAL_USER_PROFILE, 
  CONTRACT_TEMPLATES 
} from '../data/sampleContracts';
import { appConfig } from '../config/env';
import { apiClient, ApiClient } from './apiClient';

/**
 * Unified Contract Service
 * Handles data access for contracts, legal diffs, templates, and user preferences.
 * Supports seamless switching between in-memory mock mode and live backend REST endpoints.
 */
export class ContractService {
  private documents: ContractDocument[] = [...SAMPLE_DOCUMENTS];
  private userProfile: UserProfile = { ...INITIAL_USER_PROFILE };
  private templates: ContractTemplate[] = [...CONTRACT_TEMPLATES];
  public readonly isMock: boolean;
  public readonly apiBaseUrl: string;
  private readonly client: ApiClient;

  constructor(options?: { isMock?: boolean; apiBaseUrl?: string; client?: ApiClient }) {
    this.isMock = options?.isMock !== undefined ? options.isMock : appConfig.useMockData;
    this.apiBaseUrl = options?.apiBaseUrl || appConfig.apiBaseUrl;
    this.client = options?.client || (options?.apiBaseUrl ? new ApiClient(options.apiBaseUrl) : apiClient);
  }

  /**
   * Health and connectivity probe for live backend
   */
  public async checkHealth(): Promise<HealthCheckResponse | null> {
    if (this.isMock) {
      return {
        status: 'mock_active',
        version: '2.4.0',
        ai: {
          status: 'active',
          provider: 'in-memory-simulation',
          model: 'demo-rules',
        },
      };
    }
    try {
      return await this.client.get<HealthCheckResponse>('/health', { timeoutMs: 3000 });
    } catch {
      return null;
    }
  }

  /**
   * Fetch all documents (Dashboard and History)
   */
  public async getDocuments(): Promise<ContractDocument[]> {
    if (!this.isMock) {
      try {
        const response = await this.client.get<DocumentListResponse | ContractDocument[]>('/documents');
        if (Array.isArray(response)) {
          return response;
        }
        return response.documents || [];
      } catch (err) {
        console.warn('[Axiom Service] Failed to fetch live documents from backend:', err);
        return [];
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.documents]), 80);
    });
  }

  /**
   * Fetch a single document by ID (Results and Report)
   */
  public async getDocumentById(id: string): Promise<ContractDocument | undefined> {
    if (!this.isMock) {
      try {
        return await this.client.get<ContractDocument>(`/documents/${id}`);
      } catch (err) {
        console.warn(`[Axiom Service] Failed to fetch live document ${id}:`, err);
        return undefined;
      }
    }

    return new Promise((resolve) => {
      const doc = this.documents.find((d) => d.id === id) || (id === 'default' ? PRIMARY_CONTRACT : undefined);
      setTimeout(() => resolve(doc), 80);
    });
  }

  /**
   * Delete a document
   */
  public async deleteDocument(id: string): Promise<boolean> {
    if (!this.isMock) {
      try {
        await this.client.delete(`/documents/${id}`);
        const idx = this.documents.findIndex((d) => d.id === id);
        if (idx !== -1) {
          this.documents.splice(idx, 1);
        }
        return true;
      } catch (err) {
        console.warn(`[Axiom Service] Failed to delete live document ${id}:`, err);
        return false;
      }
    }

    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.documents.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getDefaultDocument(): ContractDocument {
    return PRIMARY_CONTRACT;
  }

  /**
   * Reset sample documents in memory (Mock only)
   */
  public resetSampleDocuments(): void {
    this.documents = [...SAMPLE_DOCUMENTS];
  }

  /**
   * Upload and analyze a document with progress stages
   */
  public async analyzeDocument(
    file: File | { name: string; size: number },
    onStageChange?: (stage: string, percent: number) => void
  ): Promise<ContractDocument> {
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    // 1. LIVE BACKEND MODE
    if (!this.isMock) {
      const formData = new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      } else {
        formData.append('file', new Blob(['Mock payload for test'], { type: 'application/pdf' }), file.name);
      }

      onStageChange?.('Uploading contract to backend...', 25);
      const uploaded = await this.client.upload<ContractDocument>('/documents/upload', formData);

      onStageChange?.('Invoking AI model & analyzing legal risk clauses...', 65);
      const analyzed = await this.client.post<ContractDocument>(`/documents/${uploaded.id}/analyze`, {
        riskSensitivity: this.userProfile.riskSensitivity,
        explanationStyle: this.userProfile.explanationStyle,
        autoGenerateRedlines: this.userProfile.autoGenerateRedlines,
      });

      onStageChange?.('Synthesizing plain-English explanations & counter-proposals...', 100);
      return analyzed;
    }

    // 2. EXPLICIT DEMO / MOCK MODE
    onStageChange?.('[DEMO MODE] Uploading document to in-memory simulation...', 25);
    await new Promise((r) => setTimeout(r, 400));

    onStageChange?.('[DEMO MODE] Extracting document structure & clause hierarchy...', 55);
    await new Promise((r) => setTimeout(r, 400));

    onStageChange?.('[DEMO MODE] Evaluating liabilities, indemnities, and IP rights...', 85);
    await new Promise((r) => setTimeout(r, 400));

    onStageChange?.('[DEMO MODE] Synthesizing plain-English explanations & revisions...', 100);
    await new Promise((r) => setTimeout(r, 200));

    const matchedSample = SAMPLE_DOCUMENTS.find(
      (s) => s.name.toLowerCase() === file.name.toLowerCase()
    );
    const baseTemplate = matchedSample || PRIMARY_CONTRACT;

    const newDoc: ContractDocument = {
      ...baseTemplate,
      id: `doc-demo-${Date.now()}`,
      name: file.name,
      fileSize: fileSizeFormatted,
      uploadedAt: 'Just now',
      lastAnalyzedAt: 'Just now',
      status: 'needs_review',
      provider: 'mock',
      modelName: 'demo-in-memory-simulation',
    };

    this.documents.unshift(newDoc);
    return newDoc;
  }

  /**
   * Get legal comparison diffs between two contract versions
   */
  public async getComparisonDiffs(
    originalDocId: string = 'doc-msa-fintech',
    revisedDocId: string = 'doc-msa-counter'
  ): Promise<DocumentDiff[]> {
    if (!this.isMock) {
      const response = await this.client.post<DocumentComparisonResponse>('/documents/compare', {
        originalDocId,
        revisedDocId,
      });
      return response.diffs || [];
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve([...SAMPLE_COMPARISON_DIFFS]), 80);
    });
  }

  /**
   * Toggle clause bookmark
   */
  public toggleClauseBookmark(docId: string, clauseId: string): boolean {
    const doc = this.documents.find((d) => d.id === docId) || PRIMARY_CONTRACT;
    const clause = doc.clauses.find((c) => c.id === clauseId);
    if (clause) {
      clause.bookmarked = !clause.bookmarked;
      if (!this.isMock) {
        this.client.patch(`/documents/${docId}/clauses/${clauseId}`, { bookmarked: clause.bookmarked }).catch((err) => {
          console.warn('[Axiom Service] Failed to persist clause bookmark:', err);
        });
      }
      return clause.bookmarked;
    }
    return false;
  }

  /**
   * Mark a clause reviewed
   */
  public markClauseReviewed(docId: string, clauseId: string, reviewed: boolean): void {
    const doc = this.documents.find((d) => d.id === docId) || PRIMARY_CONTRACT;
    const clause = doc.clauses.find((c) => c.id === clauseId);
    if (clause) {
      clause.reviewed = reviewed;
      if (!this.isMock) {
        this.client.patch(`/documents/${docId}/clauses/${clauseId}`, { reviewed }).catch((err) => {
          console.warn('[Axiom Service] Failed to persist clause reviewed state:', err);
        });
      }
    }
  }

  /**
   * Get contract templates
   */
  public async getTemplates(): Promise<ContractTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.templates]), 50);
    });
  }

  /**
   * Get user profile preferences
   */
  public async getUserProfile(): Promise<UserProfile> {
    if (!this.isMock) {
      try {
        const profile = await this.client.get<UserProfile>('/user/profile');
        this.userProfile = profile;
        return profile;
      } catch (err) {
        console.warn('[Axiom Service] Failed to fetch live user profile, falling back to cached profile:', err);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.userProfile }), 40);
    });
  }

  /**
   * Update user profile preferences
   */
  public async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    this.userProfile = { ...this.userProfile, ...updated };

    if (!this.isMock) {
      try {
        const result = await this.client.put<UserProfile>('/user/profile', this.userProfile);
        this.userProfile = result;
        return result;
      } catch (err) {
        console.warn('[Axiom Service] Failed to persist user profile updates to live backend:', err);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.userProfile }), 80);
    });
  }
}

export const contractService = new ContractService();
