import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Avatar from '../Common/Avatar';

export default function AppHeader() {
  const { 
    session, 
    todos, 
    notes,
    unreadNotesCount, 
    lastReadNotes, 
    setActiveTab, 
    calcHerStars, 
    setIsProfileModalOpen 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const active = todos.filter(t => t.status !== 'completed');
  const completed = todos.filter(t => t.status === 'completed');
  const inProgress = todos.filter(t => t.status === 'in-progress');

  // Dynamic day streak calculation
  const calcStreak = () => {
    const days = {};
    todos.filter(t => t.status === 'completed').forEach(t => {
      const d = new Date(t.updatedAt).toDateString();
      days[d] = true;
    });
    let streak = 0;
    const d = new Date();
    // Start scanning backwards from today
    while (days[d.toDateString()]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const streak = calcStreak();
  const stars = calcHerStars();

  const recentPartnerNotes = notes
    .filter(n => n.from !== session?.role)
    .slice(0, 5);

  return (
    <div className="app-header">
      <div className="hdr-left">
        <div className="hdr-title">Our Little <em>Space</em> ✦</div>
        <div className="hdr-sub">
          {active.length} active · {completed.length} done · {inProgress.length} in progress
        </div>
      </div>
      <div className="hdr-right">
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className={`flt ${showNotifications ? 'on' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: '#FFF', 
              borderColor: '#000', 
              padding: '0.4rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              position: 'relative'
            }}
            title="Notifications"
          >
            🔔
            {unreadNotesCount > 0 && (
              <span className="notif-badge">
                {unreadNotesCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 999 }} 
                onClick={() => setShowNotifications(false)}
              />
              <div className="notif-dropdown" style={{ zIndex: 1000 }}>
                <div className="notif-title">Notifications ✦</div>
                <div className="notif-body">
                  {recentPartnerNotes.length === 0 ? (
                    <div className="notif-empty">No messages yet! ✨</div>
                  ) : (
                    recentPartnerNotes.map(note => {
                      const isUnread = note.ts > lastReadNotes;
                      const fromLabel = note.from === 'him' ? '👦 Sanjay' : '👧 My Love';
                      return (
                        <div 
                          key={note.id} 
                          className={`notif-item ${isUnread ? 'unread' : ''}`}
                          onClick={() => {
                            setActiveTab('notes');
                            setShowNotifications(false);
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{fromLabel}</span>
                            {isUnread && (
                              <span style={{ 
                                fontSize: '0.6rem', 
                                background: 'var(--rose)', 
                                color: 'white', 
                                padding: '0.1rem 0.3rem', 
                                borderRadius: '4px', 
                                border: '1.5px solid #000',
                                fontWeight: 'bold'
                              }}>
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="notif-text">{note.text}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="streak-badge" title="Consecutive days with completed tasks">
          🔥 {streak}
        </div>
        {session.role === 'her' && (
          <div className="star-badge" id="star-badge">
            ⭐ {stars}
          </div>
        )}
        <div 
          className={`user-pill ${session.role}`} 
          onClick={() => setIsProfileModalOpen(true)}
        >
          <Avatar emojiOrUrl={session.emoji} isPill={true} />
          <span>{session.name}</span>
        </div>
      </div>
    </div>
  );
}
