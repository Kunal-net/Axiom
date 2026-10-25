import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  FileSearch,
  Scale
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/RiskBadge';
import { DoubleBezel } from '../components/ui/DoubleBezel';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Interactive Live Contract Preview State
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [copiedRevision, setCopiedRevision] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const demoClauses = [
    {
      title: 'Unlimited Indemnification',
      tag: 'Section 9.1 • Liability',
      severity: 'high' as const,
      rawLegalese: 'Contractor shall defend, indemnify, and hold harmless Client and affiliates against any and all claims, liabilities, losses, damages, costs, and expenses (including attorney\'s fees, consequential, and punitive damages) arising out of Contractor\'s deliverables or breach of any representation.',
      plainEnglish: 'You are agreeing to pay all of the client\'s lawsuits, legal bills, and lost profits out of your own pocket without any dollar limit—even for minor unintended mistakes.',
      whyRisky: 'A single bug or delay could result in the client suing you for hundreds of thousands of dollars in consequential damages, far exceeding what they paid you.',
      revisedClause: 'Each party shall indemnify the other against direct third-party claims arising from gross negligence or willful misconduct, provided Contractor\'s aggregate liability shall be capped at the total fees paid under this Statement of Work.'
    },
    {
      title: 'Broad Pre-Existing IP Assignment',
      tag: 'Section 6.2 • Intellectual Property',
      severity: 'high' as const,
      rawLegalese: 'Contractor hereby irrevocably assigns and transfers to Client all right, title, and interest in and to all Work Product, including all background technologies, pre-existing code libraries, and foundational tools incorporated therein, without reservation.',
      plainEnglish: 'The client is attempting to seize ownership of your pre-existing code libraries, UI kits, design templates, and workflow scripts that you created before ever meeting them.',
      whyRisky: 'You would legally forfeit the right to use your own reusable toolchain or starter kits with any other future clients.',
      revisedClause: 'Client receives an exclusive, perpetual license to the custom final deliverables upon full payment. Contractor explicitly retains full ownership of all pre-existing tools, code libraries, templates, and generic background know-how.'
    },
    {
      title: 'Net 90 Day Payment Lag',
      tag: 'Section 4.3 • Compensation',
      severity: 'medium' as const,
      rawLegalese: 'Client shall remit payment within ninety (90) days following formal acceptance of deliverables. Client reserves the right to withhold any disputed portion without interest or penalty pending internal audit.',
      whyRisky: 'You are forced to act as an interest-free bank for 3 months, and the client can withhold entire milestone payouts without paying interest while running vague "audits".',
      plainEnglish: 'Payment is delayed for three full months, and any payment dispute allows the client to freeze your invoice without late penalty.',
      revisedClause: 'Client shall pay all undisputed invoices within thirty (30) days of invoice date. Overdue amounts shall accrue interest at 1.5% per month. Disputed portions must be formally documented within 10 business days.'
    }
  ];

  const currentDemo = demoClauses[activeDemoIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRevision(true);
    setTimeout(() => setCopiedRevision(false), 2000);
  };

  const faqs = [
    {
      q: 'Does Axiom replace the need for a qualified contract attorney?',
      a: 'No. Axiom is an AI contract intelligence tool designed for preliminary review and issue spotting. It highlights dangerous terms, uncapped liabilities, and unfavorable payment conditions so you can make informed decisions and ask your client for redlines, but it does not provide formal legal representation.'
    },
    {
      q: 'Are my uploaded contracts used to train public AI models?',
      a: 'Never. Axiom operates under a strict Zero-Data-Retention privacy policy. Documents are processed in isolated enclaves and are never fed into training sets for public language models.'
    },
    {
      q: 'What types of documents can I analyze?',
      a: 'Axiom accepts PDF and DOCX files. It is specifically calibrated for Master Services Agreements (MSAs), Statements of Work (SOWs), Non-Disclosure Agreements (NDAs), Consulting Retainers, and Freelance Independent Contractor Agreements.'
    },
    {
      q: 'How does Axiom detect contract risks?',
      a: 'Axiom evaluates clauses against standard commercial contracting benchmarks for independent professionals. It flags extreme terms such as unilateral indemnities, perpetual non-competes, unlimited liability, delayed payment schedules, and overreaching intellectual property transfers.'
    },
    {
      q: 'Can I compare two versions of the same contract?',
      a: 'Yes. Axiom\'s Document Comparison engine performs side-by-side legal diffing, categorizing changes into inserted terms, deleted protections, and potential contractual conflicts rather than just simple text changes.'
    },
    {
      q: 'Can I export redline counter-proposals?',
      a: 'Yes. You can copy individual suggested revisions with one click or export a structured PDF Analysis Report to share with your client or legal counsel.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1D1B18] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-24 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE5DC] text-[#716B63] text-xs font-medium mb-8 border border-[#E6E0D6]">
          <span className="w-2 h-2 rounded-full bg-[#286344]"></span>
          <span>AI Contract Intelligence for Independent Professionals</span>
        </div>

        {/* 2-Line Newsreader Editorial Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1D1B18] max-w-5xl mx-auto leading-[1.05] mb-6">
          Understand your contracts <span className="italic font-normal">before</span> you sign.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#716B63] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Axiom analyzes, compares, and explains complex agreements in plain English—unmasking uncapped indemnities, IP traps, and delayed payment terms before they cost you.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            variant="nested"
            size="lg"
            onClick={() => onNavigate('analyze')}
            className="w-full sm:w-auto"
          >
            Analyze a Contract Free
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('results')}
            className="w-full sm:w-auto text-[#1D1B18]"
          >
            Explore Sample Analysis
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#716B63] pt-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#286344]" />
            <span>Zero-Data Model Training</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#286344]" />
            <span>Plain-English Counter-Proposals</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#286344]" />
            <span>Instant PDF & DOCX Parsing</span>
          </div>
        </div>

        {/* 2. LIVE INTERACTIVE CONTRACT INSPECTOR (Hero Experience) */}
        <div id="interactive-demo" className="mt-16 text-left">
          <DoubleBezel padding="md" className="max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header with selector tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6E0D6]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Live Interactive Preview</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E1EFE4] text-[#286344]">Click to Test</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] mt-1">See how Axiom decodes red-flag contract terms</h3>
                </div>

                {/* Clause selector tabs */}
                <div className="flex flex-wrap gap-2">
                  {demoClauses.map((clause, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveDemoIndex(idx);
                        setCopiedRevision(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeDemoIndex === idx
                          ? 'bg-[#1C1B19] text-white shadow-sm'
                          : 'bg-[#F0ECE4] text-[#716B63] hover:text-[#1D1B18] hover:bg-[#EAE5DC]'
                      }`}
                    >
                      {clause.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Content: Raw Contract Clause vs Axiom Intelligence */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Original Legal Document Clause */}
                <div className="bg-[#F7F4EE] rounded-xl p-5 border border-[#E6E0D6] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-medium text-[#716B63]">{currentDemo.tag}</span>
                      <span className="text-[11px] text-[#979087] uppercase tracking-wider font-semibold">Original Clause</span>
                    </div>
                    <blockquote className="text-sm font-serif italic text-[#1D1B18] leading-relaxed bg-[#FFFDFA] p-4 rounded-lg border border-[#E6E0D6]/80">
                      "{currentDemo.rawLegalese}"
                    </blockquote>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E6E0D6]/80 flex items-center justify-between text-xs text-[#979087]">
                    <span>Source: Standard Client Draft v1</span>
                    <span className="text-amber-800 font-medium">Flagged by Axiom Engine</span>
                  </div>
                </div>

                {/* Right: Axiom Plain-English Breakdown & Counter-Clause */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <RiskBadge severity={currentDemo.severity} />
                    <span className="text-xs text-[#716B63]">Plain-English Translation</span>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <p className="text-sm text-[#1D1B18] font-medium leading-snug">
                      {currentDemo.plainEnglish}
                    </p>
                    <p className="text-xs text-[#A83224] bg-[#FCE4DF]/60 p-2.5 rounded-lg border border-[#F7C6BE]/60">
                      <strong>Why this matters:</strong> {currentDemo.whyRisky}
                    </p>
                  </div>

                  {/* Suggested Revision Box */}
                  <div className="bg-[#FFFDFA] rounded-xl p-4 border border-[#E6E0D6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#286344] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recommended Counter-Proposal
                      </span>
                      <button
                        onClick={() => handleCopy(currentDemo.revisedClause)}
                        className="inline-flex items-center gap-1 text-xs text-[#716B63] hover:text-[#1D1B18] font-medium px-2 py-1 rounded hover:bg-[#F0ECE4] transition-colors"
                      >
                        {copiedRevision ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#286344]" />
                            <span className="text-[#286344]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Revision</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#1D1B18] font-sans leading-relaxed bg-[#F7F4EE] p-3 rounded-lg border border-[#E6E0D6]/60">
                      {currentDemo.revisedClause}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#E6E0D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#716B63]">
                <span>Want to analyze your own agreement right now?</span>
                <Button 
                  size="sm" 
                  variant="primary"
                  onClick={() => onNavigate('analyze')}
                >
                  Upload Your Contract PDF →
                </Button>
              </div>
            </div>
          </DoubleBezel>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6 sm:px-12 bg-[#F0ECE4]/60 border-y border-[#E6E0D6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">Three-Step Clarity</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1D1B18] mt-2 mb-4">
              From confusing legal jargon to confident negotiation
            </h2>
            <p className="text-sm sm:text-base text-[#716B63]">
              Axiom acts as your independent commercial review board, giving you clear answers in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6E0D6] shadow-whisper relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1C1B19] text-white flex items-center justify-center font-serif text-lg mb-5">
                  1
                </div>
                <h3 className="font-serif text-xl text-[#1D1B18] mb-2">Upload Agreement</h3>
                <p className="text-sm text-[#716B63] leading-relaxed">
                  Drop any client contract, NDA, or SOW (PDF or DOCX). Axiom processes documents in an isolated, encrypted enclave.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6]/70 text-xs font-mono text-[#979087]">
                Supported: PDF, DOCX • Max 25 MB
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6E0D6] shadow-whisper relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1C1B19] text-white flex items-center justify-center font-serif text-lg mb-5">
                  2
                </div>
                <h3 className="font-serif text-xl text-[#1D1B18] mb-2">Inspect Risk Findings</h3>
                <p className="text-sm text-[#716B63] leading-relaxed">
                  Axiom highlights high-risk terms directly on the contract sheet, providing plain-English explanations and risk scoring.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6]/70 text-xs font-mono text-[#979087]">
                Categorized: Liability, IP, Payment, Termination
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFFDFA] rounded-2xl p-7 border border-[#E6E0D6] shadow-whisper relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1C1B19] text-white flex items-center justify-center font-serif text-lg mb-5">
                  3
                </div>
                <h3 className="font-serif text-xl text-[#1D1B18] mb-2">Copy Fair Redlines</h3>
                <p className="text-sm text-[#716B63] leading-relaxed">
                  Export structured audit reports and copy balanced counter-clauses with a single click to paste into your client reply.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E6E0D6]/70 text-xs font-mono text-[#979087]">
                Export: PDF Report, Redline Markdown
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC FEATURES SECTION (Gapless Bento Grid) */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">Core Capabilities</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1D1B18] mt-2 mb-4">
            Engineered for freelance protection
          </h2>
          <p className="text-sm sm:text-base text-[#716B63]">
            Standard legal tools are built for enterprise law departments. Axiom is purpose-built to defend independent professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: 7-col wide */}
          <div className="md:col-span-7 bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6E0D6] shadow-whisper flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#E5EBF5] text-[#365B91] flex items-center justify-center">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-[#1D1B18]">Deep Clause-by-Clause Citation</h3>
              <p className="text-sm text-[#716B63] leading-relaxed">
                Axiom doesn't make vague summaries. It pins every finding to the exact page, section, and verbatim sentence of your contract. Click any finding to instantly jump to its highlighted source.
              </p>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6] flex items-center justify-between text-xs text-[#716B63]">
              <span className="font-medium text-[#1D1B18]">Evidence-first verification</span>
              <span className="text-[#286344] font-semibold">100% cited to original text</span>
            </div>
          </div>

          {/* Card 2: 5-col */}
          <div className="md:col-span-5 bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6E0D6] shadow-whisper flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCE4DF] text-[#A83224] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-[#1D1B18]">Hidden Trap Detection</h3>
              <p className="text-sm text-[#716B63] leading-relaxed">
                Flags uncapped consequential damages, unilateral moral rights forfeitures, 2-year non-competes, and payment withholding terms.
              </p>
            </div>
            <div className="mt-8 flex gap-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#FCE4DF] text-[#A83224] font-medium border border-[#F7C6BE]">Indemnities</span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#FFF0D8] text-[#92530C] font-medium border border-[#F5DEC2]">Net 90 Traps</span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#E1EFE4] text-[#286344] font-medium border border-[#C6DFC9]">IP Assignment</span>
            </div>
          </div>

          {/* Card 3: 5-col */}
          <div className="md:col-span-5 bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6E0D6] shadow-whisper flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0D8] text-[#92530C] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-[#1D1B18]">Side-by-Side Version Diff</h3>
              <p className="text-sm text-[#716B63] leading-relaxed">
                Compare your original contract against the client's redline draft. Spot added sneak obligations and deleted protections instantly.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E6E0D6] flex items-center justify-between text-xs text-[#716B63]">
              <span>Synchronized 2-pane view</span>
              <Button size="sm" variant="ghost" onClick={() => onNavigate('compare')}>Try Diff Tool →</Button>
            </div>
          </div>

          {/* Card 4: 7-col wide */}
          <div className="md:col-span-7 bg-[#FFFDFA] rounded-2xl p-8 border border-[#E6E0D6] shadow-whisper flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#E1EFE4] text-[#286344] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl text-[#1D1B18]">Ready-to-Paste Counter-Proposals</h3>
              <p className="text-sm text-[#716B63] leading-relaxed">
                Don't just discover that a term is unfair—get the exact legal language to replace it. Balanced clauses drafted to protect your business while preserving goodwill with your client.
              </p>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6] text-xs text-[#1D1B18] font-mono">
              "Contractor retains full ownership of pre-existing background code..."
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREELANCE DISCIPLINES / USE CASES */}
      <section id="use-cases" className="py-20 px-6 sm:px-12 bg-[#F0ECE4]/40 border-t border-[#E6E0D6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">Who Uses Axiom</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D1B18] mt-2">
              Tailored for independent creators
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper">
              <h4 className="font-serif text-xl text-[#1D1B18] mb-2">Software Engineers</h4>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Defend your reusable starter kits, CLI tools, and architecture code. Never surrender your proprietary dev stack under generic work-for-hire clauses.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper">
              <h4 className="font-serif text-xl text-[#1D1B18] mb-2">Designers & Creatives</h4>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Protect your design systems, Figma component kits, and portfolio display rights. Ensure client IP transfer only occurs after final milestone clearance.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFDFA] border border-[#E6E0D6] shadow-whisper">
              <h4 className="font-serif text-xl text-[#1D1B18] mb-2">Agency Founders</h4>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Quickly audit client-provided master agreements. Eliminate 90-day payment delays, unilateral termination traps, and onerous liability exposures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#716B63]">Questions & Answers</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1D1B18] mt-2 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#716B63]">
            Everything you need to know about Axiom's security, privacy, and analysis methodology.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div 
                key={index}
                className="bg-[#FFFDFA] rounded-2xl border border-[#E6E0D6] overflow-hidden transition-all shadow-whisper"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none hover:bg-[#F0ECE4]/40 transition-colors"
                >
                  <span className="font-serif text-lg sm:text-xl text-[#1D1B18] font-normal">{faq.q}</span>
                  <div className="w-7 h-7 rounded-full bg-[#F0ECE4] text-[#1D1B18] flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#716B63] leading-relaxed border-t border-[#E6E0D6]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PRE-FOOTER CTA SECTION */}
      <section className="py-20 px-6 sm:px-12 bg-[#1C1B19] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Risk Contract Shield</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            Never sign an unfair contract in the dark again.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Upload your agreement now and receive a plain-English risk breakdown with counter-proposals in under 60 seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('analyze')}
              className="bg-[#F7F4EE] text-[#1D1B18] hover:bg-white"
            >
              Analyze Your Contract Free →
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('dashboard')}
              className="border-stone-700 text-stone-200 hover:bg-stone-800"
            >
              Go to Workspace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
