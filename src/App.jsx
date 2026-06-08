import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './components/Auth/AuthScreen';
import AppHeader from './components/Header/AppHeader';
import TabNavigation from './components/Tabs/TabNavigation';
import TodoListTab from './components/Todos/TodoListTab';
import DashboardTab from './components/Dashboard/DashboardTab';
import MonitorTab from './components/Monitor/MonitorTab';
import NotesTab from './components/Notes/NotesTab';
import RedeemTab from './components/Redeem/RedeemTab';

// Modals & Common UI
import AddTodoModal from './components/Modals/AddTodoModal';
import EditTodoModal from './components/Modals/EditTodoModal';
import QueryTaskModal from './components/Modals/QueryTaskModal';
import ProfileModal from './components/Modals/ProfileModal';
import ConfirmModal from './components/Common/ConfirmModal';
import Toast from './components/Common/Toast';

function AppContent() {
  const { session, loading } = useApp();
  const [activeTab, setActiveTab] = useState('todos');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const appBodyRef = useRef(null);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (appBodyRef.current) {
        setShowScrollTop(appBodyRef.current.scrollTop > 300);
      }
    };

    const currentBody = appBodyRef.current;
    if (currentBody) {
      currentBody.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentBody) {
        currentBody.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, session]);

  // Reset scroll when tab changes
  useEffect(() => {
    if (appBodyRef.current) {
      appBodyRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const scrollToTop = () => {
    if (appBodyRef.current) {
      appBodyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Session verification loader
  if (loading) {
    return (
      <div className="spinner-wrap" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spin"></div>
      </div>
    );
  }

  // Not logged in -> AuthScreen
  if (!session) {
    return <AuthScreen />;
  }

  // Logged in App Shell
  return (
    <div id="app">
      <AppHeader />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="app-body" ref={appBodyRef}>
        {activeTab === 'todos' && <TodoListTab />}
        {activeTab === 'dash' && <DashboardTab />}
        {activeTab === 'monitor' && <MonitorTab />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'redeem' && <RedeemTab />}
      </div>

      {/* Floating Scroll to Top button */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
        style={{ bottom: activeTab === 'todos' ? '6rem' : '1.5rem' }}
      >
        ↑
      </button>

      {/* Overlays / Modals */}
      <AddTodoModal />
      <EditTodoModal />
      <QueryTaskModal />
      <ProfileModal />
      <ConfirmModal />
      
      {/* Toast banners */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
