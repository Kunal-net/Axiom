import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Bell,
  Check,
  Save,
  Sliders,
  Key
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DoubleBezel } from '../components/ui/DoubleBezel';
import { contractService } from '../services/contractService';
import { UserProfile } from '../types/contract';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  onLogout?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate: _onNavigate, onProfileUpdated, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'analysis' | 'privacy' | 'notifications'>('profile');

  useEffect(() => {
    contractService.getUserProfile().then(setProfile);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated = await contractService.updateUserProfile(profile);
    setProfile(updated);
    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  if (!profile) return null;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E6E0D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#979087]">Workspace Configuration</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-sm text-[#716B63] mt-1">
            Configure risk tolerance, explanation voice, and document retention policies.
          </p>
        </div>

        {savedFeedback && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E1EFE4] text-[#286344] text-xs font-medium border border-[#C6DFC9]">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* 2. Settings Nav Tabs */}
      <div className="flex border-b border-[#E6E0D6] gap-2 overflow-x-auto pb-0.5">
        {[
          { id: 'profile', label: 'Profile & Studio', icon: User },
          { id: 'analysis', label: 'Analysis Rules', icon: Sliders },
          { id: 'privacy', label: 'Privacy & Retention', icon: ShieldCheck },
          { id: 'notifications', label: 'Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${isActive
                  ? 'bg-[#1C1B19] text-white shadow-sm'
                  : 'text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4]'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Settings Form Body */}
      <form onSubmit={handleSave} className="space-y-6">
        <DoubleBezel padding="md">
          <div className="p-6 sm:p-8 space-y-8">
            {/* TAB 1: Profile & Studio */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[#1D1B18]">Professional Identity</h3>
                  <p className="text-xs text-[#716B63] mt-0.5">
                    Your details are used to calibrate liability caps and contract signature blocks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#1D1B18]">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#1D1B18]">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#1D1B18]">Freelance Discipline / Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#1D1B18]">Studio / Legal Entity Name</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA]"
                    />
                  </div>
                </div>

                {/* Account Security & Session */}
                <div className="pt-6 border-t border-[#E6E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-[#1D1B18]">Account Security & Session</h4>
                    <p className="text-[11px] text-[#716B63] mt-0.5">
                      Signed in as <span className="font-medium text-[#1D1B18]">{profile.email}</span>. Protected by 256-bit Argon2id encryption and HttpOnly cookie security.
                    </p>
                  </div>
                  {onLogout && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={onLogout}
                    >
                      Sign Out of Axiom
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Analysis Rules */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[#1D1B18]">Contract Risk Calibration</h3>
                  <p className="text-xs text-[#716B63] mt-0.5">
                    Customize how aggressively Axiom flags commercial friction and generates redlines.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Risk Sensitivity */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#1D1B18]">Risk Sensitivity Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'conservative', label: 'Conservative (Recommended)', desc: 'Flags uncapped indemnities, 60+ day payment terms, IP grabs, and all non-competes.' },
                        { id: 'standard', label: 'Standard Commercial', desc: 'Flags industry standard commercial friction points and unbalanced liabilities.' },
                        { id: 'relaxed', label: 'Relaxed / Dealbreakers Only', desc: 'Flags only existential liabilities and total forfeiture of pre-existing IP.' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setProfile({ ...profile, riskSensitivity: item.id as any })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${profile.riskSensitivity === item.id
                              ? 'bg-[#F0ECE4]/70 border-[#1C1B19] shadow-sm'
                              : 'bg-[#FFFDFA] border-[#E6E0D6] hover:bg-[#F7F4EE]'
                            }`}
                        >
                          <div className="text-xs font-semibold text-[#1D1B18] mb-1">{item.label}</div>
                          <div className="text-[11px] text-[#716B63] leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation Voice */}
                  <div className="space-y-2 pt-4 border-t border-[#E6E0D6]">
                    <label className="text-xs font-medium text-[#1D1B18]">Explanation Style</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'plain_english', label: 'Plain English', desc: 'No legal jargon. Plain human language explaining commercial risks.' },
                        { id: 'balanced', label: 'Balanced Commercial', desc: 'Mix of legal precision and plain-language summaries.' },
                        { id: 'legal_formal', label: 'Formal Legal', desc: 'Strict statutory terminology and contract doctrine phrasing.' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setProfile({ ...profile, explanationStyle: item.id as any })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${profile.explanationStyle === item.id
                              ? 'bg-[#F0ECE4]/70 border-[#1C1B19] shadow-sm'
                              : 'bg-[#FFFDFA] border-[#E6E0D6] hover:bg-[#F7F4EE]'
                            }`}
                        >
                          <div className="text-xs font-semibold text-[#1D1B18] mb-1">{item.label}</div>
                          <div className="text-[11px] text-[#716B63] leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle: Auto-generate redlines */}
                  <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-[#1D1B18]">Auto-Generate Counter-Proposal Redlines</div>
                      <div className="text-[11px] text-[#716B63]">Synthesize balanced replacement clauses for every high-risk finding</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.autoGenerateRedlines}
                      onChange={(e) => setProfile({ ...profile, autoGenerateRedlines: e.target.checked })}
                      className="w-4 h-4 accent-[#1C1B19] rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Privacy & Retention */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[#1D1B18]">Data Sovereignty & Retention</h3>
                  <p className="text-xs text-[#716B63] mt-0.5">
                    Your contracts contain sensitive intellectual property and confidential client terms.
                  </p>
                </div>

                {/* Privacy Guarantee Box */}
                <div className="p-4 rounded-xl bg-[#E1EFE4] border border-[#C6DFC9] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#286344] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#286344] block mb-0.5">Zero-Data Model Training Guarantee</span>
                    <p className="text-[#1D1B18] leading-relaxed">
                      Uploaded documents are processed in ephemeral computing enclaves and are never used to train public language models or stored beyond your selected retention limit.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-[#1D1B18]">Document Retention Window</label>
                  <select
                    value={profile.documentRetentionDays}
                    onChange={(e) => setProfile({ ...profile, documentRetentionDays: Number(e.target.value) })}
                    className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:outline-none"
                  >
                    <option value={0}>0 Days — Delete immediately after report generation</option>
                    <option value={30}>30 Days — Retain for ongoing negotiation window</option>
                    <option value={90}>90 Days — Extended project lifecycle archive</option>
                  </select>
                </div>

                {/* AI Inference Architecture Card */}
                <div className="pt-4 border-t border-[#E6E0D6] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#1D1B18] flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>AI Inference Pipeline</span>
                    </label>
                    <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E1EFE4] text-[#286344] border border-[#C6DFC9]">
                      Server Managed
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6] text-xs text-[#716B63] space-y-1.5 leading-relaxed">
                    <p className="text-[#1D1B18] font-medium">
                      Zero Client-Side Credentials Policy
                    </p>
                    <p>
                      Axiom enforces strict credential isolation: all contract intelligence operations (Groq LPU / Llama-3.3-70B and deterministic rule benchmarks) run via server-side configuration (<code className="font-mono text-[11px] bg-[#E6E0D6]/60 px-1 py-0.5 rounded">GROQ_API_KEY</code>). API keys are never stored in browser storage or exposed in client bundles.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Alerts */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[#1D1B18]">Notifications</h3>
                  <p className="text-xs text-[#716B63] mt-0.5">Control how Axiom notifies you about contract audits</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6]">
                    <div>
                      <div className="text-xs font-medium text-[#1D1B18]">Email Analysis Completion</div>
                      <div className="text-[11px] text-[#716B63]">Receive an executive summary email as soon as a document finishes processing</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => setProfile({ ...profile, emailNotifications: e.target.checked })}
                      className="w-4 h-4 accent-[#1C1B19] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E6E0D6]">
                    <div>
                      <div className="text-xs font-medium text-[#1D1B18]">High-Risk Liability Warning Alerts</div>
                      <div className="text-[11px] text-[#716B63]">Highlight contracts containing uncapped indemnities or pre-existing IP forfeiture</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.highRiskAlerts}
                      onChange={(e) => setProfile({ ...profile, highRiskAlerts: e.target.checked })}
                      className="w-4 h-4 accent-[#1C1B19] rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer Save Button */}
            <div className="pt-6 border-t border-[#E6E0D6] flex items-center justify-between">
              <span className="text-xs text-[#979087]">Changes apply across all upcoming contract evaluations</span>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DoubleBezel>
      </form>
    </div>
  );
};
