import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  FileText, 
  AlertTriangle, 
  Columns, 
  Sparkles,
  Search,
  Sliders,
  ChevronDown,
  X,
  Shield,
  Layers,
  Briefcase,
  Users,
  Compass,
  Plus,
  Minus,
  Check,
  Copy
} from 'lucide-react';
import { HeroRedRibbon, FaqRedRibbon, CtaRedRibbon } from '../components/ui/BrandRibbon';

interface LandingPageProps {
  onNavigate: (route: string, docId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Interactive Demo State (Section C)
  const [activeInspectorTab, setActiveInspectorTab] = useState<'risk' | 'suggestions' | 'citations'>('risk');
  const [showRewriteInDemo, setShowRewriteInDemo] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);

  // Section F (Original vs. Proposed) Clause Copy State
  const [copiedClause, setCopiedClause] = useState(false);

  // Section H (FAQ) Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  const handleCopyClause = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  // FAQ items (Section H)
  const faqs = [
    {
      q: 'Does Axiom replace a lawyer?',
      a: 'No. Axiom is an AI contract intelligence platform designed for issue spotting, plain-English clause translation, and commercial risk detection. It equips freelancers and studio founders to identify one-sided terms before signing or redlining, but does not provide formal attorney-client privileged legal representation.'
    },
    {
      q: 'Are my documents private?',
      a: 'Yes. Axiom enforces a strict Zero-Data-Retention architecture. Your uploaded agreements are processed in secure isolated enclaves and are never used to train public language models or third-party AI systems.'
    },
    {
      q: 'What types of contracts can I analyze?',
      a: 'Axiom accepts PDF and DOCX files, as well as pasted text. It is specifically calibrated for Master Services Agreements (MSAs), Statements of Work (SOWs), Independent Contractor Agreements, Consulting Retainers, and Non-Disclosure Agreements (NDAs).'
    },
    {
      q: 'How accurate is the analysis?',
      a: 'Axiom evaluates clauses against empirical commercial contracting standards for creative and technology professionals. Every risk flag includes precise document citations and why the term may be hazardous, minimizing false positives.'
    },
    {
      q: 'Can I export reports?',
      a: 'Yes. You can copy individual suggested counter-proposals with a single click, or export a comprehensive, structured PDF Audit Report to present to your client or legal counsel.'
    }
  ];

