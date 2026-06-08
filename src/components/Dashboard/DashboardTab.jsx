import React from 'react';
import { useApp } from '../../context/AppContext';
import { CAT_ICONS, calcStreak } from '../../utils/helpers';

export default function DashboardTab() {
  const { todos, calcHerStars } = useApp();

  const total = todos.length;
  const done = todos.filter(t => t.status === 'completed').length;
  const inProg = todos.filter(t => t.status === 'in-progress').length;
  const pend = todos.filter(t => t.status === 'pending').length;

  const hers = todos.filter(t => t.assignTo === 'her' || t.assignTo === 'both');
  const hersDone = hers.filter(t => t.status === 'completed').length;

  const smsTodos = todos.filter(t => t.cat === 'sms');
  const smsDone = smsTodos.filter(t => t.status === 'completed').length;

  const streak = calcStreak(todos);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const herPct = hers.length ? Math.round((hersDone / hers.length) * 100) : 0;
  const smsPct = smsTodos.length ? Math.round((smsDone / smsTodos.length) * 100) : 0;
  const herStars = calcHerStars();

  const categories = ['sms', 'general', 'date', 'shopping', 'travel', 'food', 'home', 'health', 'learning'];

  return (
    <div className="tab-pane active" id="tab-dash">
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--rose)' }}>{pct}%</div>
          <div className="stat-lbl">Overall Complete</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--rose)' }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--muted)' }}>
            {done} of {total} tasks
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--gold)' }}>🔥 {streak}</div>
          <div className="stat-lbl">Day Streak</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--muted)' }}>
            Consecutive active days
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--amber)' }}>{inProg}</div>
          <div className="stat-lbl">In Progress</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--muted)' }}>
            {pend} still pending
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--star)' }}>⭐ {herStars}</div>
          <div className="stat-lbl">Her Stars</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--muted)' }}>
            {Math.floor(herStars / 100)} rewards earned
          </div>
        </div>

        <div className="stat-card full">
          <div className="stat-lbl" style={{ marginBottom: '0.5rem' }}>📱 SMS Project Progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
            <span>{smsDone} / {smsTodos.length} tasks</span>
            <span style={{ color: 'var(--blue)' }}>{smsPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${smsPct}%`, background: 'var(--blue)' }}></div>
          </div>
        </div>

        <div className="stat-card full">
          <div className="stat-lbl" style={{ marginBottom: '0.5rem' }}>👧 Her Tasks Progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
            <span>{hersDone} / {hers.length} tasks</span>
            <span style={{ color: 'var(--her)' }}>{herPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${herPct}%`, background: 'var(--her)' }}></div>
          </div>
        </div>
      </div>

      <div className="section-head">By Category</div>
      {categories.map(cat => {
        const cTodos = todos.filter(t => t.cat === cat);
        if (!cTodos.length) return null;
        const cDone = cTodos.filter(t => t.status === 'completed').length;
        const cPct = Math.round((cDone / cTodos.length) * 100);
        return (
          <div key={cat} className="stat-card full" style={{ marginBottom: '0.5rem', padding: '0.7rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.8rem' }}>
                {CAT_ICONS[cat] || '📋'} {cat} <span style={{ color: 'var(--muted)' }}>({cTodos.length})</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--rose)' }}>{cPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${cPct}%`, background: 'var(--rose)' }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
