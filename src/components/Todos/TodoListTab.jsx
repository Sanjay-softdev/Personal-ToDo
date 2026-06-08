import React from 'react';
import { useApp } from '../../context/AppContext';
import TodayTasksBanner from './TodayTasksBanner';
import FiltersRow from './FiltersRow';
import TodoCard from './TodoCard';
import { CAT_ICONS } from '../../utils/helpers';

export default function TodoListTab() {
  const { 
    todos, 
    flt, 
    session, 
    setIsAddModalOpen 
  } = useApp();

  // Filter logic
  let filtered = [...todos];
  if (flt === 'active') {
    filtered = todos.filter(t => t.status === 'pending');
  } else if (flt === 'in-progress') {
    filtered = todos.filter(t => t.status === 'in-progress');
  } else if (flt === 'completed') {
    filtered = todos.filter(t => t.status === 'completed');
  } else if (flt === 'mine') {
    filtered = todos.filter(t => t.assignTo === 'both' || (session.role === 'him' ? t.assignTo === 'him' : t.assignTo === 'her'));
  } else if (flt === 'hers') {
    filtered = todos.filter(t => t.assignTo === 'her' || t.assignTo === 'both');
  } else if (['urgent', 'high', 'medium', 'low'].includes(flt)) {
    filtered = todos.filter(t => t.priority === flt);
  } else if (CAT_ICONS[flt]) {
    filtered = todos.filter(t => t.cat === flt);
  }

  // Sort logic
  const priOrd = { urgent: 0, high: 1, medium: 2, low: 3 };
  const stOrd = { pending: 0, 'in-progress': 1, completed: 2 };

  filtered.sort((a, b) => {
    if (stOrd[a.status] !== stOrd[b.status]) {
      return stOrd[a.status] - stOrd[b.status];
    }
    return (priOrd[a.priority] ?? 2) - (priOrd[b.priority] ?? 2);
  });

  return (
    <div className="tab-pane active" id="tab-todos">
      <TodayTasksBanner />
      <FiltersRow />

      <div id="todos-list">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="ei">🌸</div>
            <p>Nothing here.<br />Tap ＋ to add tasks!</p>
          </div>
        ) : (
          filtered.map(todo => (
            <TodoCard key={todo.id} todo={todo} />
          ))
        )}
      </div>

      <button 
        className="fab" 
        onClick={() => setIsAddModalOpen(true)} 
        id="add-fab"
      >
        ＋
      </button>
    </div>
  );
}
