import React from 'react';
import { useApp } from '../../context/AppContext';
import { CAT_ICONS, getUserLabel, priLabel, timeAgo } from '../../utils/helpers';

export default function MonitorTab() {
  const { 
    session, 
    todos, 
    redeems, 
    profilesMap, 
    calcHerStars, 
    handleRedeem 
  } = useApp();

  // This tab is His view of Her progress. Hide for her.
  if (session.role !== 'him') return null;

  const herTasks = todos.filter(t => t.assignTo === 'her' || t.assignTo === 'both');
  const herDone = herTasks.filter(t => t.status === 'completed');
  const herInProg = herTasks.filter(t => t.status === 'in-progress');
  const herPct = herTasks.length ? Math.round((herDone.length / herTasks.length) * 100) : 0;
  
  const smsTasks = todos.filter(t => t.cat === 'sms' && (t.assignTo === 'her' || t.assignTo === 'both'));
  const smsDone = smsTasks.filter(t => t.status === 'completed').length;
  
  const herStars = calcHerStars();
  const pendingRedeems = redeems.filter(r => r.status === 'pending');

  const healthScore = herPct >= 80 ? 'great' : herPct >= 40 ? 'warn' : 'lag';
  const healthMsg = { great: 'On fire! 🔥', warn: 'Making progress 🌱', lag: 'Needs a nudge 💛' }[healthScore];

  const recentActivity = [...todos]
    .filter(t => t.assignTo === 'her' || t.assignTo === 'both')
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  const urgentTasks = todos.filter(
    t => (t.assignTo === 'her' || t.assignTo === 'both') && t.priority === 'urgent' && t.status !== 'completed'
  );

  return (
    <div className="tab-pane active" id="tab-monitor">
      <div className="monitor-card">
        <div className="monitor-header">
          <div className="monitor-title">👧 Her Progress Overview</div>
          <div className={`monitor-badge ${healthScore}`}>{healthMsg}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.8rem' }}>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--surface)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--green)' }}>{herDone.length}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Done</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--surface)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--amber)' }}>{herInProg.length}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--surface)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--star)' }}>⭐ {herStars}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Her Stars</div>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '0.3rem' }}>Overall completion</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${herPct}%`, background: 'var(--her)' }}></div>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
          {herPct}% · {herDone.length} of {herTasks.length} tasks
        </div>
      </div>

      {pendingRedeems.length > 0 && (
        <div className="monitor-card" style={{ borderColor: '#4a3010' }}>
          <div className="monitor-header">
            <div className="monitor-title">🎁 Wish Requests ({pendingRedeems.length} pending)</div>
            <div className="monitor-badge warn">Needs response</div>
          </div>
          {pendingRedeems.map(r => (
            <div key={r.id} className="activity-row">
              <div className="act-icon">🎁</div>
              <div className="act-body">
                <div className="act-text">{r.message}</div>
                <div className="act-time">
                  {r.phone ? `📞 ${r.phone} · ` : ''}{timeAgo(r.ts)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                <button 
                  onClick={() => handleRedeem(r.id, 'approved')} 
                  style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: 'none', background: 'var(--green-dim)', color: 'var(--green)', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✓ Grant
                </button>
                <button 
                  onClick={() => handleRedeem(r.id, 'rejected')} 
                  style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: 'none', background: '#3a1010', color: '#ff6b6b', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✗ Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="monitor-card">
        <div className="monitor-header">
          <div className="monitor-title">📱 SMS Project Health</div>
          <div className={`monitor-badge ${smsDone === smsTasks.length && smsTasks.length > 0 ? 'great' : smsDone > 0 ? 'warn' : 'lag'}`}>
            {smsDone}/{smsTasks.length} done
          </div>
        </div>
        {smsTasks.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '0.5rem 0' }}>No SMS tasks yet. Add some!</div>
        ) : (
          smsTasks.map(t => (
            <div key={t.id} className="activity-row">
              <div className="act-icon">{CAT_ICONS[t.cat]}</div>
              <div className="act-body">
                <div className="act-text">{t.text}</div>
                <div className="act-time">{priLabel(t.priority)}</div>
              </div>
              <span 
                className="act-status" 
                style={{ 
                  background: t.status === 'completed' ? 'var(--green-dim)' : t.status === 'in-progress' ? 'var(--amber-dim)' : 'var(--surface)',
                  color: t.status === 'completed' ? 'var(--green)' : t.status === 'in-progress' ? 'var(--amber)' : 'var(--muted)',
                  borderRadius: '6px', 
                  padding: '0.15rem 0.5rem', 
                  fontSize: '0.65rem', 
                  whiteSpace: 'nowrap' 
                }}
              >
                {t.status === 'completed' ? '✅' : t.status === 'in-progress' ? '🔄' : '⏳'} {t.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="monitor-card">
        <div className="monitor-title" style={{ fontSize: '0.85rem', marginBottom: '0.7rem' }}>🕐 Recent Activity</div>
        {recentActivity.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>No activity yet</div>
        ) : (
          recentActivity.map(t => (
            <div key={t.id} className="activity-row">
              <div className="act-icon">
                {t.status === 'completed' ? '✅' : t.status === 'in-progress' ? '🔄' : '⏳'}
              </div>
              <div className="act-body">
                <div className="act-text">{t.text}</div>
                <div className="act-time">{timeAgo(t.updatedAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section-head">Overdue / Urgent</div>
      {urgentTasks.length === 0 ? (
        <div style={{ fontSize: '0.82rem', color: 'var(--muted)', padding: '0.5rem 0' }}>No urgent tasks 🎉</div>
      ) : (
        urgentTasks.map(t => (
          <div key={t.id} className="monitor-card" style={{ borderColor: '#3a1010' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{t.text}</div>
            <div style={{ fontSize: '0.68rem', color: '#ff6b6b', marginTop: '0.3rem' }}>🔴 Urgent — {t.status}</div>
          </div>
        ))
      )}
    </div>
  );
}
