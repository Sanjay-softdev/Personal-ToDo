import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const { session } = useApp();

  if (!session) return null;

  return (
    <div className="nav-tabs">
      <button 
        className={`nav-tab ${activeTab === 'todos' ? 'active' : ''}`}
        onClick={() => setActiveTab('todos')}
      >
        📋 Todos
      </button>
      <button 
        className={`nav-tab ${activeTab === 'dash' ? 'active' : ''}`}
        onClick={() => setActiveTab('dash')}
      >
        📊 Dashboard
      </button>
      {session.role === 'him' && (
        <button 
          className={`nav-tab ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          👁 Monitor
        </button>
      )}
      <button 
        className={`nav-tab ${activeTab === 'notes' ? 'active' : ''}`}
        onClick={() => setActiveTab('notes')}
      >
        💬 Notes
      </button>
      {session.role === 'her' && (
        <button 
          className={`nav-tab ${activeTab === 'redeem' ? 'active' : ''}`}
          onClick={() => setActiveTab('redeem')}
        >
          ⭐ Rewards
        </button>
      )}
    </div>
  );
}
