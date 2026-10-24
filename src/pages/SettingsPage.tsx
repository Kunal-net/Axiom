import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Check, 
  Upload, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Key, 
  Database,
  RefreshCw,
  Info
} from 'lucide-react';
import { contractService } from '../services/contractService';
import { UserProfile } from '../types/contract';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'Profile' | 'Preferences' | 'Plan & Usage' | 'Security'>('Profile');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [selectedSensitivity, setSelectedSensitivity] = useState<'standard' | 'strict' | 'relaxed'>('standard');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    contractService.getUserProfile().then((p) => {
      setProfile(p);
      setSelectedSensitivity(p.riskSensitivity);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated = await contractService.updateUserProfile({
      ...profile,
      riskSensitivity: selectedSensitivity
    });
    setProfile(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    }
  };

  if (!profile) return null;

  return (
    <div className="w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 pb-2 border-b border-[#E6E0D6]/60">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
            Workspace Preferences
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] tracking-tight font-normal">
            Settings
          </h1>
          <p className="text-xs text-[#716B63] max-w-xl">
            Manage your account credentials, workspace defaults, and review preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0ECE4] shadow-sm border border-[#E6E0D6]">
            <span className="w-2 h-2 rounded-full bg-[#286344] animate-pulse"></span>
            <span className="text-[11px] font-medium text-[#1D1B18] tracking-wide">
              Workspace Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-8 bg-[#F0ECE4]/50 px-6 py-2.5 rounded-xl shadow-sm border border-[#E6E0D6]/60 text-xs font-medium">
        {(['Profile', 'Preferences', 'Plan & Usage', 'Security'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative py-2 transition-colors ${
              activeTab === tab
                ? 'text-[#1D1B18] font-semibold'
                : 'text-[#716B63] hover:text-[#1D1B18]'
            }`}
          >
            <span>{tab}</span>
            {activeTab === tab && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#1C1B19] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Analytical Sensitivity (~65% / 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Form Card */}
          <form onSubmit={handleUpdate} className="bg-[#FFFDFA] rounded-xl p-8 shadow-sm border border-[#E6E0D6] flex flex-col gap-8">
            {/* Section Title */}
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl text-[#1D1B18] font-normal">
                Profile information
              </h2>
              <p className="text-xs text-[#716B63]">
                Update your photo, identification, and analytical sensitivity presets.
              </p>
            </div>

            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F0ECE4]/60 border border-[#E6E0D6]/60">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full bg-[#1C1B19] text-white flex items-center justify-center font-serif text-2xl font-medium shadow-sm">
                  <span>{profile.name.charAt(0) || 'K'}</span>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#286344] rounded-full ring-2 ring-[#FFFDFA]"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#1D1B18]">Profile photo</span>
                  <span className="text-[11px] text-[#979087]">JPG, PNG or WEBP under 2MB</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-[#FFFDFA] hover:bg-[#F0ECE4] text-[#1D1B18] text-xs font-medium transition-colors shadow-sm border border-[#E6E0D6] flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change avatar</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('Default avatar active')}
                  className="p-2 rounded-lg bg-[#FFFDFA] hover:bg-[#FCE4DF] text-[#716B63] hover:text-[#A83224] transition-colors shadow-sm border border-[#E6E0D6]"
                  title="Remove avatar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#1D1B18]" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#F0ECE4]/40 focus:bg-[#FFFDFA] px-4 py-2.5 rounded-lg text-[#1D1B18] transition-all outline-none border border-[#E6E0D6] focus:border-[#1C1B19] shadow-sm"
                />
              </div>

              {/* Email Address with Verified Pill */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-[#1D1B18]" htmlFor="email">
                    Email address
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E1EFE4] text-[#286344] text-[10px] font-semibold border border-[#C6DFC9]">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#F0ECE4]/40 focus:bg-[#FFFDFA] px-4 py-2.5 rounded-lg text-[#1D1B18] transition-all outline-none border border-[#E6E0D6] focus:border-[#1C1B19] shadow-sm"
                />
              </div>

              {/* Role / Profession */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#1D1B18]" htmlFor="role">
                  Role / Profession
                </label>
                <select
                  id="role"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-[#F0ECE4]/40 focus:bg-[#FFFDFA] px-4 py-2.5 rounded-lg text-[#1D1B18] transition-all outline-none border border-[#E6E0D6] focus:border-[#1C1B19] shadow-sm cursor-pointer"
                >
                  <option>Freelancer / Independent Consultant</option>
                  <option>Corporate Legal Counsel</option>
                  <option>Paralegal / Legal Operations</option>
                  <option>Procurement Specialist</option>
                  <option>Founder / Executive</option>
                </select>
              </div>

              {/* Organization */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-[#1D1B18]" htmlFor="org">
                    Organization
                  </label>
                  <span className="text-[10px] text-[#979087]">Optional</span>
                </div>
                <input
                  id="org"
                  type="text"
                  value={profile.organization}
                  onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  className="w-full bg-[#F0ECE4]/40 focus:bg-[#FFFDFA] px-4 py-2.5 rounded-lg text-[#1D1B18] transition-all outline-none border border-[#E6E0D6] focus:border-[#1C1B19] shadow-sm"
                />
              </div>
            </div>

            {/* Risk Sensitivity Configuration */}
            <div className="flex flex-col gap-4 pt-2 border-t border-[#E6E0D6]/60">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[#1D1B18]">
                    Preferred contract risk sensitivity
                  </h3>
                  <Info className="w-3.5 h-3.5 text-[#979087]" />
                </div>
                <p className="text-xs text-[#716B63]">
                  Determines how aggressively the intelligence engine flags ambiguous clauses.
                </p>
              </div>

              {/* 3 Option Cards (Radio-style selection) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Standard Option */}
                <div
                  onClick={() => setSelectedSensitivity('standard')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col justify-between gap-3 shadow-sm border ${
                    selectedSensitivity === 'standard'
                      ? 'bg-[#F0ECE4] border-[#1C1B19]'
                      : 'bg-[#F0ECE4]/40 border-[#E6E0D6] hover:bg-[#F0ECE4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1D1B18]">Standard</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedSensitivity === 'standard' ? 'bg-[#1C1B19] text-white' : 'opacity-0'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs text-[#716B63] leading-relaxed">
                    Balanced flags for liability, IP, and payment cycles. Recommended.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-6 rounded-full bg-[#286344]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#92530C]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#E6E0D6]"></span>
                  </div>
                </div>

                {/* Strict Option */}
                <div
                  onClick={() => setSelectedSensitivity('strict')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col justify-between gap-3 shadow-sm border ${
                    selectedSensitivity === 'strict'
                      ? 'bg-[#F0ECE4] border-[#1C1B19]'
                      : 'bg-[#F0ECE4]/40 border-[#E6E0D6] hover:bg-[#F0ECE4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1D1B18]">Strict</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedSensitivity === 'strict' ? 'bg-[#1C1B19] text-white' : 'opacity-0'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs text-[#716B63] leading-relaxed">
                    Maximum caution. Scans every unilateral phrasing & indemnities.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-6 rounded-full bg-[#A83224]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#A83224]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#A83224]"></span>
                  </div>
                </div>

                {/* Relaxed Option */}
                <div
                  onClick={() => setSelectedSensitivity('relaxed')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col justify-between gap-3 shadow-sm border ${
                    selectedSensitivity === 'relaxed'
                      ? 'bg-[#F0ECE4] border-[#1C1B19]'
                      : 'bg-[#F0ECE4]/40 border-[#E6E0D6] hover:bg-[#F0ECE4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1D1B18]">Relaxed</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedSensitivity === 'relaxed' ? 'bg-[#1C1B19] text-white' : 'opacity-0'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-xs text-[#716B63] leading-relaxed">
                    Highlights only explicit high-risk liabilities and breach clauses.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-6 rounded-full bg-[#286344]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#E6E0D6]"></span>
                    <span className="h-1.5 w-6 rounded-full bg-[#E6E0D6]"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E6E0D6]/60">
              <div className="flex items-center gap-2 text-[#716B63] text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Changes saved automatically to your workspace.</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#1C1B19] hover:bg-[#34312C] text-white text-xs font-medium transition-all shadow-sm flex items-center gap-2"
              >
                {savedFeedback ? <Check className="w-4 h-4 text-[#286344]" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{savedFeedback ? 'Profile Updated!' : 'Update profile'}</span>
              </button>
            </div>
          </form>

          {/* Analytical Engine Metrics Micro-Card */}
          <div className="bg-[#FFFDFA] rounded-xl p-6 shadow-sm border border-[#E6E0D6] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E5EBF5] text-[#365B91] flex items-center justify-center shrink-0 border border-[#C7D7EC]">
                <Cpu className="w-6 h-6 text-[#365B91]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#1D1B18]">Model Verification Engine</span>
                <span className="text-xs text-[#716B63]">Axiom Legal LLM Core v4.2 • Latency: 420ms</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] text-[#979087] uppercase font-semibold">Clause Precision</span>
                <span className="text-sm font-semibold text-[#1D1B18] font-mono">99.4%</span>
              </div>
              <div className="h-8 w-px bg-[#E6E0D6]"></div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] text-[#979087] uppercase font-semibold">Average Scan</span>
                <span className="text-sm font-semibold text-[#1D1B18] font-mono">3.2s / doc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Plan & Quota Card (~35% / 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#FFFDFA] rounded-xl p-6 shadow-sm border border-[#E6E0D6] flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#716B63] font-semibold">
                  Subscription Tier
                </span>
                <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">
                  Free Starter
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9]">
                Active
              </span>
            </div>

            {/* Quota bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#716B63]">
                <span>Monthly Contract Audits</span>
                <span className="font-medium text-[#1D1B18]">3 of 5 used</span>
              </div>
              <div className="w-full h-2 bg-[#F0ECE4] rounded-full overflow-hidden">
                <div className="h-full bg-[#1C1B19] rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-[11px] text-[#979087]">
                Quota resets in 9 days. Need unlimited reviews?
              </p>
            </div>

            {/* Pro Upgrade CTA */}
            <div className="bg-[#F0ECE4]/60 p-4 rounded-xl border border-[#E6E0D6] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#92530C]" />
                <span className="text-xs font-semibold text-[#1D1B18]">Upgrade to Axiom Pro</span>
              </div>
              <ul className="text-xs text-[#716B63] space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#286344]" />
                  <span>Unlimited contract parsing & diffing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#286344]" />
                  <span>Redline counter-proposal PDF export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#286344]" />
                  <span>Priority Neural Engine latency (sub-second)</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => alert('Axiom Pro tier upgrade checkout demo!')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1C1B19] text-white hover:bg-[#34312C] text-xs font-medium transition-colors shadow-sm text-center block mt-2"
              >
                Upgrade to Pro ($29/mo)
              </button>
            </div>

            {/* Data Retention Notice */}
            <div className="p-3.5 rounded-lg bg-[#F0ECE4]/30 border border-[#E6E0D6] text-xs text-[#716B63] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#286344] shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-[#1D1B18] font-medium">Zero-Data Retention Policy:</strong> Documents are processed in isolated enclaves and are never used to train language models.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
