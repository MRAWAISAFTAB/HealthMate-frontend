import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [focused, setFocused] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

                *, *::before, *::after {
                    box-sizing: border-box;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                html, body, #root {
                    margin: 0; padding: 0;
                    width: 100%; height: 100%;
                    overflow: hidden;
                }

                .signup-root {
                    height: 100vh;
                    width: 100vw;
                    background: #F2F2F7;
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 0; left: 0;
                    overflow: hidden;
                    padding: clamp(12px, 2vh, 24px) clamp(12px, 2vw, 24px);
                }

                .bg-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 0;
                }
                .blob-1 {
                    width: clamp(240px, 35vw, 520px);
                    height: clamp(240px, 35vw, 520px);
                    background: radial-gradient(circle, rgba(0,122,255,0.13) 0%, transparent 70%);
                    top: -10%; right: -8%;
                    animation: blobFloat 8s ease-in-out infinite;
                }
                .blob-2 {
                    width: clamp(200px, 28vw, 420px);
                    height: clamp(200px, 28vw, 420px);
                    background: radial-gradient(circle, rgba(52,199,89,0.10) 0%, transparent 70%);
                    bottom: 10%; left: -6%;
                    animation: blobFloat 10s ease-in-out infinite reverse;
                }
                .blob-3 {
                    width: clamp(140px, 20vw, 300px);
                    height: clamp(140px, 20vw, 300px);
                    background: radial-gradient(circle, rgba(175,82,222,0.08) 0%, transparent 70%);
                    top: 40%; right: -4%;
                    animation: blobFloat 12s ease-in-out infinite;
                }
                @keyframes blobFloat {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33% { transform: translate(10px,-15px) scale(1.05); }
                    66% { transform: translate(-8px,10px) scale(0.97); }
                }

                /* ── Page wrapper: side-by-side on desktop ── */
                .page-wrapper {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 64px;
                }

                /* ── Left panel (≥900px) ── */
                .left-panel {
                    display: none;
                    flex: 1;
                    flex-direction: column;
                    gap: 28px;
                    max-width: 460px;
                }
                @media (min-width: 900px) { .left-panel { display: flex; } }

                .left-brand { display: flex; align-items: center; gap: 12px; }
                .left-app-icon {
                    width: 52px; height: 52px;
                    background: linear-gradient(145deg, #1A8CFF, #0055D4);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 6px 20px rgba(0,122,255,0.35);
                    flex-shrink: 0;
                }
                .left-app-icon svg { width: 26px; height: 26px; }
                .left-brand-name { font-size: 17px; font-weight: 800; color: #1C1C1E; letter-spacing: -0.4px; }

                .left-tagline {
                    font-size: clamp(34px, 3.6vw, 54px);
                    font-weight: 800;
                    color: #1C1C1E;
                    letter-spacing: -2px;
                    line-height: 1.08;
                    margin: 0;
                }
                .left-sub {
                    font-size: 16px; color: #8E8E93;
                    font-weight: 400; line-height: 1.65; margin: 0;
                }

                .feature-list { display: flex; flex-direction: column; gap: 14px; }
                .feature-item { display: flex; align-items: center; gap: 14px; }
                .feature-dot {
                    width: 38px; height: 38px; border-radius: 11px;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .feature-dot svg { width: 18px; height: 18px; }
                .feature-label { font-size: 15px; font-weight: 600; color: #3A3A3C; }
                .feature-sub   { font-size: 12px; font-weight: 400; color: #8E8E93; margin-top: 1px; }

                /* ── Card (right panel) ── */
                .card {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255,255,255,0.88);
                    backdrop-filter: blur(30px);
                    -webkit-backdrop-filter: blur(30px);
                    border-radius: 28px;
                    border: 1px solid rgba(255,255,255,0.9);
                    box-shadow: 0 8px 48px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
                    padding: clamp(20px, 3vh, 36px) clamp(20px, 3vw, 36px);
                    display: flex;
                    flex-direction: column;
                }

                /* Mobile: full-screen feel */
                @media (max-width: 480px) {
                    .signup-root { padding: 0; align-items: flex-start; }
                    .card {
                        max-width: 100%;
                        height: 100vh;
                        border-radius: 0; border: none;
                        box-shadow: none;
                        background: transparent;
                        backdrop-filter: none;
                        -webkit-backdrop-filter: none;
                        padding: 0 24px;
                        justify-content: center;
                    }
                    .card-status-bar { height: 0; }
                    .card-footer { margin-top: 28px; padding-bottom: 0; }
                }

                /* Tablet (481–899px): centered card with padding */
                @media (min-width: 481px) and (max-width: 899px) {
                    .signup-root { padding: 40px 24px; }
                    .card { max-width: 460px; }
                }

                /* ── Card internals ── */
                .card-status-bar { height: 56px; }
                @media (min-width: 481px) { .card-status-bar { display: none; } }

                .card-icon-row {
                    display: flex; align-items: center; gap: 10px;
                    margin-bottom: 28px;
                }
                @media (min-width: 900px) { .card-icon-row { display: none; } }

                .app-icon {
                    width: 44px; height: 44px;
                    background: linear-gradient(145deg, #1A8CFF, #0055D4);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 16px rgba(0,122,255,0.35);
                    animation: iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
                    flex-shrink: 0;
                }
                .app-icon svg { width: 22px; height: 22px; }
                .app-name { font-size: 15px; font-weight: 700; color: #1C1C1E; letter-spacing: -0.3px; }
                @keyframes iconPop {
                    from { opacity: 0; transform: scale(0.6); }
                    to   { opacity: 1; transform: scale(1); }
                }

                .card-header { animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
                .card-header h1 {
                    font-size: clamp(24px, 3.5vw, 34px);
                    font-weight: 800; color: #1C1C1E;
                    letter-spacing: -1.2px; line-height: 1.1;
                    margin: 0 0 4px 0;
                }
                .card-header p { font-size: 15px; color: #8E8E93; margin: 0 0 16px 0; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .input-card {
                    background: rgba(255,255,255,0.95);
                    border-radius: 18px;
                    border: 1px solid rgba(0,0,0,0.06);
                    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
                    overflow: hidden;
                    transition: box-shadow 0.3s ease;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s both;
                }
                .input-card.has-focus { box-shadow: 0 4px 28px rgba(0,122,255,0.12); }

                .input-row { position: relative; display: flex; align-items: center; }
                .input-icon {
                    position: absolute; left: 15px;
                    width: 19px; height: 19px;
                    color: #C7C7CC;
                    transition: color 0.2s ease;
                    pointer-events: none; flex-shrink: 0;
                }
                .input-row.is-focused .input-icon { color: #007AFF; }

                .focus-bar {
                    position: absolute; left: 0; top: 0; bottom: 0;
                    width: 3px; background: #007AFF;
                    border-radius: 0 2px 2px 0;
                    opacity: 0; transform: scaleY(0.3);
                    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
                }
                .input-row.is-focused .focus-bar { opacity: 1; transform: scaleY(1); }

                .input-row input {
                    width: 100%;
                    padding: 15px 15px 15px 44px;
                    font-size: 16px; font-family: inherit;
                    font-weight: 500; color: #1C1C1E;
                    background: transparent; border: none; outline: none;
                }
                .input-row input::placeholder { color: #C7C7CC; font-weight: 400; }

                .divider { height: 1px; background: rgba(0,0,0,0.06); margin: 0 14px; }

                .terms-text {
                    font-size: 12px; color: #8E8E93;
                    margin: 10px 2px 0; line-height: 1.6;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both;
                }
                .terms-text a { color: #007AFF; text-decoration: none; font-weight: 500; }

                .cta-btn {
                    width: 100%;
                    background: linear-gradient(180deg, #1A8CFF 0%, #007AFF 100%);
                    color: white; padding: 16px;
                    border-radius: 14px; font-size: 17px;
                    font-weight: 700; font-family: inherit;
                    letter-spacing: -0.3px; border: none; cursor: pointer;
                    margin-top: clamp(12px, 1.5vh, 18px); position: relative; overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0,122,255,0.38), 0 2px 6px rgba(0,122,255,0.2);
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both;
                }
                .cta-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 12px 32px rgba(0,122,255,0.45), 0 2px 6px rgba(0,122,255,0.2);
                }
                .cta-btn:active:not(:disabled) { transform: scale(0.97); box-shadow: 0 4px 12px rgba(0,122,255,0.3); }
                .cta-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .cta-btn::after {
                    content: ''; position: absolute;
                    top: 0; left: -100%; width: 60%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
                    animation: shimmer 3s infinite 1s;
                }
                @keyframes shimmer { 0% { left: -100%; } 40%, 100% { left: 160%; } }

                .spinner {
                    width: 18px; height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.35);
                    border-top-color: white; border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block; vertical-align: middle; margin-right: 8px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .or-divider {
                    display: flex; align-items: center; gap: 12px;
                    margin-top: clamp(12px, 1.5vh, 20px);
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.35s both;
                }
                .or-line { flex: 1; height: 1px; background: rgba(0,0,0,0.08); }
                .or-text { font-size: 11px; color: #AEAEB2; font-weight: 700; letter-spacing: 0.8px; }

                .social-btn {
                    width: 100%; background: white;
                    border: 1px solid rgba(0,0,0,0.08); border-radius: 14px;
                    padding: 13px; display: flex; align-items: center;
                    justify-content: center; gap: 10px;
                    font-size: 15px; font-weight: 600; color: #1C1C1E;
                    font-family: inherit; cursor: pointer; margin-top: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.4s both;
                }
                .social-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.09); }
                .social-btn:active { transform: scale(0.97); }

                .card-footer {
                    margin-top: clamp(14px, 2vh, 24px); text-align: center;
                    animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.45s both;
                    padding-bottom: 0;
                }
                @media (max-width: 480px) { .card-footer { margin-top: auto; padding-bottom: 36px; } }
                .card-footer p { font-size: 15px; color: #8E8E93; font-weight: 500; margin: 0; }
                .card-footer a { color: #007AFF; font-weight: 700; text-decoration: none; margin-left: 5px; }
            `}</style>

            <div className="signup-root">
                <div className="bg-blob blob-1" />
                <div className="bg-blob blob-2" />
                <div className="bg-blob blob-3" />

                <div className="page-wrapper">

                    {/* ── LEFT PANEL (desktop only) ── */}
                    <div className="left-panel">
                        <div className="left-brand">
                            <div className="left-app-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.33 20 6.96 18.66 5.5 16.6C5.54 14.53 9.67 13.4 12 13.4C14.32 13.4 18.46 14.53 18.5 16.6C17.04 18.66 14.67 20 12 20Z" fill="white"/>
                                </svg>
                            </div>
                            <span className="left-brand-name">HealthKit</span>
                        </div>

                        <p className="left-tagline">Your health,<br />beautifully<br />secured.</p>
                        <p className="left-sub">Track, manage, and protect your health data with the privacy and elegance you deserve.</p>

                        <div className="feature-list">
                            {[
                                { bg: '#EBF4FF', stroke: '#007AFF', path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'End-to-End Encrypted', sub: 'Your data never leaves your control' },
                                { bg: '#EDFAF1', stroke: '#34C759', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', label: 'Health Monitoring', sub: 'Real-time insights at a glance' },
                                { bg: '#F5F0FF', stroke: '#AF52DE', path: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Instant Sync', sub: 'All devices, always up to date' },
                            ].map((f, i) => (
                                <div className="feature-item" key={i}>
                                    <div className="feature-dot" style={{ background: f.bg }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={f.path} />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="feature-label">{f.label}</div>
                                        <div className="feature-sub">{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── CARD ── */}
                    <div className="card">
                        <div className="card-status-bar" />

                        {/* Mobile/tablet only brand row */}
                        <div className="card-icon-row">
                            <div className="app-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.33 20 6.96 18.66 5.5 16.6C5.54 14.53 9.67 13.4 12 13.4C14.32 13.4 18.46 14.53 18.5 16.6C17.04 18.66 14.67 20 12 20Z" fill="white"/>
                                </svg>
                            </div>
                            <span className="app-name">HealthKit</span>
                        </div>

                        <div className="card-header">
                            <h1>Create Account</h1>
                            <p>Secure your health data today.</p>
                        </div>

                        <div className={`input-card ${focused ? 'has-focus' : ''}`}>
                            <div className={`input-row ${focused === 'name' ? 'is-focused' : ''}`}>
                                <div className="focus-bar" />
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <input type="text" placeholder="Full Name"
                                    onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="divider" />
                            <div className={`input-row ${focused === 'email' ? 'is-focused' : ''}`}>
                                <div className="focus-bar" />
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input type="email" placeholder="Email"
                                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="divider" />
                            <div className={`input-row ${focused === 'password' ? 'is-focused' : ''}`}>
                                <div className="focus-bar" />
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input type="password" placeholder="Password"
                                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>

                        <p className="terms-text">
                            By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </p>

                        <button className="cta-btn" onClick={handleSignup} disabled={loading}>
                            {loading && <span className="spinner" />}
                            {loading ? 'Creating Account...' : 'Continue'}
                        </button>

                        <div className="or-divider">
                            <div className="or-line" /><span className="or-text">OR</span><div className="or-line" />
                        </div>

                        <button className="social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Continue with Apple
                        </button>

                        <div className="card-footer">
                            <p>Already have an account?<Link to="/login">Sign In</Link></p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Signup;