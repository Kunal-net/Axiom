import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('landing');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F4EE]/95 backdrop-blur-xs border-b border-[#E6E0D6]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: AXIOM Wordmark */}
        <div 
          onClick={() => {
            onNavigate('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <span className="font-display text-2xl font-bold tracking-[0.06em] text-[#111110]">
            AXIOM
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button 
            onClick={() => handleLinkClick('product-demo')}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#716B63] hover:text-[#111110] transition-colors cursor-pointer"
          >
            Product
          </button>
          <button 
            onClick={() => handleLinkClick('use-cases')}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#716B63] hover:text-[#111110] transition-colors cursor-pointer"
          >
            Use Cases
          </button>
          <button 
            onClick={() => handleLinkClick('clause-comparison')}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#716B63] hover:text-[#111110] transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button 
            onClick={() => handleLinkClick('features')}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#716B63] hover:text-[#111110] transition-colors cursor-pointer"
          >
            Security
          </button>
          <button 
            onClick={() => handleLinkClick('faq')}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#716B63] hover:text-[#111110] transition-colors cursor-pointer"
          >
            Resources
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => onNavigate('signin')}
            className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#111110] hover:opacity-70 transition-opacity cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className="bg-[#111110] text-[#FFFFFF] text-[11px] font-semibold tracking-[0.14em] uppercase px-4 py-2 hover:bg-[#262624] transition-colors flex items-center gap-2 group cursor-pointer shadow-xs"
          >
            <span>Analyze a Contract</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-3">
          <button
            onClick={() => onNavigate('analyze')}
            className="bg-[#111110] text-[#FFFFFF] text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5"
          >
            Analyze
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#111110]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E6E0D6] bg-[#F7F4EE] px-6 py-5 flex flex-col gap-4">
          <button 
            onClick={() => handleLinkClick('product-demo')}
            className="text-left text-xs font-semibold tracking-[0.14em] uppercase text-[#716B63] py-1 border-b border-[#E6E0D6]/60"
          >
            Product
          </button>
          <button 
            onClick={() => handleLinkClick('use-cases')}
            className="text-left text-xs font-semibold tracking-[0.14em] uppercase text-[#716B63] py-1 border-b border-[#E6E0D6]/60"
          >
            Use Cases
          </button>
          <button 
            onClick={() => handleLinkClick('clause-comparison')}
            className="text-left text-xs font-semibold tracking-[0.14em] uppercase text-[#716B63] py-1 border-b border-[#E6E0D6]/60"
          >
            Pricing
          </button>
          <button 
            onClick={() => handleLinkClick('features')}
            className="text-left text-xs font-semibold tracking-[0.14em] uppercase text-[#716B63] py-1 border-b border-[#E6E0D6]/60"
          >
            Security
          </button>
          <button 
            onClick={() => handleLinkClick('faq')}
            className="text-left text-xs font-semibold tracking-[0.14em] uppercase text-[#716B63] py-1 border-b border-[#E6E0D6]/60"
          >
            Resources
          </button>
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('signin');
              }}
              className="text-xs font-semibold tracking-[0.14em] uppercase text-[#111110]"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('analyze');
              }}
              className="bg-[#111110] text-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase px-4 py-2"
            >
              Analyze a Contract →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
