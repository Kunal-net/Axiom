import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertCircle, Lock, Mail, User, Building, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DoubleBezel } from '../components/ui/DoubleBezel';
import { authService } from '../services/authService';
import { ApiError } from '../services/apiClient';

interface SignInPageProps {
  onNavigate: (route: string) => void;
  onAuthenticated: () => void;
  destinationRoute?: string;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onAuthenticated,
  destinationRoute = 'dashboard',
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (mode === 'register') {
      if (!name.trim()) {
        errors.name = 'Full name is required.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await authService.login({ email, password });
      } else {
        await authService.register({
          email,
          password,
          name,
          organization: organization || undefined,
          role: role || undefined,
        });
      }

      onAuthenticated();
      onNavigate(destinationRoute);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.code === 'INVALID_CREDENTIALS') {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        } else if (err.status === 429 || err.code === 'TOO_MANY_ATTEMPTS') {
          setErrorMessage('Too many failed attempts. Please wait a few minutes before trying again.');
        } else if (err.status === 409 || err.code === 'EMAIL_ALREADY_EXISTS') {
          setErrorMessage('An account with this email address already exists. Please sign in instead.');
          setMode('signin');
        } else {
          setErrorMessage(err.message || 'Authentication failed. Please try again.');
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message || 'Unable to connect to the authentication service.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setMode('signin');
    setEmail('alex.mercer@studiomercer.design');
    setPassword('DevPassword123!');
    setErrorMessage(null);
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col justify-between selection:bg-[#1C1B19] selection:text-white px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1C1B19] text-[#FFFFFF] flex items-center justify-center font-serif text-lg italic font-medium shrink-0 shadow-sm transition-transform group-hover:scale-105">
            A
          </div>
          <div>
            <span className="font-display text-xl font-normal text-[#1D1B18] tracking-tight">Axiom</span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#716B63] ml-1.5 font-medium">Legal Intelligence</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          className="text-xs font-medium text-[#716B63] hover:text-[#1D1B18] transition-colors"
        >
          ← Back to Site
        </button>
      </div>

      {/* Main Authentication Box */}
      <div className="max-w-md w-full mx-auto my-auto">
        <DoubleBezel padding="md">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title & Mode Switcher */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAE5DC] text-[#716B63] text-[11px] font-medium">
                <Shield className="w-3.5 h-3.5 text-[#1C1B19]" />
                <span>Isolated Client Workspaces</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-[#1D1B18] font-normal tracking-tight">
                {mode === 'signin' ? 'Sign in to Axiom' : 'Create an Account'}
              </h1>
              <p className="text-xs sm:text-sm text-[#716B63]">
                {mode === 'signin'
                  ? 'Access your private contracts, risk analyses, and redline drafts.'
                  : 'Get started with AI-powered contract intelligence for your practice.'}
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#F0ECE4] rounded-xl border border-[#E6E0D6]/80 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setFieldErrors({});
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-[#FFFDFA] text-[#1D1B18] shadow-sm font-semibold'
                    : 'text-[#716B63] hover:text-[#1D1B18]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setFieldErrors({});
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-[#FFFDFA] text-[#1D1B18] shadow-sm font-semibold'
                    : 'text-[#716B63] hover:text-[#1D1B18]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Credentials Filler */}
            <div className="p-3 rounded-xl bg-[#F0ECE4]/60 border border-[#E6E0D6] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#92530C] shrink-0" />
                <div className="flex flex-col min-w-0 text-[11px]">
                  <span className="font-medium text-[#1D1B18] truncate">Studio Mercer Lead Partner</span>
                  <span className="text-[#716B63] truncate">alex.mercer@studiomercer.design</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="shrink-0 text-[11px] font-medium text-[#1C1B19] hover:underline bg-[#FFFDFA] border border-[#E6E0D6] px-2.5 py-1 rounded-lg shadow-whisper transition-all hover:bg-[#F7F4EE]"
              >
                Use Demo
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[#FCE4DF] border border-[#F7C6BE] text-[#A83224] text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Registration Specific Fields */}
              {mode === 'register' && (
                <>
                  <div>
                    <label
                      htmlFor="auth-name"
                      className="block text-xs font-semibold text-[#1D1B18] mb-1.5"
                    >
                      Full Name <span className="text-[#A83224]">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#979087]" />
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Mercer"
                        autoComplete="name"
                        className={`w-full bg-[#F7F4EE] border ${
                          fieldErrors.name ? 'border-[#A83224]' : 'border-[#E6E0D6]'
                        } rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA] transition-colors`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-[11px] text-[#A83224] mt-1">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="auth-org"
                        className="block text-xs font-semibold text-[#1D1B18] mb-1.5"
                      >
                        Studio / Organization
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#979087]" />
                        <input
                          id="auth-org"
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. Mercer Design"
                          className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="auth-role"
                        className="block text-xs font-semibold text-[#1D1B18] mb-1.5"
                      >
                        Professional Role
                      </label>
                      <input
                        id="auth-role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Lead Partner"
                        className="w-full bg-[#F7F4EE] border border-[#E6E0D6] rounded-xl px-3 py-2 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold text-[#1D1B18] mb-1.5"
                >
                  Email Address <span className="text-[#A83224]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#979087]" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`w-full bg-[#F7F4EE] border ${
                      fieldErrors.email ? 'border-[#A83224]' : 'border-[#E6E0D6]'
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA] transition-colors`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-[#A83224] mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-semibold text-[#1D1B18]"
                  >
                    Password <span className="text-[#A83224]">*</span>
                  </label>
                  {mode === 'signin' && (
                    <span className="text-[11px] text-[#716B63]">
                      Min 8 characters
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#979087]" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className={`w-full bg-[#F7F4EE] border ${
                      fieldErrors.password ? 'border-[#A83224]' : 'border-[#E6E0D6]'
                    } rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1D1B18] focus:outline-none focus:border-[#1C1B19] focus:bg-[#FFFDFA] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#979087] hover:text-[#1D1B18] p-1 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-[#A83224] mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center shadow-whisper"
                  loading={isLoading}
                  withArrow={!isLoading}
                >
                  {mode === 'signin' ? 'Sign In to Workspace' : 'Create Axiom Account'}
                </Button>
              </div>
            </form>

            {/* Security Guarantee */}
            <div className="pt-4 border-t border-[#E6E0D6]/60 flex items-center justify-center gap-2 text-[11px] text-[#716B63]">
              <Lock className="w-3.5 h-3.5 text-[#286344]" />
              <span>Argon2id hashing • HttpOnly security • OWASP isolated</span>
            </div>
          </div>
        </DoubleBezel>
      </div>

      {/* Footer Details */}
      <div className="max-w-md w-full mx-auto text-center pt-6 text-[11px] text-[#979087]">
        Axiom Legal Intelligence — Confidential Contract Analysis Platform
      </div>
    </div>
  );
};
