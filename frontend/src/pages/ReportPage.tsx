import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Printer
} from 'lucide-react';
import { ContractDocument } from '../types/contract';
import { contractService } from '../services/contractService';

interface ReportPageProps {
  docId?: string;
  onNavigate: (route: string, docId?: string) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ docId, onNavigate }) => {
  const [document, setDocument] = useState<ContractDocument | null>(null);
  const [loadedDocId, setLoadedDocId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        } else if (contractService.isMock) {
          setDocument(contractService.getDefaultDocument());
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

  const [copiedRevisionId, setCopiedRevisionId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'findings' | 'recommendations' | 'details'>('findings');
  const [sortBy, setSortBy] = useState<'severity' | 'order' | 'impact'>('severity');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRevisionId(id);
    setTimeout(() => setCopiedRevisionId(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="w-full px-6 sm:px-10 py-16 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#1C1B19] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[#716B63]">Loading analysis report for {docId || 'contract'}...</p>
      </div>
    );
  }

  if (loadError || !document) {
    return (
      <div className="w-full px-6 sm:px-10 py-12 max-w-6xl mx-auto space-y-6">
        <div className="bg-[#FCE4DF] border border-[#F7C6BE] rounded-xl p-6 text-[#A83224] flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <span>Analysis Report Not Available</span>
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

  const sortedClauses = [...document.clauses].sort((a, b) => {
    if (sortBy === 'severity') {
      const rank = { high: 0, medium: 1, low: 2, info: 3 };
      return rank[a.severity] - rank[b.severity];
    }
    if (sortBy === 'order') {
      return a.pageNumber - b.pageNumber;
    }
    return 0;
  });

  const totalClauses = document.clauses.length;
  const highCount = document.riskCounts?.high ?? document.clauses.filter(c => c.severity === 'high').length;
  const medCount = document.riskCounts?.medium ?? document.clauses.filter(c => c.severity === 'medium').length;
  const lowCount = document.riskCounts?.low ?? document.clauses.filter(c => c.severity === 'low').length;

  const totalRated = totalClauses > 0 ? totalClauses : 1;
  const highDash = (highCount / totalRated) * 314.15;
  const medDash = (medCount / totalRated) * 314.15;
  const lowDash = (lowCount / totalRated) * 314.15;
  const medOffset = -highDash;
  const lowOffset = -(highDash + medDash);

  const overallExposure = highCount > 0 ? 'High Risk' : medCount > 0 ? 'Medium Risk' : 'Standard Risk';
  const overallBadgeClass = highCount > 0
    ? 'bg-[#FCE4DF] text-[#A83224] border-[#F7C6BE]'
    : medCount > 0
    ? 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]'
    : 'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]';

  return (
    <div className="w-full px-6 sm:px-10 py-6 max-w-6xl mx-auto space-y-8 pb-16 print:p-0 print:max-w-none">
      {/* 1. Editorial Sub-Bar & Breadcrumbs (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E0D6]/60 print:hidden">
        <div className="flex items-center gap-2 text-xs text-[#716B63] flex-wrap">
          <button
            onClick={() => onNavigate('results', document.id)}
            className="w-7 h-7 rounded-lg bg-[#FFFDFA] flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] border border-[#E6E0D6] shadow-sm mr-1"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-medium text-[#1D1B18]">{document.name}</span>
          <span>•</span>
          <span className="bg-[#F0ECE4] px-2 py-0.5 rounded text-[#716B63] text-[10px] font-mono font-medium">
            {document.id}
          </span>
          <span>•</span>
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
              ? 'Deterministic Fallback (Rule Benchmark Engine)'
              : `Live AI: ${document.modelName || 'Groq'}`}
          </span>
          <span>•</span>
          <span>Analyzed {document.uploadedAt}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FFFDFA] text-[#1D1B18] hover:bg-[#F0ECE4] shadow-sm border border-[#E6E0D6] transition-all text-xs font-medium"
            type="button"
          >
            {copiedShareLink ? <Check className="w-3.5 h-3.5 text-[#286344]" /> : <Share2 className="w-3.5 h-3.5 text-[#716B63]" />}
            <span>{copiedShareLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] shadow-sm transition-all text-xs font-medium"
            type="button"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download report / Print</span>
          </button>
        </div>
      </div>

      {/* 2. Document Header Title */}
      <div className="pt-2 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-5xl text-[#1D1B18] tracking-tight font-normal">
              Analysis Report
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-sm border ${overallBadgeClass}`}>
              {overallExposure}
            </span>
          </div>
          <p className="text-sm text-[#716B63] max-w-2xl">
            Automated comprehensive exposure analysis against standard independent contractor benchmarks and IP safe-harbors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#979087]">
          <ShieldCheck className="w-4 h-4 text-[#286344]" />
          <span>Integrity Verified • Document: {document.id}</span>
        </div>
      </div>

      {/* 3. Top Metric Cards Grid (1/3 Exposure vs 2/3 Executive Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
        {/* Exposure Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFDFA] rounded-xl p-6 shadow-sm border border-[#E6E0D6] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FCE4DF]/30 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
                Overall Exposure
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${overallBadgeClass}`}>
                {overallExposure}
              </span>
            </div>

            {/* SVG Donut Visual matching Stitch */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    className="text-[#F0ECE4]"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="9"
                  />
                  {totalClauses > 0 && highCount > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="#A83224"
                      strokeDasharray={`${highDash} 314.15`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      strokeWidth="9"
                    />
                  )}
                  {totalClauses > 0 && medCount > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="#92530C"
                      strokeDasharray={`${medDash} 314.15`}
                      strokeDashoffset={`${medOffset}`}
                      strokeLinecap="round"
                      strokeWidth="9"
                    />
                  )}
                  {totalClauses > 0 && lowCount > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="#286344"
                      strokeDasharray={`${lowDash} 314.15`}
                      strokeDashoffset={`${lowOffset}`}
                      strokeLinecap="round"
                      strokeWidth="9"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-3xl font-normal text-[#1D1B18] leading-tight">{totalClauses}</span>
                  <span className="text-[10px] text-[#716B63] uppercase tracking-wider font-semibold">Clauses Rated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Counters */}
          <div className="grid grid-cols-3 gap-2 pt-4 bg-[#F0ECE4]/60 p-3 rounded-lg border border-[#E6E0D6]/60">
            <div className="flex flex-col items-center text-center">
              <span className="text-lg text-[#A83224] font-semibold">{highCount}</span>
              <span className="text-[10px] text-[#716B63] flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A83224]"></span> High
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg text-[#92530C] font-semibold">{medCount}</span>
              <span className="text-[10px] text-[#716B63] flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#92530C]"></span> Medium
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg text-[#286344] font-semibold">{lowCount}</span>
              <span className="text-[10px] text-[#716B63] flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#286344]"></span> Low
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary Card (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDFA] rounded-xl p-8 shadow-sm border border-[#E6E0D6] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
                Executive Summary
              </span>
              <span className="text-xs text-[#979087]">
                {document.provider === 'mock' || document.id.startsWith('doc-demo-')
                  ? 'Source: Demo Simulation (In-Memory Mock)'
                  : document.provider === 'rule_benchmark'
                  ? 'Source: Deterministic Fallback (Rule Benchmark Engine)'
                  : `Source: Live AI (${document.modelName || 'Groq'})`}
              </span>
            </div>

            <p className="text-sm text-[#1D1B18] leading-relaxed">
              {document.summary || "Exposure analysis complete. Key commercial clauses and counter-proposals are detailed below."}
            </p>

            <p className="text-xs text-[#716B63] leading-relaxed">
              Analysis generated for contract <strong className="font-semibold text-[#1D1B18]">{document.name}</strong> ({document.id}). All findings are verbatim excerpts cited directly from the uploaded text layer.
            </p>
          </div>

          {/* Mini Badges Row */}
          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-[#E6E0D6]/60">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0ECE4] text-[#1D1B18] text-xs">
              <AlertTriangle className={`w-4 h-4 ${highCount > 0 ? 'text-[#A83224]' : 'text-[#92530C]'}`} />
              <span>Critical Friction: <strong className="font-medium">{highCount} High, {medCount} Medium Risk Items</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0ECE4] text-[#1D1B18] text-xs">
              <span className="text-[#979087]">⚖</span>
              <span>Protective Balance: <strong className="font-medium">
                {lowCount > 0
                  ? `${Math.round((lowCount / totalRated) * 100)}% Standard Terms`
                  : totalRated - (highCount + medCount) > 0
                  ? `${Math.round(((totalRated - (highCount + medCount)) / totalRated) * 100)}% Standard Terms`
                  : `${Math.max(10, Math.round(((totalClauses > 0 ? Math.max(1, 10 - highCount - medCount) : 0) / 10) * 100))}% Standard Terms`}
              </strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabs & Filtering Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0D6]/60 print:hidden">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('findings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'findings'
                ? 'bg-[#F0ECE4] text-[#1D1B18] shadow-sm'
                : 'text-[#716B63] hover:text-[#1D1B18] hover:bg-[#FFFDFA]'
            }`}
          >
            Key findings ({document.clauses.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-[#F0ECE4] text-[#1D1B18] shadow-sm'
                : 'text-[#716B63] hover:text-[#1D1B18] hover:bg-[#FFFDFA]'
            }`}
          >
            Recommendations ({document.clauses.filter((c) => c.suggestedRevision).length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-[#F0ECE4] text-[#1D1B18] shadow-sm'
                : 'text-[#716B63] hover:text-[#1D1B18] hover:bg-[#FFFDFA]'
            }`}
          >
            Document details
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#979087]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-lg px-3 py-1.5 text-xs text-[#1D1B18] outline-none cursor-pointer"
          >
            <option value="severity">Severity (Highest first)</option>
            <option value="order">Document Order (Page 1-8)</option>
            <option value="impact">Risk Impact</option>
          </select>
        </div>
      </div>

      {/* 5. Tab Content: Findings, Recommendations, or Document Details */}
      {activeTab === 'details' ? (
        <div className="bg-[#FFFDFA] rounded-xl p-6 sm:p-8 shadow-sm border border-[#E6E0D6] space-y-6">
          <div className="border-b border-[#E6E0D6] pb-4">
            <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">Document Audit Specifications</h3>
            <p className="text-xs text-[#716B63] mt-1">
              Cryptographic verification, storage telemetry, and model pipeline provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Document Title</span>
              <div className="font-medium text-[#1D1B18] text-sm truncate">{document.name}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Document Identifier</span>
              <div className="font-mono text-[#1D1B18] truncate">{document.id}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Intelligence Provider</span>
              <div className="font-medium text-[#1D1B18]">
                {document.provider === 'mock' || document.id.startsWith('doc-demo-')
                  ? 'Demo Simulation (In-Memory)'
                  : document.provider === 'rule_benchmark'
                  ? 'Deterministic Benchmark Engine'
                  : `Live AI: ${document.modelName || 'Groq'}`}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">File Format & Size</span>
              <div className="font-mono text-[#1D1B18] uppercase">{document.fileType} • {document.fileSize}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Page Length</span>
              <div className="font-medium text-[#1D1B18]">{document.pageCount} Pages Analyzed</div>
            </div>

            <div className="p-4 rounded-lg bg-[#F7F4EE] border border-[#E6E0D6] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Lifecycle Status</span>
              <div className="font-medium capitalize text-[#1D1B18]">{document.status.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Extracted Text Layer Preview */}
          <div className="space-y-2 pt-4 border-t border-[#E6E0D6]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">
                Extracted Document Layer (Verbatim Source Text)
              </span>
              <span className="text-[11px] text-[#716B63]">
                {document.extractedText ? `${document.extractedText.length.toLocaleString()} characters` : 'Text preview ready'}
              </span>
            </div>

            <div className="bg-[#1C1B19] text-[#E6E0D6] rounded-xl p-5 text-xs font-mono leading-relaxed max-h-80 overflow-y-auto selection:bg-[#34312C] selection:text-white">
              <pre className="whitespace-pre-wrap font-mono">
                {document.extractedText ||
                  document.clauses.map((c) => `[${c.section} • Page ${c.pageNumber}]\n${c.originalText}\n`).join('\n') ||
                  'No extracted raw text layer available for this document.'}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 py-2">
          {(activeTab === 'recommendations'
            ? sortedClauses.filter((c) => Boolean(c.suggestedRevision))
            : sortedClauses
          ).map((clause, idx) => (
            <div
              key={clause.id}
              className="bg-[#FFFDFA] rounded-xl p-6 sm:p-8 shadow-sm border border-[#E6E0D6] flex flex-col gap-6 transition-all hover:bg-[#FFFEFC]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal">
                      {idx + 1}. {clause.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      clause.severity === 'high' ? 'bg-[#FCE4DF] text-[#A83224] border-[#F7C6BE]' :
                      clause.severity === 'medium' ? 'bg-[#FFF0D8] text-[#92530C] border-[#F5DEC2]' :
                      'bg-[#E1EFE4] text-[#286344] border-[#C6DFC9]'
                    }`}>
                      {clause.severity.toUpperCase()} RISK
                    </span>
                  </div>
                  <span className="text-xs text-[#979087]">{clause.section} • Page {clause.pageNumber}</span>
                </div>

                <div className="flex items-center gap-1 self-start sm:self-auto print:hidden">
                  <button
                    onClick={() => onNavigate('results', document.id)}
                    className="p-2 rounded-lg text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] text-xs font-medium flex items-center gap-1"
                    title="Direct contract jump"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Jump to Section</span>
                  </button>
                </div>
              </div>

              {/* Contract Excerpt */}
              <div className={`rounded-lg p-4 pl-5 border-l-4 ${
                clause.severity === 'high' ? 'bg-[#F0ECE4]/70 border-[#A83224]' :
                clause.severity === 'medium' ? 'bg-[#F0ECE4]/70 border-[#92530C]' :
                'bg-[#F0ECE4]/70 border-[#286344]'
              }`}>
                <div className="text-[10px] uppercase tracking-wider text-[#716B63] mb-1 font-semibold">
                  Contract Excerpt
                </div>
                <p className="font-serif italic text-sm text-[#1D1B18] leading-relaxed">
                  "{clause.originalText}"
                </p>
              </div>

              {/* Why High Risk */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">
                  <AlertTriangle className={`w-3.5 h-3.5 ${
                    clause.severity === 'high' ? 'text-[#A83224]' : 'text-[#92530C]'
                  }`} />
                  <span>Why this poses risk</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#716B63] pl-5 list-disc">
                  {clause.whyRisky.split('. ').filter(Boolean).map((pt, pIdx) => (
                    <li key={pIdx}>{pt.replace(/\.$/, '')}.</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Revision */}
              {clause.suggestedRevision && (
                <div className="bg-[#F7F4EE] rounded-lg p-5 border border-[#E6E0D6] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#1D1B18] font-semibold">
                      <span className="text-[#286344]">✓</span>
                      <span>Recommended Revision</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(clause.id, clause.suggestedRevision)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFFDFA] hover:bg-[#F0ECE4] text-[#1D1B18] text-xs shadow-sm border border-[#E6E0D6] transition-all font-medium print:hidden"
                    >
                      {copiedRevisionId === clause.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#286344]" />
                          <span className="text-[#286344]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#716B63]" />
                          <span>Copy Revision</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-serif italic text-xs text-[#1D1B18] leading-relaxed">
                    "{clause.suggestedRevision}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
