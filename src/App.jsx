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
  const [showLoader, setShowLoader] = useState(true);
  const [loaderFadeOut, setLoaderFadeOut] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const appBodyRef = useRef(null);

  // Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderFadeOut(true);
      const removeTimer = setTimeout(() => setShowLoader(false), 1000); // matches fade-out transition
      return () => clearTimeout(removeTimer);
    }, 4500); // 4.5s loader sequence matching the original constellation path durations

    return () => clearTimeout(timer);
  }, []);

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
  }, [loading, session, showLoader]);

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

  // Cosmic Space Loader Screen
  if (showLoader) {
    return (
      <div id="loader-container" className={loaderFadeOut ? 'fade-out' : ''}>
        <div className="space-bg"></div>
        <div className="ui-frame"></div>
        <svg className="constellation-svg" viewBox="0 0 600 300">
          <line className="constellation-line line-group-1" x1="120" y1="80" x2="250" y2="60" />
          <line className="constellation-line line-group-2" x1="250" y1="60" x2="480" y2="100" />
          <line className="constellation-line line-group-3" x1="480" y1="100" x2="350" y2="240" />
          <line className="constellation-line line-group-4" x1="350" y1="240" x2="120" y2="80" />
          
          <path 
            className="constellation-line line-group-heart" 
            d="M 300,120 C 300,70 230,70 230,120 C 230,180 300,220 300,235 C 300,220 370,180 370,120 C 370,70 300,70 300,120 Z" 
            fill="none" 
          />
          
          <g className="heart-pulse">
            <polygon className="star star-heart" points="300,110 304,118 313,118 306,124 309,132 300,127 291,132 294,124 287,118 296,118" />
            <polygon className="star star-heart" points="230,110 234,118 243,118 236,124 239,132 230,127 221,132 224,124 217,118 226,118" />
            <polygon className="star star-heart" points="370,110 374,118 383,118 376,124 379,132 370,127 361,132 364,124 357,118 366,118" />
          </g>
          
          <polygon className="star star-1" points="120,70 124,78 133,78 126,84 129,92 120,87 111,92 114,84 107,78 116,78" />
          <polygon className="star star-2" points="250,50 254,58 263,58 256,64 259,72 250,67 241,72 244,64 237,58 246,58" />
          <polygon className="star star-3" points="480,90 484,98 493,98 486,104 489,112 480,107 471,112 474,104 467,98 476,98" />
          <polygon className="star star-4" points="350,230 354,238 363,238 356,244 359,252 350,247 341,252 344,244 337,238 346,238" />
        </svg>
        <div className="loading-text">CONNECTING CONSTELLATIONS…</div>
      </div>
    );
  }

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
