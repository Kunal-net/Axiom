import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-8 max-w-7xl mx-auto">
      <nav className="glass-warm rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-whisper">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1C1B19] flex items-center justify-center text-[#F7F4EE] shadow-sm transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 22h20L12 2Z" />
              <circle cx="12" cy="15" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl font-normal tracking-tight text-[#1D1B18]">Axiom</span>
            <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#716B63] px-1.5 py-0.5 rounded bg-[#EAE5DC] hidden sm:inline-block">Legal-Tech</span>
          </div>
        </div>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#716B63]">
          <a href="#how-it-works" className="hover:text-[#1D1B18] transition-colors">How it works</a>
          <a href="#interactive-demo" className="hover:text-[#1D1B18] transition-colors">Live Preview</a>
          <a href="#features" className="hover:text-[#1D1B18] transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-[#1D1B18] transition-colors">Use Cases</a>
          <a href="#faq" className="hover:text-[#1D1B18] transition-colors">FAQ</a>
        </div>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('dashboard')}
          >
            Sign In
          </Button>
          <Button
            variant="nested"
            onClick={() => onNavigate('analyze')}
          >
            Analyze a Contract
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 p-5 rounded-2xl glass-warm shadow-elevation border border-[#E6E0D6] flex flex-col gap-3">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#716B63] hover:text-[#1D1B18] py-2 border-b border-[#E6E0D6]/60"
          >
            How it works
          </a>
          <a
            href="#interactive-demo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#716B63] hover:text-[#1D1B18] py-2 border-b border-[#E6E0D6]/60"
          >
            Live Preview
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#716B63] hover:text-[#1D1B18] py-2 border-b border-[#E6E0D6]/60"
          >
            Features
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-[#716B63] hover:text-[#1D1B18] py-2 border-b border-[#E6E0D6]/60"
          >
            FAQ
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard');
              }}
            >
              Sign In to Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('analyze');
              }}
            >
              Analyze a Contract Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
