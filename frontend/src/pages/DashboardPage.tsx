import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  GitCompare, 
  Folder, 
  AlertTriangle, 
  UploadCloud 
} from 'lucide-react';
import { contractService } from '../services/contractService';
import { ContractDocument, ContractTemplate, UserProfile } from '../types/contract';
import { TemplatesModal } from '../components/contracts/TemplatesModal';

interface DashboardPageProps {
  onNavigate: (route: string, docId?: string) => void;
  onOpenTemplates?: () => void;
  userProfile?: UserProfile;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigate, 
  onOpenTemplates, 
  userProfile: initialProfile 
}) => {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(initialProfile);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    contractService.getDocuments().then((docs) => {
      if (active) {
        setDocuments(docs);
      }
    });

    if (!userProfile) {
      contractService.getUserProfile().then((prof) => {
        if (active) setUserProfile(prof);
      });
    }

    return () => {
      active = false;
    };
  }, [userProfile]);

  const handleFileSelection = async (file: File) => {
    const isPdfOrDocx = file.name.endsWith('.pdf') || file.name.endsWith('.docx') || 
                        file.type === 'application/pdf' || 
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isPdfOrDocx) {
      setUploadError('Only PDF and DOCX files are supported.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(15);
    setUploadStage('Reading agreement bytes...');

    try {
      const doc = await contractService.analyzeDocument(file, (stage, percent) => {
        setUploadStage(stage);
        setUploadProgress(percent);
      });
      setIsUploading(false);
      onNavigate('results', doc.id);
    } catch (err: unknown) {
      setIsUploading(false);
      const apiErr = err as { message?: string };
      setUploadError(apiErr.message || 'Failed to upload and analyze document. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleSelectTemplate = (_template: ContractTemplate) => {
    setIsTemplatesOpen(false);
    onNavigate('analyze');
  };

  // Derive dynamic user first name from authenticated profile
  const userName = userProfile?.name?.trim() || 'Kunal Suryanshi';
  const firstName = userName.split(' ')[0] || 'Kunal';

  // Portfolio metrics calculation
  const evaluatedDocs = documents.filter(
    (d) => (d.status === 'completed' || d.status === 'needs_review') && d.clauses && d.clauses.length > 0
  );
  const totalEvaluated = evaluatedDocs.length;
  const totalHigh = evaluatedDocs.reduce((sum, d) => sum + (d.riskCounts?.high || 0), 0);
  const totalMed = evaluatedDocs.reduce((sum, d) => sum + (d.riskCounts?.medium || 0), 0);
  const totalLow = evaluatedDocs.reduce((sum, d) => sum + (d.riskCounts?.low || 0), 0);
  const totalClauses = totalHigh + totalMed + totalLow;

  const hasEvaluation = totalEvaluated > 0 && totalClauses > 0;
  const safePercent = hasEvaluation
    ? Math.max(0, Math.min(100, Math.round(((totalLow + (totalMed * 0.4)) / totalClauses) * 100)))
    : null;

  const riskLevel = !hasEvaluation
    ? 'NO DATA'
    : totalHigh > 2
    ? 'HIGH'
    : (totalHigh > 0 || totalMed > 1)
    ? 'MODERATE'
    : 'LOW';

  const strokeColor = !hasEvaluation
    ? '#EAE5DC'
    : riskLevel === 'HIGH'
    ? '#D92228'
    : riskLevel === 'MODERATE'
    ? '#92530C'
    : '#286344';

  // Recent insight from evaluated agreements
  const recentEvaluatedDoc = evaluatedDocs[0];
  const latestInsight = recentEvaluatedDoc?.clauses?.find((c) => c.severity === 'high') || 
                        recentEvaluatedDoc?.clauses?.find((c) => c.severity === 'medium') || 
                        recentEvaluatedDoc?.clauses?.[0];
  const latestInsightDocId = recentEvaluatedDoc?.id;
  const hasInsights = !!latestInsight;

  return (
    <div className="w-full bg-[#F7F4EE] text-[#1D1B18] px-6 sm:px-8 lg:px-9 py-6 space-y-6 max-w-[1240px] xl:max-w-[1280px] mx-auto min-h-[calc(100vh-56px)] select-none">
      
      {/* ========================================================================= */}
      {/* SECTION 1 — ASYMMETRIC WELCOME HERO                                       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-1 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Greeting & Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-2">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#111110]">
                EXECUTIVE WORKSPACE
              </span>
              <span className="w-5 h-[2px] bg-[#D92228]" aria-hidden="true" />
            </div>

            <h1 className="font-display text-[48px] sm:text-[56px] lg:text-[62px] xl:text-[66px] font-normal tracking-[-0.03em] text-[#111110] leading-[0.98] mb-3 whitespace-nowrap">
              Welcome back, {firstName}.
            </h1>

            <p className="text-[14px] sm:text-[15px] text-[#57534E] max-w-[440px] font-sans leading-snug">
              Analyze, compare, and negotiate your contracts with citation-backed clarity.
            </p>
          </div>

          {/* Right Column: Coordinated Architectural Photograph, Red Brand Motif, Grid & Editorial Typography */}
          <div className="lg:col-span-5 relative flex items-center justify-end">
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[580px] xl:max-w-[620px] aspect-[720/254] select-none">
              
              {/* Drafting grid lines background extending across the hero illustration */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#E6E0D6_1px,transparent_1px),linear-gradient(to_bottom,#E6E0D6_1px,transparent_1px)] bg-[size:16px_16px]" 
                aria-hidden="true"
              />

              {/* Architectural Colonnade Facade with diagonal crop on left edge matching reference */}
              <div 
                className="absolute left-[1.9%] top-0 w-[75.8%] h-full pointer-events-none select-none overflow-hidden"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 56% 100%)' }}
              >
                <img
                  src="/images/facade.jpg"
                  alt="Classical architectural facade with Corinthian colonnade"
                  className="w-full h-full object-cover object-[32%_center] filter grayscale contrast-125 mix-blend-multiply"
                />
              </div>

              {/* Vector SVG: Precision Red Geometric Brand Motif & Architectural Drafting Guidelines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                viewBox="0 0 720 254"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Architectural Drafting Guidelines & Reference Lines */}
                <g stroke="#8A857D" strokeWidth="0.8" strokeOpacity="0.35">
                  <line x1="0" y1="0" x2="720" y2="0" strokeWidth="1" strokeOpacity="0.45" />
                  <line x1="0" y1="254" x2="720" y2="254" strokeWidth="1" strokeOpacity="0.45" />
                  <line x1="0" y1="170" x2="720" y2="170" />
                  <line x1="0" y1="97" x2="600" y2="97" />
                  <line x1="0" y1="116" x2="600" y2="116" />
                  <line x1="0" y1="194" x2="650" y2="194" />
                  <line x1="48" y1="0" x2="48" y2="254" />
                  <line x1="146" y1="0" x2="146" y2="254" />
                  <line x1="216" y1="0" x2="216" y2="254" />
                  <line x1="341" y1="0" x2="341" y2="254" />
                  <line x1="549" y1="0" x2="549" y2="254" />
                  {/* Vertical rule aligned to the left of the editorial typography */}
                  <line x1="607" y1="89" x2="607" y2="155" strokeWidth="1.2" strokeOpacity="0.6" />
                </g>

                {/* Precision Red Geometric Brand Motif layered with mix-blend-multiply */}
                <g style={{ mixBlendMode: 'multiply' }}>
                  {/* Facet 1: Primary Sweeping Right Blade / Wing entering from upper region */}
                  <polygon
                    points="584,0 488,0 507,49 432,156 495,198"
                    fill="#D92228"
                  />

                  {/* Facet 2: Sharp Left Triangular Point extending toward left-middle columns */}
                  <polygon
                    points="216,170 341,174 415,99 327,122"
                    fill="#B0181D"
                    opacity="0.96"
                  />

                  {/* Facet 3: Downward Cutting Vertical Blade through architectural facade */}
                  <polygon
                    points="341,174 341,252 379,252 415,199 432,156"
                    fill="#D92228"
                  />

                  {/* Facet 4: Upper-Middle Origami Fold & Notch */}
                  <polygon
                    points="488,0 507,49 415,99 327,122"
                    fill="#B0181D"
                  />

                  {/* Internal Origami Crease Lines for dimensional fidelity */}
                  <line x1="216" y1="170" x2="432" y2="156" stroke="#8F1216" strokeWidth="1" />
                  <line x1="341" y1="174" x2="341" y2="252" stroke="#8F1216" strokeWidth="1" />
                  <line x1="507" y1="49" x2="432" y2="156" stroke="#8F1216" strokeWidth="1" />
                  <line x1="327" y1="122" x2="415" y2="99" stroke="#8F1216" strokeWidth="1" />
                </g>
              </svg>

              {/* Vertical Editorial Accent Text to the right of the architectural image */}
              <div 
                className="absolute left-[85.5%] top-[35%] flex flex-col justify-center space-y-0.5 font-sans text-[7.5px] sm:text-[8.5px] lg:text-[9px] font-bold tracking-[0.24em] leading-tight uppercase text-[#716B63] select-none text-left shrink-0 z-20"
              >
                <span>CLEARER</span>
                <span>CONTRACTS</span>
                <span>BRIGHTER</span>
                <span>CREATIVES</span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 2 — THREE PRIMARY ACTION CARDS                                    */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        
        {/* Card 01: Analyze a contract */}
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 flex flex-col justify-between shadow-xs hover:border-[#111110]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shadow-xs">
                  <FileText className="w-5 h-5 text-[#111110]" />
                </div>
                <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
              </div>
              <span className="text-xs text-[#8A857D] font-mono">01</span>
            </div>
            <h2 className="font-display font-normal text-[20px] text-[#111110] mb-2 leading-snug tracking-tight">
              Analyze a contract
            </h2>
            <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed">
              Upload any commercial PDF or DOCX to trigger full risk discovery and clause auditing.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('analyze')}
              className="w-full py-2.5 px-4 rounded-md bg-[#111110] text-[#FFFFFF] text-xs font-medium hover:bg-[#262624] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
            >
              <span>Upload document</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>

        {/* Card 02: Compare documents */}
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 flex flex-col justify-between shadow-xs hover:border-[#111110]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shadow-xs">
                  <GitCompare className="w-5 h-5 text-[#111110]" />
                </div>
                <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
              </div>
              <span className="text-xs text-[#8A857D] font-mono">02</span>
            </div>
            <h2 className="font-display font-normal text-[20px] text-[#111110] mb-2 leading-snug tracking-tight">
              Compare documents
            </h2>
            <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed">
              Evaluate counterparty markups against standard terms to isolate subtle deviations instantly.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('compare')}
              className="w-full py-2.5 px-4 rounded-md bg-[#FFFDFA] text-[#111110] text-xs font-medium border border-[#D4CDC3] hover:bg-[#F0ECE4] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Compare documents</span>
              <GitCompare className="w-3.5 h-3.5 text-[#716B63]" />
            </button>
          </div>
        </div>

        {/* Card 03: Use a template */}
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 flex flex-col justify-between shadow-xs hover:border-[#111110]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shadow-xs">
                  <Folder className="w-5 h-5 text-[#111110]" />
                </div>
                <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
              </div>
              <span className="text-xs text-[#8A857D] font-mono">03</span>
            </div>
            <h2 className="font-display font-normal text-[20px] text-[#111110] mb-2 leading-snug tracking-tight">
              Use a template
            </h2>
            <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed">
              Start drafting with standardized, lawyer-approved templates tailored for modern digital work.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => {
                if (onOpenTemplates) onOpenTemplates();
                else setIsTemplatesOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-md bg-[#FFFDFA] text-[#111110] text-xs font-medium border border-[#D4CDC3] hover:bg-[#F0ECE4] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse templates</span>
              <Folder className="w-3.5 h-3.5 text-[#716B63]" />
            </button>
          </div>
        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 3 — FULL-WIDTH QUICK UPLOAD PANEL                                 */}
      {/* ========================================================================= */}
      <section className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#111110]">
                QUICK UPLOAD
              </span>
              <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
            </div>
            <h2 className="font-display text-[26px] sm:text-[28px] font-normal text-[#111110] tracking-tight">
              Drop an agreement here.
            </h2>
            <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed max-w-2xl mt-1 font-sans">
              Axiom scans liability caps, unilateral termination clauses, and payment terms in seconds with citation-backed confidence.
            </p>
          </div>

          <div className="text-right sm:self-start shrink-0">
            <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.16em] uppercase text-[#8A857D] block">
              SUPPORTED FORMATS
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium text-[#716B63] block">
              PDF, DOCX (MAX 25MB)
            </span>
          </div>
        </div>

        {/* Drag & Drop Surface with Vertically Centered Badge */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileSelection(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-md py-8 sm:py-9 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all cursor-pointer ${
            isDragging 
              ? 'border-[#111110] bg-[#F0ECE4]/60' 
              : 'border-[#D4CDC3] bg-[#FFFDFA] hover:border-[#111110] hover:bg-[#F7F4EE]/40'
          }`}
        >
          {/* Centered Instructions & Document Icon */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shadow-xs mb-2">
              <FileText className="w-5 h-5 text-[#111110]" />
            </div>
            <p className="text-xs sm:text-[13px] font-medium text-[#111110]">
              Drag and drop your contract here
            </p>
            <p className="text-xs text-[#716B63] mt-0.5">
              or <span className="font-semibold text-[#111110] underline decoration-[#D4CDC3] underline-offset-2">click to browse files</span>
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <button
              type="button"
              className="px-6 py-2.5 rounded-md bg-[#111110] text-[#FFFFFF] text-xs font-medium hover:bg-[#262624] transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Browse files
            </button>
          </div>
        </div>

        {/* Upload Progress & Feedback */}
        {isUploading && (
          <div className="mt-4 p-4 rounded-md bg-[#F0ECE4]/60 border border-[#E6E0D6] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#111110] font-medium">
              <span className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 animate-bounce text-[#111110]" />
                <span>{uploadStage || 'Processing document...'}</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#111110] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mt-4 p-3 rounded-md bg-[#FCE4DF] border border-[#F7C6BE] text-xs text-[#A83224] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* SECTION 4 — BOTTOM TWO EDITORIAL PANELS                                    */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        
        {/* Left Panel: Risk Level Index (PORTFOLIO INTEGRITY) */}
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#111110]">
                PORTFOLIO INTEGRITY
              </span>
              <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl sm:text-[22px] font-normal text-[#111110] tracking-tight">
              Risk Level Index
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
            {/* Circular Gauge Visualizer */}
            <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-[#EAE5DC]"
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8.5"
                  fill="none"
                />
                {hasEvaluation && (
                  <circle
                    className="transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    r="38"
                    stroke={strokeColor}
                    strokeWidth="8.5"
                    fill="none"
                    strokeDasharray="238.76"
                    strokeDashoffset={238.76 * (1 - (safePercent || 0) / 100)}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold tracking-tight text-[#111110] leading-none">
                  {hasEvaluation && safePercent !== null ? `${safePercent}%` : '—'}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#8A857D] mt-1">
                  {hasEvaluation ? riskLevel : 'NO DATA'}
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed text-center sm:text-left">
              {hasEvaluation ? (
                <p>
                  {totalHigh > 0
                    ? `${totalHigh} high and ${totalMed} medium risk liabilities flagged across ${totalEvaluated} analyzed agreement${totalEvaluated === 1 ? '' : 's'}.`
                    : totalMed > 0
                    ? `${totalMed} moderate risk items identified across ${totalEvaluated} analyzed file${totalEvaluated === 1 ? '' : 's'}.`
                    : `All active clauses balanced and standard protective terms maintained.`}
                </p>
              ) : (
                <p>
                  Upload contracts to see your risk profile, common issues, and suggested improvements.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Recent Insights (RECENT INSIGHTS) */}
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#111110]">
                RECENT INSIGHTS
              </span>
              <span className="w-4 h-[2px] bg-[#D92228]" aria-hidden="true" />
            </div>
          </div>

          {hasInsights && latestInsight ? (
            <div className="mt-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-[#111110]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-normal text-base sm:text-[18px] text-[#111110] truncate tracking-tight">
                    {latestInsight.title}
                  </h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                    latestInsight.severity === 'high'
                      ? 'bg-[#FCE4DF] text-[#A83224]'
                      : 'bg-[#FFF0D8] text-[#92530C]'
                  }`}>
                    {latestInsight.severity}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed mt-1 line-clamp-2">
                  {latestInsight.explanation || latestInsight.whyRisky}
                </p>
                {latestInsightDocId && (
                  <button
                    onClick={() => onNavigate('results', latestInsightDocId)}
                    className="mt-3 text-xs font-semibold text-[#111110] hover:text-[#716B63] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review in contract</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 mt-6">
              <div className="w-9 h-9 rounded-md bg-[#F0ECE4] flex items-center justify-center text-[#111110] shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-[#111110]" />
              </div>
              <div>
                <h4 className="font-display font-normal text-base sm:text-[18px] text-[#111110] tracking-tight">
                  No insights yet
                </h4>
                <p className="text-xs sm:text-[13px] text-[#716B63] leading-relaxed mt-1 font-sans">
                  Analyze a contract to see key risks, suggestions, and negotiation opportunities here.
                </p>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* Global Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};
