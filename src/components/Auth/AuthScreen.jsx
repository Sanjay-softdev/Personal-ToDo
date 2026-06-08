import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AuthScreen() {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email.trim() || !password) {
      setErrorMsg('Enter email and password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      await login(email, password);
    } catch (e) {
      setErrorMsg(e.message || 'Login failed.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div id="auth-screen">
      <div className="auth-brand">
        <img className="auth-logo-img" src="/love-logo.png" alt="Love logo" />
        <div className="auth-title">Our Little <em>Space</em></div>
        <div className="auth-sub">PRIVATE · SHARED · MOTIVATED</div>
      </div>
      <div className="auth-card">
        <div 
          style={{ 
            textAlign: 'center', 
            marginBottom: '1.2rem', 
            fontSize: '0.85rem', 
            color: 'var(--text2)', 
            fontWeight: '500' 
          }}
        >
          Sign In
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="field-grp">
            <div className="field-lbl">Email</div>
            <input 
              className="field-in" 
              type="email" 
              placeholder="your@email.com" 
              autoComplete="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field-grp">
            <div className="field-lbl">Password</div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                className="field-in" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                autoComplete="current-password"
                style={{ paddingRight: '2.8rem' }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.15rem', 
                  padding: '0', 
                  outline: 'none', 
                  userSelect: 'none' 
                }}
              >
                <span>{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Signing in…' : 'Sign In'}
          </button>
          
          <div className={`auth-err ${errorMsg ? 'show' : ''}`}>
            {errorMsg}
          </div>
        </form>

        <div className="auth-hint">
          Private space for just the two of us 💜🤍<br />
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
            Your data syncs in real-time via cloud ☁️
          </span>
        </div>
      </div>
    </div>
  );
}
