import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/RiskBadge';
import { contractService } from '../services/contractService';
import { ContractDocument } from '../types/contract';

interface HistoryPageProps {
  onNavigate: (route: string, docId?: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'risk'>('date');

  useEffect(() => {
    contractService.getDocuments().then(setDocuments);
  }, []);

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || doc.fileType === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'risk') return b.riskCounts.high - a.riskCounts.high;
      return 0; // default order
    });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E6E0D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Audit & Analysis Archive</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            Document History
          </h1>
          <p className="text-sm text-[#716B63] mt-1">
            Search, revisit, and export all contract analyses conducted across your client engagements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('analyze')}
        >
          Analyze New Contract
        </Button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#979087]" />
          <input
            type="text"
            placeholder="Search document names or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1D1B18] placeholder-[#979087] focus:outline-none focus:border-[#1C1B19]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* File Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] focus:outline-none"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="needs_review">Needs Review</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] focus:outline-none"
          >
            <option value="date">Sort: Recent First</option>
            <option value="risk">Sort: Highest Risk</option>
            <option value="name">Sort: Document Name</option>
          </select>
        </div>
      </div>

      {/* 3. Document Archive Table */}
      <div className="bg-[#FFFDFA] rounded-2xl border border-[#E6E0D6] shadow-whisper overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#716B63] space-y-2">
            <FileText className="w-8 h-8 mx-auto text-[#979087]" />
            <p className="font-medium text-sm text-[#1D1B18]">No documents match this filter</p>
            <p>Try resetting your search query or format selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4EE] text-[#716B63] uppercase tracking-wider font-medium text-[11px] border-b border-[#E6E0D6]">
                <tr>
                  <th className="py-3 px-6">Document</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Date Processed</th>
                  <th className="py-3 px-4">Risk Profile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E0D6]/70">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onNavigate('results', doc.id)}
                    className="hover:bg-[#F0ECE4]/30 transition-colors group cursor-pointer"
                  >
                    {/* Document Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F0ECE4] text-[#716B63] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm text-[#1D1B18] group-hover:underline truncate max-w-xs sm:max-w-md">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-[#979087]">
                            {doc.fileSize} • {doc.pageCount} Pages • {doc.clauses.length} Flagged Terms
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Format */}
                    <td className="py-4 px-4 font-mono uppercase text-[11px] text-[#716B63]">
                      {doc.fileType}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-[#716B63] whitespace-nowrap">
                      {doc.uploadedAt}
                    </td>

                    {/* Risk Breakdown */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {doc.riskCounts.high > 0 && (
                          <RiskBadge severity="high" count={doc.riskCounts.high} size="sm" />
                        )}
                        {doc.riskCounts.medium > 0 && (
                          <RiskBadge severity="medium" count={doc.riskCounts.medium} size="sm" />
                        )}
                        {doc.riskCounts.low > 0 && (
                          <RiskBadge severity="low" count={doc.riskCounts.low} size="sm" />
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {doc.status === 'needs_review' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF0D8] text-[#92530C] border border-[#F5DEC2]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#92530C]"></span>
                          Needs Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#286344]"></span>
                          Completed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('results', doc.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#1D1B18] bg-[#F0ECE4] hover:bg-[#EAE5DC] transition-colors"
                        >
                          Workspace
                        </button>
                        <button
                          onClick={() => onNavigate('report', doc.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                        >
                          Audit Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E6E0D6] bg-[#F7F4EE]/50 flex items-center justify-between text-xs text-[#716B63]">
          <span>Showing {filteredDocs.length} of {documents.length} contracts</span>
          <div className="flex items-center gap-1">
            <button disabled className="p-1.5 rounded hover:bg-[#EAE5DC] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 rounded bg-[#FFFDFA] border border-[#E6E0D6] font-medium text-[#1D1B18]">1</span>
            <button disabled className="p-1.5 rounded hover:bg-[#EAE5DC] disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
