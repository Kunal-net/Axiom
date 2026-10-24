import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  GitCompare,
  Check
} from 'lucide-react';
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
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'risk'>('date');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadDocuments = useCallback(() => {
    contractService.getDocuments().then(setDocuments);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);


  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document from history?')) {
      await contractService.deleteDocument(id);
      loadDocuments();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Document Name', 'Format', 'File Size', 'Upload Date', 'High Risks', 'Medium Risks', 'Low Risks', 'Status'];
    const rows = documents.map(d => [
      `"${d.name}"`,
      d.fileType.toUpperCase(),
      d.fileSize,
      `"${d.uploadedAt}"`,
      d.riskCounts.high,
      d.riskCounts.medium,
      d.riskCounts.low,
      d.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Axiom_Contract_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || doc.fileType === filterType;
      const matchesRisk = 
        filterRisk === 'all' ||
        (filterRisk === 'high' && doc.riskCounts.high > 0) ||
        (filterRisk === 'medium' && doc.riskCounts.medium > 0) ||
        (filterRisk === 'clean' && doc.riskCounts.high === 0 && doc.riskCounts.medium === 0);
      return matchesSearch && matchesType && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'risk') return b.riskCounts.high - a.riskCounts.high;
      return 0; // Default order
    });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedDocs.map(d => d.id));
    }
  };

  const toggleSelectDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. Top Breadcrumb & Page Headings */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#716B63]"></span>
            <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
              Archive & Repository • {documents.length} Analyzed Files
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] tracking-tight font-normal">
            Document history
          </h1>
          <p className="text-xs text-[#716B63] max-w-2xl">
            View, filter, and audit all your analyzed contracts, revisions, and structural risk reports with direct provenance tracking.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFDFA] text-[#1D1B18] text-xs font-medium hover:bg-[#F0ECE4] shadow-sm border border-[#E6E0D6] transition-all"
            type="button"
          >
            <Download className="w-4 h-4 text-[#716B63]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1B19] text-white text-xs font-medium hover:bg-[#34312C] shadow-md transition-all"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span>Upload new</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Summary Row (4 Bento Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">Total Reviewed</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#1D1B18] leading-tight">24 contracts</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#286344] font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3 this week</span>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <svg className="w-full h-7 overflow-visible stroke-[#1C1B19]/30" fill="none" viewBox="0 0 160 28">
              <path d="M0 24 L25 18 L55 22 L85 10 L115 15 L140 6 L160 9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle className="fill-[#1C1B19]" cx="160" cy="9" r="3" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">High Risk Detected</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCE4DF] text-[#A83224] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#1D1B18] leading-tight">7 clauses</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#A83224] font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>In 2 documents</span>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <svg className="w-full h-7 overflow-visible stroke-[#A83224]/30" fill="none" viewBox="0 0 160 28">
              <path d="M0 10 L30 14 L60 8 L90 20 L120 12 L140 22 L160 16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle className="fill-[#A83224]" cx="160" cy="16" r="3" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">Avg. Analysis Time</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#1D1B18] leading-tight">14 seconds</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#286344] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>99.2% parsing confidence</span>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <svg className="w-full h-7 overflow-visible stroke-[#365B91]/30" fill="none" viewBox="0 0 160 28">
              <path d="M0 20 L40 18 L80 12 L120 14 L140 8 L160 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle className="fill-[#365B91]" cx="160" cy="6" r="3" />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">Redlines Drafted</span>
            <div className="w-8 h-8 rounded-lg bg-[#E1EFE4] text-[#286344] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#1D1B18] leading-tight">18 revisions</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#286344] font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>12 accepted by client</span>
            </div>
          </div>
          <div className="mt-4 pt-2">
            <svg className="w-full h-7 overflow-visible stroke-[#286344]/30" fill="none" viewBox="0 0 160 28">
              <path d="M0 22 L35 18 L70 20 L105 10 L135 12 L160 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <circle className="fill-[#286344]" cx="160" cy="4" r="3" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#979087]" />
          <input
            type="text"
            placeholder="Search documents by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1D1B18] placeholder:text-[#979087] focus:outline-none focus:border-[#1C1B19] transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* File Format Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] outline-none cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] outline-none cursor-pointer"
          >
            <option value="all">All Risks</option>
            <option value="high">High Risk Detected</option>
            <option value="medium">Medium Risk</option>
            <option value="clean">Clean / Low Risk</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] outline-none cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Severity</option>
          </select>

          {(searchQuery || filterType !== 'all' || filterRisk !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterRisk('all');
              }}
              className="text-xs text-[#716B63] hover:text-[#1D1B18] underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4. Document Table Ledger */}
      <div className="bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E0D6] bg-[#F0ECE4]/40 text-[#716B63] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedDocs.length}
                    onChange={toggleSelectAll}
                    className="rounded border-[#E6E0D6] text-[#1C1B19] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-medium">Document Name</th>
                <th className="py-3.5 px-4 font-medium">Type</th>
                <th className="py-3.5 px-4 font-medium">Date</th>
                <th className="py-3.5 px-4 font-medium">Risk Assessment</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D6]/60 text-xs text-[#1D1B18]">
              {paginatedDocs.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <tr
                    key={doc.id}
                    onClick={() => onNavigate('results', doc.id)}
                    className={`hover:bg-[#F0ECE4]/30 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#F0ECE4]/20' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center" onClick={(e) => toggleSelectDoc(doc.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-[#E6E0D6] text-[#1C1B19] cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#716B63] shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1D1B18] group-hover:text-[#34312C] transition-colors">
                            {doc.name}
                          </span>
                          <span className="text-[11px] text-[#979087]">
                            {doc.fileSize} • {doc.pageCount} pages
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#716B63] uppercase text-[11px] font-mono">
                      {doc.fileType}
                    </td>
                    <td className="py-4 px-4 text-[#716B63] text-xs">
                      {doc.uploadedAt}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {doc.riskCounts.high > 0 && (
                          <RiskBadge severity="high" count={doc.riskCounts.high} size="sm" />
                        )}
                        {doc.riskCounts.medium > 0 && (
                          <RiskBadge severity="medium" count={doc.riskCounts.medium} size="sm" />
                        )}
                        {doc.riskCounts.low > 0 && (
                          <RiskBadge severity="low" count={doc.riskCounts.low} size="sm" />
                        )}
                        {doc.riskCounts.high === 0 && doc.riskCounts.medium === 0 && (
                          <span className="text-[10px] text-[#286344] font-medium bg-[#E1EFE4] px-2 py-0.5 rounded">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        doc.status === 'completed'
                          ? 'bg-[#E1EFE4] text-[#286344]'
                          : 'bg-[#FFF0D8] text-[#92530C]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'completed' ? 'bg-[#286344]' : 'bg-[#92530C]'}`}></span>
                        {doc.status === 'completed' ? 'Completed' : 'Needs Review'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('results', doc.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-[#1D1B18] bg-[#F0ECE4] hover:bg-[#EAE5DC] transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => onNavigate('report', doc.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                        >
                          Report
                        </button>
                        <button
                          onClick={() => onNavigate('compare', doc.id)}
                          className="p-1.5 rounded-md text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                          title="Compare with revisions"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(doc.id, e)}
                          className="p-1.5 rounded-md text-[#979087] hover:text-[#A83224] hover:bg-[#FCE4DF] transition-colors"
                          title="Delete from archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar */}
        <div className="p-4 border-t border-[#E6E0D6] bg-[#FFFDFA] flex items-center justify-between text-xs text-[#716B63]">
          <span>
            Showing <strong className="text-[#1D1B18] font-medium">{paginatedDocs.length}</strong> of {filteredDocs.length} documents
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#E6E0D6] hover:bg-[#F0ECE4] disabled:opacity-40 transition-colors font-medium"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                  currentPage === p
                    ? 'bg-[#1C1B19] text-white shadow-sm'
                    : 'hover:bg-[#F0ECE4] text-[#716B63]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#E6E0D6] hover:bg-[#F0ECE4] disabled:opacity-40 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
