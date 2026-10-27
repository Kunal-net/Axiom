import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  FileText,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/RiskBadge';
import { DoubleBezel } from '../components/ui/DoubleBezel';
import { contractService } from '../services/contractService';
import { DocumentDiff, ContractDocument } from '../types/contract';

interface ComparePageProps {
  onNavigate: (route: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  const [diffs, setDiffs] = useState<DocumentDiff[]>([]);
  const [selectedDiffId, setSelectedDiffId] = useState<string>('diff-1');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [compareError, setCompareError] = useState<string | null>(null);

  const executeCompare = async (aId: string, bId: string) => {
    setIsLoading(true);
    setCompareError(null);
    try {
      const results = await contractService.getComparisonDiffs(aId, bId);
      setDiffs(results);
      if (results.length > 0) {
        setSelectedDiffId(results[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve comparison diffs from backend.';
      setCompareError(msg);
      setDiffs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    contractService.getDocuments().then((docs) => {
      if (!active) return;
      setDocuments(docs);
      const firstId = docs[0]?.id || (contractService.isMock ? 'doc-msa-fintech' : '');
      const secondId = docs.length > 1 ? docs[1]?.id : (contractService.isMock ? 'doc-msa-counter' : docs[0]?.id || '');
      setDocAId(firstId);
      setDocBId(secondId);

      if (firstId && secondId) {
        executeCompare(firstId, secondId);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const handleSelectDocA = (newAId: string) => {
    setDocAId(newAId);
    if (newAId && docBId) {
      executeCompare(newAId, docBId);
    }
  };

  const handleSelectDocB = (newBId: string) => {
    setDocBId(newBId);
    if (docAId && newBId) {
      executeCompare(docAId, newBId);
    }
  };

  const selectedDocA = documents.find((d) => d.id === docAId) || documents[0];
  const selectedDocB = documents.find((d) => d.id === docBId) || (documents.length > 1 ? documents[1] : undefined);

  const selectedDiff = diffs.find((d) => d.id === selectedDiffId) || diffs[0];

  const conflictCount = diffs.filter((d) => d.changeType === 'conflict').length;
  const modifiedCount = diffs.filter((d) => d.changeType === 'modified').length;
  const addedCount = diffs.filter((d) => d.changeType === 'added').length;
  const removedCount = diffs.filter((d) => d.changeType === 'removed').length;

  const filterTabs = [
    { id: 'all', label: `All Diffs (${diffs.length})` },
    ...(conflictCount > 0 ? [{ id: 'conflict', label: `Conflicts (${conflictCount})` }] : []),
    ...(modifiedCount > 0 ? [{ id: 'modified', label: `Modified (${modifiedCount})` }] : []),
    ...(addedCount > 0 ? [{ id: 'added', label: `Added (${addedCount})` }] : []),
    ...(removedCount > 0 ? [{ id: 'removed', label: `Removed (${removedCount})` }] : []),
  ];

  const filteredDiffs = diffs.filter((diff) => {
    if (filterType === 'all') return true;
    return diff.changeType === filterType;
  });

  const getChangeBadge = (type: DocumentDiff['changeType']) => {
    switch (type) {
      case 'conflict':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FCE4DF] text-[#A83224] border border-[#F7C6BE]">Legal Conflict</span>;
      case 'added':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9]">Protection Added</span>;
      case 'modified':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF0D8] text-[#92530C] border border-[#F5DEC2]">Clause Modified</span>;
      case 'removed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F0ECE4] text-[#716B63] border border-[#E6E0D6]">Clause Removed</span>;
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E6E0D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Side-by-Side Legal Diff</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            Compare Documents
          </h1>
          <p className="text-sm text-[#716B63] mt-1">
            Detect contractual divergences, added liabilities, and altered terms between revisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('results')}
          >
            Back to Analysis
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('analyze')}
          >
            Upload New Draft
          </Button>
        </div>
      </div>

      {/* 2. Document Version Selectors Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A (Original) */}
        <div className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper space-y-2">
          <div className="flex items-center justify-between text-xs text-[#716B63]">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#A83224]">Baseline Version A</span>
            {documents.length > 1 ? (
              <select
                value={docAId}
                onChange={(e) => handleSelectDocA(e.target.value)}
                className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-lg px-2 py-0.5 text-xs text-[#1D1B18] outline-none"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-mono text-[11px]">Primary Baseline</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FCE4DF] text-[#A83224] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1D1B18] truncate">
                {selectedDocA?.name || 'Baseline Agreement'}
              </div>
              <div className="text-[11px] text-[#979087]">
                {selectedDocA ? `${selectedDocA.fileSize} • ${selectedDocA.pageCount} Pages • ${selectedDocA.uploadedAt}` : 'Baseline Document'}
              </div>
            </div>
          </div>
        </div>

        {/* Document B (Revised) */}
        <div className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper space-y-2">
          <div className="flex items-center justify-between text-xs text-[#716B63]">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#286344]">Comparison Target B</span>
            {documents.length > 1 ? (
              <select
                value={docBId}
                onChange={(e) => handleSelectDocB(e.target.value)}
                className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-lg px-2 py-0.5 text-xs text-[#1D1B18] outline-none"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-mono text-[11px]">Counter-Proposal Draft</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E1EFE4] text-[#286344] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#1D1B18] truncate">
                {selectedDocB ? selectedDocB.name : `${selectedDocA?.name || 'Document'}_Redline_Counter_Proposal.docx`}
              </div>
              <div className="text-[11px] text-[#979087]">
                {selectedDocB ? `${selectedDocB.fileSize} • ${selectedDocB.pageCount} Pages • ${selectedDocB.uploadedAt}` : 'Generated with Axiom Redlines'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Summary of Divergences Filter Strip */}
      <div className="p-4 rounded-xl bg-[#F0ECE4]/70 border border-[#E6E0D6] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-[#716B63] flex-wrap">
          <span className="font-semibold text-[#1D1B18]">Summary of Changes:</span>
          <span>{diffs.length} Altered Clause{diffs.length === 1 ? '' : 's'}</span>
          {conflictCount > 0 && (
            <>
              <span>•</span>
              <span className="text-[#A83224] font-medium">{conflictCount} Conflict{conflictCount === 1 ? '' : 's'} Identified</span>
            </>
          )}
          {addedCount > 0 && (
            <>
              <span>•</span>
              <span className="text-[#286344] font-medium">{addedCount} Protection{addedCount === 1 ? '' : 's'} Added</span>
            </>
          )}
          {modifiedCount > 0 && (
            <>
              <span>•</span>
              <span className="text-[#92530C] font-medium">{modifiedCount} Modified</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#716B63] mr-1 hidden sm:inline">Filter:</span>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filterType === tab.id
                  ? 'bg-[#1C1B19] text-white shadow-sm'
                  : 'bg-[#FFFDFA] text-[#716B63] hover:text-[#1D1B18] border border-[#E6E0D6]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Side-by-Side Synchronized Comparison View */}
      {isLoading ? (
        <div className="bg-[#FFFDFA] rounded-xl border border-[#E6E0D6] p-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1C1B19] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#716B63]">Computing semantic legal diffs between contract revisions...</p>
        </div>
      ) : compareError ? (
        <div className="bg-[#FFFDFA] rounded-xl border border-[#F7C6BE] p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FCE4DF] text-[#A83224] border border-[#F7C6BE] flex items-center justify-center mx-auto">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#782419]">Comparison Request Failed</h3>
            <p className="text-xs text-[#A83224] max-w-md mx-auto mt-1 leading-relaxed">
              {compareError}
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => docAId && docBId && executeCompare(docAId, docBId)}
            >
              Retry Comparison
            </Button>
          </div>
        </div>
      ) : diffs.length === 0 ? (
        <div className="bg-[#FFFDFA] rounded-xl border border-[#E6E0D6] p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E1EFE4] text-[#286344] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#1D1B18]">No Contractual Divergences Found</h3>
            <p className="text-xs text-[#716B63] max-w-md mx-auto mt-1">
              Both documents maintain identical contractual provisions with zero detected legal variance between these versions.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Diff Clauses Navigator (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Detected Divergences</span>
            <div className="space-y-2">
              {filteredDiffs.map((diff) => {
                const isSelected = diff.id === selectedDiffId;
                return (
                  <div
                    key={diff.id}
                    onClick={() => setSelectedDiffId(diff.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-[#FFFDFA] border-[#1C1B19] shadow-sm'
                        : 'bg-[#FFFDFA] border-[#E6E0D6] hover:border-[#716B63] hover:bg-[#F7F4EE]'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {getChangeBadge(diff.changeType)}
                      <span className="text-xs font-mono text-[#979087]">{diff.section}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#1D1B18] mb-1">
                      {diff.clauseTitle}
                    </h4>

                    <p className="text-[11px] text-[#716B63] line-clamp-2 leading-relaxed">
                      {diff.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Side-by-Side Dual Pane + Impact Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedDiff && (
              <DoubleBezel padding="md">
                <div className="p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E0D6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getChangeBadge(selectedDiff.changeType)}
                      <span className="text-xs font-mono text-[#979087]">{selectedDiff.section}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal">
                      {selectedDiff.clauseTitle}
                    </h3>
                  </div>

                  <RiskBadge severity={selectedDiff.severity} size="sm" />
                </div>

                {/* Side-by-side Dual Text Panes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Original Draft (Strikethrough / Red) */}
                  <div className="bg-[#FCE4DF]/40 rounded-xl p-4 border border-[#F7C6BE] space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A83224]">
                      Original Client Language
                    </span>
                    <p className="text-xs font-serif leading-relaxed text-[#A83224] line-through decoration-[#A83224]/80">
                      "{selectedDiff.originalText}"
                    </p>
                  </div>

                  {/* Right: Counter-Proposed Redline (Green / Revised) */}
                  <div className="bg-[#E1EFE4]/50 rounded-xl p-4 border border-[#C6DFC9] space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#286344]">
                      Axiom Counter-Proposal Redline
                    </span>
                    <p className="text-xs font-serif leading-relaxed text-[#1D1B18] font-medium">
                      "{selectedDiff.revisedText}"
                    </p>
                  </div>
                </div>

                {/* Legal & Commercial Impact Assessment */}
                <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6] space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1D1B18]">
                    Commercial Impact Assessment
                  </span>
                  <p className="text-xs text-[#716B63] leading-relaxed">
                    {selectedDiff.explanation}
                  </p>
                  <div className="text-xs text-[#286344] font-medium pt-1">
                    <strong>Protection Gained:</strong> {selectedDiff.legalImpact}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDiff.revisedText);
                      setCopiedDiff(true);
                      setTimeout(() => setCopiedDiff(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDFA] border border-[#E6E0D6] hover:bg-[#F0ECE4] text-[#1D1B18] font-medium transition-colors"
                  >
                    {copiedDiff ? <Check className="w-3.5 h-3.5 text-[#286344]" /> : <GitCompare className="w-3.5 h-3.5" />}
                    <span>{copiedDiff ? 'Copied Counter-Clause' : 'Copy Counter-Clause'}</span>
                  </button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigate('results')}
                  >
                    View in Full Contract →
                  </Button>
                </div>
              </div>
            </DoubleBezel>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
