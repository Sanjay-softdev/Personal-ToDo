import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function EditTodoModal() {
  const { todos, editTodoId, setEditTodoId, saveEdit } = useApp();

  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [assignTo, setAssignTo] = useState('both');

  const todo = todos.find(x => x.id === editTodoId);

  useEffect(() => {
    if (todo) {
      setText(todo.text || '');
      setDescription(todo.description || '');
      setCategory(todo.cat || 'general');
      setPriority(todo.priority || 'medium');
      setStatus(todo.status || 'pending');
      setDueDate(todo.dueDate || '');
      setAssignTo(todo.assignTo || 'both');
    }
  }, [todo]);

  if (!editTodoId || !todo) return null;

  const handleClose = () => {
    setEditTodoId(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'edit-modal-overlay') {
      handleClose();
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    await saveEdit(editTodoId, {
      text,
      description,
      cat: category,
      priority,
      status,
      dueDate,
      assignTo
    });
    setEditTodoId(null);
  };

  return (
    <div 
      className="edit-overlay open" 
      id="edit-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">Edit Task ✏️</div>

        <div className="field-grp">
          <div className="field-lbl">Task Title</div>
          <textarea 
            className="bulk-area" 
            rows="2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="field-grp">
          <div className="field-lbl">Description</div>
          <textarea 
            className="bulk-area" 
            rows="2" 
            placeholder="Add details…"
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

        <button className="m-submit" onClick={handleSave}>Save Changes ✦</button>
      </div>
    </div>
  );
}
