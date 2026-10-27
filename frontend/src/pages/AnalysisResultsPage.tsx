import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Search,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/RiskBadge';
import { ClauseFinding, ContractDocument } from '../types/contract';
import { contractService } from '../services/contractService';

interface AnalysisResultsPageProps {
  docId?: string;
  onNavigate: (route: string, docId?: string) => void;
}

export const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({ docId, onNavigate }) => {
  const [document, setDocument] = useState<ContractDocument | null>(null);
  const [loadedDocId, setLoadedDocId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedClauseId, setSelectedClauseId] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRevision, setCopiedRevision] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileTab, setMobileTab] = useState<'clauses' | 'viewer' | 'details'>('clauses');

  const isLoading = loadedDocId === null && !loadError;

  useEffect(() => {
    let active = true;

    const resolveAndLoad = async () => {
      let resolvedId = docId;
      if (!resolvedId) {
        const docs = await contractService.getDocuments();
        if (docs.length > 0) {
          resolvedId = docs[0].id;
        } else if (contractService.isMock) {
          resolvedId = contractService.getDefaultDocument().id;
        }
      }

      if (!resolvedId) {
        if (active) {
          setLoadError('No contracts found in your workspace. Please upload or select a contract from your documents.');
          setLoadedDocId('none');
        }
        return;
      }

      try {
        const doc = await contractService.getDocumentById(resolvedId);
        if (!active) return;
        if (doc) {
          setDocument(doc);
          if (doc.clauses && doc.clauses.length > 0) {
            setSelectedClauseId(doc.clauses[0].id);
            setCurrentPage(doc.clauses[0].pageNumber || 1);
          }
        } else if (contractService.isMock) {
          const defaultDoc = contractService.getDefaultDocument();
          setDocument(defaultDoc);
          if (defaultDoc.clauses && defaultDoc.clauses.length > 0) {
            setSelectedClauseId(defaultDoc.clauses[0].id);
            setCurrentPage(defaultDoc.clauses[0].pageNumber || 1);
          }
        } else {
          setLoadError(`Document "${resolvedId}" was not found or could not be loaded from backend.`);
        }
        setLoadedDocId(resolvedId);
      } catch (err) {
        if (!active) return;
        setLoadError(`Failed to load document: ${err instanceof Error ? err.message : String(err)}`);
        setLoadedDocId(resolvedId);
      }
    };

    resolveAndLoad();

    return () => {
      active = false;
    };
  }, [docId]);

  if (isLoading) {
    return (
      <div className="w-full px-6 sm:px-10 py-16 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#1C1B19] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[#716B63]">Loading analysis workspace for {docId || 'contract'}...</p>
      </div>
    );
  }

  if (loadError || !document) {
    return (
      <div className="w-full px-6 sm:px-10 py-12 max-w-6xl mx-auto space-y-6">
        <div className="bg-[#FCE4DF] border border-[#F7C6BE] rounded-xl p-6 text-[#A83224] flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <span>Contract Workspace Not Available</span>
          </div>
          <p className="text-sm text-[#782419]">
            {loadError || 'The requested contract analysis could not be found or has not been completed.'}
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onNavigate('analyze')}
              className="px-4 py-2 bg-[#1C1B19] text-white rounded-lg text-xs font-medium hover:bg-[#34312C] transition-colors"
            >
              Upload New Contract
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-[#FFFDFA] text-[#1D1B18] border border-[#E6E0D6] rounded-lg text-xs font-medium hover:bg-[#F0ECE4] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedClause = document.clauses.find((c) => c.id === selectedClauseId) || document.clauses[0];

  const filteredClauses = document.clauses.filter((clause) => {
    const matchesSeverity = filterSeverity === 'all' || clause.severity === filterSeverity;
    const matchesSearch = clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRevision(true);
    setTimeout(() => setCopiedRevision(false), 2000);
  };

  const handleSelectClause = (clause: ClauseFinding) => {
    setSelectedClauseId(clause.id);
    setCurrentPage(clause.pageNumber);
    setMobileTab('details');
  };

  const navigateNextFinding = () => {
    if (!document || !document.clauses || document.clauses.length === 0) return;
    const currentIndex = document.clauses.findIndex((c) => c.id === selectedClauseId);
    if (currentIndex < document.clauses.length - 1) {
      const nextClause = document.clauses[currentIndex + 1];
      setSelectedClauseId(nextClause.id);
      setCurrentPage(nextClause.pageNumber);
    } else {
      const firstClause = document.clauses[0];
      setSelectedClauseId(firstClause.id);
      setCurrentPage(firstClause.pageNumber);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#F7F4EE] overflow-hidden">
      {/* 1. Top Sub-header Toolbar */}
      <div className="h-14 px-6 border-b border-[#E6E0D6] bg-[#FFFDFA] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#1C1B19] text-white flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-[#1D1B18] truncate">{document.name}</span>
            <span className="text-[11px] text-[#979087] hidden sm:inline">• {document.pageCount} Pages</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              document.provider === 'mock' || document.id.startsWith('doc-demo-')
                ? 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]'
                : document.provider === 'rule_benchmark'
                ? 'bg-[#F0ECE4] text-[#716B63] border-[#E6E0D6]'
                : 'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]'
            }`}>
              {document.provider === 'mock' || document.id.startsWith('doc-demo-')
                ? 'Demo Simulation'
                : document.provider === 'rule_benchmark'
                ? 'Deterministic Fallback (Rule Benchmark)'
                : `Live AI: ${document.modelName || 'Groq'}`}
            </span>
          </div>
        </div>

        {/* Severity Summary Pills */}
        <div className="hidden md:flex items-center gap-2">
          <RiskBadge severity="high" count={document.riskCounts.high} size="sm" />
          <RiskBadge severity="medium" count={document.riskCounts.medium} size="sm" />
          <RiskBadge severity="low" count={document.riskCounts.low} size="sm" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('report', document.id)}
          >
            Full Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('compare', document.id)}
          >
            Compare Drafts
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-[#E6E0D6] bg-[#FFFDFA] text-xs font-medium">
        <button
          onClick={() => setMobileTab('clauses')}
          className={`flex-1 py-2.5 text-center border-b-2 ${mobileTab === 'clauses' ? 'border-[#1C1B19] text-[#1D1B18]' : 'border-transparent text-[#716B63]'
            }`}
        >
          Clauses ({document.clauses.length})
        </button>
        <button
          onClick={() => setMobileTab('viewer')}
          className={`flex-1 py-2.5 text-center border-b-2 ${mobileTab === 'viewer' ? 'border-[#1C1B19] text-[#1D1B18]' : 'border-transparent text-[#716B63]'
            }`}
        >
          Document Page {currentPage}
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2.5 text-center border-b-2 ${mobileTab === 'details' ? 'border-[#1C1B19] text-[#1D1B18]' : 'border-transparent text-[#716B63]'
            }`}
        >
          Risk Breakdown
        </button>
      </div>

      {/* 2. Three-Column Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Clause Findings & Severity Filters */}
        <aside
          className={`w-full lg:w-80 xl:w-96 border-r border-[#E6E0D6] bg-[#FFFDFA] flex flex-col shrink-0 ${mobileTab === 'clauses' ? 'flex' : 'hidden lg:flex'
            }`}
        >
          {/* Filter Bar */}
          <div className="p-4 border-b border-[#E6E0D6] space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#979087]" />
              <input
                type="text"
                placeholder="Search flagged clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1D1B18] placeholder-[#979087] focus:outline-none focus:border-[#1C1B19]"
              />
            </div>

            {/* Severity Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {[
                { id: 'all', label: `All (${document.clauses.length})` },
                { id: 'high', label: `High (${document.riskCounts.high})` },
                { id: 'medium', label: `Med (${document.riskCounts.medium})` },
                { id: 'low', label: `Low (${document.riskCounts.low})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterSeverity(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${filterSeverity === tab.id
                      ? 'bg-[#1C1B19] text-white shadow-sm'
                      : 'bg-[#F0ECE4] text-[#716B63] hover:text-[#1D1B18]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clause Findings List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E6E0D6]/70 p-3 space-y-2">
            {filteredClauses.map((clause) => {
              const isSelected = clause.id === selectedClauseId;
              return (
                <div
                  key={clause.id}
                  onClick={() => handleSelectClause(clause)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? 'bg-[#F0ECE4]/70 border-[#1C1B19] shadow-sm'
                      : 'bg-[#FFFDFA] border-[#E6E0D6] hover:border-[#716B63] hover:bg-[#F7F4EE]'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <RiskBadge severity={clause.severity} size="sm" />
                    <span className="text-[11px] font-mono text-[#979087]">{clause.section}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#1D1B18] line-clamp-1 mb-1">
                    {clause.title}
                  </h4>

                  <p className="text-[11px] text-[#716B63] line-clamp-2 leading-relaxed">
                    {clause.explanation}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#E6E0D6]/60 flex items-center justify-between text-[10px] text-[#979087]">
                    <span>Page {clause.pageNumber}</span>
                    <span className="text-[#1D1B18] font-medium group-hover:underline">View in document →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER PANEL: Document Paper Sheet Viewer */}
        <main
          className={`flex-1 bg-[#F0ECE4] flex flex-col min-w-0 overflow-hidden ${mobileTab === 'viewer' ? 'flex' : 'hidden lg:flex'
            }`}
        >
          {/* Document Viewer Header Bar */}
          <div className="h-11 px-4 bg-[#FFFDFA] border-b border-[#E6E0D6] flex items-center justify-between text-xs text-[#716B63]">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-[#F0ECE4] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-[#1D1B18]">Page {currentPage} of {document.pageCount}</span>
              <button
                onClick={() => setCurrentPage(Math.min(document.pageCount, currentPage + 1))}
                disabled={currentPage >= document.pageCount}
                className="p-1 rounded hover:bg-[#F0ECE4] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Document Title Stamp */}
            <div className="hidden sm:block text-xs font-serif text-[#1D1B18] truncate max-w-sm">
              {document.name}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
                className="p-1 rounded hover:bg-[#F0ECE4]"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                className="p-1 rounded hover:bg-[#F0ECE4]"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Sheet Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div
              className="w-full max-w-2xl bg-[#FFFDFA] border border-[#E6E0D6] rounded-xl p-8 sm:p-12 shadow-whisper text-xs sm:text-sm font-serif leading-relaxed text-[#1D1B18] space-y-6 select-text transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Document Header Plate */}
              <div className="text-center pb-6 border-b border-[#E6E0D6]/80 font-sans space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-[#979087]">Axiom Contract Intelligence Viewer</div>
                <div className="text-base font-semibold text-[#1D1B18]">{document.name}</div>
                <div className="text-[11px] text-[#716B63]">Document ID: {document.id}</div>
              </div>

              {/* Dynamic Page Content from document clauses */}
              {(() => {
                const pageClauses = document.clauses.filter((c) => c.pageNumber === currentPage);
                if (pageClauses.length > 0) {
                  return (
                    <div className="space-y-6">
                      <div className="font-sans font-semibold text-xs text-[#1D1B18] uppercase tracking-wider">
                        FLAGGED CLAUSES ON PAGE {currentPage} ({pageClauses.length})
                      </div>
                      {pageClauses.map((clause) => {
                        const isSelected = selectedClauseId === clause.id;
                        return (
                          <div
                            key={clause.id}
                            onClick={() => {
                              setSelectedClauseId(clause.id);
                              setMobileTab('details');
                            }}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? clause.severity === 'high'
                                  ? 'bg-[#FCE4DF] border-[#F7C6BE] ring-2 ring-[#A83224]'
                                  : clause.severity === 'medium'
                                  ? 'bg-[#FFF0D8] border-[#F5DEC2] ring-2 ring-[#92530C]'
                                  : 'bg-[#E1EFE4] border-[#C6DFC9] ring-2 ring-[#286344]'
                                : clause.severity === 'high'
                                ? 'bg-[#FCE4DF]/40 border-[#F7C6BE]/60 hover:bg-[#FCE4DF]/70'
                                : clause.severity === 'medium'
                                ? 'bg-[#FFF0D8]/40 border-[#F5DEC2]/60 hover:bg-[#FFF0D8]/70'
                                : 'bg-[#E1EFE4]/40 border-[#C6DFC9]/60 hover:bg-[#E1EFE4]/70'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-sans font-semibold mb-1">
                              <span className="uppercase">{clause.section} • {clause.title}</span>
                              <span className={
                                clause.severity === 'high' ? 'text-[#A83224]' :
                                clause.severity === 'medium' ? 'text-[#92530C]' : 'text-[#286344]'
                              }>
                                {clause.severity.toUpperCase()} RISK
                              </span>
                            </div>
                            <p className="italic font-medium leading-relaxed">
                              "{clause.originalText}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="space-y-5 py-8 text-center text-[#716B63]">
                    <div className="w-10 h-10 rounded-full bg-[#F0ECE4] text-[#1D1B18] flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-[#716B63]" />
                    </div>
                    <h3 className="font-serif text-lg text-[#1D1B18] font-normal">Page {currentPage}</h3>
                    <p className="text-xs max-w-md mx-auto leading-relaxed">
                      {document.clauses.length > 0
                        ? `No high or medium exposure clauses flagged on page ${currentPage}. Review flagged sections using the clause list on the left.`
                        : "No risk clauses flagged in this contract."}
                    </p>
                    {selectedClause && (
                      <div className="mt-4 p-4 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6] text-left">
                        <div className="text-[10px] font-semibold text-[#979087] uppercase tracking-wider mb-1">
                          Active Selection: {selectedClause.section} (Page {selectedClause.pageNumber})
                        </div>
                        <div className="font-serif italic text-xs text-[#1D1B18] mb-2">
                          "{selectedClause.originalText}"
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setCurrentPage(selectedClause.pageNumber)}>
                          Jump to Page {selectedClause.pageNumber} →
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sheet Footer */}
              <div className="pt-8 border-t border-[#E6E0D6]/70 flex items-center justify-between text-[11px] font-sans text-[#979087]">
                <span>Contract ID: {document.id}</span>
                <span>Page {currentPage} of {document.pageCount}</span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Selected Clause Deep Dive & Counter-Proposal */}
        <aside
          className={`w-full lg:w-96 xl:w-[420px] border-l border-[#E6E0D6] bg-[#FFFDFA] flex flex-col shrink-0 ${mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
            }`}
        >
          {selectedClause ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Header Badge & Title */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <RiskBadge severity={selectedClause.severity} />
                  <span className="text-xs font-mono text-[#979087]">{selectedClause.section}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal leading-snug">
                  {selectedClause.title}
                </h3>
              </div>

              {/* Why Risky Alert Box */}
              <div className="p-4 rounded-xl bg-[#FCE4DF]/70 border border-[#F7C6BE] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#A83224] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Why This May Be Risky
                </span>
                <p className="text-xs text-[#1D1B18] leading-relaxed">
                  {selectedClause.whyRisky}
                </p>
              </div>

              {/* Plain-English Explanation */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">
                  Plain-English Translation
                </span>
                <p className="text-xs text-[#1D1B18] leading-relaxed bg-[#F7F4EE] p-3.5 rounded-xl border border-[#E6E0D6]">
                  {selectedClause.explanation}
                </p>
              </div>

              {/* Original Excerpt Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">
                  Source Contract Text (Page {selectedClause.pageNumber})
                </span>
                <blockquote className="text-xs font-serif italic text-[#716B63] bg-[#F7F4EE] p-3.5 rounded-xl border border-[#E6E0D6] leading-relaxed">
                  "{selectedClause.originalText}"
                </blockquote>
              </div>

              {/* Suggested Revision & Copy Button */}
              <div className="space-y-2 pt-2 border-t border-[#E6E0D6]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#286344] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#286344]" />
                    Recommended Counter-Clause
                  </span>

                  <button
                    onClick={() => handleCopy(selectedClause.suggestedRevision)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#1D1B18] font-medium px-2.5 py-1 rounded-lg bg-[#E1EFE4] hover:bg-[#C6DFC9] border border-[#C6DFC9] transition-colors"
                  >
                    {copiedRevision ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#286344]" />
                        <span className="text-[#286344]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#286344]" />
                        <span>Copy Revision</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFDFA] border border-[#286344]/30 shadow-sm text-xs text-[#1D1B18] font-sans leading-relaxed">
                  {selectedClause.suggestedRevision}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    contractService.markClauseReviewed(document.id, selectedClause.id, true);
                    navigateNextFinding();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] border border-[#E6E0D6] transition-colors"
                >
                  Mark Reviewed
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={navigateNextFinding}
                >
                  Next Finding →
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#716B63]">
              Select a clause from the left list or document viewer to inspect risk analysis.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
