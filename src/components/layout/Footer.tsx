import React from 'react';

const CURRENT_YEAR = 2026;

interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E6E0D6] bg-[#F7F4EE] pt-16 pb-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#E6E0D6]/70">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1C1B19] flex items-center justify-center text-[#F7F4EE]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 22h20L12 2Z" />
                  <circle cx="12" cy="15" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-normal text-[#1D1B18]">Axiom</span>
            </div>
            <p className="text-sm text-[#716B63] max-w-sm leading-relaxed">
              Intelligent contract analysis and plain-English risk detection for independent designers, software engineers, and creative agencies.
            </p>
            <div className="text-xs text-[#979087]">
              Built with precision. Designed with restraint.
            </div>
          </div>

          {/* Product Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1B18]">Product</h4>
            <ul className="space-y-2 text-sm text-[#716B63]">
              <li><button onClick={() => onNavigate?.('analyze')} className="hover:text-[#1D1B18] transition-colors">Clause Analyzer</button></li>
              <li><button onClick={() => onNavigate?.('compare')} className="hover:text-[#1D1B18] transition-colors">Contract Comparison</button></li>
              <li><button onClick={() => onNavigate?.('results')} className="hover:text-[#1D1B18] transition-colors">Evidence Workspace</button></li>
              <li><button onClick={() => onNavigate?.('report')} className="hover:text-[#1D1B18] transition-colors">Legal Audit Reports</button></li>
              <li><button onClick={() => onNavigate?.('dashboard')} className="hover:text-[#1D1B18] transition-colors">Document Dashboard</button></li>
            </ul>
          </div>

          {/* Guides & Freelancers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1B18]">Freelance Shield</h4>
            <ul className="space-y-2 text-sm text-[#716B63]">
              <li><a href="#features" className="hover:text-[#1D1B18] transition-colors">Indemnity Red Flags</a></li>
              <li><a href="#features" className="hover:text-[#1D1B18] transition-colors">Work for Hire Pitfalls</a></li>
              <li><a href="#features" className="hover:text-[#1D1B18] transition-colors">Net 30 vs Net 90</a></li>
              <li><a href="#features" className="hover:text-[#1D1B18] transition-colors">Non-Compete Limits</a></li>
            </ul>
          </div>

          {/* Security & Enclave */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1D1B18]">Confidentiality</h4>
            <ul className="space-y-2 text-sm text-[#716B63]">
              <li><span className="text-[#1D1B18] font-medium">Zero-Data Training</span></li>
              <li><span className="text-xs text-[#716B63]">Your contracts are never used to train frontier LLM models.</span></li>
              <li className="pt-2"><span className="text-xs text-[#716B63]">AES-256 in transit & at rest</span></li>
              <li><span className="text-xs text-[#716B63]">SOC2 Type II aligned</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-[#979087] leading-relaxed max-w-2xl">
            <strong>Legal Disclaimer:</strong> Axiom provides AI-assisted contract analysis for informational purposes only. It does not provide legal advice, attorney-client privileged counsel, or replace formal review by a qualified legal professional licensed in your jurisdiction.
          </p>
          <div className="text-xs text-[#979087] whitespace-nowrap">
            © {CURRENT_YEAR} Axiom Intelligence Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