  return (
    <div className="w-full bg-[#F7F4EE] text-[#1D1B18] selection:bg-[#1C1B19] selection:text-white overflow-x-hidden font-sans">

      {/* ========================================================================= */}
      {/* SECTION B — EDITORIAL HERO (MATCHING IMAGE A)                             */}
      {/* ========================================================================= */}
      <section className="relative border-b border-[#E6E0D6] overflow-hidden bg-[#F7F4EE]">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-12 divide-x divide-[#E6E0D6]/60 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12" aria-hidden="true">
          <div className="col-span-1 h-full" />
          <div className="col-span-6 h-full" />
          <div className="col-span-3 h-full" />
          <div className="col-span-2 h-full" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 w-full pt-8 sm:pt-10 pb-12 sm:pb-16 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
            
            {/* Left Column: Hero Typography & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between pr-0 lg:pr-6">
              <div>
                {/* Top subtitle snippet placed above the right end of the headline */}
                <div className="flex items-center justify-end mb-6 sm:mb-8">
                  <p className="text-xs sm:text-[13px] text-[#57534E] max-w-[260px] text-left font-sans leading-relaxed">
                    Contract intelligence<br />
                    for independent<br />
                    professionals.
                  </p>
                </div>

                {/* Massive 3-Line Display Headline */}
                <h1 className="font-display text-[46px] sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-normal tracking-[-0.035em] leading-[0.93] text-[#111110] uppercase mb-8 select-none">
                  <span className="block">UNDERSTAND</span>
                  <span className="block whitespace-nowrap">
                    YOUR CONTR
                    <span className="relative inline-block text-[#111110]">
                      A
                      {/* Red origami delta shard cutting across the right leg of A */}
                      <svg
                        className="absolute top-[22px] sm:top-[28px] lg:top-[34px] -right-3.5 sm:-right-4 lg:-right-5 w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 pointer-events-none z-10"
                        viewBox="0 0 32 32"
                        fill="none"
                        aria-hidden="true"
                      >
                        <polygon
                          points="2,20 30,2 14,24"
                          fill="#D92228"
                        />
                      </svg>
                    </span>
                    CTS
                  </span>
                  <span className="block">BEFORE YOU SIGN.</span>
                </h1>

                {/* Supporting Copy */}
                <p className="text-sm sm:text-base text-[#57534E] max-w-xl font-sans leading-relaxed mb-8">
                  Axiom analyzes, compares, and explains complex agreements in plain English — so you can spot risks, understand your rights, and negotiate with confidence.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <button
                  onClick={() => onNavigate('analyze')}
                  className="bg-[#111110] text-[#FFFFFF] text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase px-7 py-3.5 sm:py-4 hover:bg-[#262624] transition-all flex items-center gap-3 cursor-pointer group shadow-xs"
                >
                  <span>Analyze a Contract</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('product-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-transparent border border-[#111110] text-[#111110] text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase px-6 py-3.5 sm:py-4 hover:bg-[#111110]/5 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <span>See Example</span>
                  <div className="w-5 h-5 rounded-full border border-[#111110] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-3 h-3 text-[#111110]" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Image & Dynamic Red Ribbon Motif */}
            <div className="lg:col-span-5 relative min-h-[440px] sm:min-h-[500px] flex flex-col justify-between border-l border-[#E6E0D6] pl-0 lg:pl-8">
              
              {/* Classical Column Architectural Photo at top right with diagonal cut sloping up to the right */}
              <div className="relative w-full flex justify-end">
                <div 
                  className="relative w-52 sm:w-64 md:w-72 h-68 sm:h-80 md:h-88 overflow-hidden border border-[#E6E0D6] shadow-xs"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 96%)' }}
                >
                  <img
                    src="/images/column.jpg"
                    alt="Classical Corinthian column"
                    className="w-full h-full object-cover filter grayscale contrast-125"
                  />
                  
                  {/* Floating Inset Badge: CLEARER CONTRACTS BRIGHTER CREATIVES */}
                  <div className="absolute top-4 left-4 bg-[#FFFDFA] border border-[#111110] px-3.5 py-2.5 text-center shadow-xs">
                    <div className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] leading-tight text-[#111110]">
                      Clearer<br />
                      Contracts<br />
                      Brighter<br />
                      Creatives
                    </div>
                  </div>
                </div>
              </div>

              {/* Giant Red Origami Ribbon overlapping column and pointing left */}
              <div className="absolute -top-3 -left-20 sm:-left-24 lg:-left-32 w-[135%] h-[120%] pointer-events-none z-20">
                <HeroRedRibbon className="w-full h-full object-contain" />
              </div>

              {/* Editorial Steps & Wordmark on Lower Right Grid */}
              <div className="relative z-30 pt-8 mt-auto flex items-end justify-between border-t border-[#E6E0D6]">
                <div className="space-y-1.5 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase text-[#111110]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#8A857D]">01</span>
                    <span>Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#8A857D]">02</span>
                    <span>Understand</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#8A857D]">03</span>
                    <span>Negotiate</span>
                  </div>
                </div>

                <div className="font-display font-bold text-sm tracking-[0.14em] text-[#111110] pr-6">
                  AXIOM
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION C — PRODUCT DEMONSTRATION ("A CLOSER LOOK")                        */}
      {/* ========================================================================= */}
      <section id="product-demo" className="relative border-b border-[#E6E0D6] py-14 sm:py-20 bg-[#F7F4EE]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-4 pl-4 border-l border-[#111110]/30 space-y-5">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#716B63] block">
                A CLOSER LOOK
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-[#111110] leading-[1.08]">
                See how Axiom<br />
                analyzes your<br />
                contract.
              </h2>
              
              <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed font-sans max-w-sm">
                Upload a contract and get clause-by-clause analysis with clear explanations, risk flags, and suggested rewrites.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('analyze')}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#111110] pb-1 border-b border-[#111110] hover:opacity-70 transition-all cursor-pointer group"
                >
                  <span>Try a Sample Contract</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Product UI Mockup matching IMAGE A */}
            <div className="lg:col-span-8 relative">
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-xl shadow-whisper overflow-hidden">
                
                {/* Contract Window Header */}
                <div className="border-b border-[#E6E0D6] px-4 py-2.5 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
                  {/* Left branding & document name */}
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-sm tracking-wider text-[#111110]">
                      AXIOM
                    </span>
                    <span className="text-[#D0C8BC]">‹</span>
                    <span className="font-medium text-[#111110] text-[11px] truncate max-w-[200px] sm:max-w-none">
                      Freelance Design Agreement.pdf
                    </span>
                  </div>

                  {/* Center viewer controls */}
                  <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-sans text-[#716B63]">
                    <span>2 / 12</span>
                    <span className="text-[#D0C8BC]">|</span>
                    <span>− 100% +</span>
                    <Search className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-[#111110]" />
                    <Sliders className="w-3.5 h-3.5 cursor-pointer hover:text-[#111110]" />
                  </div>

                  {/* Right inspector tabs */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveInspectorTab('risk')}
                      className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                        activeInspectorTab === 'risk' ? 'border-[#111110] text-[#111110] font-semibold' : 'border-transparent text-[#716B63] hover:text-[#111110]'
                      }`}
                    >
                      Risk Analysis
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('suggestions')}
                      className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                        activeInspectorTab === 'suggestions' ? 'border-[#111110] text-[#111110] font-semibold' : 'border-transparent text-[#716B63] hover:text-[#111110]'
                      }`}
                    >
                      Suggestions
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('citations')}
                      className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                        activeInspectorTab === 'citations' ? 'border-[#111110] text-[#111110] font-semibold' : 'border-transparent text-[#716B63] hover:text-[#111110]'
                      }`}
                    >
                      Citations
                    </button>
                    <button
                      onClick={() => onNavigate('results')}
                      className="p-1 text-[#8A857D] hover:text-[#111110]"
                      title="Open full workspace"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Workspace Body: 3-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
                  
                  {/* Left Navigation Sidebar (Col 1-2) */}
                  <div className="hidden md:block md:col-span-3 border-r border-[#E6E0D6] bg-[#FAF8F5] p-3 text-xs font-sans space-y-1">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E1EFE4] text-[#286344] font-medium rounded-md">
                      <FileText className="w-3.5 h-3.5 text-[#286344]" />
                      <span>Summary</span>
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 text-[#57534E] hover:bg-[#FFFFFF]/60 cursor-pointer rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D92228]" />
                        <span>Risks</span>
                      </div>
                      <span className="bg-[#FFF0D8] text-[#92530C] text-[10px] font-bold px-1.5 py-0.2 rounded-full">6</span>
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 text-[#57534E] hover:bg-[#FFFFFF]/60 cursor-pointer rounded-md">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#8A857D]" />
                        <span>Terms</span>
                      </div>
                      <span className="bg-[#EAE5DC] text-[#57534E] text-[10px] font-medium px-1.5 py-0.2 rounded-full">12</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 text-[#57534E] hover:bg-[#FFFFFF]/60 cursor-pointer rounded-md">
                      <Columns className="w-3.5 h-3.5 text-[#8A857D]" />
                      <span>Comparison</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 text-[#57534E] hover:bg-[#FFFFFF]/60 cursor-pointer rounded-md">
                      <Sparkles className="w-3.5 h-3.5 text-[#8A857D]" />
                      <span>Suggestions</span>
                    </div>
                  </div>

                  {/* Document Viewer (Col 3-7) */}
                  <div className="md:col-span-5 p-5 sm:p-6 font-serif text-[13px] leading-relaxed border-r border-[#E6E0D6] bg-[#FFFFFF] relative">
                    <h3 className="font-sans font-bold text-sm text-[#111110] mb-3">
                      4. Payment and Invoicing
                    </h3>
                    
                    <p className="mb-3 text-[#33312E]">
                      <strong className="font-sans font-semibold text-[#111110]">4.1 Fees.</strong> The Client shall pay the Freelancer a fixed fee of ₹2,00,000 for the services described in this Agreement.
                    </p>

                    {/* Highlighted Net 60 Clause with peach highlight and orange comment bubble */}
                    <div className="relative mb-3 p-2.5 bg-[#FFF2E0] border border-[#FCD9B8] rounded-xs transition-all">
                      <p className="text-[#111110] text-[12.5px] leading-relaxed pr-6">
                        <strong className="font-sans font-semibold text-[#111110]">4.2 Payment Terms.</strong> Payment shall be made within 60 days of invoice receipt. All amounts are non-refundable except as required by law.
                      </p>
                      {/* Orange comment flag icon on the right with arrow */}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-6 h-6 bg-[#C4841D] text-white rounded-xs flex items-center justify-center shadow-xs">
                        <FileText className="w-3 h-3" />
                      </div>
                    </div>

                    <p className="mb-3 text-[#33312E]">
                      <strong className="font-sans font-semibold text-[#111110]">4.3 Invoicing.</strong> The Freelancer shall issue invoices at the milestones set out in Exhibit A. Invoices shall include a detailed description of the work performed.
                    </p>

                    <p className="text-[#33312E]">
                      <strong className="font-sans font-semibold text-[#111110]">4.4 Late Payments.</strong> If payment is more than 15 days overdue, the Freelancer may charge interest at a rate of 1.5% per month on the overdue amount.
                    </p>

                    {/* Subtle column image background on right side */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 opacity-15 overflow-hidden pointer-events-none">
                      <img src="/images/column.jpg" alt="" className="w-full h-full object-cover filter grayscale" />
                    </div>
                  </div>

                  {/* Inspector Panel (Col 8-12) */}
                  <div className="md:col-span-4 p-5 bg-[#FAF8F5] flex flex-col justify-between font-sans">
                    {activeInspectorTab === 'risk' && (
                      <div className="space-y-3.5">
                        {/* Risk severity badge & Category dropdown */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D6]">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A83224] bg-[#FCE4DF] px-2 py-0.5 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A83224]" />
                            High Risk
                          </span>
                          
                          <div className="flex items-center gap-1 text-[11px] text-[#716B63]">
                            <span>Payment Terms</span>
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Finding title in serif */}
                        <h4 className="font-display text-lg font-normal text-[#111110] leading-snug">
                          Unfavorable payment period
                        </h4>

                        {/* Plain English explanation */}
                        <p className="text-[11px] text-[#57534E] leading-relaxed">
                          The payment period of 60 days is longer than the industry standard (typically 15–30 days for freelance agreements) and may cause cash flow issues. The non-refundable clause further increases your risk if the project is canceled or significantly reduced.
                        </p>

                        {/* Why this matters callout box */}
                        <div className="bg-[#FCE4DF]/70 border border-[#F7C6BE] rounded-sm p-3 text-[11px] space-y-1.5">
                          <span className="font-bold text-[#A83224] text-[10px] uppercase tracking-wide block">
                            Why this matters
                          </span>
                          <ul className="space-y-1 text-[#7F1D1D] text-[11px]">
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#A83224]" />
                              Delays your cash flow
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#A83224]" />
                              Increases financial risk
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#A83224]" />
                              Limits your ability to recover costs
                            </li>
                          </ul>
                        </div>

                        {/* Toggle Suggested Rewrite */}
                        {showRewriteInDemo && (
                          <div className="bg-[#E1EFE4] border border-[#C6DFC9] rounded-sm p-3 text-xs space-y-2 mt-2">
                            <span className="font-bold text-[#286344] text-[10px] uppercase tracking-wide flex items-center justify-between">
                              <span>Suggested Alternative</span>
                              <Check className="w-3 h-3 text-[#286344]" />
                            </span>
                            <p className="text-[#1D1B18] font-serif text-[12px] leading-snug">
                              "Payment shall be made within 15 days of invoice receipt. Fees are refundable for work not yet performed, except for expenses reasonably incurred and approved in advance."
                            </p>
                            <button
                              onClick={() => handleCopyRewrite("Payment shall be made within 15 days of invoice receipt. Fees are refundable for work not yet performed, except for expenses reasonably incurred and approved in advance.")}
                              className="text-[10px] font-bold tracking-wider uppercase text-[#286344] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedDemo ? 'Copied!' : 'Copy Suggestion'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeInspectorTab === 'suggestions' && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#286344] bg-[#E1EFE4] px-2 py-0.5 rounded-sm inline-block">
                          Counter-Proposal Ready
                        </span>
                        <h4 className="font-display text-base font-normal text-[#111110]">
                          15-Day Net Payment Schedule
                        </h4>
                        <p className="text-[11px] text-[#57534E] leading-relaxed">
                          Recommended standard commercial language used by independent contractors to guarantee timely compensation and mutual milestone sign-offs.
                        </p>
                      </div>
                    )}

                    {activeInspectorTab === 'citations' && (
                      <div className="space-y-3 text-[11px] text-[#57534E]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#716B63] block">
                          Legal Benchmark Citations
                        </span>
                        <p>• Model Freelance Agreement §4.2 (Creative Guild 2025)</p>
                        <p>• Prompt Payment Standards for Independent Tech Professionals</p>
                      </div>
                    )}

                    {/* Bottom Action inside Inspector */}
                    <div className="pt-3 border-t border-[#E6E0D6] mt-3">
                      <button
                        onClick={() => setShowRewriteInDemo(!showRewriteInDemo)}
                        className="w-full bg-[#111110] text-[#FFFFFF] text-[11px] font-semibold tracking-[0.1em] uppercase py-2.5 px-3 hover:bg-[#262624] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{showRewriteInDemo ? 'Hide Suggested Rewrite' : 'Show Suggested Rewrite'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION D — HOW IT WORKS ("FROM CONFUSION TO CONFIDENCE")                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative bg-[#111110] text-[#FFFFFF] py-14 sm:py-20 border-b border-[#262624]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#8A857D] block">
                HOW IT WORKS
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-normal tracking-tight text-[#FFFFFF] leading-[1.06]">
                From confusion<br />to confidence.
              </h2>
              
              <p className="text-xs sm:text-[13px] text-[#A8A29E] leading-relaxed font-sans max-w-xs pt-1">
                A simple process to understand your contracts and negotiate better.
              </p>
            </div>

            {/* Right: Three Editorial Numbered Process Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#262624]">
              
              {/* Step 01 */}
              <div className="py-5 md:py-0 md:px-7 first:pl-0 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-5xl sm:text-6xl font-light text-[#FFFFFF]">
                      01
                    </span>
                    <div className="flex items-center gap-3 text-[#8A857D]">
                      <FileText className="w-4 h-4 text-[#FFFFFF]" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#716B63]" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.16em] text-[#FFFFFF] mb-1.5">
                    REVIEW
                  </h3>

                  <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                    Upload your contract (PDF, DOC, or paste text).
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full border border-[#262624] flex items-center justify-center text-[#8A857D] mt-4">
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>

              {/* Step 02 */}
              <div className="py-5 md:py-0 md:px-7 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-5xl sm:text-6xl font-light text-[#FFFFFF]">
                      02
                    </span>
                    <div className="flex items-center gap-3 text-[#8A857D]">
                      <Shield className="w-4 h-4 text-[#FFFFFF]" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#716B63]" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.16em] text-[#FFFFFF] mb-1.5">
                    UNDERSTAND
                  </h3>

                  <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                    Axiom detects risks, explains complex terms, and highlights unfair clauses.
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full border border-[#262624] flex items-center justify-center text-[#8A857D] mt-4">
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>

              {/* Step 03 */}
              <div className="py-5 md:py-0 md:px-7 last:pr-0 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-5xl sm:text-6xl font-light text-[#FFFFFF]">
                      03
                    </span>
                    <div className="flex items-center gap-3 text-[#8A857D]">
                      <Sparkles className="w-4 h-4 text-[#FFFFFF]" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.16em] text-[#FFFFFF] mb-1.5">
                    NEGOTIATE
                  </h3>

                  <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                    Get clear suggestions and counter-proposals you can use with confidence.
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full border border-[#262624] flex items-center justify-center text-[#8A857D] mt-4">
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION E — PRODUCT FEATURES ("BUILT FOR REAL CONTRACTS")                 */}
      {/* 4 Cards in a Single Row matching IMAGE A                                   */}
      {/* ========================================================================= */}
      <section id="features" className="relative bg-[#F7F4EE] py-14 sm:py-20 border-b border-[#E6E0D6]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Editorial Header */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#716B63] block">
                POWERFUL FEATURES
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#111110] leading-[1.08]">
                Built for real<br />contracts.
              </h2>
              
              <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed font-sans max-w-xs pt-1">
                Axiom gives you the same contract intelligence used by legal professionals — tailored for freelancers, creators, and small studios.
              </p>
            </div>

            {/* Right: FOUR CARDS IN A SINGLE HORIZONTAL ROW */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Feature 1 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-4 sm:p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-7 h-7 rounded-sm bg-[#E1EFE4] flex items-center justify-center text-[#286344]">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Clause Explanations
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Understand complex legal jargon in plain English.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-10 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/engraving.jpg" alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-4 sm:p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-7 h-7 rounded-sm bg-[#FFF0D8] flex items-center justify-center text-[#92530C]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Hidden Trap Detection
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Identify unfair terms, ambiguous language, and missing protections.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('results')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-10 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/facade.jpg" alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-4 sm:p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-7 h-7 rounded-sm bg-[#E1EFE4] flex items-center justify-center text-[#286344]">
                    <Columns className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Side-by-Side Comparison
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Compare multiple versions and see exactly what changed.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('compare')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-10 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/column.jpg" alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-4 sm:p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-7 h-7 rounded-sm bg-[#E5EBF5] flex items-center justify-center text-[#365B91]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Counter-Proposals
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Get AI-generated counter-proposals you can edit and use.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-10 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/engraving.jpg" alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION F — ORIGINAL VS. PROPOSED CLAUSE ("BETTER TERMS. REAL RESULTS.")  */}
      {/* ========================================================================= */}
      <section id="clause-comparison" className="relative bg-[#F7F4EE] py-14 sm:py-20 border-b border-[#E6E0D6] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Heading Column */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#716B63] block">
                ORIGINAL VS. PROPOSED
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#111110] leading-[1.08]">
                Better terms.<br />Real results.
              </h2>
              
              <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed font-sans max-w-xs pt-1">
                See how Axiom turns risky clauses into fair, balanced language.
              </p>
            </div>

            {/* Center: Two Comparison Panels Side by Side */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                
                {/* 1. Original Clause Panel */}
                <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#D92228] text-white flex items-center justify-center font-bold text-[10px]">
                        −
                      </span>
                      <span className="text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-[#111110]">
                        Original Clause
                      </span>
                    </div>

                    <div className="font-serif text-[13px] leading-relaxed text-[#1D1B18] pt-1">
                      <span className="text-[#8A857D] font-mono mr-1.5">›</span>
                      Payment shall be made{' '}
                      <span className="bg-[#FCE4DF] text-[#A83224] px-1 py-0.5 line-through decoration-[#A83224]">
                        within 60 days of invoice receipt. All amounts are non-refundable except as required by law.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Axiom's Proposed Rewrite Panel */}
                <div className="border border-[#C6DFC9] bg-[#FFFFFF] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#286344] text-white flex items-center justify-center font-bold text-[10px]">
                          +
                        </span>
                        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-[#111110]">
                          Axiom's Proposed Rewrite
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyClause("Payment shall be made within 15 days of invoice receipt. Fees are refundable for work not yet performed, except for expenses reasonably incurred and approved in advance.")}
                        className="text-[10px] font-sans font-semibold tracking-wider uppercase text-[#286344] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Copy rewrite"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedClause ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="font-serif text-[13px] leading-relaxed text-[#1D1B18] pt-1">
                      <span className="text-[#8A857D] font-mono mr-1.5">›</span>
                      Payment shall be made{' '}
                      <span className="bg-[#E1EFE4] text-[#286344] px-1 py-0.5 font-medium">
                        within 15 days of invoice receipt. Fees are refundable for work not yet performed, except for expenses reasonably incurred and approved in advance.
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Corinthian Column Photo along Right Edge */}
            <div className="hidden lg:block lg:col-span-2 relative h-48 sm:h-56">
              <div 
                className="w-full h-full overflow-hidden border border-[#E6E0D6] shadow-xs"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
              >
                <img
                  src="/images/column.jpg"
                  alt="Column architectural motif"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION G — WHO AXIOM IS FOR ("PEOPLE WHO BUILD CULTURE")                 */}
      {/* ========================================================================= */}
      <section id="use-cases" className="relative bg-[#F7F4EE] py-14 sm:py-20 border-b border-[#E6E0D6]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Heading + Facade Photo underneath */}
            <div className="lg:col-span-3 space-y-4">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#716B63] block">
                BUILT FOR INDEPENDENT PROFESSIONALS
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#111110] leading-[1.08]">
                Made for<br />
                the people who<br />
                build culture.
              </h2>

              {/* Architectural building facade photo */}
              <div className="w-full h-32 overflow-hidden border border-[#E6E0D6] shadow-xs rounded-xs mt-3">
                <img 
                  src="/images/facade.jpg" 
                  alt="Neoclassical architecture facade" 
                  className="w-full h-full object-cover filter grayscale contrast-110" 
                />
              </div>
            </div>

            {/* Right: Three Persona Cards in a Single Row */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Persona 1 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-sm border border-[#E6E0D6] bg-[#FAF8F5] flex items-center justify-center text-[#111110]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Freelancers
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Designers, developers, writers, and consultants.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-12 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/column.jpg" alt="" className="w-full h-full object-cover filter grayscale opacity-60" />
                  </div>
                </div>
              </div>

              {/* Persona 2 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-sm border border-[#E6E0D6] bg-[#FAF8F5] flex items-center justify-center text-[#111110]">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Creative Studios
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Small teams and agencies working with clients.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-12 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/engraving.jpg" alt="" className="w-full h-full object-cover filter grayscale opacity-60" />
                  </div>
                </div>
              </div>

              {/* Persona 3 */}
              <div className="border border-[#E6E0D6] bg-[#FFFFFF] rounded-md p-5 flex flex-col justify-between hover:border-[#111110] transition-colors group shadow-2xs">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-sm border border-[#E6E0D6] bg-[#FAF8F5] flex items-center justify-center text-[#111110]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-normal text-base text-[#111110]">
                    Agency Founders
                  </h3>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Founders managing client contracts at scale.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate('analyze')}
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111110] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <div className="mt-3 h-12 w-full overflow-hidden border border-[#E6E0D6] rounded-xs">
                    <img src="/images/facade.jpg" alt="" className="w-full h-full object-cover filter grayscale opacity-60" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION H — FREQUENTLY ASKED QUESTIONS (FAQ)                              */}
      {/* ========================================================================= */}
      <section id="faq" className="relative bg-[#F7F4EE] py-14 sm:py-20 border-b border-[#E6E0D6] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Header */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[11px] font-sans font-bold tracking-[0.18em] uppercase text-[#716B63] block">
                FAQ
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#111110] leading-[1.08]">
                Frequently<br />Asked Questions.
              </h2>
            </div>

            {/* Center: Editorial Accordion List */}
            <div className="lg:col-span-6 divide-y divide-[#E6E0D6] border-t border-b border-[#E6E0D6]">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.q} className="py-3.5">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left py-1 font-sans text-xs sm:text-[13px] text-[#111110] hover:text-[#57534E] transition-colors cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className="w-5 h-5 flex items-center justify-center text-[#111110] shrink-0">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pt-2 pb-2.5 pr-6 text-xs text-[#57534E] leading-relaxed font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Architectural Column & Rising Red Origami Dart */}
            <div className="hidden lg:block lg:col-span-3 relative h-64 sm:h-72">
              <div className="absolute inset-0 overflow-hidden border border-[#E6E0D6]">
                <img
                  src="/images/column.jpg"
                  alt="Column capital"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
              </div>
              <div className="absolute -bottom-8 -left-10 w-44 h-44 pointer-events-none z-10">
                <FaqRedRibbon className="w-full h-full" />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION I — FINAL CALL TO ACTION ("NEVER SIGN AN UNFAIR CONTRACT AGAIN.") */}
      {/* ========================================================================= */}
      <section className="relative bg-[#111110] text-[#FFFFFF] py-14 sm:py-20 overflow-hidden border-b border-[#262624]">
        {/* Dynamic red ribbon accent rising from the bottom right */}
        <div className="absolute -bottom-10 -right-6 w-72 h-56 pointer-events-none z-0">
          <CtaRedRibbon className="w-full h-full" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center justify-between">
            
            {/* Left: Headline */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#D92228] block">
                GET STARTED TODAY
              </span>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-normal uppercase tracking-tight text-[#FFFFFF] leading-[1.02]">
                NEVER SIGN AN UNFAIR<br />CONTRACT AGAIN.
              </h2>
            </div>

            {/* Right: Supporting Copy & Action Buttons */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <p className="text-xs sm:text-[13px] text-[#A8A29E] leading-relaxed font-sans max-w-md">
                Join thousands of independent professionals who use Axiom to review, understand, and negotiate better contracts.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onNavigate('analyze')}
                  className="bg-[#FFFFFF] text-[#111110] text-xs font-semibold tracking-[0.14em] uppercase px-6 sm:px-7 py-3 hover:bg-[#EAE5DC] transition-colors flex items-center gap-2 cursor-pointer group shadow-sm"
                >
                  <span>Analyze a Contract</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('product-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-transparent border border-[#FFFFFF] text-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase px-5 py-3 hover:bg-[#FFFFFF]/10 transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <span>See Example</span>
                  <div className="w-4 h-4 rounded-full border border-[#FFFFFF] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-2.5 h-2.5 text-[#FFFFFF]" />
                  </div>
                </button>
              </div>

              {/* Tagline */}
              <div className="text-[10px] font-sans font-bold tracking-[0.22em] uppercase text-[#8A857D] pt-3 border-t border-[#262624]">
                INDEPENDENT BY DESIGN
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
