import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  X, 
  MessageSquarePlus, 
  BarChart2, 
  RefreshCw,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import { PRIMARY_CONTRACT } from '../data/sampleContracts';
import { ClauseFinding, ContractDocument, RiskSeverity } from '../types/contract';
import { contractService } from '../services/contractService';

interface AnalysisResultsPageProps {
  docId?: string;
  onNavigate: (route: string, docId?: string) => void;
}

export const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({ docId, onNavigate }) => {
  const [document, setDocument] = useState<ContractDocument>(PRIMARY_CONTRACT);
  const [selectedClauseId, setSelectedClauseId] = useState<string>('clause-1');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRevision, setCopiedRevision] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [currentPage, setCurrentPage] = useState(4);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRedlineModalOpen, setIsRedlineModalOpen] = useState(false);
  const [redlineComment, setRedlineComment] = useState('');
  const [copiedRedline, setCopiedRedline] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'Overview' | 'Document' | 'Clause Analysis' | 'Recommendations' | 'Comparison'>('Document');

  useEffect(() => {
    if (docId) {
      contractService.getDocumentById(docId).then((doc) => {
        if (doc) setDocument(doc);
      });
    }
  }, [docId]);

  const selectedClause = document.clauses.find((c) => c.id === selectedClauseId) || document.clauses[0];

  const filteredClauses = document.clauses.filter((clause) => {
    const matchesSeverity = !filterSeverity || clause.severity === filterSeverity;
    const matchesSearch = !searchQuery || 
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      clause.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleCopyRevision = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRevision(true);
    setTimeout(() => setCopiedRevision(false), 2200);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleBookmarkToggle = () => {
    if (selectedClause) {
      const state = contractService.toggleClauseBookmark(document.id, selectedClause.id);
      setIsBookmarked(state);
    }
  };

  const handleOpenRedline = () => {
    setRedlineComment(
      `[Redline Request - ${selectedClause?.section || 'Clause'}]: ` +
      `We request revising this provision to standard bilateral commercial terms:\n\n` +
      `"${selectedClause?.suggestedRevision}"\n\n` +
      `Rationale: ${selectedClause?.explanation}`
    );
    setIsRedlineModalOpen(true);
  };

  const handleCopyRedline = () => {
    navigator.clipboard.writeText(redlineComment);
    setCopiedRedline(true);
    setTimeout(() => setCopiedRedline(false), 2000);
  };

  return (
    <div className="w-full px-6 sm:px-10 py-6 max-w-[1520px] mx-auto space-y-6 pb-16">
      {/* 1. Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6E0D6]/80">
        {/* Breadcrumb & Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-8 h-8 rounded-lg bg-[#FFFDFA] flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors shadow-sm shrink-0 border border-[#E6E0D6]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <span className="font-medium text-[#1D1B18] truncate text-sm">
              {document.name}
            </span>
            <span className="text-[#979087]">•</span>
            <span className="px-2 py-0.5 rounded bg-[#F0ECE4] text-[#716B63] font-medium font-mono text-[11px]">
              v2.4
            </span>
            <span className="text-[#979087]">•</span>
            <span className="text-[#716B63]">Analyzed 14m ago</span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#F0ECE4]/80 p-1 rounded-xl shadow-sm text-xs">
          {(['Overview', 'Document', 'Clause Analysis', 'Recommendations', 'Comparison'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveViewTab(tab);
                if (tab === 'Comparison') onNavigate('compare');
                if (tab === 'Recommendations') onNavigate('report');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeViewTab === tab
                  ? 'bg-[#FFFDFA] text-[#1D1B18] shadow-[0_1px_4px_rgba(29,27,24,0.06)]'
                  : 'text-[#716B63] hover:text-[#1D1B18]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFFDFA] hover:bg-[#F0ECE4] text-[#1D1B18] border border-[#E6E0D6] shadow-sm transition-all text-xs font-medium"
            type="button"
          >
            {copiedShareLink ? <Check className="w-4 h-4 text-[#286344]" /> : <Share2 className="w-4 h-4 text-[#716B63]" />}
            <span>{copiedShareLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => onNavigate('report', document.id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] shadow-sm transition-colors text-xs font-medium"
            type="button"
          >
            <Download className="w-4 h-4" />
            <span>Download report</span>
          </button>
        </div>
      </div>

      {/* 2. Flagship 3-Column Workspace */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* ==================== COLUMN 1: Risk Summary & Navigation (3 cols) ==================== */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">
          {/* Risk Pill Navigation Section */}
          <div className="bg-[#FFFDFA] rounded-2xl p-5 border border-[#E6E0D6] shadow-[0_2px_12px_-4px_rgba(29,27,24,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1D1B18]">Risk summary</span>
              <span className="text-xs text-[#716B63] px-2 py-0.5 rounded-full bg-[#F0ECE4] font-medium">
                {document.clauses.length} total
              </span>
            </div>

            {/* Filter Pill Chips */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setFilterSeverity(filterSeverity === 'high' ? null : 'high')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                  filterSeverity === 'high'
                    ? 'bg-[#FCE4DF] border-[#F7C6BE] ring-1 ring-[#A83224]'
                    : 'bg-[#FCE4DF]/70 hover:bg-[#FCE4DF] border-[#F7C6BE]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A83224]"></span>
                  <span className="text-xs font-medium text-[#A83224]">
                    {document.riskCounts.high} High risk clauses
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A83224]" />
              </button>

              <button
                type="button"
                onClick={() => setFilterSeverity(filterSeverity === 'medium' ? null : 'medium')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                  filterSeverity === 'medium'
                    ? 'bg-[#FFF0D8] border-[#F5DEC2] ring-1 ring-[#92530C]'
                    : 'bg-[#FFF0D8]/70 hover:bg-[#FFF0D8] border-[#F5DEC2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#92530C]"></span>
                  <span className="text-xs font-medium text-[#92530C]">
                    {document.riskCounts.medium} Medium risk clauses
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#92530C]" />
              </button>

              <button
                type="button"
                onClick={() => setFilterSeverity(filterSeverity === 'low' ? null : 'low')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                  filterSeverity === 'low'
                    ? 'bg-[#E1EFE4] border-[#C6DFC9] ring-1 ring-[#286344]'
                    : 'bg-[#E1EFE4]/70 hover:bg-[#E1EFE4] border-[#C6DFC9]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#286344]"></span>
                  <span className="text-xs font-medium text-[#286344]">
                    {document.riskCounts.low} Low risk clauses
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#286344]" />
              </button>
            </div>
          </div>

          {/* Clause Navigation List */}
          <div className="bg-[#FFFDFA] rounded-2xl p-5 border border-[#E6E0D6] shadow-[0_2px_12px_-4px_rgba(29,27,24,0.04)] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-[#979087] uppercase tracking-wider font-semibold">
                Flagged Clauses ({filteredClauses.length})
              </span>
              {filterSeverity && (
                <button
                  onClick={() => setFilterSeverity(null)}
                  className="text-[11px] text-[#716B63] hover:text-[#1D1B18] underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredClauses.map((clause, idx) => {
                const isSelected = clause.id === selectedClauseId;
                const severityColor = 
                  clause.severity === 'high' ? 'bg-[#A83224]' : 
                  clause.severity === 'medium' ? 'bg-[#92530C]' : 'bg-[#286344]';
                const badgeStyle =
                  clause.severity === 'high' ? 'bg-[#FCE4DF] text-[#A83224] border-[#F7C6BE]' :
                  clause.severity === 'medium' ? 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]' :
                  'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]';

                return (
                  <div
                    key={clause.id}
                    onClick={() => {
                      setSelectedClauseId(clause.id);
                      setCurrentPage(clause.pageNumber);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0ECE4] border-[#E6E0D6] shadow-sm'
                        : 'border-transparent hover:bg-[#F0ECE4]/50 hover:border-[#E6E0D6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-1.5 h-6 rounded-full shrink-0 ${severityColor}`}></span>
                      <span className="text-xs font-medium text-[#1D1B18] truncate">
                        {idx + 1}. {clause.title}
                      </span>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                      {clause.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fairness Score Assessment Card */}
          <div className="bg-[#FFFDFA] rounded-2xl p-5 border border-[#E6E0D6] shadow-[0_2px_12px_-4px_rgba(29,27,24,0.04)] relative overflow-hidden flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#92530C]" />
                <span className="text-sm font-medium text-[#1D1B18]">Fairness Score</span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#FFF0D8] text-[#92530C] border border-[#F5DEC2]">
                Unbalanced
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl leading-tight font-normal text-[#1D1B18]">64</span>
              <span className="text-xs text-[#979087]">/ 100</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F0ECE4] rounded-full h-2 overflow-hidden flex">
              <div className="bg-[#92530C] h-full rounded-full transition-all duration-500" style={{ width: '64%' }}></div>
            </div>

            <p className="text-xs text-[#716B63] leading-relaxed">
              Significantly leans toward Client interests. Critical provisions restrict freelance protections and shift liability.
            </p>

            <div className="pt-2 flex items-center gap-2 border-t border-[#E6E0D6]/70 text-[#979087] text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#286344]" />
              <span>Calculated against 4,200+ industry standards</span>
            </div>
          </div>
        </div>

        {/* ==================== COLUMN 2: Document Viewer (5 cols) ==================== */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Viewer Controls Top Bar */}
          <div className="bg-[#FFFDFA] rounded-xl px-4 py-2.5 border border-[#E6E0D6] shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#716B63]">
                <Search className="w-3.5 h-3.5 text-[#979087]" />
                <input
                  type="text"
                  placeholder="Find in page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-[#1D1B18] placeholder:text-[#979087] outline-none w-24 sm:w-32"
                />
              </div>

              <div className="h-4 w-px bg-[#E6E0D6]"></div>

              <div className="flex items-center gap-1.5 text-[#716B63]">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F0ECE4] text-[#716B63]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-[#1D1B18]">Page {currentPage}</span> of 8
                <button
                  onClick={() => setCurrentPage(Math.min(8, currentPage + 1))}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F0ECE4] text-[#716B63]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Zoom & Tools */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F0ECE4] rounded-lg px-2 py-1 text-[#716B63] text-xs">
                <button
                  onClick={() => setZoomPercent(Math.max(70, zoomPercent - 10))}
                  className="hover:text-[#1D1B18] px-1 font-mono"
                >
                  -
                </button>
                <span className="px-1.5 font-medium text-[#1D1B18] font-mono">{zoomPercent}%</span>
                <button
                  onClick={() => setZoomPercent(Math.min(150, zoomPercent + 10))}
                  className="hover:text-[#1D1B18] px-1 font-mono"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => setZoomPercent(100)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                title="Fit to width"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setZoomPercent(100);
                  setSearchQuery('');
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                title="Reset viewer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Paper Sheet Surface */}
          <div 
            className="bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6E0D6] shadow-[0_4px_24px_-6px_rgba(29,27,24,0.06)] relative min-h-[720px] flex flex-col justify-between transition-all"
            style={{ transform: `scale(${zoomPercent / 100})`, transformOrigin: 'top center' }}
          >
            <div className="flex flex-col gap-6">
              {/* Document Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6]/80 text-[#979087] text-[11px] tracking-widest uppercase font-semibold">
                <span>MASTER SERVICES AGREEMENT</span>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#F0ECE4] text-[#716B63] font-medium">
                    CONFIDENTIAL
                  </span>
                  <span>•</span>
                  <span>Page {currentPage}/8</span>
                </div>
              </div>

              {/* Section 5: Termination and Notice */}
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-xl text-[#1D1B18] font-normal">
                  5. Termination and Notice
                </h3>
                <p className="text-xs text-[#716B63] leading-relaxed">
                  5.1 This Agreement will commence on the Effective Date and will continue until the Services are completed in accordance with the Statement of Work, unless earlier terminated as permitted under this Section 5.
                </p>

                {/* Highlighted Callout Box (CLAUSE 5.2 • HIGH RISK) */}
                <div className={`my-2 p-4 rounded-xl border-l-4 transition-all shadow-sm flex flex-col gap-2 relative ${
                  selectedClause?.id === 'clause-1'
                    ? 'bg-[#FCE4DF]/70 border-[#A83224] ring-2 ring-[#A83224]/30'
                    : 'bg-[#FCE4DF]/40 border-[#A83224]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A83224] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A83224] animate-pulse"></span>
                      CLAUSE 5.2 • HIGH RISK
                    </span>
                    <span className="text-xs font-semibold text-[#A83224] uppercase">Flagged</span>
                  </div>
                  <blockquote className="font-serif italic text-sm text-[#1D1B18] font-normal pl-2 border-l-2 border-[#F7C6BE]">
                    “The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.”
                  </blockquote>
                </div>

                <p className="text-xs text-[#716B63] leading-relaxed">
                  5.3 Upon any early cessation under Section 5.1, Contractor shall promptly cease all performance and deliver to Client all partially completed Work Product and documentation up to the effective notice timestamp.
                </p>
              </div>

              {/* Section 6: IP Ownership (Dimmed Contextual Clauses) */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#E6E0D6]/60">
                <h3 className="font-serif text-xl text-[#1D1B18] font-normal">
                  6. Intellectual Property & Deliverables
                </h3>
                <p className="text-xs text-[#716B63] leading-relaxed">
                  6.1 <strong className="text-[#1D1B18] font-medium">Work for Hire.</strong> Freelancer agrees that all deliverables, inventions, discoveries, and copyrightable works created solely or jointly during performance shall be considered a "work made for hire" for the sole benefit of Client.
                </p>
                <div className={`p-3 rounded-lg border transition-all ${
                  selectedClause?.id === 'clause-2' 
                    ? 'bg-[#FCE4DF]/70 border-[#A83224] ring-2 ring-[#A83224]/30' 
                    : 'bg-[#F0ECE4]/30 border-transparent'
                }`}>
                  <p className="text-xs text-[#716B63] leading-relaxed">
                    6.2 <strong className="text-[#1D1B18] font-medium">Assignment of Rights.</strong> In the event any materials do not qualify as work made for hire, Freelancer irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe.
                  </p>
                </div>
              </div>
            </div>

            {/* Paper Page Footer Watermark */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E6E0D6]/60 text-[#979087] text-[11px] mt-8">
              <span>Executed DocuSign Envelope ID: 884B-9021-CF81</span>
              <span>Axiom Contract Intelligence Verified • 2026</span>
            </div>
          </div>
        </div>

        {/* ==================== COLUMN 3: Explanation, Impact & Revisions (4 cols) ==================== */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#FFFDFA] rounded-2xl p-6 border border-[#E6E0D6] shadow-[0_4px_20px_-6px_rgba(29,27,24,0.05)] flex flex-col gap-5">
            {/* Header & Bookmark */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                selectedClause.severity === 'high'
                  ? 'bg-[#FCE4DF] text-[#A83224] border-[#F7C6BE]'
                  : selectedClause.severity === 'medium'
                  ? 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]'
                  : 'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedClause.severity === 'high' ? 'bg-[#A83224]' :
                  selectedClause.severity === 'medium' ? 'bg-[#92530C]' : 'bg-[#286344]'
                }`}></span>
                {selectedClause.severity.toUpperCase()} RISK CLAUSE
              </span>

              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isBookmarked
                    ? 'bg-[#1C1B19] text-white'
                    : 'text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4]'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark clause'}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Location */}
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl text-[#1D1B18] font-normal leading-tight">
                {selectedClause.title}
              </h2>
              <span className="text-xs text-[#716B63]">
                Found in {selectedClause.section} on Page {selectedClause.pageNumber}
              </span>
            </div>

            {/* Original Clause Quote Box */}
            <div className="bg-[#F0ECE4]/70 rounded-xl p-4 border-l-2 border-[#979087] flex flex-col gap-1.5">
              <span className="text-[10px] text-[#979087] uppercase tracking-wider font-semibold">
                Original clause
              </span>
              <p className="text-xs italic text-[#1D1B18] leading-relaxed">
                "{selectedClause.originalText}"
              </p>
            </div>

            {/* Plain English Explanation */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#1D1B18]">
                Plain English explanation
              </span>
              <p className="text-xs text-[#716B63] leading-relaxed">
                {selectedClause.explanation}
              </p>
            </div>

            {/* Why this is a risk */}
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-medium text-[#1D1B18]">
                Why this is a risk
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#716B63]">
                {selectedClause.whyRisky.split('. ').filter(Boolean).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FCE4DF] text-[#A83224] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                      ✕
                    </span>
                    <span className="leading-snug">{point.replace(/\.$/, '')}.</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Revision Box */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1D1B18]">
                  Suggested revision
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9] text-[10px] font-medium">
                  Fair Standard
                </span>
              </div>
              <div className="bg-[#E1EFE4]/40 border border-[#C6DFC9] rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs text-[#1D1B18] leading-relaxed font-medium">
                  "{selectedClause.suggestedRevision}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleCopyRevision(selectedClause.suggestedRevision)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1B19] text-white hover:bg-[#34312C] transition-colors text-xs font-medium shadow-sm active:scale-98"
              >
                {copiedRevision ? <Check className="w-4 h-4 text-[#E1EFE4]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRevision ? 'Copied to clipboard!' : 'Copy suggested revision'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenRedline}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FFFDFA] hover:bg-[#F0ECE4] text-[#1D1B18] border border-[#E6E0D6] transition-colors text-xs font-medium"
              >
                <MessageSquarePlus className="w-4 h-4 text-[#716B63]" />
                <span>Insert Redline Comment</span>
              </button>
            </div>

            {/* Negotiation Benchmark Card */}
            <div className="rounded-xl p-4 bg-[#F0ECE4]/60 border border-[#E6E0D6] flex items-start gap-3 mt-1">
              <BarChart2 className="w-5 h-5 text-[#716B63] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[#1D1B18]">
                  Axiom Negotiation Benchmark
                </span>
                <p className="text-[11px] text-[#716B63] leading-normal">
                  92% of enterprise clients accept a 14 to 30-day notice period when requested during the initial draft phase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redline Comment Dialog Modal */}
      {isRedlineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D6]">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-[#1C1B19]" />
                <h3 className="font-serif text-lg text-[#1D1B18]">Redline Counter-Proposal Note</h3>
              </div>
              <button
                onClick={() => setIsRedlineModalOpen(false)}
                className="p-1 rounded-lg text-[#979087] hover:text-[#1D1B18] hover:bg-[#F0ECE4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#716B63]">
              Copy this pre-formatted redline note to paste directly into your client's email thread, Slack discussion, or DocuSign comment box.
            </p>

            <textarea
              rows={6}
              value={redlineComment}
              onChange={(e) => setRedlineComment(e.target.value)}
              className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl p-3 text-xs text-[#1D1B18] font-sans focus:outline-none focus:border-[#1C1B19]"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsRedlineModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#E6E0D6] bg-white text-[#1D1B18] hover:bg-[#F0ECE4] text-xs font-medium"
              >
                Close
              </button>

              <button
                onClick={handleCopyRedline}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] text-xs font-medium shadow-sm"
              >
                {copiedRedline ? <Check className="w-4 h-4 text-[#E1EFE4]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRedline ? 'Copied Note!' : 'Copy Redline Note'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
