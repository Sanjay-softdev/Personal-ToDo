import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/helpers';

const NUDGES = [
  "Every line of code you write is one step closer to something real. I see you grinding 🔥",
  "Your consistency is your superpower. Keep pushing, I'm watching you grow 💪",
  "Even if it's messy today, it's progress. Clean code comes after working code. Go! ✨",
  "I believe in you more than you know. Check off that next task 💛",
  "You're building something real. That's more than most people ever do 🚀",
  "Small wins today = big wins next week. Keep the streak going! 🔥",
  "Stuck? Break it into smaller pieces. You've solved harder things before 🧩",
  "Your future self will thank you for the work you put in today 🌸",
  "One commit at a time. One task at a time. You've got this 💻",
  "I'm proud of how far you've come. Don't stop now 💜"
];

export default function NotesTab() {
  const { session, notes, sendNudge, sendNote } = useApp();

  const [nudgeText, setNudgeText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);

  // Initialize random nudge
  const selectRandomNudge = () => {
    const msg = NUDGES[Math.floor(Math.random() * NUDGES.length)];
    setNudgeText(msg);
  };

  useEffect(() => {
    selectRandomNudge();
  }, []);

  const handleSendNudge = async () => {
    await sendNudge(nudgeText);
    selectRandomNudge();
  };

  const handleSendNote = async () => {
    if (!noteText.trim()) return;
    await sendNote(noteText, replyTargetId);
    setNoteText('');
    setReplyTargetId(null);
  };

  const handleReplyInitiate = (noteId) => {
    setReplyTargetId(noteId);
    const textInput = document.getElementById('note-text-area');
    if (textInput) textInput.focus();
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
  };

  const replyTarget = notes.find(x => x.id === replyTargetId);

  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return (
    <div className="tab-pane active" id="tab-notes">
      {session.role === 'him' && (
        <div className="nudge-card" id="nudge-compose">
          <div className="nudge-title">✦ Send a Motivation Nudge</div>
          <div className="nudge-msg">"{nudgeText}"</div>
          <button className="nudge-send-btn" onClick={handleSendNudge}>
            Send this to her 💛
          </button>
        </div>
      )}

      <div className="section-head">Check-in Note</div>

      {/* Reply Preview Bar */}
      {replyTargetId && replyTarget && (
        <div 
          id="reply-preview-container"
          style={{ 
            display: 'flex', 
            background: '#fff', 
            border: '3px solid #000', 
            borderBottom: 'none', 
            borderRadius: 'var(--r) var(--r) 0 0', 
            padding: '0.6rem 0.8rem', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            fontFamily: "'Comic Neue', cursive", 
            fontWeight: 700, 
            boxShadow: '2px 2px 0px #000', 
            marginBottom: '-3px', 
            position: 'relative', 
            zIndex: 2 
          }}
        >
          <div 
            style={{ 
              fontSize: '0.82rem', 
              color: '#000', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              flex: 1, 
              marginRight: '0.5rem',
              textAlign: 'left'
            }}
          >
            <span style={{ color: 'var(--rose)' }}>↳ Replying to {replyTarget.fromName}: </span>
            <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              "{replyTarget.text.slice(0, 40)}{replyTarget.text.length > 40 ? '...' : ''}"
            </span>
          </div>
          <button 
            className="flt" 
            onClick={handleCancelReply}
            style={{ 
              background: 'var(--gold)', 
              borderColor: '#000', 
              padding: '0.15rem 0.4rem', 
              fontSize: '0.75rem', 
              lineHeight: 1, 
              cursor: 'pointer', 
              fontWeight: 900, 
              margin: '0' 
            }}
          >
            ×
          </button>
        </div>
      )}

      <textarea 
        id="note-text-area"
        className="note-input" 
        placeholder="Write a note, encouragement, or update…"
        style={{ marginTop: 0 }}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      ></textarea>
      <button className="note-send" onClick={handleSendNote}>Send ✦</button>

      <div className="section-head" style={{ marginTop: '1rem' }}>Messages</div>
      
      <div id="notes-feed">
        {notes.length === 0 ? (
          <div className="empty">
            <div className="ei">💬</div>
            <p>No messages yet.<br />Send a note or nudge!</p>
          </div>
        ) : (
          notes.slice(0, 20).map(n => {
            let parentNote = null;
            if (n.replyTo) {
              parentNote = notes.find(x => x.id === n.replyTo);
            }
            return (
              <div key={n.id} className={`msg-bubble from-${n.from}`}>
                {parentNote && (
                  <div 
                    className="reply-badge-bubble" 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.05)', 
                      borderLeft: '3px solid var(--rose)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '6px', 
                      fontSize: '0.76rem', 
                      marginBottom: '0.4rem', 
                      color: '#555', 
                      textAlign: 'left' 
                    }}
                  >
                    <strong>{parentNote.fromName}:</strong> {parentNote.text.slice(0, 50)}{parentNote.text.length > 50 ? '...' : ''}
                  </div>
                )}
                <div style={{ wordBreak: 'break-word', textAlign: 'left' }}>
                  {n.type === 'nudge' ? '💛 ' : ''}{n.text}
                </div>
                <div 
                  className="msg-meta" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem', 
                    marginTop: '0.4rem' 
                  }}
                >
                  <span>
                    {n.fromName} · {timeAgo(n.ts)}
                    {n.type === 'nudge' ? ' · motivation nudge' : ''}
                  </span>
                  <button 
                    onClick={() => handleReplyInitiate(n.id)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      padding: 0, 
                      fontFamily: "'Fredoka', sans-serif", 
                      fontSize: '0.72rem', 
                      color: 'var(--rose)', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.15rem', 
                      transition: 'transform 0.1s' 
                    }}
                  >
                    ↩️ Reply
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
