import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { timeAgo } from '../../utils/helpers';

export default function RedeemTab() {
  const { session, redeems, calcHerStars, submitRedeem } = useApp();

  const [wishMsg, setWishMsg] = useState('');
  const [phone, setPhone] = useState('');

  if (session.role !== 'her') return null;

  const stars = calcHerStars();
  const progress = Math.min(100, stars % 100);
  const rewardCount = Math.floor(stars / 100);

  const handleSubmit = async () => {
    if (!wishMsg.trim()) return;
    await submitRedeem(wishMsg, phone);
    setWishMsg('');
    setPhone('');
  };

  return (
    <div className="tab-pane active" id="tab-redeem">
      <div className="redeem-hero">
        <div className="redeem-star-count" id="redeem-star-count">{stars}</div>
        <div className="redeem-star-label">⭐ Your Stars</div>
        <div className="redeem-progress-wrap">
          <div 
            className="redeem-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="redeem-hint">
          {progress} / 100 stars · {rewardCount} reward{rewardCount !== 1 ? 's' : ''} available
        </div>
      </div>

      <div className="star-legend">
        <div className="star-legend-item">🔴 Urgent = ⭐⭐⭐⭐⭐</div>
        <div className="star-legend-item">🟠 High = ⭐⭐⭐</div>
        <div className="star-legend-item">🟡 Medium = ⭐⭐</div>
        <div className="star-legend-item">⚪ Low = ⭐</div>
      </div>

      <div className="redeem-form-card">
        <div className="redeem-form-title">🎁 Make a Wish Request</div>
        <div className="field-lbl" style={{ marginBottom: '0.3rem' }}>What do you want? 💭</div>
        <textarea 
          className="redeem-textarea" 
          placeholder="I want… a special dinner date 🌹, new earrings 💎, a movie night 🎬…"
          value={wishMsg}
          onChange={(e) => setWishMsg(e.target.value)}
        ></textarea>
        
        <div className="field-lbl" style={{ marginTop: '0.7rem', marginBottom: '0.3rem' }}>
          Your phone / link / details
        </div>
        <input 
          className="redeem-input" 
          type="text" 
          placeholder="Phone number or any extra info…" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <button 
          className="redeem-btn" 
          disabled={stars < 100}
          onClick={handleSubmit}
        >
          {stars >= 100 ? '⭐ Redeem 100 Stars for This Wish' : `Need ${100 - stars} more stars to redeem`}
        </button>
      </div>

      <div className="section-head">Your Wish History</div>
      <div className="redeem-history-card">
        {redeems.length === 0 ? (
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', padding: '0.5rem 0' }}>
            No wishes yet. Earn stars by completing tasks! 🌟
          </div>
        ) : (
          [...redeems].reverse().map(r => (
            <div key={r.id} className="redeem-item">
              <div className="redeem-item-icon">
                {r.status === 'approved' ? '🎁' : r.status === 'rejected' ? '💔' : '⏳'}
              </div>
              <div className="redeem-item-body">
                <div className="redeem-item-msg" style={{ fontWeight: 'bold' }}>{r.message}</div>
                {r.phone && <div className="redeem-item-phone" style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem' }}>📞 {r.phone}</div>}
                <div className="redeem-item-meta" style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                  Requested {timeAgo(r.ts)} · -100 ⭐
                </div>
              </div>
              <span className={`redeem-status ${r.status}`}>
                {r.status === 'approved' ? '✓ Granted' : r.status === 'rejected' ? '✗ Denied' : '⏳ Pending'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
