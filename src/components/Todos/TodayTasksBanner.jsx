import React from 'react';
import { useApp } from '../../context/AppContext';
import { CAT_ICONS, STAR_MAP, priLabel } from '../../utils/helpers';

export default function TodayTasksBanner() {
  const { todos } = useApp();

  const todayStr = new Date().toDateString();

  const todayTasks = todos.filter(t => {
    if (t.status === 'completed') return false;
    const createdToday = new Date(t.createdAt).toDateString() === todayStr;
    const dueToday = t.dueDate && new Date(t.dueDate + 'T00:00:00').toDateString() === todayStr;
    return createdToday || dueToday;
  });

  return (
    <div className="today-banner">
      <div className="today-banner-title">📅 Today's Tasks</div>
      <div id="today-tasks-list">
        {todayTasks.length === 0 ? (
          <div className="today-empty">No tasks for today 🌸</div>
        ) : (
          <>
            {todayTasks.slice(0, 5).map(t => (
              <div 
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '0.75rem' }}>{CAT_ICONS[t.cat] || '📋'}</span>
                <span 
                  style={{ 
                    fontSize: '0.78rem', 
                    color: 'var(--text2)', 
                    flex: 1, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {t.text}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.65rem', 
                    background: 'var(--star-dim)', 
                    color: '#000', 
                    border: '1px solid #000', 
                    padding: '0.1rem 0.4rem', 
                    borderRadius: '6px', 
                    flexShrink: 0, 
                    fontWeight: 700 
                  }}
                >
                  ⭐×{STAR_MAP[t.priority] || 1}
                </span>
                <span className={`pill p-${t.priority}`} style={{ flexShrink: 0 }}>
                  {priLabel(t.priority).split(' ')[0]}
                </span>
              </div>
            ))}
            {todayTasks.length > 5 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', padding: '0.3rem 0', textAlign: 'left' }}>
                +{todayTasks.length - 5} more…
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
