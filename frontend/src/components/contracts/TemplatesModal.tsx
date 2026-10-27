import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CONTRACT_TEMPLATES } from '../../data/sampleContracts';
import { ContractTemplate } from '../../types/contract';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ContractTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFDFA] border border-[#E6E0D6] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E6E0D6] flex items-center justify-between bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1C1B19] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E1EFE4]" />
            </div>
            <div>
              <h2 className="font-display text-xl text-[#1D1B18] font-normal tracking-tight">
                Lawyer-Vetted Contract Templates
              </h2>
              <p className="text-xs text-[#716B63]">
                Pre-calibrated standard agreements with fair freelance protections built in.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#979087] hover:text-[#1D1B18] hover:bg-[#EAE5DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTRACT_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-xl border border-[#E6E0D6] bg-white hover:border-[#1C1B19] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-[#716B63] bg-[#F0ECE4] px-2 py-0.5 rounded">
                      {tpl.category}
                    </span>
                    <span className="text-[#979087] font-mono text-[11px]">{tpl.fileSize} • {tpl.estimatedPages} pages</span>
                  </div>
                  <h3 className="font-medium text-sm text-[#1D1B18] group-hover:text-black">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-[#716B63] mt-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tpl.standardClauses.map((clause, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] text-[#286344] bg-[#E1EFE4] px-2 py-0.5 rounded font-medium">
                        <Check className="w-2.5 h-2.5" />
                        {clause}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E6E0D6]/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#716B63] group-hover:text-[#1D1B18]">Ready to analyze</span>
                  <button
                    onClick={() => {
                      onSelectTemplate(tpl);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1B19] text-white text-xs font-medium hover:bg-[#34312C] transition-colors shadow-sm"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F4EE] border-t border-[#E6E0D6] flex items-center justify-between text-xs text-[#716B63]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#286344]" />
            <span>All templates vetted against US, UK & EU commercial standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#E6E0D6] bg-white text-[#1D1B18] hover:bg-[#F0ECE4] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
