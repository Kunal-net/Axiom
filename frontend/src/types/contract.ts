export type RiskSeverity = 'high' | 'medium' | 'low' | 'info';

export interface ClauseFinding {
  id: string;
  title: string;
  severity: RiskSeverity;
  section: string;
  pageNumber: number;
  originalText: string;
  explanation: string;
  whyRisky: string;
  suggestedRevision: string;
  category: 'liability' | 'payment' | 'ip' | 'termination' | 'warranty' | 'confidentiality' | 'governing_law';
  reviewed?: boolean;
  bookmarked?: boolean;
}

export interface ContractDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx';
  fileSize: string;
  uploadedAt: string;
  lastAnalyzedAt: string;
  status: 'completed' | 'processing' | 'needs_review' | 'failed';
  riskCounts: {
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  summary: string;
  clauses: ClauseFinding[];
  pageCount: number;
  provider?: string;
  modelName?: string;
  extractedText?: string;
}

export interface DocumentDiff {
  id: string;
  clauseTitle: string;
  section: string;
  changeType: 'modified' | 'added' | 'removed' | 'conflict';
  severity: RiskSeverity;
  originalText: string;
  revisedText: string;
  explanation: string;
  legalImpact: string;
  authorOriginal?: string;
  authorRevised?: string;
}

export interface ContractTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  fileSize: string;
  estimatedPages: number;
  standardClauses: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  riskSensitivity: 'standard' | 'strict' | 'relaxed';
  explanationStyle: 'plain_english' | 'balanced' | 'legal_formal';
  autoGenerateRedlines: boolean;
  documentRetentionDays: number;
  emailNotifications: boolean;
  highRiskAlerts: boolean;
}

export interface DocumentListResponse {
  documents: ContractDocument[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface DocumentComparisonResponse {
  comparisonId: string;
  originalDocId: string;
  revisedDocId: string;
  diffs: DocumentDiff[];
}

export interface AnalysisInitiateRequest {
  riskSensitivity?: 'standard' | 'strict' | 'relaxed';
  explanationStyle?: 'plain_english' | 'balanced' | 'legal_formal';
  autoGenerateRedlines?: boolean;
}

export interface HealthCheckResponse {
  status: string;
  version?: string;
  timestamp?: string;
  database?: string;
  ai?: {
    status: string;
    provider: string;
    model: string;
  };
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  organization?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TokenResponse {
  token: string;
  tokenType: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
  organization?: string;
}

