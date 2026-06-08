import { SPRITE_EMOJIS, isBase64Image } from '../components/Common/Avatar';

export const CAT_ICONS = { 
  general: '📋', 
  sms: '📱', 
  date: '🌹', 
  shopping: '🛍', 
  travel: '✈️', 
  food: '🍽', 
  home: '🏠', 
  health: '💊', 
  learning: '📚' 
};

export const STAR_MAP = { urgent: 5, high: 3, medium: 2, low: 1 };

export function getUserLabel(role, profilesMap) {
  const p = profilesMap[role];
  if (p) {
    let displayEmoji = p.emoji;
    if (isBase64Image(p.emoji)) {
      displayEmoji = (role === 'him' ? '👦' : '👧');
    } else if (typeof p.emoji === 'string' && p.emoji.startsWith('sprite:')) {
      const key = p.emoji.substring(7);
      displayEmoji = SPRITE_EMOJIS[key] || '⭐';
    }
    return `${displayEmoji} ${p.name}`;
  }
  return role === 'him' ? '👦 Sanjay' : '👧 My Love';
}

export function priLabel(p) { 
  return { urgent: '🔴 Urgent', high: '🟠 High', medium: '🟡 Medium', low: '⚪ Low' }[p] || p; 
}

export function statusColor(s) { 
  return { pending: 'var(--muted)', 'in-progress': 'var(--amber)', completed: 'var(--green)' }[s] || '#666'; 
}

export function fmtDate(d) { 
  if (!d) return ''; 
  const dt = new Date(d + 'T00:00:00'); 
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); 
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

export function calcStreak(todos) {
  const days = {};
  todos.filter(t => t.status === 'completed').forEach(t => {
    const d = new Date(t.updatedAt).toDateString();
    days[d] = true;
  });
  let streak = 0;
  const d = new Date();
  while (days[d.toDateString()]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

