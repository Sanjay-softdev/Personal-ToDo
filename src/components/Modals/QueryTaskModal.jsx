import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function QueryTaskModal() {
  const { todos, queryTodoId, setQueryTodoId, sendTaskQuery } = useApp();
  const [queryText, setQueryText] = useState('');
  const inputRef = useRef(null);

  const todo = todos.find(x => x.id === queryTodoId);

  useEffect(() => {
    if (queryTodoId && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150);
    }
  }, [queryTodoId]);

  if (!queryTodoId || !todo) return null;

  const handleClose = () => {
    setQueryTodoId(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'query-modal-overlay') {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    if (!queryText.trim()) return;
    await sendTaskQuery(queryTodoId, queryText);
    setQueryText('');
    setQueryTodoId(null);
  };

  return (
    <div 
      className="overlay open" 
      id="query-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">Ask about Task 💬</div>

        <div 
          style={{ 
            fontSize: '0.95rem', 
            marginBottom: '1.2rem', 
            background: 'var(--surface)', 
            padding: '0.8rem', 
            border: '3px solid #000', 
            borderRadius: '8px', 
            boxShadow: '2px 2px 0px #000', 
            fontFamily: "'Comic Neue', cursive", 
            fontWeight: 'bold', 
            color: '#000' 
          }}
        >
          Task: <strong>{todo.text}</strong>
        </div>

        <div className="field-grp">
          <div className="field-lbl">Your Question</div>
          <textarea 
            ref={inputRef}
            className="bulk-area" 
            rows="3" 
            placeholder="Type your question here…"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          ></textarea>
        </div>

        <button className="m-submit" onClick={handleSubmit}>Send Question 🚀</button>
      </div>
    </div>
  );
}
