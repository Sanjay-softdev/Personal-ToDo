import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddTodoModal() {
  const { isAddModalOpen, setIsAddModalOpen, addTodos, parseTasksInput } = useApp();

  const [rawText, setRawText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [assignTo, setAssignTo] = useState('both');
  const [parsedPreview, setParsedPreview] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isAddModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150);
    }
  }, [isAddModalOpen]);

  // Handle preview rendering
  useEffect(() => {
    const parsed = parseTasksInput(rawText);
    setParsedPreview(parsed);
  }, [rawText, parseTasksInput]);

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    setIsAddModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'add-modal-overlay') {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    if (!rawText.trim()) return;
    await addTodos(rawText, category, priority, status, dueDate, assignTo, description);
    // Reset fields
    setRawText('');
    setDescription('');
    setCategory('general');
    setPriority('medium');
    setStatus('pending');
    setDueDate('');
    setAssignTo('both');
    setIsAddModalOpen(false);
  };

  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return (
    <div 
      className="overlay open" 
      id="add-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">Add to Our List ✦</div>

        <div className="field-grp">
          <div className="field-lbl">Task(s) — paste a paragraph, each line = one task</div>
          <textarea 
            ref={inputRef}
            className="bulk-area" 
            rows="4"
            placeholder="Book movie tickets for Friday&#10;Buy roses&#10;Review her login page component&#10;…paste anything here!"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          ></textarea>
          <div className="bulk-hint">💡 Paste a full paragraph or multiple lines. Each line will become its own task automatically.</div>
        </div>

        {parsedPreview.length > 0 && (
          <div className="parsed-preview show">
            <div className="preview-lbl">Will create these tasks:</div>
            <div>
              {parsedPreview.slice(0, 8).map((t, idx) => (
                <div key={idx} className="preview-item">
                  • <strong>{escapeHtml(t.text)}</strong>
                  {t.description ? ` - <em>${escapeHtml(t.description)}</em>` : ''}
                </div>
              ))}
              {parsedPreview.length > 8 && (
                <div className="preview-item" style={{ color: 'var(--rose)' }}>
                  +{parsedPreview.length - 8} more…
                </div>
              )}
            </div>
          </div>
        )}

        <div className="field-grp">
          <div className="field-lbl">Description (optional)</div>
          <textarea 
            className="bulk-area" 
            rows="2" 
            placeholder="Add details, notes, or context for this task…"
            style={{ minHeight: '60px' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="row-2">
          <div className="field-grp">
            <div className="field-lbl">Category</div>
            <select className="sel" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="general">📋 General</option>
              <option value="sms">📱 SMS Project</option>
              <option value="date">🌹 Date</option>
              <option value="shopping">🛍 Shopping</option>
              <option value="travel">✈️ Travel</option>
              <option value="food">🍽 Food</option>
              <option value="home">🏠 Home</option>
              <option value="health">💊 Health</option>
              <option value="learning">📚 Learning</option>
            </select>
          </div>
          <div className="field-grp">
            <div className="field-lbl">Priority</div>
            <select className="sel" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="urgent">🔴 Urgent (⭐×5)</option>
              <option value="high">🟠 High (⭐×3)</option>
              <option value="medium">🟡 Medium (⭐×2)</option>
              <option value="low">⚪ Low (⭐×1)</option>
            </select>
          </div>
        </div>

        <div className="row-2">
          <div className="field-grp">
            <div className="field-lbl">Status</div>
            <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
          <div className="field-grp">
            <div className="field-lbl">Due Date</div>
            <input 
              className="field-in" 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="field-grp">
          <div className="field-lbl">Assigned To</div>
          <select className="sel" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="both">Both of us</option>
            <option value="him">👦 Sanjay</option>
            <option value="her">👧 My Love</option>
          </select>
        </div>

        <button className="m-submit" onClick={handleSubmit}>Add to List 💛</button>
      </div>
    </div>
  );
}
