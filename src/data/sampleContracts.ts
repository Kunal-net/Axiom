import { ContractDocument, DocumentDiff, UserProfile, ContractTemplate } from '../types/contract';

export const PRIMARY_CONTRACT: ContractDocument = {
  id: 'doc-msa-fintech',
  name: 'Freelance Agreement.pdf',
  fileType: 'pdf',
  fileSize: '2.4 MB',
  uploadedAt: 'Oct 21, 2026',
  lastAnalyzedAt: '14m ago',
  status: 'needs_review',
  pageCount: 8,
  summary: 'This contract contains several clauses that may be significantly unfavorable to you, particularly around unilateral termination, intellectual property ownership, and uncapped indemnification liability. We strongly recommend requesting targeted redlines before proceeding to execution.',
  riskCounts: {
    high: 3,
    medium: 5,
    low: 2,
    info: 1,
  },
  clauses: [
    {
      id: 'clause-1',
      title: 'Unilateral termination without notice',
      severity: 'high',
      section: 'Section 5.2',
      pageNumber: 4,
      category: 'termination',
      originalText: 'The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.',
      explanation: 'This clause allows the client to end the contract at any time without notice or compensation, which may be unfair and leaves you financially vulnerable after investing time.',
      whyRisky: 'No prior notice period (industry norm: 14–30 days). Eliminates compensation rights for work completed or in-progress. Completely non-reciprocal: you remain bound to deliverables while client can vacate commitments instantaneously.',
      suggestedRevision: 'Either party may terminate this Agreement with 30 days’ written notice. The Client shall compensate the Freelancer for all work completed up to the termination date.'
    },
    {
      id: 'clause-2',
      title: 'Broad Work for Hire & IP Ownership',
      severity: 'high',
      section: 'Section 6.2',
      pageNumber: 4,
      category: 'ip',
      originalText: 'Contractor irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe in all Work Product, including all pre-existing tools, libraries, and background frameworks incorporated therein, without reservation.',
      explanation: 'The client is attempting to seize ownership of your pre-existing code libraries, UI kits, design templates, and workflow scripts that you created before ever meeting them.',
      whyRisky: 'You legally forfeit the right to use your own reusable toolchain or starter kits with any other future clients.',
      suggestedRevision: 'Client receives an exclusive, perpetual license to custom deliverables upon full payment. Contractor explicitly retains full ownership of all pre-existing tools, code libraries, templates, and generic background know-how.'
    },
    {
      id: 'clause-3',
      title: 'Uncapped One-Way Indemnification',
      severity: 'high',
      section: 'Section 9.1',
      pageNumber: 3,
      category: 'liability',
      originalText: 'Contractor shall defend, indemnify, and hold harmless Client, its affiliates, directors, officers, employees, and agents from and against any and all claims, liabilities, losses, damages, costs, and expenses (including attorney\'s fees and consequential or punitive damages) arising out of or related to Contractor\'s performance.',
      explanation: 'This exposes your personal freelance business to unlimited financial liability, including client\'s lost profits, third-party lawsuits, and punitive damages.',
      whyRisky: 'A single disputed bug could result in a claim bankrupting you, far exceeding the total compensation paid under the contract.',
      suggestedRevision: 'Each party agrees to indemnify the other against direct third-party claims arising from gross negligence or willful misconduct, provided that Contractor\'s aggregate liability shall be capped at the total amount actually paid under this Agreement.'
    },
    {
      id: 'clause-4',
      title: 'Confidentiality & Non-Disclosure Scope',
      severity: 'medium',
      section: 'Section 7.1',
      pageNumber: 3,
      category: 'confidentiality',
      originalText: 'Confidential Information shall encompass all disclosures made by Client, whether marked confidential or not, including ideas discussed informally, with confidentiality obligations enduring in perpetuity.',
      explanation: 'A perpetual confidentiality term without a residual knowledge clause or written markings requirement can expose you to accidental breach claims years later.',
      whyRisky: 'Prevents you from discussing generic industry insights or listing the engagement in your portfolio without formal written clearance.',
      suggestedRevision: 'Confidentiality obligations shall endure for a period of three (3) years post-termination and shall exclude information generally known to the industry or retained in unaided memory.'
    },
    {
      id: 'clause-5',
      title: 'Net 90 Day Payment Schedule',
      severity: 'medium',
      section: 'Section 4.3',
      pageNumber: 2,
      category: 'payment',
      originalText: 'Client shall remit payment within ninety (90) days following formal acceptance of deliverables. Client reserves the right to withhold any disputed portion without interest or penalty pending internal audit.',
      explanation: 'Payment is delayed for three full months, and any payment dispute allows the client to freeze your invoice without late penalty.',
      whyRisky: 'You are forced to act as an interest-free bank for 3 months, creating severe cashflow vulnerability.',
      suggestedRevision: 'Client shall pay all undisputed invoices within thirty (30) days of invoice date. Overdue amounts shall accrue interest at 1.5% per month. Disputed portions must be formally documented within 10 business days.'
    },
    {
      id: 'clause-6',
      title: 'Unilateral Amendment Rights',
      severity: 'medium',
      section: 'Section 12.1',
      pageNumber: 5,
      category: 'termination',
      originalText: 'Client reserves the right to amend project timelines, technical specifications, and milestones at its sole discretion upon electronic notice.',
      explanation: 'Allows the client to expand the project scope or accelerate deadlines without compensating you for additional hours.',
      whyRisky: 'Classic scope creep mechanism without change-order fee guarantees.',
      suggestedRevision: 'Any material changes to project specifications, milestones, or deliverables must be mutually agreed upon in writing via an executed Change Order detailing cost and schedule adjustments.'
    },
    {
      id: 'clause-7',
      title: '2-Year Broad Non-Compete Period',
      severity: 'medium',
      section: 'Section 11.4',
      pageNumber: 4,
      category: 'confidentiality',
      originalText: 'During the term and for twenty-four (24) months thereafter, Contractor shall not directly or indirectly provide consulting, engineering, or design services to any entity in competitive commercial markets.',
      explanation: 'This is an extreme restraint of trade. Independent professionals should not be bound to non-competes.',
      whyRisky: 'Bans you from accepting clients in your primary area of expertise for 2 full years after finishing this project.',
      suggestedRevision: 'Section 11.4 shall be deleted in its entirety, or narrowed strictly to direct non-solicitation of Client’s internal personnel for 6 months.'
    },
    {
      id: 'clause-8',
      title: 'Non-Solicitation of Personnel',
      severity: 'medium',
      section: 'Section 10.2',
      pageNumber: 4,
      category: 'confidentiality',
      originalText: 'Contractor shall not recruit, solicit, or engage any employee or contractor of Client for a period of eighteen (18) months following the Effective Date.',
      explanation: 'Standard non-solicitation, but the duration is excessive for a short-term freelance contract.',
      whyRisky: 'Exceeds standard 6-month commercial contracting benchmarks.',
      suggestedRevision: 'Non-solicitation period shall be reduced to six (6) months and limited to employees with whom Contractor directly worked.'
    },
    {
      id: 'clause-9',
      title: 'Governing Law & Foreign Jurisdiction',
      severity: 'low',
      section: 'Section 14.1',
      pageNumber: 4,
      category: 'governing_law',
      originalText: 'This Agreement shall be governed by Delaware law and the parties submit to the exclusive jurisdiction of courts located in New Castle County, Delaware.',
      explanation: 'Low severity for everyday operations, but litigating across state lines incurs travel expenses and local counsel fees.',
      whyRisky: 'Gives the client home-court advantage if a payment dispute escalates to litigation.',
      suggestedRevision: 'This Agreement shall be governed by the laws of Contractor\'s jurisdiction, or disputes resolved via binding AAA online arbitration.'
    },
    {
      id: 'clause-10',
      title: 'Perpetual Warranty Survival',
      severity: 'low',
      section: 'Section 13.2',
      pageNumber: 4,
      category: 'warranty',
      originalText: 'All warranties and representations regarding deliverables shall survive the termination of this Agreement perpetually.',
      explanation: 'Software and design deliverables naturally become obsolete or undergo client modifications; warranties should not last forever.',
      whyRisky: 'Leaves you liable for bugs or browser incompatibilities years after delivery.',
      suggestedRevision: 'Deliverable warranties shall survive for ninety (90) days following acceptance, after which deliverables are deemed accepted AS-IS.'
    }
  ]
};

