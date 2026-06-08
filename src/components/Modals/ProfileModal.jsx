import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Avatar, { AVATAR_SPRITES } from '../Common/Avatar';

export default function ProfileModal() {
  const { 
    session, 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    saveProfileChanges, 
    logout 
  } = useApp();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    if (session) {
      setName(session.name || '');
      setEmoji(session.emoji || '');
    }
  }, [session, isProfileModalOpen]);

  if (!isProfileModalOpen || !session) return null;

  const handleClose = () => {
    setIsProfileModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'profile-modal-overlay') {
      handleClose();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_size = 128;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > max_size) {
            h *= max_size / w;
            w = max_size;
          }
        } else {
          if (h > max_size) {
            w *= max_size / h;
            w = max_size;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const base64Data = canvas.toDataURL('image/jpeg', 0.7);
        setEmoji(base64Data);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await saveProfileChanges(name, emoji);
  };

  const handleLogout = async () => {
    setIsProfileModalOpen(false);
    await logout();
  };

  return (
    <div 
      className="overlay open" 
      id="profile-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="modal" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">My Profile 👤</div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div 
            id="p-avatar-preview-wrap"
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gold-dim)',
              border: '3px solid #000',
              borderRadius: '50%',
              boxShadow: '4px 4px 0px #000',
              overflow: 'hidden',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <div 
              style={{
                fontSize: '4.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Avatar emojiOrUrl={emoji} isPill={false} />
            </div>
          </div>
        </div>

        <div className="field-grp">
          <div className="field-lbl">Display Name</div>
          <input 
            className="field-in" 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-grp">
          <div className="field-lbl">Profile Emoji / Avatar</div>
          <input 
            className="field-in" 
            type="text" 
            placeholder="e.g. 👦, 👧, 🐼, 🍕 or select below"
            maxLength="30"
            value={emoji.startsWith('data:image/') ? 'Custom Image File 🖼️' : emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
          <input 
            type="file" 
            id="p-file-input" 
            accept="image/*" 
            style={{ display: 'none' }}
            onChange={handleImageUpload} 
          />

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.8rem', flexWrap: 'wrap' }}>
            <button 
              className="flt" 
              onClick={() => document.getElementById('p-file-input').click()}
              style={{ background: 'var(--blue)', color: 'white', borderColor: '#000', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            >
              🖼️ Choose from Gallery
            </button>
          </div>

          <div className="field-lbl" style={{ marginTop: '0.8rem', fontSize: '0.72rem', textTransform: 'uppercase' }}>
            ✨ Cute Animal Avatars
          </div>
          
          <div 
            id="sprite-picker-grid"
            style={{
              display: 'flex',
              gap: '0.4rem',
              justifyContent: 'center',
              marginTop: '0.4rem',
              flexWrap: 'wrap',
              maxHeight: '110px',
              overflowY: 'auto',
              padding: '0.3rem',
              border: '3px solid #000',
              borderRadius: '8px',
              background: 'var(--surface)',
              boxShadow: '2px 2px 0px #000'
            }}
          >
            {Object.keys(AVATAR_SPRITES).map(key => {
              const sprite = AVATAR_SPRITES[key];
              const x = sprite.c * 33.333;
              const y = sprite.r * 25;
              return (
                <button 
                  key={key}
                  className="sprite-btn" 
                  onClick={() => setEmoji(`sprite:${key}`)}
                  title={key} 
                  style={{ 
                    backgroundPosition: `${x}% ${y}%`, 
                    backgroundRepeat: 'no-repeat' 
                  }}
                ></button>
              );
            })}
          </div>

          <div className="field-lbl" style={{ marginTop: '0.8rem', fontSize: '0.72rem', textTransform: 'uppercase' }}>
            Standard Emojis
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            {['👦', '👧', '🐱', '🐼', '🦊', '🦄', '💖', '🔥'].map(em => (
              <button 
                key={em}
                className="flt" 
                onClick={() => setEmoji(em)}
                style={{ padding: '0.3rem 0.6rem', fontSize: '1.1rem' }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button className="m-submit" onClick={handleSave} style={{ background: 'var(--green)', margin: 0 }}>
            Save Profile ✦
          </button>
          <button className="m-submit" onClick={handleLogout} style={{ background: 'var(--rose)', margin: 0 }}>
            Sign Out ⏏
          </button>
        </div>
      </div>
    </div>
  );
}
