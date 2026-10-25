import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  ArrowRight, 
  GitCompare, 
  FolderOpen,
  AlertTriangle, 
  Zap,
  UploadCloud, 
  Plus
} from 'lucide-react';
import { RiskBadge } from '../components/ui/RiskBadge';
import { contractService } from '../services/contractService';
import { ContractDocument, ContractTemplate } from '../types/contract';
import { TemplatesModal } from '../components/contracts/TemplatesModal';

interface DashboardPageProps {
  onNavigate: (route: string, docId?: string) => void;
  onOpenTemplates?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    contractService.getDocuments().then(setDocuments);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Navigate to analyze page with file trigger or analyze directly
      onNavigate('analyze');
    }
  };

  const handleSelectTemplate = (_template: ContractTemplate) => {
    onNavigate('analyze');
  };

  return (
    <div className="w-full px-6 sm:px-10 py-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Top Greeting & Live Telemetry */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#716B63] bg-[#F0ECE4] px-2.5 py-1 rounded-full font-medium">
              Executive Workspace
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#286344] bg-[#E1EFE4] px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#286344] animate-pulse"></span>
              Engine: v2.4 Active
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] tracking-tight font-normal">
            Welcome back, Kunal.
          </h1>
          <p className="text-sm text-[#716B63]">
            Analyze your contracts, spot structural liabilities, and execute agreements with citation-backed clarity.
          </p>
        </div>

        {/* Usage Metric Capsule */}
        <div className="flex items-center gap-4 bg-[#FFFDFA] p-3 px-4 rounded-xl shadow-sm border border-[#E6E0D6]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#716B63] gap-6 text-xs">
              <span className="uppercase tracking-widest text-[#979087] text-[10px] font-semibold">Quota Usage</span>
              <span className="font-medium text-[#1D1B18]">3 / 5 Free Used</span>
            </div>
            <div className="w-40 sm:w-44 h-1.5 bg-[#F0ECE4] rounded-full overflow-hidden">
              <div className="h-full bg-[#1C1B19] rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs font-medium text-[#1D1B18] hover:text-[#716B63] transition-colors underline decoration-[#E6E0D6] underline-offset-4 pl-2"
          >
            Upgrade
          </button>
        </div>
      </header>

      {/* 2. Primary Action Trio */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Analyze a contract */}
        <div className="group relative flex flex-col justify-between p-6 bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] hover:shadow-md hover:bg-[#FFFEFC] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18] group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-[#1D1B18]" />
              </div>
              <span className="text-xs text-[#979087] font-mono">01</span>
            </div>
            <div>
              <h2 className="text-lg text-[#1D1B18] font-medium tracking-tight mb-1.5">
                Analyze a contract
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Upload any commercial PDF or DOCX to trigger full risk discovery and clause auditing.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#1C1B19] text-white text-xs font-medium hover:bg-[#34312C] shadow-sm transition-colors"
            >
              <span>Upload document</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action 2: Compare documents */}
        <div className="group relative flex flex-col justify-between p-6 bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] hover:shadow-md hover:bg-[#FFFEFC] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18] group-hover:scale-105 transition-transform">
                <GitCompare className="w-6 h-6 text-[#1D1B18]" />
              </div>
              <span className="text-xs text-[#979087] font-mono">02</span>
            </div>
            <div>
              <h2 className="text-lg text-[#1D1B18] font-medium tracking-tight mb-1.5">
                Compare documents
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Evaluate counterparty markups against standard terms to isolate subtle deviations instantly.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('compare')}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#FFFDFA] text-[#1D1B18] text-xs font-medium border border-[#E6E0D6] hover:bg-[#F0ECE4] transition-colors"
            >
              <span>Compare documents</span>
              <GitCompare className="w-4 h-4 text-[#716B63]" />
            </button>
          </div>
        </div>

        {/* Action 3: Use a template */}
        <div className="group relative flex flex-col justify-between p-6 bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] hover:shadow-md hover:bg-[#FFFEFC] transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18] group-hover:scale-105 transition-transform">
                <FolderOpen className="w-6 h-6 text-[#1D1B18]" />
              </div>
              <span className="text-xs text-[#979087] font-mono">03</span>
            </div>
            <div>
              <h2 className="text-lg text-[#1D1B18] font-medium tracking-tight mb-1.5">
                Use a template
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Start drafting with standardized, lawyer-approved templates tailored for modern digital work.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <button
              onClick={() => setIsTemplatesOpen(true)}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#FFFDFA] text-[#1D1B18] text-xs font-medium border border-[#E6E0D6] hover:bg-[#F0ECE4] transition-colors"
            >
              <span>Browse templates</span>
              <FolderOpen className="w-4 h-4 text-[#716B63]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Middle Insight & Rapid Ingestion Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Portfolio Risk Meter (4 columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6]/60">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
                Portfolio Integrity
              </span>
              <h3 className="text-base text-[#1D1B18] font-medium">Risk Level Index</h3>
            </div>
            <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-[#FFF0D8] text-[#92530C] font-medium border border-[#F5DEC2]">
              Moderate
            </span>
          </div>

          {/* Safe Index Circular Visualizer */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                  className="text-[#F0ECE4] fill-none"
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                {/* Progress indicator (64%) */}
                <circle
                  className="text-[#92530C] fill-none transition-all duration-1000 ease-out"
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="301.59"
                  strokeDashoffset="108.57"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-semibold tracking-tight text-[#1D1B18]">64%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#979087] font-semibold">Safe Index</span>
              </div>
            </div>
          </div>

          {/* Revision Alert Sub-clause */}
          <div className="p-3.5 bg-[#F0ECE4]/70 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#92530C] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[#1D1B18]">3 clauses need revision</span>
              <span className="text-[11px] text-[#716B63]">
                Identified liabilities in indemnification & liability caps across active files.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Instant Drag & Drop Card (8 columns) */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-8 group relative flex flex-col justify-between p-8 bg-[#FFFDFA] rounded-xl shadow-sm border-2 border-dashed border-[#E6E0D6] hover:border-[#1D1B18] hover:bg-[#FFFEFC] transition-all cursor-pointer"
        >
          <div className="flex flex-col max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#716B63]" />
              <span className="text-[11px] uppercase tracking-wider text-[#716B63] font-semibold">
                Instant Ingestion
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1D1B18] font-normal tracking-tight">
              Drop an unreviewed agreement here.
            </h3>
            <p className="text-sm text-[#716B63] mt-2 leading-relaxed">
              Axiom scans liability caps, unilateral termination clauses, and payment indemnity terms in seconds with citation-backed confidence.
            </p>
          </div>

          {/* Target Box */}
          <div className="mt-8 pt-6 border-t border-[#E6E0D6]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#1D1B18]">PDF or DOCX accepted</span>
                <span className="text-[11px] text-[#979087]">Maximum file size: 20MB per upload</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.docx" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <button 
                type="button"
                className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#FFFDFA] text-[#1D1B18] text-xs font-medium border border-[#E6E0D6] hover:bg-[#F0ECE4] shadow-sm transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-[#716B63]" />
                <span>Browse files</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Documents Ledger */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-medium tracking-tight text-[#1D1B18]">
              Recent documents
            </h2>
            <span className="text-xs bg-[#F0ECE4] px-2 py-0.5 rounded-full text-[#716B63] font-medium">
              {showEmptyState ? '0 active' : `${documents.length} active`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-xs text-[#716B63] hover:text-[#1D1B18] underline transition-colors"
            >
              {showEmptyState ? 'Show Sample Documents' : 'Test Empty State'}
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1D1B18] hover:text-[#716B63] transition-colors group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Table Canvas */}
        {showEmptyState ? (
          <div className="bg-[#FFFDFA] rounded-xl border border-[#E6E0D6] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F0ECE4] flex items-center justify-center mx-auto text-[#979087]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1D1B18]">No contracts analyzed yet</h3>
              <p className="text-xs text-[#716B63] max-w-sm mx-auto mt-1">
                Upload your first independent agreement to begin detecting unilateral risks and negotiating counter-proposals.
              </p>
            </div>
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1B19] text-white text-xs font-medium hover:bg-[#34312C] shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFDFA] rounded-xl shadow-sm border border-[#E6E0D6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E0D6] bg-[#F0ECE4]/40 text-[#716B63] text-[11px] uppercase tracking-wider font-medium">
                    <th className="py-3.5 px-6 font-medium">Document Name</th>
                    <th className="py-3.5 px-4 font-medium">Type</th>
                    <th className="py-3.5 px-4 font-medium">Date</th>
                    <th className="py-3.5 px-4 font-medium">Risk Assessment</th>
                    <th className="py-3.5 px-4 font-medium">Analysis Status</th>
                    <th className="py-3.5 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E0D6]/60 text-xs text-[#1D1B18]">
                  {documents.slice(0, 4).map((doc) => (
                    <tr 
                      key={doc.id}
                      onClick={() => onNavigate('results', doc.id)}
                      className="hover:bg-[#F0ECE4]/30 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};