export const SAMPLE_COMPARISON_DIFFS: DocumentDiff[] = [
  {
    id: 'diff-1',
    clauseTitle: 'Termination clause modified',
    section: 'Section 5.2',
    changeType: 'conflict',
    severity: 'high',
    originalText: '⊖ “The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.”',
    revisedText: '⊕ “Either party may terminate this Agreement with 30 days’ written notice. The Client shall compensate the Freelancer for all work completed up to the termination date.”',
    explanation: 'Discrepancy detected in mutual notice rights and work-in-progress compensation commitments.',
    legalImpact: 'Original draft allowed abrupt cancellation without pay. Revised terms institute bilateral 30-day notice and mandatory pro-rata compensation.',
    authorOriginal: 'Client Legal Counsel • Signed Oct 21',
    authorRevised: 'Redrafted via External Counsel • Uploaded 14:20'
  },
  {
    id: 'diff-2',
    clauseTitle: 'Intellectual Property Ownership',
    section: 'Section 6.2',
    changeType: 'conflict',
    severity: 'high',
    originalText: '⊖ “Contractor transfers, assigns, and sets over all pre-existing tools and background technologies to Client.”',
    revisedText: '⊕ “Contractor retains full ownership of pre-existing tools. Client receives exclusive perpetual license to bespoke deliverables.”',
    explanation: 'Direct contradiction regarding ownership of developer toolkits and starter libraries.',
    legalImpact: 'Protects your pre-existing code assets from corporate expropriation.',
    authorOriginal: 'Client Legal Counsel • Section 6.2',
    authorRevised: 'Axiom Redline Engine • Recommended Carve-Out'
  },
  {
    id: 'diff-3',
    clauseTitle: 'Liability Cap institute',
    section: 'Section 9.2',
    changeType: 'added',
    severity: 'high',
    originalText: '⊖ [No aggregate cap existed; liability was unlimited]',
    revisedText: '⊕ “Total aggregate liability of either party shall not exceed the total fees paid under this Statement of Work in the preceding 6 months ($45,000).”',
    explanation: 'Inserted commercial liability ceiling where none was originally specified.',
    legalImpact: 'Eliminates open-ended personal exposure for indirect damages.',
    authorOriginal: 'Original Draft • Section 9',
    authorRevised: 'Contractor Redline • Section 9.2'
  },
  {
    id: 'diff-4',
    clauseTitle: 'Payment Terms & Invoicing Window',
    section: 'Section 4.3',
    changeType: 'modified',
    severity: 'medium',
    originalText: '⊖ “Invoices payable within ninety (90) days following formal acceptance.”',
    revisedText: '⊕ “Invoices payable within thirty (30) days of receipt; 1.5% late fee per month thereafter.”',
    explanation: 'Shifted payment schedule from Net 90 to standard Net 30 with late penalty.',
    legalImpact: 'Shortens payment waiting period by 60 days and enforces overdue interest.',
    authorOriginal: 'Client Procurement Terms',
    authorRevised: 'Standard Freelance Schedule'
  },
  {
    id: 'diff-5',
    clauseTitle: 'Restrictive Non-Compete deleted',
    section: 'Section 11.4',
    changeType: 'removed',
    severity: 'high',
    originalText: '⊖ “Contractor prohibited from providing services in fintech sector for 24 months post-termination.”',
    revisedText: '⊕ [Section 11.4 deleted in its entirety]',
    explanation: 'Deleted onerous 24-month restrictive non-compete covenant entirely.',
    legalImpact: 'Restores complete freedom to consult with other technology clients.',
    authorOriginal: 'Client In-House Legal Draft',
    authorRevised: 'Deleted by Contractor'
  },
  {
    id: 'diff-6',
    clauseTitle: 'Indemnification Scope & Mutuality',
    section: 'Section 9.1',
    changeType: 'conflict',
    severity: 'high',
    originalText: '⊖ “Contractor shall solely indemnify Client against all consequential and indirect losses.”',
    revisedText: '⊕ “Each party shall mutually indemnify the other against direct third-party claims arising from gross negligence.”',
    explanation: 'Converted unilateral contractor indemnity into balanced bilateral indemnity.',
    legalImpact: 'Removes indirect loss exposure and requires mutual client accountability.',
    authorOriginal: 'Client Draft v1.0',
    authorRevised: 'Axiom Counter-Proposal'
  },
  {
    id: 'diff-7',
    clauseTitle: 'Audit Rights & Withholding',
    section: 'Section 4.4',
    changeType: 'removed',
    severity: 'medium',
    originalText: '⊖ “Client reserves right to unilaterally freeze milestone disbursements pending arbitrary audits.”',
    revisedText: '⊕ [Unilateral freeze clause removed]',
    explanation: 'Removed clause that allowed client to freeze payments without notice.',
    legalImpact: 'Guarantees regular cashflow without administrative withholdings.',
    authorOriginal: 'Client Accounting Annex',
    authorRevised: 'Contractor Redline'
  },
  {
    id: 'diff-8',
    clauseTitle: 'Cure Period for Alleged Breach',
    section: 'Section 8.3',
    changeType: 'added',
    severity: 'medium',
    originalText: '⊖ [Immediate breach termination without cure opportunity]',
    revisedText: '⊕ “In event of alleged default, non-breaching party must provide written notice with 15 business days to cure.”',
    explanation: 'Added mandatory 15-day cure window prior to declaring contract breach.',
    legalImpact: 'Prevents snap terminations over fixable technical bugs.',
    authorOriginal: 'Original Draft',
    authorRevised: 'Added Protection'
  },
  {
    id: 'diff-9',
    clauseTitle: 'Non-Solicitation Sunset Window',
    section: 'Section 10.2',
    changeType: 'modified',
    severity: 'low',
    originalText: '⊖ “Non-solicitation of employees remains in force for eighteen (18) months.”',
    revisedText: '⊕ “Non-solicitation narrowed to six (6) months for directly collaborative personnel.”',
    explanation: 'Reduced non-solicitation term to 6 months.',
    legalImpact: 'Standardized timeline matching common industry norms.',
    authorOriginal: 'Client HR Annex',
    authorRevised: 'Contractor Revision'
  },
  {
    id: 'diff-10',
    clauseTitle: 'Dispute Arbitration Safe-Harbor',
    section: 'Section 14.2',
    changeType: 'added',
    severity: 'low',
    originalText: '⊖ [Litigation required in New Castle County, Delaware courts]',
    revisedText: '⊕ “Parties agree to resolve disputes under $50,000 via expedited online AAA arbitration.”',
    explanation: 'Added digital arbitration clause to prevent out-of-state travel for disputes.',
    legalImpact: 'Significantly cuts legal costs in event of payment disputes.',
    authorOriginal: 'Original Jurisdiction Section',
    authorRevised: 'Alternative Dispute Mechanism'
  },
  {
    id: 'diff-11',
    clauseTitle: 'Deliverables Warranty Window',
    section: 'Section 13.2',
    changeType: 'conflict',
    severity: 'low',
    originalText: '⊖ “All representations and code warranties survive indefinitely.”',
    revisedText: '⊕ “Warranty period limited to ninety (90) days following final deployment acceptance.”',
    explanation: 'Capped open-ended lifetime warranty to 90 days.',
    legalImpact: 'Terminates ongoing unpaid maintenance exposure.',
    authorOriginal: 'Client Technical Addendum',
    authorRevised: 'Contractor Warranty Clause'
  },
  {
    id: 'diff-12',
    clauseTitle: 'Force Majeure & Delay Protection',
    section: 'Section 15.1',
    changeType: 'added',
    severity: 'low',
    originalText: '⊖ [No force majeure protection included for Contractor]',
    revisedText: '⊕ “Neither party liable for milestone delays caused by utility outages, acts of God, or vendor downtime.”',
    explanation: 'Added standard reciprocal force majeure protection.',
    legalImpact: 'Shields contractor from breach claims during unexpected external outages.',
    authorOriginal: 'Original Draft',
    authorRevised: 'Standard Commercial Ingestion'
  }
];

