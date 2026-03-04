import React, { useState } from 'react';

const AddVitals = () => {
    const [vitalType, setVitalType] = useState('BP');
    const [value, setValue] = useState('');

    const typeConfig = {
        BP:     { icon: '🫀', color: '#FF3B30', bg: '#FFF1F0', unit: 'mmHg',  placeholder: '120/80', hint: 'Systolic / Diastolic' },
        Sugar:  { icon: '🩸', color: '#FF9500', bg: '#FFF8ED', unit: 'mg/dL', placeholder: '95',     hint: 'Fasting or post-meal' },
        Weight: { icon: '⚖️', color: '#34C759', bg: '#EDFAF1', unit: 'kg',    placeholder: '70.5',   hint: 'Morning weight preferred' },
        Temp:   { icon: '🌡️', color: '#007AFF', bg: '#EBF4FF', unit: '°F',   placeholder: '98.6',   hint: 'Oral or ear reading' },
    };
    const cfg = typeConfig[vitalType];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

                .addvitals-root {
                    min-height: 100vh;
                    background: #F2F2F7;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                    padding-bottom: 100px;
                    position: relative; overflow-x: hidden;
                }
                .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
                .blob-1 { width: 360px; height: 360px; top: -80px; right: -80px; animation: blobFloat 9s ease-in-out infinite; }
                .blob-2 { width: 280px; height: 280px; bottom: 80px; left: -60px; animation: blobFloat 12s ease-in-out infinite reverse; }
                @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(10px,-14px) scale(1.04);} }

                .content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; padding: 0 20px; }

                .page-header { padding: 56px 0 28px; }
                .page-title { font-size: clamp(30px,5vw,42px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 6px 0; }
                .page-sub { font-size: 15px; color: #8E8E93; margin: 0; font-weight: 400; }

                /* Pills */
                .type-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 28px; scrollbar-width: none; }
                .type-pills::-webkit-scrollbar { display: none; }
                .pill {
                    display: flex; align-items: center; gap: 7px;
                    padding: 11px 20px; border-radius: 50px;
                    font-size: 14px; font-weight: 700;
                    border: none; cursor: pointer; white-space: nowrap;
                    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
                    background: white; color: #8E8E93;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.07);
                    font-family: inherit;
                }
                .pill.active { color: white; transform: scale(1.05); }
                .pill-icon { font-size: 17px; }

                /* Main input card */
                .main-card {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-radius: 26px; border: 1px solid rgba(255,255,255,0.8);
                    box-shadow: 0 6px 32px rgba(0,0,0,0.07);
                    padding: clamp(22px,4vw,32px);
                    transition: box-shadow 0.3s ease;
                }

                .type-hero { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
                .type-icon-wrap { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
                .type-hero-name { font-size: 20px; font-weight: 800; color: #1C1C1E; letter-spacing: -0.5px; }
                .type-hero-hint { font-size: 12px; color: #8E8E93; font-weight: 400; margin-top: 2px; }

                .input-row { display: flex; align-items: flex-end; gap: 10px; padding-bottom: 16px; margin-bottom: 8px; border-bottom: 1.5px solid #F2F2F7; }
                .big-input { flex: 1; font-size: clamp(44px,9vw,60px); font-weight: 800; color: #1C1C1E; background: transparent; border: none; outline: none; font-family: inherit; letter-spacing: -2px; line-height: 1; min-width: 0; }
                .big-input::placeholder { color: #E5E5EA; }
                .unit-label { font-size: 18px; font-weight: 600; color: #AEAEB2; padding-bottom: 10px; flex-shrink: 0; }

                .hint-text { font-size: 12px; color: #C7C7CC; font-weight: 500; margin-bottom: 22px; }

                .save-btn {
                    width: 100%; padding: 17px; border-radius: 14px;
                    font-size: 17px; font-weight: 700; font-family: inherit;
                    letter-spacing: -0.3px; border: none; cursor: pointer; color: white;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    position: relative; overflow: hidden;
                }
                .save-btn:hover { transform: translateY(-1px); }
                .save-btn:active { transform: scale(0.97); }
                .save-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); animation:shimmer 3s infinite 1s; }
                @keyframes shimmer { 0%{left:-100%;} 40%,100%{left:160%;} }

                /* Quick reference */
                .ref-section { margin-top: 28px; }
                .ref-title { font-size: 11px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
                .ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .ref-card { background: rgba(255,255,255,0.8); border-radius: 16px; padding: 14px; border: 1px solid rgba(0,0,0,0.04); }
                .ref-range { font-size: 13px; font-weight: 700; color: #1C1C1E; margin-bottom: 2px; }
                .ref-label { font-size: 11px; color: #8E8E93; font-weight: 500; }

                @media (min-width: 768px) {
                    .content { padding: 0 40px; }
                    .ref-grid { grid-template-columns: repeat(4, 1fr); }
                }
            `}</style>

            <div className="addvitals-root">
                <div className="bg-blob blob-1" style={{background:`radial-gradient(circle, ${cfg.color}22 0%, transparent 70%)`}}/>
                <div className="bg-blob blob-2" style={{background:`radial-gradient(circle, ${cfg.color}15 0%, transparent 70%)`}}/>

                <div className="content">
                    <div className="page-header">
                        <h1 className="page-title">Add Vitals</h1>
                        <p className="page-sub">Log your health reading</p>
                    </div>

                    <div className="type-pills">
                        {['BP','Sugar','Weight','Temp'].map(item => {
                            const c = typeConfig[item];
                            return (
                                <button key={item} className={`pill ${vitalType===item?'active':''}`}
                                    style={vitalType===item ? {background:c.color, boxShadow:`0 6px 20px ${c.color}44`} : {}}
                                    onClick={()=>setVitalType(item)}>
                                    <span className="pill-icon">{c.icon}</span>{item}
                                </button>
                            );
                        })}
                    </div>

                    <div className="main-card">
                        <div className="type-hero">
                            <div className="type-icon-wrap" style={{background:cfg.bg}}>
                                {cfg.icon}
                            </div>
                            <div>
                                <div className="type-hero-name">{vitalType} Reading</div>
                                <div className="type-hero-hint">{cfg.hint}</div>
                            </div>
                        </div>

                        <div className="input-row">
                            <input className="big-input" type="text"
                                placeholder={cfg.placeholder}
                                value={value}
                                onChange={e=>setValue(e.target.value)}/>
                            <span className="unit-label">{cfg.unit}</span>
                        </div>
                        <p className="hint-text">Tap to enter your {vitalType} value</p>

                        <button className="save-btn"
                            style={{
                                background:`linear-gradient(135deg, ${cfg.color}, ${cfg.color}BB)`,
                                boxShadow:`0 8px 24px ${cfg.color}44`
                            }}>
                            Save Record
                        </button>
                    </div>

                    {/* Quick reference ranges */}
                    <div className="ref-section">
                        <p className="ref-title">Normal Ranges</p>
                        <div className="ref-grid">
                            {[
                                {range:'<120/80', label:'Normal BP'},
                                {range:'70–100', label:'Fasting Sugar'},
                                {range:'18.5–24.9', label:'Healthy BMI'},
                                {range:'97–99°F', label:'Normal Temp'},
                            ].map((r,i)=>(
                                <div className="ref-card" key={i}>
                                    <div className="ref-range">{r.range}</div>
                                    <div className="ref-label">{r.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddVitals;