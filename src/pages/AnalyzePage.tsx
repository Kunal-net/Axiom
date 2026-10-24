import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Lock, 
  ArrowRight, 
  X,
  PlusCircle, 
  Cloud,
  CheckCircle2,
  Shield,
  Gavel,
  ShieldCheck,
  GitCompare,
  FileSearch,
  Brain,
  FileCheck
} from 'lucide-react';
import { contractService } from '../services/contractService';
import { ContractDocument } from '../types/contract';

interface AnalyzePageProps {
  onNavigate: (route: string, docId?: string) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [stagedFile, setStagedFile] = useState<{ name: string; size: string; rawSize: number } | null>({
    name: 'Freelance_Agreement.pdf',
    size: '2.4 MB',
    rawSize: 2.4 * 1024 * 1024
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0); // 0: upload, 1: processing, 2: analyzing, 3: report
  const [progressPercent, setProgressPercent] = useState(42);
  const [statusText, setStatusText] = useState('Parsing paragraph structure & liability limitations');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Invalid format. Axiom accepts PDF or DOCX documents.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 20MB limit.');
      return;
    }

    const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setStagedFile({
      name: file.name,
      size: formattedSize,
      rawSize: file.size
    });
  };

  const triggerAnalysis = async () => {
    if (!stagedFile) return;
    setIsAnalyzing(true);
    setActiveStageIndex(0);
    setProgressPercent(15);
    setStatusText('Uploading document to secure analysis enclave...');

    try {
      // Stage 1 -> Stage 2
      await new Promise(r => setTimeout(r, 600));
      setActiveStageIndex(1);
      setProgressPercent(45);
      setStatusText('Parsing paragraph structure & liability limitations...');

      // Stage 2 -> Stage 3
      await new Promise(r => setTimeout(r, 800));
      setActiveStageIndex(2);
      setProgressPercent(78);
      setStatusText('Auditing indemnities, unilateral termination & non-competes...');

      // Stage 3 -> Stage 4
      await new Promise(r => setTimeout(r, 700));
      setActiveStageIndex(3);
      setProgressPercent(100);
      setStatusText('Synthesizing structured risk report and plain-English redlines...');

      const doc = await contractService.analyzeDocument({
        name: stagedFile.name,
        size: stagedFile.rawSize
      });

      await new Promise(r => setTimeout(r, 500));
      onNavigate('results', doc.id);
    } catch {
      setIsAnalyzing(false);
      setErrorMessage('Analysis service encountered an unexpected error. Please try again.');
    }
  };

  return (
    <div className="w-full px-6 sm:px-10 py-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. Header Context */}
      <div className="flex flex-col gap-2.5 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0ECE4] text-[#716B63] text-[11px] uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#286344]"></span>
            AXIOM INTELLIGENCE ENGINE • v2.4 Neural Parser
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] tracking-tight font-normal">
              Analyze a contract
            </h1>
            <p className="text-sm text-[#716B63] mt-1">
              Upload your document and let Axiom scan it for risks, unfair clauses and key insights.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#716B63] text-xs bg-[#FFFDFA] px-3.5 py-2 rounded-lg shadow-sm border border-[#E6E0D6]">
            <Lock className="w-3.5 h-3.5 text-[#286344]" />
            <span>SOC-2 Type II Verified Environment</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-[#FCE4DF] border border-[#F7C6BE] rounded-xl flex items-center gap-3 text-xs text-[#A83224]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Main Workspace Grid (Bento Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Staged File (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Interactive Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative bg-[#FFFDFA] hover:bg-[#F0ECE4]/40 transition-all duration-300 rounded-xl p-8 sm:p-10 shadow-sm border border-[#E6E0D6] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
              dragActive ? 'ring-2 ring-[#1C1B19] bg-[#F0ECE4]/60' : ''
            }`}
            style={{
              backgroundImage: 'radial-gradient(#cbc6bd 0.75px, transparent 0.75px)',
              backgroundSize: '16px 16px'
            }}
          >
            <div className="w-14 h-14 rounded-full bg-[#F0ECE4] flex items-center justify-center text-[#1D1B18] mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-[#1D1B18]" />
            </div>

            <p className="text-base text-[#1D1B18] font-medium mb-1">
              Drag and drop your file here
            </p>
            <p className="text-xs text-[#716B63] mb-6">
              Supports PDF and DOCX (max 20MB)
            </p>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] transition-colors text-xs font-medium shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Choose file</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStagedFile({
                    name: 'Cloud_Import_Master_Agreement.pdf',
                    size: '3.1 MB',
                    rawSize: 3.1 * 1024 * 1024
                  });
                }}
                className="px-4 py-2.5 rounded-lg bg-[#F0ECE4] text-[#1D1B18] hover:bg-[#EAE5DC] transition-colors text-xs font-medium flex items-center gap-2"
              >
                <Cloud className="w-4 h-4 text-[#716B63]" />
                <span>Import from Cloud</span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-[#979087] text-xs font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#286344]" /> 256-bit AES
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#716B63]" /> Auto-redacted PII
              </span>
            </div>
          </div>

          {/* Staged Document Card */}
          {stagedFile && (
            <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-[#FCE4DF] text-[#A83224] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#A83224]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1D1B18] truncate">
                      {stagedFile.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F0ECE4] text-[#716B63] text-[10px] font-mono">
                      PDF
                    </span>
                  </div>
                  <span className="text-xs text-[#716B63] mt-0.5 flex items-center gap-1.5">
                    <span>{stagedFile.size}</span>
                    <span>•</span>
                    <span className="text-[#286344] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valid signature block verified
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setStagedFile(null)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#979087] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
                  title="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={triggerAnalysis}
                  className="px-4 py-2.5 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] transition-all text-xs font-medium shadow-sm flex items-center gap-1.5 active:scale-98 disabled:opacity-50"
                >
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze contract'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Micro Document Preview Strip */}
          <div className="bg-[#F0ECE4]/60 rounded-xl p-4 border border-[#E6E0D6]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#716B63]">
              <FileSearch className="w-4 h-4 text-[#979087]" />
              <span>
                Estimated reading: <strong className="text-[#1D1B18] font-medium">8 pages</strong> • Master Services Schedule included
              </span>
            </div>
            <span className="text-xs text-[#365B91] bg-[#E5EBF5] px-2.5 py-1 rounded-md font-medium border border-[#C7D7EC]">
              Standard NDA & IP clauses detected
            </span>
          </div>
        </div>

        {/* Right Column: Pipeline Stepper & Diagnostics (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Pipeline Monitor Card */}
          <div className="bg-[#FFFDFA] rounded-xl p-6 shadow-sm border border-[#E6E0D6] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D6]/60">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#716B63] font-semibold">
                  Orchestration
                </span>
                <h2 className="text-base text-[#1D1B18] font-medium">
                  Analysis Pipeline
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F0ECE4] px-2.5 py-1 rounded-full text-[#716B63] text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-[#365B91] animate-pulse"></span>
                <span>Live telemetry</span>
              </div>
            </div>

            {/* Responsive Pipeline Stepper (4 stages) */}
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Stage 1: Uploading */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs ${
                  activeStageIndex > 0 || isAnalyzing
                    ? 'bg-[#E1EFE4] text-[#286344]'
                    : 'bg-[#F0ECE4] text-[#716B63]'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs text-[#1D1B18] font-medium">Uploading</span>
                <span className="text-[10px] text-[#286344]">
                  {activeStageIndex > 0 ? 'Completed' : 'Ready'}
                </span>
              </div>

              {/* Stage 2: Processing (Active) */}
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs ${
                  activeStageIndex === 1
                    ? 'bg-[#E5EBF5] text-[#365B91] ring-2 ring-[#365B91]/30'
                    : activeStageIndex > 1
                    ? 'bg-[#E1EFE4] text-[#286344]'
                    : 'bg-[#F0ECE4] text-[#716B63]'
                }`}>
                  {activeStageIndex === 1 ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#365B91] border-t-transparent rounded-full animate-spin"></div>
                  ) : activeStageIndex > 1 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-[#716B63]" />
                  )}
                </div>
                <span className="text-xs text-[#1D1B18] font-medium">Processing</span>
                <span className="text-[10px] text-[#365B91] font-medium">
                  {activeStageIndex === 1 ? 'Extracting...' : activeStageIndex > 1 ? 'Extracted' : 'Queued'}
                </span>
              </div>

              {/* Stage 3: Analyzing */}
              <div className={`flex flex-col items-center text-center gap-1.5 ${activeStageIndex < 2 ? 'opacity-60' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  activeStageIndex === 2
                    ? 'bg-[#FFF0D8] text-[#92530C] ring-2 ring-[#92530C]/30'
                    : activeStageIndex > 2
                    ? 'bg-[#E1EFE4] text-[#286344]'
                    : 'bg-[#F0ECE4] text-[#716B63]'
                }`}>
                  {activeStageIndex === 2 ? (
                    <div className="w-3.5 h-3.5 border-2 border-[#92530C] border-t-transparent rounded-full animate-spin"></div>
                  ) : activeStageIndex > 2 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Brain className="w-3.5 h-3.5 text-[#716B63]" />
                  )}
                </div>
                <span className="text-xs text-[#1D1B18] font-medium">Analyzing</span>
                <span className="text-[10px] text-[#979087]">
                  {activeStageIndex === 2 ? 'Evaluating...' : activeStageIndex > 2 ? 'Audited' : 'Risks check'}
                </span>
              </div>

              {/* Stage 4: Report */}
              <div className={`flex flex-col items-center text-center gap-1.5 ${activeStageIndex < 3 ? 'opacity-40' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  activeStageIndex === 3
                    ? 'bg-[#E1EFE4] text-[#286344]'
                    : 'bg-[#F0ECE4] text-[#716B63]'
                }`}>
                  <FileCheck className="w-3.5 h-3.5 text-[#716B63]" />
                </div>
                <span className="text-xs text-[#1D1B18] font-medium">Report</span>
                <span className="text-[10px] text-[#979087]">
                  {activeStageIndex === 3 ? 'Generating...' : 'Score pending'}
                </span>
              </div>
            </div>

            {/* Progress Bar & Deep Diagnostic Indicator */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1D1B18]">Batch parsing tokens</span>
                <span className="font-medium text-[#1D1B18] font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F0ECE4] overflow-hidden">
                <div
                  className="h-full bg-[#1C1B19] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#716B63] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365B91]"></span>
                <span>{statusText}</span>
              </p>
            </div>

            {/* Inline Telemetry Feed */}
            <div className="rounded-lg bg-[#F0ECE4]/70 p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] text-[#979087] uppercase tracking-wider font-semibold">
                <span>Parser Log</span>
                <span>Latency 48ms</span>
              </div>
              <div className="text-xs text-[#716B63] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>OCR text normalization</span>
                  <span className="text-[#286344] font-medium text-[11px]">PASS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entity boundary resolution</span>
                  <span className="text-[#365B91] font-medium text-[11px]">
                    {activeStageIndex >= 1 ? 'PASS' : 'RUNNING'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Indemnification clause mapping</span>
                  <span className={`text-[11px] font-medium ${activeStageIndex >= 2 ? 'text-[#286344]' : 'text-[#979087]'}`}>
                    {activeStageIndex >= 2 ? 'PASS' : 'WAITING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informational Reassurance Card */}
          <div className="bg-[#FFFDFA] rounded-xl p-5 shadow-sm border border-[#E6E0D6] flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#E1EFE4] text-[#286344] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#286344]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1D1B18] leading-tight">
                Asynchronous Background Scan
              </span>
              <p className="text-xs text-[#716B63] leading-relaxed">
                This usually takes 1–2 minutes. You can safely navigate away or explore other documents. We’ll notify you and update your history ledger the moment processing is finalized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Feature / Trust Badges (3 items) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#FFFDFA] rounded-xl p-4 shadow-sm border border-[#E6E0D6] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#F0ECE4] text-[#1D1B18] flex items-center justify-center shrink-0">
            <Gavel className="w-5 h-5 text-[#1D1B18]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#1D1B18] truncate">Jurisdiction Safe</span>
            <span className="text-[11px] text-[#716B63] truncate">US, UK & EU common standards</span>
          </div>
        </div>

        <div className="bg-[#FFFDFA] rounded-xl p-4 shadow-sm border border-[#E6E0D6] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#F0ECE4] text-[#1D1B18] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#1D1B18]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#1D1B18] truncate">Confidential & Encrypted</span>
            <span className="text-[11px] text-[#716B63] truncate">Zero model-training retention</span>
          </div>
        </div>

        <div className="bg-[#FFFDFA] rounded-xl p-4 shadow-sm border border-[#E6E0D6] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#F0ECE4] text-[#1D1B18] flex items-center justify-center shrink-0">
            <GitCompare className="w-5 h-5 text-[#1D1B18]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[#1D1B18] truncate">Clause Benchmarking</span>
            <span className="text-[11px] text-[#716B63] truncate">Compared with 14,000+ precedents</span>
          </div>
        </div>
      </div>
    </div>
  );
};
