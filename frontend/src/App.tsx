import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/AppHeader';
import { Footer } from './components/layout/Footer';
import { TemplatesModal } from './components/contracts/TemplatesModal';

import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { ReportPage } from './pages/ReportPage';
import { ComparePage } from './pages/ComparePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { contractService } from './services/contractService';
import { authService } from './services/authService';
import { apiClient } from './services/apiClient';
import { UserProfile, ContractTemplate } from './types/contract';

const PROTECTED_ROUTES = new Set([
  'dashboard',
  'analyze',
  'results',
  'report',
  'compare',
  'history',
  'settings',
]);

export function App() {
  // Routes: landing | signin | dashboard | analyze | results | report | compare | history | settings
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'landing';
  });

  const [activeDocId, setActiveDocId] = useState<string>('');
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [pendingDestination, setPendingDestination] = useState<string>('dashboard');
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await contractService.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      console.warn('[Axiom App] Could not load user profile:', err);
    }
  }, []);

  // Initialize and check session with backend
  useEffect(() => {
    let mounted = true;
    authService.checkAuth().then((user) => {
      if (!mounted) return;
      if (user) {
        setIsAuthenticated(true);
        fetchProfile();
      } else {
        setIsAuthenticated(false);
        // If user landed directly on a protected route while unauthenticated, redirect to signin
        const hash = window.location.hash.replace('#/', '').replace('#', '');
        const route = hash.split('?doc=')[0] || 'landing';
        if (PROTECTED_ROUTES.has(route)) {
          setPendingDestination(route);
          setCurrentRoute('signin');
        }
      }
      setIsAuthChecking(false);
    });

    // Listen for unauthorized 401s from API client
    const unsubscribe = apiClient.onUnauthorized(() => {
      if (!mounted) return;
      setIsAuthenticated(false);
      setUserProfile(undefined);
      setCurrentRoute((prev) => {
        if (PROTECTED_ROUTES.has(prev)) {
          setPendingDestination(prev);
          return 'signin';
        }
        return prev;
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [fetchProfile]);

  // Handle URL hash changes for easy bookmarking and browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        const [route, id] = hash.split('?doc=');
        const targetRoute = route || 'landing';

        if (PROTECTED_ROUTES.has(targetRoute) && !authService.isAuthenticated()) {
          setPendingDestination(targetRoute);
          setCurrentRoute('signin');
        } else {
          setCurrentRoute(targetRoute);
        }

        if (id) setActiveDocId(id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, docId?: string) => {
    if (PROTECTED_ROUTES.has(route) && !isAuthenticated) {
      setPendingDestination(route);
      setCurrentRoute('signin');
      window.location.hash = '#/signin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    if (docId) setActiveDocId(docId);
    window.location.hash = docId ? `#/${route}?doc=${docId}` : `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    fetchProfile();
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserProfile(undefined);
    navigate('landing');
  };

  const handleSelectTemplate = (_template: ContractTemplate) => {
    setIsTemplatesModalOpen(false);
    navigate('analyze');
  };

  // If on the Public Landing Page
  if (currentRoute === 'landing') {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col font-sans selection:bg-[#1C1B19] selection:text-white">
        <Navbar onNavigate={navigate} currentRoute={currentRoute} />
        <main className="flex-1">
          <LandingPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  // If on the Sign In / Registration Page
  if (currentRoute === 'signin') {
    return (
      <SignInPage
        onNavigate={navigate}
        onAuthenticated={handleAuthenticated}
        destinationRoute={pendingDestination || 'dashboard'}
      />
    );
  }

  // If checking initial authentication for protected route, show elegant warm ivory loader
  if (isAuthChecking && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C1B19] text-[#FFFFFF] flex items-center justify-center font-serif text-lg italic font-medium shadow-sm animate-pulse">
            A
          </div>
          <span className="text-xs font-medium text-[#716B63] tracking-wider uppercase">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated trying to view protected pages, fallback to SignInPage
  if (!isAuthenticated) {
    return (
      <SignInPage
        onNavigate={navigate}
        onAuthenticated={handleAuthenticated}
        destinationRoute={currentRoute}
      />
    );
  }

  // Authenticated App Shell (Dashboard, Analyze, Results, Report, Compare, History, Settings)
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex font-sans selection:bg-[#1C1B19] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Render AppHeader for pages that use standard header */}
        {currentRoute !== 'results' && currentRoute !== 'report' && (
          <AppHeader
            onNavigate={navigate}
            userProfile={userProfile}
            onLogout={handleLogout}
            onSearch={(q) => {
              if (q && currentRoute !== 'history') navigate('history');
            }}
          />
        )}

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-x-hidden">
          {currentRoute === 'dashboard' && (
            <DashboardPage
              onNavigate={navigate}
              onOpenTemplates={() => setIsTemplatesModalOpen(true)}
              userProfile={userProfile}
            />
          )}
          {currentRoute === 'analyze' && <AnalyzePage onNavigate={navigate} />}
          {currentRoute === 'results' && <AnalysisResultsPage docId={activeDocId} onNavigate={navigate} />}
          {currentRoute === 'report' && <ReportPage docId={activeDocId} onNavigate={navigate} />}
          {currentRoute === 'compare' && <ComparePage onNavigate={navigate} />}
          {currentRoute === 'history' && <HistoryPage onNavigate={navigate} />}
          {currentRoute === 'settings' && (
            <SettingsPage
              onNavigate={navigate}
              onProfileUpdated={(updated) => setUserProfile(updated)}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Global Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default App;