export const SAMPLE_DOCUMENTS: ContractDocument[] = [
  PRIMARY_CONTRACT,
  {
    id: 'doc-nda-cybersec',
    name: 'Mutual Non-Disclosure Agreement - CyberSec.pdf',
    fileType: 'pdf',
    fileSize: '480 KB',
    uploadedAt: 'Oct 20, 2026',
    lastAnalyzedAt: 'Oct 20, 2026',
    status: 'completed',
    pageCount: 3,
    summary: 'Standard bilateral non-disclosure agreement with well-balanced confidentiality terms and reasonable 2-year sunset provision. Minor ambiguity in definition of proprietary source code.',
    riskCounts: { high: 0, medium: 1, low: 3, info: 2 },
    clauses: []
  },
  {
    id: 'doc-sow-frontend',
    name: 'Software Development SOW v2.docx',
    fileType: 'docx',
    fileSize: '890 KB',
    uploadedAt: 'Oct 19, 2026',
    lastAnalyzedAt: 'Oct 19, 2026',
    status: 'completed',
    pageCount: 4,
    summary: 'Statement of Work for web application design and implementation. Contains strict milestone deadlines without automatic scope adjustment for client review delays.',
    riskCounts: { high: 1, medium: 2, low: 1, info: 1 },
    clauses: []
  },
  {
    id: 'doc-creator-partnership',
    name: 'Creator Brand Partnership Agreement.pdf',
    fileType: 'pdf',
    fileSize: '1.1 MB',
    uploadedAt: 'Oct 16, 2026',
    lastAnalyzedAt: 'Oct 16, 2026',
    status: 'completed',
    pageCount: 6,
    summary: 'Brand sponsorship contract for digital content creator. Contains perpetual digital likeness licensing and unrestricted paid-media amplification rights without ongoing royalty.',
    riskCounts: { high: 2, medium: 2, low: 0, info: 1 },
    clauses: []
  },
  {
    id: 'doc-retainer-advisory',
    name: 'Strategic Advisory Retainer 2026.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadedAt: 'Oct 14, 2026',
    lastAnalyzedAt: 'Oct 14, 2026',
    status: 'completed',
    pageCount: 5,
    summary: 'Executive advisory agreement covering quarterly strategic reviews. Uncapped travel expense pre-approval requirements and 60-day delayed retainer billing cycle.',
    riskCounts: { high: 0, medium: 2, low: 2, info: 0 },
    clauses: []
  },
  {
    id: 'doc-subcontractor-apex',
    name: 'Subcontractor Master Agreement - Apex.docx',
    fileType: 'docx',
    fileSize: '740 KB',
    uploadedAt: 'Oct 11, 2026',
    lastAnalyzedAt: 'Oct 11, 2026',
    status: 'completed',
    pageCount: 7,
    summary: 'Subcontractor agreement passing through enterprise prime-contract liabilities without insurance indemnification backstop.',
    riskCounts: { high: 3, medium: 1, low: 1, info: 1 },
    clauses: []
  },
  {
    id: 'doc-ip-assignment',
    name: 'Bespoke IP License & Assignment.pdf',
    fileType: 'pdf',
    fileSize: '620 KB',
    uploadedAt: 'Oct 08, 2026',
    lastAnalyzedAt: 'Oct 08, 2026',
    status: 'completed',
    pageCount: 4,
    summary: 'Standalone intellectual property assignment for custom software module. Well drafted with clean open-source exception schedule.',
    riskCounts: { high: 0, medium: 0, low: 4, info: 1 },
    clauses: []
  },
  {
    id: 'doc-saas-terms',
    name: 'Vendor Cloud Services Agreement.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploadedAt: 'Oct 04, 2026',
    lastAnalyzedAt: 'Oct 04, 2026',
    status: 'completed',
    pageCount: 11,
    summary: 'Enterprise SaaS procurement agreement with data processing addendum. Includes auto-renewal price escalations capped at 8% per year.',
    riskCounts: { high: 1, medium: 3, low: 2, info: 2 },
    clauses: []
  }
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'tpl-msa-freelance',
    title: 'Standard Freelance Master Services Agreement (MSA)',
    category: 'Consulting & Engineering',
    description: 'Bilateral commercial terms with capped liability, Net 30 payment schedule, and protected background IP.',
    fileSize: '180 KB',
    estimatedPages: 6,
    standardClauses: ['Net 30 Payment', 'Bilateral Indemnity', 'IP Carve-Out', '30-Day Notice']
  },
  {
    id: 'tpl-mutual-nda',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Confidentiality',
    description: 'Clean bilateral confidentiality agreement with 2-year sunset and residual knowledge protections.',
    fileSize: '95 KB',
    estimatedPages: 3,
    standardClauses: ['Residual Knowledge', '2-Year Sunset', 'Mutual Protection', 'Safe Disclosure']
  },
  {
    id: 'tpl-dev-sow',
    title: 'Software Development Statement of Work (SOW)',
    category: 'Development',
    description: 'Milestone-based project schedule with automatic timeline extension for client acceptance delays.',
    fileSize: '140 KB',
    estimatedPages: 4,
    standardClauses: ['Milestone Sign-off', 'Change Order Protocol', 'Acceptance Windows', 'Warranty Limit']
  },
  {
    id: 'tpl-consulting-retainer',
    title: 'Independent Advisor Monthly Retainer',
    category: 'Advisory',
    description: 'Fixed-fee recurring advisory agreement with upfront monthly disbursements and rollovers.',
    fileSize: '110 KB',
    estimatedPages: 4,
    standardClauses: ['Upfront Billing', 'No Non-Compete', 'Independent Status', 'Scope Boundaries']
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Kunal',
  email: 'kunal@axiom.legal',
  role: 'Freelancer / Independent Consultant',
  organization: 'Kunal Freelance',
  riskSensitivity: 'standard',
  explanationStyle: 'plain_english',
  autoGenerateRedlines: true,
  documentRetentionDays: 30,
  emailNotifications: true,
  highRiskAlerts: true,
};
