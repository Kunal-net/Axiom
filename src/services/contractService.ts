import { ContractDocument, DocumentDiff, UserProfile, ContractTemplate } from '../types/contract';
import { 
  PRIMARY_CONTRACT, 
  SAMPLE_DOCUMENTS, 
  SAMPLE_COMPARISON_DIFFS, 
  INITIAL_USER_PROFILE, 
  CONTRACT_TEMPLATES 
} from '../data/sampleContracts';
import { appConfig } from '../config/env';

class ContractService {
  private documents: ContractDocument[] = [...SAMPLE_DOCUMENTS];
  private userProfile: UserProfile = { ...INITIAL_USER_PROFILE };
  private templates: ContractTemplate[] = [...CONTRACT_TEMPLATES];
  public readonly isMock: boolean = appConfig.useMockData;
  public readonly apiBaseUrl: string = appConfig.apiBaseUrl;

  // Fetch all documents
  public async getDocuments(): Promise<ContractDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.documents]), 80);
    });
  }

  // Fetch single document by ID
  public async getDocumentById(id: string): Promise<ContractDocument | undefined> {
    return new Promise((resolve) => {
      const doc = this.documents.find((d) => d.id === id) || (id === 'default' ? PRIMARY_CONTRACT : undefined);
      setTimeout(() => resolve(doc), 80);
    });
  }

  // Delete a document
  public async deleteDocument(id: string): Promise<boolean> {
    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.documents.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Reset sample documents
  public resetSampleDocuments(): void {
    this.documents = [...SAMPLE_DOCUMENTS];
  }

  // Simulate realistic document analysis with progress stages
  public async analyzeDocument(
    file: { name: string; size: number },
    onStageChange?: (stage: string, percent: number) => void
  ): Promise<ContractDocument> {
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    // Stage 1: Uploading
    onStageChange?.('Uploading document to secure enclave...', 25);
    await new Promise((r) => setTimeout(r, 500));

    // Stage 2: Extracting clauses
    onStageChange?.('Extracting document structure & clause hierarchy...', 55);
    await new Promise((r) => setTimeout(r, 600));

    // Stage 3: Risk scanning
    onStageChange?.('Evaluating liabilities, indemnities, and IP rights...', 85);
    await new Promise((r) => setTimeout(r, 700));

    // Stage 4: Synthesizing recommendations
    onStageChange?.('Synthesizing plain-English explanations & revisions...', 100);
    await new Promise((r) => setTimeout(r, 400));

    const newDoc: ContractDocument = {
      ...PRIMARY_CONTRACT,
      id: `doc-${Date.now()}`,
      name: file.name,
      fileSize: fileSizeFormatted,
      uploadedAt: 'Just now',
      lastAnalyzedAt: 'Just now',
      status: 'needs_review'
    };

    this.documents.unshift(newDoc);
    return newDoc;
  }

  // Get comparison diffs
  public async getComparisonDiffs(): Promise<DocumentDiff[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...SAMPLE_COMPARISON_DIFFS]), 80);
    });
  }

  // Mark clause reviewed or bookmarked
  public toggleClauseBookmark(docId: string, clauseId: string): boolean {
    const doc = this.documents.find((d) => d.id === docId) || PRIMARY_CONTRACT;
    const clause = doc.clauses.find((c) => c.id === clauseId);
    if (clause) {
      clause.bookmarked = !clause.bookmarked;
      return clause.bookmarked;
    }
    return false;
  }

  public markClauseReviewed(docId: string, clauseId: string, reviewed: boolean): void {
    const doc = this.documents.find((d) => d.id === docId) || PRIMARY_CONTRACT;
    const clause = doc.clauses.find((c) => c.id === clauseId);
    if (clause) {
      clause.reviewed = reviewed;
    }
  }

  // Get templates
  public async getTemplates(): Promise<ContractTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.templates]), 50);
    });
  }

  // Get profile
  public async getUserProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.userProfile }), 40);
    });
  }

  // Update profile
  public async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    this.userProfile = { ...this.userProfile, ...updated };
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.userProfile }), 80);
    });
  }
}

export const contractService = new ContractService();
