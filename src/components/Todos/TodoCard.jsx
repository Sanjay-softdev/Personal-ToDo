import React from 'react';
import { useApp } from '../../context/AppContext';
import { CAT_ICONS, STAR_MAP, getUserLabel, priLabel, statusColor, fmtDate } from '../../utils/helpers';

// Star pop animation utility
function spawnStarAnim(x, y, count) {
  for (let i = 0; i < Math.min(count, 5); i++) {
    const el = document.createElement('div');
    el.className = 'star-pop';
    el.textContent = '⭐';
    el.style.left = `${x + (Math.random() - 0.5) * 40}px`;
    el.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    el.style.animationDelay = `${i * 0.12}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

export default function TodoCard({ todo }) {
  const { 
    session, 
    profilesMap, 
    chkToggle, 
    setStatus, 
    deleteTodo, 
    setEditTodoId, 
    setQueryTodoId 
  } = useApp();

  const done = todo.status === 'completed';
  const overdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !done;
  
  const creatorLabel = todo.addedBy === 'him' ? getUserLabel('him', profilesMap) : getUserLabel('her', profilesMap);
  const assignLabel = todo.assignTo === 'both' ? 'Both' : (todo.assignTo === 'him' ? getUserLabel('him', profilesMap) : getUserLabel('her', profilesMap));
  const stars = STAR_MAP[todo.priority] || 1;
  const isCreator = todo.addedBy === session.role;

  const handleCheck = async (who, e) => {
    e.stopPropagation();
    const result = await chkToggle(todo.id, who);
    if (result && result.animated) {
      const starBadge = document.getElementById('star-badge');
      if (starBadge) {
        const rect = starBadge.getBoundingClientRect();
        spawnStarAnim(rect.left, rect.top, result.stars);
      }
    }
  };

  const handleStatusChange = async (val) => {
    const result = await setStatus(todo.id, val);
    if (result && result.animated) {
      const starBadge = document.getElementById('star-badge');
      if (starBadge) {
        const rect = starBadge.getBoundingClientRect();
        spawnStarAnim(rect.left, rect.top, result.stars);
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditTodoId(todo.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteTodo(todo.id);
  };

  const handleQuery = (e) => {
    e.stopPropagation();
    setQueryTodoId(todo.id);
  };

  return (
    <div className={`todo-card p-${todo.priority} ${done ? 's-done' : ''}`} id={`tc-${todo.id}`}>
      {isCreator && (
        <div className="tc-actions">
          <button className="tc-act-btn" onClick={handleEdit} title="Edit task">✏️</button>
          <button className="tc-act-btn" onClick={handleDelete} title="Delete">×</button>
        </div>
      )}
      <div className="tc-top">
        <div className="tc-checks">
          <div 
            className={`chk him ${todo.himDone ? 'on' : ''}`} 
            title="Sanjay mark" 
            onClick={(e) => handleCheck('him', e)}
          >
            {todo.himDone ? '✓' : ''}
          </div>
          <div 
            className={`chk her ${todo.herDone ? 'on' : ''}`} 
            title="Her mark" 
            onClick={(e) => handleCheck('her', e)}
          >
            {todo.herDone ? '✓' : ''}
          </div>
        </div>
        <div className="tc-body">
          <div className={`tc-text ${done ? 'struck' : ''}`}>
            {CAT_ICONS[todo.cat] || '📋'} {todo.text}
          </div>
          {todo.description && (
            <div className="tc-desc">{todo.description}</div>
          )}
          <div className="tc-meta">
            <span className={`pill by-${todo.addedBy}`}>{creatorLabel}</span>
            <span className="pill cat">{CAT_ICONS[todo.cat] || '📋'} {todo.cat}</span>
            <span className={`pill p-${todo.priority}`}>{priLabel(todo.priority)}</span>
            <span className="pill stars">⭐×{stars}</span>
            {overdue && <span className="pill overdue">⚠️ Overdue</span>}
            {todo.dueDate && !overdue && (
              <span className="pill due">📅 {fmtDate(todo.dueDate)}</span>
            )}
            <span className="pill cat">→ {assignLabel}</span>
          </div>
          <div className="tc-status-row">
            <span className="tc-status-item">
              <span className="sdot" style={{ background: statusColor(todo.status) }}></span>
              <select 
                className={`status-sel ${todo.status}`} 
                value={todo.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </span>
            <span className="tc-status-item" style={{ marginLeft: '0.3rem' }}>
              <span className="sdot" style={{ background: todo.himDone ? 'var(--him)' : 'var(--border)' }}></span>👦
              <span className="sdot" style={{ background: todo.herDone ? 'var(--her)' : 'var(--border)' }}></span>👧
            </span>
          </div>
        </div>
      </div>
      <button 
        className="tc-query-btn" 
        onClick={handleQuery} 
        title="Ask question about this task"
      >
        💬
      </button>
    </div>
  );
}
