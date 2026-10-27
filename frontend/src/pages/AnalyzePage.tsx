import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { contractService } from '../services/contractService';

interface AnalyzePageProps {
  onNavigate: (route: string, docId?: string) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
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

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Invalid file format. Please upload a PDF or Word document (.docx).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25 MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const startAnalysis = async (fileToAnalyze: { name: string; size: number }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const doc = await contractService.analyzeDocument(fileToAnalyze, (stage, percent) => {
        setCurrentStage(stage);
        setProgressPercent(percent);
      });
      // Transition to results screen
      setTimeout(() => {
        onNavigate('results', doc.id);
      }, 400);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      const msg = err instanceof Error ? err.message : 'Analysis was interrupted. Please try again.';
      setErrorMessage(`Live analysis failed: ${msg}`);
    }
  };

  return (
    <div className="w-full bg-[#F7F4EE] text-[#1D1B18] px-6 sm:px-8 lg:px-9 py-6 lg:py-8 max-w-[1240px] xl:max-w-[1280px] mx-auto select-none min-h-[calc(100vh-56px)]">
      {/* ========================================================================= */}
      {/* 1. EDITORIAL PAGE HEADER                                                  */}
      {/* ========================================================================= */}
      <div className="pb-6 border-b border-[#E6E0D6] mb-8">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#111110]">
            NEW ANALYSIS RUN
          </span>
          <span className="w-5 h-[2px] bg-[#D92228]" aria-hidden="true" />
        </div>

        <h1 className="font-display text-[42px] sm:text-[48px] lg:text-[52px] font-normal tracking-[-0.03em] text-[#111110] leading-[1.05] mb-2.5">
          Analyze Contract
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#57534E] max-w-[620px] font-sans leading-relaxed">
          Upload any client contract to uncover indemnities, intellectual property traps, and non-standard payment obligations in seconds.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. RESTRUCTURED UPLOAD INTERFACE (CLEAN PROPORTIONATE WORKSPACE)          */}
      {/* ========================================================================= */}
      <div className="max-w-[960px]">
        <div className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-md p-6 sm:p-10 shadow-xs">
          {/* Actively Analyzing State */}
          {isAnalyzing ? (
            <div className="py-10 px-4 max-w-lg mx-auto text-center space-y-6">
              <div className="w-14 h-14 rounded-md bg-[#111110] text-[#F7F4EE] flex items-center justify-center mx-auto shadow-xs">
                <Loader2 className="w-7 h-7 animate-spin text-[#F7F4EE]" />
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#111110] font-normal tracking-tight">
                  Analyzing Agreement
                </h2>
                <p className="text-xs font-mono text-[#716B63] mt-1.5 truncate max-w-md mx-auto">
                  {selectedFile?.name || 'Uploaded Document'}
                </p>
              </div>

              {/* Progress Bar & Stage Status */}
              <div className="space-y-2.5">
                <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#111110] h-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#716B63]">
                  <span className="font-medium text-[#111110]">{currentStage}</span>
                  <span className="font-mono text-[#111110]">{progressPercent}%</span>
                </div>
              </div>

              {/* Real Checkpoints List */}
              <div className="bg-[#F7F4EE] rounded-md p-4 border border-[#E6E0D6] text-left text-xs space-y-2.5">
                <div className={`flex items-center gap-2.5 ${progressPercent >= 25 ? 'text-[#286344] font-medium' : 'text-[#8A857D]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Enclave security handshake established</span>
                </div>
                <div className={`flex items-center gap-2.5 ${progressPercent >= 55 ? 'text-[#286344] font-medium' : 'text-[#8A857D]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Document parsed & clauses indexed by section</span>
                </div>
                <div className={`flex items-center gap-2.5 ${progressPercent >= 85 ? 'text-[#286344] font-medium' : 'text-[#8A857D]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Liability caps, IP rights & payment terms benchmarked</span>
                </div>
                <div className={`flex items-center gap-2.5 ${progressPercent >= 100 ? 'text-[#286344] font-medium' : 'text-[#8A857D]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Plain-English counter-proposals synthesized</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Dropzone Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed transition-all cursor-pointer select-none rounded-md p-10 sm:p-16 text-center ${
                  dragActive
                    ? 'border-[#111110] bg-[#F0ECE4] scale-[0.995]'
                    : 'border-[#D4CDC3] bg-[#F7F4EE]/40 hover:bg-[#F0ECE4]/50 hover:border-[#111110]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-md bg-[#FFFDFA] border border-[#E6E0D6] text-[#111110] flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <UploadCloud className="w-6 h-6 text-[#111110]" />
                </div>

                <h2 className="font-display text-2xl sm:text-3xl text-[#111110] font-normal tracking-tight mb-2">
                  Drop your contract here, or <span className="underline decoration-[#716B63] underline-offset-4 hover:text-[#111110]">browse</span>
                </h2>
                <p className="text-xs sm:text-[14px] text-[#716B63] max-w-md mx-auto leading-relaxed">
                  Upload PDF or DOCX agreement. Up to 25 MB per document.
                </p>

                {/* Restrained secondary privacy note */}
                <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#716B63]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A857D]" />
                  <span>Encrypted in transit · Zero-data retention policy applied</span>
                </div>
              </div>

              {/* Staged Selected File Card */}
              {selectedFile && (
                <div className="p-4 mt-6 rounded-md bg-[#F7F4EE] border border-[#E6E0D6] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-[#FFFDFA] border border-[#E6E0D6] flex items-center justify-center shrink-0 text-[#111110]">
                      <FileText className="w-5 h-5 text-[#111110]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#111110] truncate">{selectedFile.name}</div>
                      <div className="text-xs text-[#716B63]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-[#716B63] hover:text-[#111110] hover:underline px-2.5 py-1.5 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => startAnalysis(selectedFile)}
                      className="px-5 py-2.5 bg-[#111110] text-[#FFFFFF] text-xs font-medium tracking-wide hover:bg-[#262624] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <span>Start Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 mt-4 rounded-md bg-[#FCE4DF] border border-[#F7C6BE] text-xs text-[#A83224] flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
