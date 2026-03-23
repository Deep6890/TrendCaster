import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';

import Dashboard      from './pages/Dashboard';
import GuardianAI     from './pages/GuardianAI';
import RegretSimulator from './pages/RegretSimulator';
import LifeImpact     from './pages/LifeImpact';
import CrowdVsSmart   from './pages/CrowdVsSmart';
import WaitPower      from './pages/WaitPower';
import MistakeMemory  from './pages/MistakeMemory';
import DailyFeed      from './pages/DailyFeed';
import ChatPage       from './pages/ChatPage';

function AppShell() {
  const { activePage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const PAGES = {
    dashboard: <Dashboard />,
    guardian:  <GuardianAI />,
    regret:    <RegretSimulator />,
    life:      <LifeImpact />,
    crowd:     <CrowdVsSmart />,
    wait:      <WaitPower />,
    memory:    <MistakeMemory />,
    feed:      <DailyFeed />,
    chat:      <ChatPage />,
  };

  const isChatPage = activePage === 'chat';

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-[Inter,sans-serif]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className={`flex-1 ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {PAGES[activePage] || <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
