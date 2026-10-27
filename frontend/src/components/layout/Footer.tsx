import React from 'react';

const CURRENT_YEAR = 2026;

interface FooterProps {
  onNavigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E6E0D6] bg-[#F7F4EE] pt-12 pb-10 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E6E0D6]">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-display text-2xl font-bold tracking-[0.06em] text-[#111110] block">
              AXIOM
            </span>
            <p className="text-xs text-[#57534E] leading-relaxed max-w-xs font-sans">
              Contract intelligence for independent professionals.
            </p>
          </div>

          {/* Product Navigation */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111110]">Product</h4>
            <ul className="space-y-1.5 text-xs text-[#57534E]">
              <li><button onClick={() => onNavigate?.('analyze')} className="hover:text-[#111110] transition-colors cursor-pointer">Features</button></li>
              <li><button onClick={() => onNavigate?.('compare')} className="hover:text-[#111110] transition-colors cursor-pointer">Use Cases</button></li>
              <li><button onClick={() => onNavigate?.('results')} className="hover:text-[#111110] transition-colors cursor-pointer">Pricing</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111110]">Resources</h4>
            <ul className="space-y-1.5 text-xs text-[#57534E]">
              <li><button onClick={() => onNavigate?.('report')} className="hover:text-[#111110] transition-colors cursor-pointer">Guides</button></li>
              <li><button onClick={() => onNavigate?.('analyze')} className="hover:text-[#111110] transition-colors cursor-pointer">Templates</button></li>
              <li><a href="#faq" className="hover:text-[#111110] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111110]">Company</h4>
            <ul className="space-y-1.5 text-xs text-[#57534E]">
              <li><a href="#product-demo" className="hover:text-[#111110] transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-[#111110] transition-colors">Security</a></li>
              <li><a href="mailto:contact@axiom-intel.local" className="hover:text-[#111110] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Socials & Copyright */}
          <div className="md:col-span-2 space-y-3 flex flex-col justify-between items-start md:items-end">
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-[#111110]">
              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <div className="text-[11px] text-[#716B63]">
              © {CURRENT_YEAR} Axiom. All rights reserved.
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#716B63]">
              <a href="#faq" className="hover:text-[#111110] transition-colors">Privacy</a>
              <span>•</span>
              <a href="#faq" className="hover:text-[#111110] transition-colors">Terms</a>
              <span>•</span>
              <a href="#faq" className="hover:text-[#111110] transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
