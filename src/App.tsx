import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/AppHeader';
import { Footer } from './components/layout/Footer';
import { TemplatesModal } from './components/contracts/TemplatesModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { ReportPage } from './pages/ReportPage';
import { ComparePage } from './pages/ComparePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { contractService } from './services/contractService';
import { UserProfile, ContractTemplate } from './types/contract';

export function App() {
  // Routes: landing | dashboard | analyze | results | report | compare | history | settings
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'landing';
  });

  const [activeDocId, setActiveDocId] = useState<string>('doc-msa-fintech');
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();

  useEffect(() => {
    contractService.getUserProfile().then(setUserProfile);
  }, []);

  // Handle URL hash changes for easy bookmarking and browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        const [route, id] = hash.split('?doc=');
        setCurrentRoute(route || 'landing');
        if (id) setActiveDocId(id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, docId?: string) => {
    setCurrentRoute(route);
    if (docId) setActiveDocId(docId);
    window.location.hash = docId ? `#/${route}?doc=${docId}` : `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (template: ContractTemplate) => {
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

  // Authenticated App Shell (Dashboard, Analyze, Results, Report, Compare, History, Settings)
  return (
    <div className="min-h-screen bg-[#F7F4EE] flex font-sans selection:bg-[#1C1B19] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentRoute={currentRoute} 
        onNavigate={navigate} 
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Render AppHeader for pages that use standard header */}
        {currentRoute !== 'results' && currentRoute !== 'report' && (
          <AppHeader 
            onNavigate={navigate} 
            onSearch={(q) => {
              if (q && currentRoute !== 'history') navigate('history');
            }}
          />
        )}

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-x-hidden">
          {currentRoute === 'dashboard' && <DashboardPage onNavigate={navigate} onOpenTemplates={() => setIsTemplatesModalOpen(true)} />}
          {currentRoute === 'analyze' && <AnalyzePage onNavigate={navigate} />}
          {currentRoute === 'results' && <AnalysisResultsPage docId={activeDocId} onNavigate={navigate} />}
          {currentRoute === 'report' && <ReportPage docId={activeDocId} onNavigate={navigate} />}
          {currentRoute === 'compare' && <ComparePage onNavigate={navigate} />}
          {currentRoute === 'history' && <HistoryPage onNavigate={navigate} />}
          {currentRoute === 'settings' && <SettingsPage onNavigate={navigate} />}
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
