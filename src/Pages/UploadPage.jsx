import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return alert("Bhai, pehle report toh select karo! 📁");
    setLoading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('reportName', file.name);
    const userData = JSON.parse(localStorage.getItem('user'));
    formData.append('userId', userData.id);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setResult(response.data.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Masla ho gaya: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
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

        .page-header { padding: 56px 0 28px; animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .app-icon { width: 44px; height: 44px; background: linear-gradient(145deg,#1A8CFF,#0055D4); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,122,255,0.35); flex-shrink: 0; }
        .app-icon svg { width: 22px; height: 22px; }
        .app-name { font-size: 15px; font-weight: 700; color: #1C1C1E; }
        .page-title { font-size: clamp(30px,5vw,44px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 6px 0; }
        .page-sub { font-size: 15px; color: #8E8E93; font-weight: 400; margin: 0; }

        @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

        /* Upload card */
        .upload-card {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-radius: 28px; border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 6px 32px rgba(0,0,0,0.07);
          padding: clamp(20px,4vw,32px);
          margin-bottom: 20px;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }

        /* Drop zone */
        .drop-zone {
          border: 2px dashed #D1D1D6;
          border-radius: 20px;
          padding: clamp(36px,6vw,56px) 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          background: rgba(242,242,247,0.5);
          position: relative; overflow: hidden;
        }
        .drop-zone.dragging { border-color: #007AFF; background: rgba(0,122,255,0.05); transform: scale(1.01); }
        .drop-zone.has-file { border-color: #34C759; background: rgba(52,199,89,0.05); border-style: solid; }

        .drop-icon-wrap {
          width: 68px; height: 68px; margin: 0 auto 14px;
          background: linear-gradient(145deg,#EBF4FF,#D6EBFF);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .drop-zone.dragging .drop-icon-wrap { transform: scale(1.15); }
        .drop-zone.has-file .drop-icon-wrap { background: linear-gradient(145deg,#EDFAF1,#C8F5D6); }
        .drop-icon-wrap svg { width: 30px; height: 30px; }

        .drop-title { font-size: 17px; font-weight: 700; color: #1C1C1E; margin-bottom: 5px; }
        .drop-sub { font-size: 13px; color: #8E8E93; margin-bottom: 14px; }
        .file-tags { display: flex; gap: 7px; justify-content: center; flex-wrap: wrap; }
        .file-tag { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: white; color: #8E8E93; border: 1px solid #E5E5EA; }

        .file-selected { display: flex; align-items: center; gap: 12px; text-align: left; }
        .file-icon-box { width: 48px; height: 48px; background: rgba(52,199,89,0.12); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .file-icon-box svg { width: 22px; height: 22px; color: #34C759; }
        .file-name { font-size: 15px; font-weight: 700; color: #1C1C1E; margin-bottom: 2px; word-break: break-all; }
        .file-size { font-size: 12px; color: #8E8E93; }
        .file-remove { margin-left: auto; background: #F2F2F7; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #8E8E93; cursor: pointer; flex-shrink: 0; font-family: inherit; transition: background 0.15s; }
        .file-remove:hover { background: #E5E5EA; }

        .hidden-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        /* Analyze button */
        .analyze-btn {
          width: 100%; padding: 17px; border-radius: 14px; margin-top: 18px;
          font-size: 17px; font-weight: 700; font-family: inherit;
          letter-spacing: -0.3px; border: none; cursor: pointer; color: white;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          position: relative; overflow: hidden;
        }
        .analyze-btn.ready {
          background: linear-gradient(180deg,#1A8CFF 0%,#007AFF 100%);
          box-shadow: 0 8px 24px rgba(0,122,255,0.38);
        }
        .analyze-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(0,122,255,0.45); }
        .analyze-btn.ready:active { transform: scale(0.97); }
        .analyze-btn.loading-state { background: #AEAEB2; cursor: not-allowed; }
        .analyze-btn.no-file { background: #E5E5EA; color: #AEAEB2; cursor: not-allowed; }
        .analyze-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); animation:shimmer 3s infinite 1s; }
        @keyframes shimmer { 0%{left:-100%;} 40%,100%{left:160%;} }

        /* Spinner */
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to{transform:rotate(360deg);} }

        /* Loading pulse dots */
        .analyzing-wrap { display: flex; align-items: center; justify-content: center; gap: 6px; }
        .pulse-dot { width: 6px; height: 6px; background: white; border-radius: 50%; animation: pulseDot 1.2s ease-in-out infinite; }
        .pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .pulse-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulseDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4;} 40%{transform:scale(1);opacity:1;} }

        /* Features row */
        .features { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
        .feat { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.7); border-radius: 50px; padding: 7px 13px; font-size: 12px; font-weight: 600; color: #3A3A3C; border: 1px solid rgba(0,0,0,0.04); }
        .feat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* Result card */
        .result-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-radius: 28px; border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 6px 32px rgba(0,0,0,0.07);
          overflow: hidden; margin-bottom: 16px;
        }
        .result-header { padding: 20px 24px 16px; border-bottom: 1px solid #F2F2F7; display: flex; align-items: center; gap: 10px; }
        .ai-badge { display: inline-flex; align-items: center; gap: 5px; background: #EBF4FF; color: #007AFF; font-size: 10px; font-weight: 800; padding: 5px 10px; border-radius: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-pulse { width: 5px; height: 5px; background: #007AFF; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .result-title { font-size: 17px; font-weight: 800; color: #1C1C1E; letter-spacing: -0.4px; flex: 1; }

        .result-body { padding: 20px 24px 24px; }
        .summary-label { font-size: 10px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .summary-text { font-size: 17px; color: #1C1C1E; line-height: 1.75; font-weight: 400; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', system-ui; text-align: right; }

        .result-footer { padding: 14px 24px; background: #F9F9FB; border-top: 1px solid #F2F2F7; display: flex; gap: 8px; flex-wrap: wrap; }
        .stat-chip { background: white; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #8E8E93; border: 1px solid #F2F2F7; }

        /* Privacy footer */
        .privacy-footer { text-align: center; padding: 20px 0 0; }
        .privacy-text { font-size: 11px; color: #AEAEB2; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

        @media (min-width: 768px) { .content { padding: 0 40px; } }
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

          {/* Upload card */}
          <div className="upload-card">
            <div
              className={`drop-zone ${dragging?'dragging':''} ${file?'has-file':''}`}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}>

              {!file ? (
                <>
                  <div className="drop-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="drop-title">Drop your report here</p>
                  <p className="drop-sub">or tap to browse files</p>
                  <div className="file-tags">
                    {['PDF','PNG','JPG','JPEG'].map(t=><span className="file-tag" key={t}>{t}</span>)}
                  </div>
                  <input className="hidden-input" type="file" id="fileInput" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange}/>
                </>
              ) : (
                <div className="file-selected">
                  <div className="file-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size/1024).toFixed(1)} KB</div>
                  </div>
                  <button className="file-remove" onClick={e=>{e.stopPropagation();setFile(null);setResult(null);}}>Remove</button>
                </div>
              )}
            </div>

            <button
              className={`analyze-btn ${loading?'loading-state':file?'ready':'no-file'}`}
              onClick={handleUpload}
              disabled={loading || !file}>
              {loading ? (
                <div className="analyzing-wrap">
                  <span className="spinner"/>
                  Analyzing...
                </div>
              ) : file ? '✦ Analyze Report' : 'Select a File First'}
            </button>

            <div className="features">
              {[
                {dot:'#007AFF', label:'Gemini AI'},
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

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="result-card"
                initial={{opacity:0, y:28, scale:0.97}}
                animate={{opacity:1, y:0, scale:1}}
                exit={{opacity:0, y:16}}
                transition={{type:'spring', stiffness:240, damping:22}}>

                <div className="result-header">
                  <span className="ai-badge"><div className="ai-pulse"/>Gemini AI Analysis</span>
                </div>

                <div className="result-body">
                  <p className="summary-label">Urdu Summary</p>
                  <p className="summary-text">{result.aiAnalysis.summaryUrdu}</p>
                </div>

                <div className="result-footer">
                  <span className="stat-chip">📋 Analyzed</span>
                  <span className="stat-chip">🔒 Private</span>
                  <span className="stat-chip">✦ AI Powered</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="privacy-footer">
            <p className="privacy-text">🔒 Privacy Protected by HealthKit AI</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;