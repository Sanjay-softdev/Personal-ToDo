import React from 'react';
import { useApp } from '../../context/AppContext';
import Avatar from '../Common/Avatar';

export default function AppHeader() {
  const { session, todos, calcHerStars, setIsProfileModalOpen } = useApp();

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

  return (
    <div className="app-header">
      <div className="hdr-left">
        <div className="hdr-title">Our Little <em>Space</em> ✦</div>
        <div className="hdr-sub">
          {active.length} active · {completed.length} done · {inProgress.length} in progress
        </div>
      </div>
      <div className="hdr-right">
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
