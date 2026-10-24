import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DoubleBezel } from '../components/ui/DoubleBezel';
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
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

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
    } catch {
      setIsAnalyzing(false);
      setErrorMessage('Analysis was interrupted. Please try again.');
    }
  };

  const handleSampleSelect = (sampleName: string, sizeMB: number) => {
    const fakeFile = new File(['sample contract content'], sampleName, { type: 'application/pdf' });
    setSelectedFile(fakeFile);
    startAnalysis({ name: sampleName, size: sizeMB * 1024 * 1024 });
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E0D6]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">New Analysis Run</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
          Analyze Contract
        </h1>
        <p className="text-sm text-[#716B63] mt-1 max-w-2xl">
          Upload any client contract to uncover indemnities, intellectual property traps, and non-standard payment obligations in seconds.
        </p>
      </div>

      {/* Main Upload Double-Bezel Card */}
      <DoubleBezel padding="md" className="max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 space-y-8">
          {/* If actively processing */}
          {isAnalyzing ? (
            <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1C1B19] text-white flex items-center justify-center mx-auto shadow-md">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">Analyzing Agreement</h3>
                <p className="text-xs text-[#716B63] mt-1">{selectedFile?.name}</p>
              </div>

              {/* Progress Bar & Stage Status */}
              <div className="space-y-3">
                <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1C1B19] h-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#716B63]">
                  <span className="font-medium text-[#1D1B18]">{currentStage}</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
              </div>

              {/* Real checkpoints list */}
              <div className="bg-[#F7F4EE] rounded-xl p-4 border border-[#E6E0D6] text-left text-xs space-y-2.5">
                <div className={`flex items-center gap-2 ${progressPercent >= 25 ? 'text-[#286344] font-medium' : 'text-[#979087]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Enclave security handshake established</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 55 ? 'text-[#286344] font-medium' : 'text-[#979087]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Document parsed & clauses indexed by section</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 85 ? 'text-[#286344] font-medium' : 'text-[#979087]'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Liability caps, IP rights & payment terms benchmarked</span>
                </div>
                <div className={`flex items-center gap-2 ${progressPercent >= 100 ? 'text-[#286344] font-medium' : 'text-[#979087]'}`}>
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
                className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all select-none ${dragActive
                    ? 'border-[#1C1B19] bg-[#F0ECE4]/70 scale-[0.99]'
                    : 'border-[#E6E0D6] bg-[#F7F4EE]/60 hover:bg-[#F0ECE4]/40 hover:border-[#716B63]'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-[#FFFDFA] border border-[#E6E0D6] text-[#1D1B18] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <UploadCloud className="w-7 h-7 text-[#1C1B19]" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal">
                  Drop your contract here, or <span className="underline decoration-[#716B63] underline-offset-4">browse</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#716B63] mt-2 max-w-sm mx-auto leading-relaxed">
                  Upload PDF or DOCX agreement. Up to 25 MB per document.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-xs text-[#286344] bg-[#E1EFE4] px-3 py-1 rounded-full border border-[#C6DFC9]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-Data Retention Policy Applied</span>
                </div>
              </div>

              {/* Selected File Card if user picked a file */}
              {selectedFile && (
                <div className="p-4 rounded-xl bg-[#F0ECE4] border border-[#E6E0D6] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FFFDFA] border border-[#E6E0D6] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#1C1B19]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#1D1B18] truncate">{selectedFile.name}</div>
                      <div className="text-xs text-[#716B63]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => startAnalysis(selectedFile)}
                    >
                      Start Analysis →
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-[#FCE4DF] border border-[#F7C6BE] text-xs text-[#A83224] flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Sample Contracts Instant Test */}
              <div className="pt-4 border-t border-[#E6E0D6]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Don't have a contract handy?</span>
                  <span className="text-xs text-[#716B63]">1-Click Instant Test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSampleSelect('Master Services Agreement - FinTech Co.pdf', 1.4)}
                    className="p-3.5 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] hover:border-[#1C1B19] text-left transition-all group"
                  >
                    <div className="text-xs font-medium text-[#1D1B18] group-hover:underline truncate">
                      Master Services Agreement
                    </div>
                    <div className="text-[11px] text-[#716B63] mt-1 flex items-center justify-between">
                      <span>Apex FinTech</span>
                      <span className="text-[#A83224] font-medium">2 High Risks</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSampleSelect('Mutual Non-Disclosure Agreement - CyberSec.pdf', 0.5)}
                    className="p-3.5 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] hover:border-[#1C1B19] text-left transition-all group"
                  >
                    <div className="text-xs font-medium text-[#1D1B18] group-hover:underline truncate">
                      Mutual NDA Agreement
                    </div>
                    <div className="text-[11px] text-[#716B63] mt-1 flex items-center justify-between">
                      <span>CyberSec Systems</span>
                      <span className="text-[#286344] font-medium">Standard</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSampleSelect('Software Development SOW v2.docx', 0.9)}
                    className="p-3.5 rounded-xl bg-[#FFFDFA] border border-[#E6E0D6] hover:border-[#1C1B19] text-left transition-all group"
                  >
                    <div className="text-xs font-medium text-[#1D1B18] group-hover:underline truncate">
                      Software Development SOW
                    </div>
                    <div className="text-[11px] text-[#716B63] mt-1 flex items-center justify-between">
                      <span>Agency Client</span>
                      <span className="text-[#92530C] font-medium">1 High Risk</span>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </DoubleBezel>
    </div>
  );
};
