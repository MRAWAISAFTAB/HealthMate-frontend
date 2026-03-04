import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResultSheet = ({ isOpen, onClose, data }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .sheet-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.38);
          backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
          z-index: 40;
        }

        .sheet {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 50;
          background: rgba(250,250,252,0.97);
          backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border-radius: 32px 32px 0 0;
          border-top: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 -8px 48px rgba(0,0,0,0.12);
          max-height: 88vh;
          overflow-y: auto;
          padding: 12px 24px 40px;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          scrollbar-width: none;
        }
        .sheet::-webkit-scrollbar { display: none; }

        /* Handle */
        .sheet-handle {
          width: 36px; height: 5px;
          background: #D1D1D6; border-radius: 3px;
          margin: 0 auto 20px; flex-shrink: 0;
        }

        /* Header */
        .sheet-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .sheet-title { font-size: 22px; font-weight: 800; color: #1C1C1E; letter-spacing: -0.6px; margin: 0; }
        .sheet-close {
          width: 32px; height: 32px;
          background: #E5E5EA; border: none; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s ease;
          flex-shrink: 0;
        }
        .sheet-close:hover { background: #D1D1D6; }
        .sheet-close:active { transform: scale(0.9); }
        .sheet-close svg { width: 14px; height: 14px; color: #3A3A3C; }

        /* AI badge */
        .ai-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .ai-badge { display: inline-flex; align-items: center; gap: 5px; background: #EBF4FF; color: #007AFF; font-size: 10px; font-weight: 800; padding: 5px 10px; border-radius: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-pulse { width: 5px; height: 5px; background: #007AFF; border-radius: 50%; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

        /* Urdu summary card */
        .urdu-card {
          background: linear-gradient(135deg, rgba(0,122,255,0.06), rgba(0,122,255,0.03));
          border: 1px solid rgba(0,122,255,0.12);
          border-radius: 22px; padding: 20px;
          margin-bottom: 16px;
        }
        .urdu-label { font-size: 10px; font-weight: 800; color: #007AFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .urdu-text {
          font-size: 18px; color: #1C1C1E; line-height: 1.8;
          font-weight: 500; direction: rtl; text-align: right;
          font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', system-ui;
        }

        /* Abnormal values */
        .section-label { font-size: 11px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }

        .abnormal-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .abnormal-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,59,48,0.08); color: #FF3B30;
          border: 1px solid rgba(255,59,48,0.15);
          padding: 8px 14px; border-radius: 50px;
          font-size: 13px; font-weight: 600;
        }
        .warn-icon { font-size: 13px; flex-shrink: 0; }

        .all-normal {
          background: rgba(52,199,89,0.08); border: 1px solid rgba(52,199,89,0.15);
          border-radius: 16px; padding: 14px 18px;
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }
        .normal-icon { font-size: 20px; }
        .normal-text { font-size: 14px; font-weight: 600; color: #34C759; }

        /* Stats row */
        .stats-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .stat-chip { background: white; border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 600; color: #8E8E93; border: 1px solid #F2F2F7; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }

        /* Done button */
        .done-btn {
          width: 100%; padding: 17px; border-radius: 14px;
          font-size: 17px; font-weight: 700; font-family: inherit;
          letter-spacing: -0.3px; border: none; cursor: pointer;
          background: linear-gradient(180deg,#1A8CFF 0%,#007AFF 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(0,122,255,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .done-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(0,122,255,0.42); }
        .done-btn:active { transform: scale(0.97); }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="sheet-overlay"
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
              className="sheet"
              initial={{y:'100%'}}
              animate={{y:0}}
              exit={{y:'100%'}}
              transition={{type:'spring', damping:28, stiffness:220}}>

              <div className="sheet-handle"/>

              <div className="sheet-header">
                <h2 className="sheet-title">Analysis Results</h2>
                <button className="sheet-close" onClick={onClose}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* AI Badge */}
              <div className="ai-badge-row">
                <span className="ai-badge"><div className="ai-pulse"/>Gemini AI Analysis</span>
              </div>

              {/* Urdu Summary */}
              <div className="urdu-card">
                <p className="urdu-label">Urdu Summary</p>
                <p className="urdu-text">{data?.summaryUrdu || 'Analysis pending...'}</p>
              </div>

              {/* Abnormal Values */}
              <p className="section-label">Attention Required</p>
              {data?.abnormalValues?.length > 0 ? (
                <div className="abnormal-grid">
                  {data.abnormalValues.map((val,i) => (
                    <span className="abnormal-pill" key={i}>
                      <span className="warn-icon">⚠️</span>{val}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="all-normal">
                  <span className="normal-icon">✅</span>
                  <span className="normal-text">Everything looks normal.</span>
                </div>
              )}

              {/* Stats */}
              <div className="stats-row">
                <span className="stat-chip">📋 Analyzed</span>
                <span className="stat-chip">🔒 Private</span>
                <span className="stat-chip">✦ AI Powered</span>
              </div>

              <button className="done-btn" onClick={onClose}>Done</button>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResultSheet;