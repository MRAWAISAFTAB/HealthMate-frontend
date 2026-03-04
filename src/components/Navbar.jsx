import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    return (
        <>
            <style>{`
                .navbar {
                    position: fixed; bottom: 0; left: 0; right: 0;
                    z-index: 50;
                    padding: 0 8px;
                    padding-bottom: env(safe-area-inset-bottom, 8px);
                }

                .navbar-inner {
                    background: rgba(255,255,255,0.82);
                    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255,255,255,0.9);
                    border-radius: 24px;
                    margin-bottom: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.6) inset;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 8px 4px;
                }

                .nav-item {
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 4px; padding: 6px 16px;
                    border-radius: 16px;
                    border: none; background: none; cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
                    min-width: 64px;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                }
                .nav-item:active { transform: scale(0.88); }

                .nav-item.active {
                    background: rgba(0,122,255,0.10);
                }
                .nav-item.logout-btn {
                    background: none;
                }
                .nav-item.logout-btn:active { transform: scale(0.88); }

                .nav-icon {
                    width: 24px; height: 24px;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
                }
                .nav-item:active .nav-icon { transform: scale(0.85); }

                .nav-icon svg { width: 22px; height: 22px; }

                .nav-label {
                    font-size: 10px; font-weight: 700;
                    letter-spacing: 0.2px;
                    transition: color 0.15s ease;
                }

                .nav-item.active .nav-label { color: #007AFF; }
                .nav-item:not(.active):not(.logout-btn) .nav-label { color: #8E8E93; }
                .nav-item.logout-btn .nav-label { color: #FF3B30; }

                /* Active indicator dot */
                .active-dot {
                    width: 4px; height: 4px; border-radius: 50%;
                    background: #007AFF;
                    margin-top: -2px;
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
                }
                .nav-item.active .active-dot { opacity: 1; transform: scale(1); }
            `}</style>

            <nav className="navbar">
                <div className="navbar-inner">

                    {/* Upload */}
                    <NavLink to="/" end className={({isActive}) => `nav-item ${isActive?'active':''}`}>
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke={location.pathname==='/'?'#007AFF':'#8E8E93'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        </div>
                        <span className="nav-label">Upload</span>
                        <div className="active-dot"/>
                    </NavLink>

                    {/* Vitals */}
                    <NavLink to="/vitals" className={({isActive}) => `nav-item ${isActive?'active':''}`}>
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                style={{color: location.pathname==='/vitals'?'#007AFF':'#8E8E93'}}>
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                            </svg>
                        </div>
                        <span className="nav-label">Vitals</span>
                        <div className="active-dot"/>
                    </NavLink>

                    {/* Timeline */}
                    <NavLink to="/timeline" className={({isActive}) => `nav-item ${isActive?'active':''}`}>
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                style={{color: location.pathname==='/timeline'?'#007AFF':'#8E8E93'}}>
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <span className="nav-label">History</span>
                        <div className="active-dot"/>
                    </NavLink>

                    {/* Logout */}
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </div>
                        <span className="nav-label">Logout</span>
                    </button>

                </div>
            </nav>
        </>
    );
};

export default Navbar;