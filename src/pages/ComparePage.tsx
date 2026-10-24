import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  X, 
  ArrowLeftRight, 
  FileText, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Copy,
  Clock,
  History,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { contractService } from '../services/contractService';
import { DocumentDiff } from '../types/contract';

interface ComparePageProps {
  onNavigate: (route: string, docId?: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [diffs, setDiffs] = useState<DocumentDiff[]>([]);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isReRunning, setIsReRunning] = useState(false);

  useEffect(() => {
    contractService.getComparisonDiffs().then((d) => {
      setDiffs(d);
    });
  }, []);

  const filteredDiffs = diffs.filter((diff) => {
    if (filterType === 'all') return true;
    return diff.changeType === filterType;
  });

  const activeDiff = filteredDiffs[currentDiffIndex] || filteredDiffs[0] || diffs[0];

  const handleNextDiff = () => {
    if (filteredDiffs.length > 0) {
      setCurrentDiffIndex((prev) => (prev + 1) % filteredDiffs.length);
    }
  };

  const handlePrevDiff = () => {
    if (filteredDiffs.length > 0) {
      setCurrentDiffIndex((prev) => (prev - 1 + filteredDiffs.length) % filteredDiffs.length);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const handleReRun = () => {
    setIsReRunning(true);
    setTimeout(() => {
      setIsReRunning(false);
    }, 600);
  };

  const handleExportDiff = () => {
    const reportText = filteredDiffs.map((d, i) => (
      `Diff #${i + 1}: ${d.clauseTitle} (${d.section})\n` +
      `Type: ${d.changeType.toUpperCase()} | Severity: ${d.severity.toUpperCase()}\n` +
      `Original: ${d.originalText}\n` +
      `Revised: ${d.revisedText}\n` +
      `Legal Impact: ${d.legalImpact}\n` +
      `------------------------------------------\n`
    )).join('\n');

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Axiom_Contract_Diff_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const conflictCount = diffs.filter(d => d.changeType === 'conflict').length;
  const addedCount = diffs.filter(d => d.changeType === 'added').length;
  const removedCount = diffs.filter(d => d.changeType === 'removed').length;
  const modifiedCount = diffs.filter(d => d.changeType === 'modified').length;

  return (
    <div className="w-full px-6 sm:px-10 py-6 max-w-[1520px] mx-auto space-y-6 pb-16">
      {/* 1. Top Header & Action Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A83224] animate-pulse"></span>
            <span className="text-[10px] text-[#716B63] uppercase tracking-widest font-semibold">
              Document Intelligence • Audit Mode
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] tracking-tight font-normal">
            Compare documents
          </h1>
          <p className="text-xs text-[#716B63]">
            Upload two related documents to find differences, conflicts and risks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportDiff}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FFFDFA] text-[#1D1B18] text-xs font-medium shadow-sm hover:bg-[#F0ECE4] border border-[#E6E0D6] transition-colors"
            type="button"
          >
            <Download className="w-4 h-4 text-[#716B63]" />
            <span>Export Diff</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-lg bg-[#FFFDFA] text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] shadow-sm border border-[#E6E0D6] flex items-center justify-center transition-colors"
            title="Close workspace"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Document Selection Bar */}
      <div className="bg-[#FFFDFA] rounded-xl p-3.5 shadow-sm border border-[#E6E0D6] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Document A (Original or Swapped) */}
        <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-[#F0ECE4]/60 hover:bg-[#F0ECE4] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#FFFDFA] flex items-center justify-center text-[#716B63] shadow-sm shrink-0 border border-[#E6E0D6]">
              <FileText className="w-5 h-5 text-[#716B63]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#1D1B18] truncate">
                  {isSwapped ? 'Freelance Agreement (v2).pdf' : 'Freelance Agreement.pdf'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDFA] text-[#979087] font-mono border border-[#E6E0D6]">
                  {isSwapped ? 'V2.0' : 'V1.0'}
                </span>
              </div>
              <span className="text-[11px] text-[#716B63]">
                {isSwapped ? '2.1 MB • Uploaded Today, 14:20' : '2.4 MB • Uploaded Oct 21'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#979087] uppercase font-semibold px-2 py-1 bg-white rounded border border-[#E6E0D6]">
            {isSwapped ? 'Counter-Proposal' : 'Baseline Draft'}
          </span>
        </div>

        {/* Swap Center Indicator */}
        <div className="flex items-center justify-center self-center shrink-0">
          <button
            onClick={() => setIsSwapped(!isSwapped)}
            className="w-9 h-9 rounded-full bg-[#F0ECE4] hover:bg-[#EAE5DC] text-[#1D1B18] shadow-sm flex items-center justify-center transition-transform hover:rotate-180 duration-300 border border-[#E6E0D6]"
            title="Swap comparison direction"
            type="button"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#716B63]" />
          </button>
        </div>

        {/* Document B (Revised or Swapped) */}
        <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-[#F0ECE4]/60 hover:bg-[#F0ECE4] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#FFFDFA] flex items-center justify-center text-[#286344] shadow-sm shrink-0 border border-[#E6E0D6]">
              <CheckCircle2 className="w-5 h-5 text-[#286344]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#1D1B18] truncate">
                  {isSwapped ? 'Freelance Agreement.pdf' : 'Freelance Agreement (v2).pdf'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#E1EFE4] text-[#286344] font-medium border border-[#C6DFC9]">
                  {isSwapped ? 'V1.0' : 'Latest'}
                </span>
              </div>
              <span className="text-[11px] text-[#716B63]">
                {isSwapped ? '2.4 MB • Uploaded Oct 21' : '2.1 MB • Uploaded Today, 14:20'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#286344] uppercase font-semibold px-2 py-1 bg-[#E1EFE4] rounded border border-[#C6DFC9]">
            {isSwapped ? 'Baseline Draft' : 'Revised Draft'}
          </span>
        </div>

        {/* Re-run CTA */}
        <div className="shrink-0 flex items-center justify-end">
          <button
            onClick={handleReRun}
            disabled={isReRunning}
            className="w-full xl:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1C1B19] hover:bg-[#34312C] text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            type="button"
          >
            <span>{isReRunning ? 'Recalculating...' : 'Re-run Comparison'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Difference Filter Pills Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDFA] rounded-xl px-4 py-2.5 shadow-sm border border-[#E6E0D6]">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => { setFilterType('all'); setCurrentDiffIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 shadow-sm transition-all ${
              filterType === 'all'
                ? 'bg-[#1C1B19] text-white'
                : 'bg-[#F0ECE4] text-[#1D1B18] hover:bg-[#EAE5DC]'
            }`}
          >
            <span>All differences</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{diffs.length}</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterType('conflict'); setCurrentDiffIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
              filterType === 'conflict'
                ? 'bg-[#A83224] text-white'
                : 'bg-[#F0ECE4] hover:bg-[#EAE5DC] text-[#1D1B18]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#A83224]"></span>
            <span>Conflicts</span>
            <span className="text-[10px] font-mono opacity-80">{conflictCount}</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterType('added'); setCurrentDiffIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
              filterType === 'added'
                ? 'bg-[#286344] text-white'
                : 'bg-[#F0ECE4] hover:bg-[#EAE5DC] text-[#1D1B18]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#286344]"></span>
            <span>Added</span>
            <span className="text-[10px] font-mono opacity-80">{addedCount}</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterType('removed'); setCurrentDiffIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
              filterType === 'removed'
                ? 'bg-[#716B63] text-white'
                : 'bg-[#F0ECE4] hover:bg-[#EAE5DC] text-[#1D1B18]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#A83224]"></span>
            <span>Removed</span>
            <span className="text-[10px] font-mono opacity-80">{removedCount}</span>
          </button>

          <button
            type="button"
            onClick={() => { setFilterType('modified'); setCurrentDiffIndex(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
              filterType === 'modified'
                ? 'bg-[#92530C] text-white'
                : 'bg-[#F0ECE4] hover:bg-[#EAE5DC] text-[#1D1B18]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#92530C]"></span>
            <span>Modified</span>
            <span className="text-[10px] font-mono opacity-80">{modifiedCount}</span>
          </button>
        </div>

        {/* Difference Queue Controller */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 text-xs">
          <span className="text-[#716B63]">
            Showing <strong className="text-[#1D1B18] font-medium">{filteredDiffs.length > 0 ? currentDiffIndex + 1 : 0}</strong> of {filteredDiffs.length} diffs
          </span>
          <div className="flex items-center gap-1 bg-[#F0ECE4] rounded-lg p-0.5">
            <button
              onClick={handlePrevDiff}
              disabled={filteredDiffs.length <= 1}
              className="w-7 h-7 rounded flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#FFFDFA] transition-colors disabled:opacity-30"
              title="Previous difference"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDiff}
              disabled={filteredDiffs.length <= 1}
              className="w-7 h-7 rounded flex items-center justify-center text-[#1D1B18] hover:bg-[#FFFDFA] transition-colors disabled:opacity-30"
              title="Next difference"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side Dual Document Readers + Difference Inspector (3-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1: Original Contract Reader (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] overflow-hidden">
          {/* Reader Sub-Header */}
          <div className="px-4 py-3 bg-[#F0ECE4]/70 border-b border-[#E6E0D6] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1D1B18]">Original Contract</span>
              <span className="px-1.5 py-0.5 rounded bg-[#FFFDFA] text-[#716B63] text-[10px] font-mono border border-[#E6E0D6]">
                v1
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#716B63] text-[11px]">
              <span>Page 3 of 8</span>
              <span className="px-1.5 py-0.5 rounded bg-[#FFFDFA] text-[#1D1B18] font-mono border border-[#E6E0D6]">
                100%
              </span>
            </div>
          </div>

          {/* Document Page Simulation */}
          <div className="p-5 flex flex-col gap-4 text-[#1D1B18]">
            <div className="flex items-center justify-between pb-1 text-[#979087] text-[10px] uppercase tracking-wider font-semibold">
              <span>Clause Review • Freelance Services</span>
              <span>Doc ID: #FS-2024-91</span>
            </div>

            {/* Section 4 Context */}
            <div className="opacity-40 flex flex-col gap-1 text-xs">
              <h4 className="font-medium text-[#1D1B18]">4. Deliverables & Acceptance</h4>
              <p className="line-clamp-2 leading-relaxed text-[#716B63]">
                Freelancer shall deliver completed project assets within the established sprint milestones. Client retains inspection rights for ten (10) consecutive business days.
              </p>
            </div>

            {/* Section 5: The Redlined Clause (Focus) */}
            <div className="flex flex-col gap-2 p-3.5 rounded-lg bg-[#F0ECE4]/40 border border-[#E6E0D6] relative">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs text-[#1D1B18]">{activeDiff?.section || 'Section 5.2'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FCE4DF] text-[#A83224] border border-[#F7C6BE] font-medium flex items-center gap-1">
                  <span>⊖</span>
                  <span>Removed Clause</span>
                </span>
              </div>

              {/* Redline Excerpt Box */}
              <div className="p-3.5 rounded-lg bg-[#FCE4DF] text-[#A83224] text-xs leading-relaxed shadow-sm border border-[#F7C6BE]">
                <p className="font-serif italic text-sm text-[#A83224] mb-1 font-medium">Original unilateral clause:</p>
                <p className="line-through decoration-[#A83224]/70">
                  {activeDiff?.originalText || '“The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.”'}
                </p>
              </div>

              <span className="text-[11px] text-[#979087] flex items-center gap-1 pt-1">
                <History className="w-3.5 h-3.5" />
                <span>{activeDiff?.authorOriginal || 'Authored by Client Legal Counsel • Signed Oct 21'}</span>
              </span>
            </div>

            {/* Section 6 Context preview */}
            <div className="opacity-50 flex flex-col gap-1 pt-1 text-xs">
              <h4 className="font-medium text-[#1D1B18]">6. Payment & Invoicing</h4>
              <p className="leading-relaxed text-[#716B63]">
                Payment cycles are structured on net-30 days post invoice submittal. Freelancer agrees to submit all billing sheets by the final calendar day of each cycle.
              </p>
            </div>

            {/* Visual Page Footer */}
            <div className="pt-4 flex items-center justify-between text-[#979087] text-[10px] border-t border-[#E6E0D6]/60">
              <span>Standard Master Services Framework</span>
              <span>End of Section 5</span>
            </div>
          </div>
        </div>

        {/* Column 2: Revised Contract Reader (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] overflow-hidden">
          {/* Reader Sub-Header */}
          <div className="px-4 py-3 bg-[#F0ECE4]/70 border-b border-[#E6E0D6] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1D1B18]">Revised Contract (v2)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#E1EFE4] text-[#286344] text-[10px] font-mono border border-[#C6DFC9]">
                v2
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#716B63] text-[11px]">
              <span>Page 3 of 8</span>
              <span className="px-1.5 py-0.5 rounded bg-[#FFFDFA] text-[#1D1B18] font-mono border border-[#E6E0D6]">
                100%
              </span>
            </div>
          </div>

          {/* Document Page Simulation */}
          <div className="p-5 flex flex-col gap-4 text-[#1D1B18]">
            <div className="flex items-center justify-between pb-1 text-[10px] uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-1.5 text-[#365B91]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365B91]"></span>
                <span>Synced View • Rev 2 Counter-Draft</span>
              </div>
              <span className="text-[#979087]">Doc ID: #FS-2024-91-B</span>
            </div>

            {/* Section 4 Context */}
            <div className="opacity-40 flex flex-col gap-1 text-xs">
              <h4 className="font-medium text-[#1D1B18]">4. Deliverables & Acceptance</h4>
              <p className="line-clamp-2 leading-relaxed text-[#716B63]">
                Freelancer shall deliver completed project assets within the established sprint milestones. Client retains inspection rights for ten (10) consecutive business days.
              </p>
            </div>

            {/* Section 5: The Revised Addition (Focus) */}
            <div className="flex flex-col gap-2 p-3.5 rounded-lg bg-[#F0ECE4]/40 border border-[#E6E0D6] relative">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs text-[#1D1B18]">{activeDiff?.section || 'Section 5.2'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9] font-medium flex items-center gap-1">
                  <span>⊕</span>
                  <span>Revised Addition</span>
                </span>
              </div>

              {/* Green Excerpt Box */}
              <div className="p-3.5 rounded-lg bg-[#E1EFE4] text-[#286344] text-xs leading-relaxed shadow-sm border border-[#C6DFC9]">
                <p className="font-serif italic text-sm text-[#286344] mb-1 font-medium">Revised bilateral terms:</p>
                <p className="font-medium text-[#1D1B18]">
                  {activeDiff?.revisedText || '“Either party may terminate this Agreement with 30 days’ written notice. The Client shall compensate the Freelancer for all work completed up to the termination date.”'}
                </p>
              </div>

              <span className="text-[11px] text-[#979087] flex items-center gap-1 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeDiff?.authorRevised || 'Redrafted via External Counsel • Uploaded 14:20'}</span>
              </span>
            </div>

            {/* Section 6 Context preview */}
            <div className="opacity-50 flex flex-col gap-1 pt-1 text-xs">
              <h4 className="font-medium text-[#1D1B18]">6. Payment & Invoicing</h4>
              <p className="leading-relaxed text-[#716B63]">
                Payment cycles are structured on net-30 days post invoice submittal. Freelancer agrees to submit all billing sheets by the final calendar day of each cycle.
              </p>
            </div>

            {/* Visual Page Footer */}
            <div className="pt-4 flex items-center justify-between text-[#979087] text-[10px] border-t border-[#E6E0D6]/60">
              <span>Standard Master Services Framework (Amended)</span>
              <span>Synchronized Line 114</span>
            </div>
          </div>
        </div>

        {/* Column 3: Difference Details Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-[#FFFDFA] rounded-xl p-6 shadow-sm border border-[#E6E0D6] gap-5">
          {/* Tag & Title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FCE4DF] text-[#A83224] border border-[#F7C6BE] font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                High Risk Mitigation
              </span>
              <span className="text-xs text-[#979087] font-mono">
                Diff #{currentDiffIndex + 1} of {filteredDiffs.length}
              </span>
            </div>

            <h2 className="font-serif text-2xl text-[#1D1B18] font-normal leading-tight">
              {activeDiff?.clauseTitle}
            </h2>
            <p className="text-xs text-[#716B63] leading-relaxed">
              {activeDiff?.explanation}
            </p>
          </div>

          {/* Legal Impact Box */}
          <div className="p-4 rounded-xl bg-[#F0ECE4]/70 border border-[#E6E0D6] space-y-2">
            <span className="text-[10px] text-[#979087] uppercase tracking-wider font-semibold">
              Commercial Legal Impact
            </span>
            <p className="text-xs text-[#1D1B18] leading-relaxed">
              {activeDiff?.legalImpact}
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => handleCopy(activeDiff?.revisedText || '')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1B19] text-white hover:bg-[#34312C] text-xs font-medium shadow-sm transition-colors"
            >
              {copiedDiff ? <Check className="w-4 h-4 text-[#E1EFE4]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedDiff ? 'Copied Revision!' : 'Copy Counter-Proposal'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNextDiff()}
                className="py-2 px-3 rounded-lg border border-[#C6DFC9] bg-[#E1EFE4] hover:bg-[#E1EFE4]/80 text-[#286344] text-xs font-medium transition-colors text-center"
              >
                Accept Redline
              </button>
              <button
                onClick={() => handleNextDiff()}
                className="py-2 px-3 rounded-lg border border-[#E6E0D6] bg-white hover:bg-[#F0ECE4] text-[#716B63] text-xs font-medium transition-colors text-center"
              >
                Keep Original
              </button>
            </div>
          </div>

          {/* Navigation to Full Analysis / Report */}
          <div className="pt-3 border-t border-[#E6E0D6]/60 flex items-center justify-between text-xs text-[#716B63]">
            <button
              onClick={() => onNavigate('results')}
              className="hover:text-[#1D1B18] underline"
            >
              View in Analysis Workspace
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="hover:text-[#1D1B18] underline"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
