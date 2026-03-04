import React, { useState } from 'react';

const ReportUpload = () => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) setFile(selected);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

                .upload-root {
                    min-height: 100vh;
                    background: #F2F2F7;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                    padding-bottom: 100px;
                    position: relative; overflow-x: hidden;
                }
                .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
                .blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,122,255,0.10) 0%, transparent 70%); top: -80px; right: -80px; animation: blobFloat 9s ease-in-out infinite; }
                .blob-2 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(52,199,89,0.08) 0%, transparent 70%); bottom: 60px; left: -80px; animation: blobFloat 12s ease-in-out infinite reverse; }
                .blob-3 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(175,82,222,0.07) 0%, transparent 70%); top: 40%; right: -40px; animation: blobFloat 14s ease-in-out infinite; }
                @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(10px,-14px) scale(1.04);} }

                .content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 0 20px; }

                .page-header { padding: 56px 0 32px; }
                .header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .app-icon { width: 44px; height: 44px; background: linear-gradient(145deg,#1A8CFF,#0055D4); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,122,255,0.35); flex-shrink: 0; }
                .app-icon svg { width: 22px; height: 22px; }
                .app-name { font-size: 15px; font-weight: 700; color: #1C1C1E; }
                .page-title { font-size: clamp(30px,5vw,44px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 6px 0; }
                .page-sub { font-size: 15px; color: #8E8E93; font-weight: 400; margin: 0; }

                /* Upload card */
                .upload-card {
                    background: rgba(255,255,255,0.88);
                    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                    border-radius: 28px; border: 1px solid rgba(255,255,255,0.8);
                    box-shadow: 0 6px 32px rgba(0,0,0,0.07);
                    padding: clamp(24px,4vw,36px);
                    margin-bottom: 20px;
                }

                .drop-zone {
                    border: 2px dashed #D1D1D6;
                    border-radius: 20px;
                    padding: clamp(40px,6vw,60px) 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    background: rgba(242,242,247,0.5);
                    position: relative;
                    overflow: hidden;
                }
                .drop-zone.dragging { border-color: #007AFF; background: rgba(0,122,255,0.05); transform: scale(1.01); }
                .drop-zone.has-file { border-color: #34C759; background: rgba(52,199,89,0.05); }

                .drop-icon-wrap {
                    width: 72px; height: 72px; margin: 0 auto 16px;
                    background: linear-gradient(145deg, #EBF4FF, #D6EBFF);
                    border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
                }
                .drop-zone.dragging .drop-icon-wrap { transform: scale(1.15); }
                .drop-icon-wrap svg { width: 32px; height: 32px; color: #007AFF; }

                .drop-title { font-size: 17px; font-weight: 700; color: #1C1C1E; margin-bottom: 6px; }
                .drop-sub { font-size: 13px; color: #8E8E93; font-weight: 400; margin-bottom: 16px; }
                .file-types { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
                .file-tag { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: white; color: #8E8E93; border: 1px solid #E5E5EA; }

                .file-selected { display: flex; align-items: center; gap: 12px; }
                .file-icon-box { width: 48px; height: 48px; background: rgba(52,199,89,0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .file-icon-box svg { width: 22px; height: 22px; color: #34C759; }
                .file-name { font-size: 15px; font-weight: 700; color: #1C1C1E; margin-bottom: 2px; word-break: break-all; text-align: left; }
                .file-size { font-size: 12px; color: #8E8E93; text-align: left; }
                .file-remove { margin-left: auto; background: #F2F2F7; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #8E8E93; cursor: pointer; flex-shrink: 0; font-family: inherit; }

                .hidden-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

                .analyze-btn {
                    width: 100%; padding: 17px; border-radius: 14px; margin-top: 20px;
                    font-size: 17px; font-weight: 700; font-family: inherit;
                    letter-spacing: -0.3px; border: none; cursor: pointer; color: white;
                    background: linear-gradient(180deg,#1A8CFF 0%,#007AFF 100%);
                    box-shadow: 0 8px 24px rgba(0,122,255,0.38);
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    position: relative; overflow: hidden;
                }
                .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(0,122,255,0.45); }
                .analyze-btn:active { transform: scale(0.97); }
                .analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
                .analyze-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); animation:shimmer 3s infinite 1s; }
                @keyframes shimmer { 0%{left:-100%;} 40%,100%{left:160%;} }

                /* Feature pills */
                .features { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
                .feat { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.8); border-radius: 50px; padding: 8px 14px; font-size: 12px; font-weight: 600; color: #3A3A3C; border: 1px solid rgba(0,0,0,0.04); }
                .feat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

                /* Privacy footer */
                .privacy-footer { text-align: center; padding: 24px 0; }
                .privacy-text { font-size: 11px; color: #AEAEB2; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
                .lock-icon { display: inline-block; margin-right: 5px; }

                @media (min-width: 768px) {
                    .content { padding: 0 40px; }
                }
            `}</style>

            <div className="upload-root">
                <div className="bg-blob blob-1"/><div className="bg-blob blob-2"/><div className="bg-blob blob-3"/>
                <div className="content">
                    <div className="page-header">
                        <div className="header-top">
                            <div className="app-icon">
                                <svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C9.33 20 6.96 18.66 5.5 16.6C5.54 14.53 9.67 13.4 12 13.4C14.32 13.4 18.46 14.53 18.5 16.6C17.04 18.66 14.67 20 12 20Z" fill="white"/></svg>
                            </div>
                            <span className="app-name">HealthKit</span>
                        </div>
                        <h1 className="page-title">Upload<br/>Report</h1>
                        <p className="page-sub">AI-powered medical analysis</p>
                    </div>

                    <div className="upload-card">
                        <div
                            className={`drop-zone ${dragging?'dragging':''} ${file?'has-file':''}`}
                            onDragOver={e=>{e.preventDefault();setDragging(true);}}
                            onDragLeave={()=>setDragging(false)}
                            onDrop={handleDrop}>

                            {!file ? (
                                <>
                                    <div className="drop-icon-wrap">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                    <p className="drop-title">Drop your report here</p>
                                    <p className="drop-sub">or tap to browse files</p>
                                    <div className="file-types">
                                        {['PDF','PNG','JPG','JPEG'].map(t=><span className="file-tag" key={t}>{t}</span>)}
                                    </div>
                                    <input className="hidden-input" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange}/>
                                </>
                            ) : (
                                <div className="file-selected">
                                    <div className="file-icon-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                    <div style={{flex:1, minWidth:0}}>
                                        <div className="file-name">{file.name}</div>
                                        <div className="file-size">{(file.size/1024).toFixed(1)} KB</div>
                                    </div>
                                    <button className="file-remove" onClick={e=>{e.stopPropagation();setFile(null);}}>Remove</button>
                                </div>
                            )}
                        </div>

                        <button className="analyze-btn" disabled={!file}>
                            {file ? '✦ Analyze Now' : 'Select a File First'}
                        </button>

                        <div className="features">
                            {[
                                {dot:'#007AFF', label:'Gemini AI Analysis'},
                                {dot:'#34C759', label:'Urdu Summary'},
                                {dot:'#FF9500', label:'Key Findings'},
                                {dot:'#AF52DE', label:'Private & Secure'},
                            ].map((f,i)=>(
                                <div className="feat" key={i}>
                                    <div className="feat-dot" style={{background:f.dot}}/>
                                    {f.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="privacy-footer">
                        <p className="privacy-text">
                            <span className="lock-icon">🔒</span>
                            Privacy Protected by HealthKit AI
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportUpload;