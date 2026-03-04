import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Timeline = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const token = localStorage.getItem('token');
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get(`${API}/api/reports/my-history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(res.data);
            } catch (err) {
                console.error("History fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Yeh report delete karna chahte hain?")) return;
        setDeletingId(id);
        try {
            await axios.delete(`${API}/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            alert("Delete nahi hua!");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

                .timeline-root { min-height: 100vh; background: #F2F2F7; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; padding-bottom: 100px; position: relative; }
                .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
                .blob-1 { width: 360px; height: 360px; background: radial-gradient(circle,rgba(0,122,255,0.09) 0%,transparent 70%); top: -60px; right: -60px; animation: blobFloat 9s ease-in-out infinite; }
                .blob-2 { width: 280px; height: 280px; background: radial-gradient(circle,rgba(175,82,222,0.07) 0%,transparent 70%); bottom: 80px; left: -60px; animation: blobFloat 12s ease-in-out infinite reverse; }
                @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(10px,-14px) scale(1.04);} }

                .sticky-header { position: sticky; top: 0; z-index: 10; background: rgba(242,242,247,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(0,0,0,0.06); padding: 56px 20px 16px; }
                .header-inner { max-width: 800px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; }
                .page-title { font-size: clamp(28px,5vw,40px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 3px 0; }
                .page-sub { font-size: 14px; color: #8E8E93; font-weight: 400; margin: 0; }
                .report-count { font-size: 12px; font-weight: 700; color: #AEAEB2; background: white; padding: 6px 12px; border-radius: 50px; }

                .content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 20px 20px 0; }

                .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 16px; }
                .loader { width: 32px; height: 32px; border: 3px solid rgba(0,122,255,0.15); border-top-color: #007AFF; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to{transform:rotate(360deg);} }
                .loading-text { font-size: 14px; color: #8E8E93; font-weight: 500; }

                .empty-wrap { display: flex; flex-direction: column; align-items: center; padding: 80px 0; }
                .empty-icon { font-size: 56px; margin-bottom: 14px; opacity: 0.25; }
                .empty-title { font-size: 18px; font-weight: 700; color: #AEAEB2; margin-bottom: 6px; }
                .empty-sub { font-size: 14px; color: #C7C7CC; font-weight: 400; }

                .report-card { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 16px; }

                .report-img-wrap { height: clamp(140px,18vw,200px); position: relative; overflow: hidden; background: linear-gradient(135deg,#E8EAED,#D1D1D6); }
                .report-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: transform 0.4s ease; }
                .report-card:hover .report-img { transform: scale(1.02); }
                .img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 100%); }
                .date-badge { position: absolute; top: 14px; left: 14px; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; color: #3A3A3C; }
                .delete-btn { position: absolute; top: 14px; right: 14px; background: rgba(255,59,48,0.9); backdrop-filter: blur(12px); border: none; border-radius: 50px; padding: 6px 14px; font-size: 11px; font-weight: 700; color: white; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 5px; transition: background 0.15s; }
                .delete-btn:hover { background: rgba(255,59,48,1); }
                .delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .del-spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
                .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; opacity: 0.3; }

                .report-body { padding: clamp(14px,3vw,22px); }
                .report-top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
                .ai-badge { display: inline-flex; align-items: center; gap: 5px; background: #EBF4FF; color: #007AFF; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
                .ai-dot { width: 5px; height: 5px; background: #007AFF; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
                .report-filename { font-size: clamp(15px,2.5vw,18px); font-weight: 700; color: #1C1C1E; letter-spacing: -0.3px; margin-bottom: 12px; }

                /* Summary sections */
                .summary-block { background: #F9F9FB; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; }
                .summary-label { font-size: 10px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
                .summary-en { font-size: 14px; color: #3A3A3C; line-height: 1.7; font-weight: 400; }
                .summary-ur { font-size: 15px; color: #1C1C1E; line-height: 1.9; font-weight: 500; direction: ltr; text-align: left; font-family: 'Plus Jakarta Sans', system-ui; }

                /* Tags */
                .tag-section { margin-bottom: 10px; }
                .tag-title { font-size: 10px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 7px; }
                .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }
                .tag { padding: 5px 10px; border-radius: 7px; font-size: 12px; font-weight: 600; }
                .tag-red { background: #FFF1F0; color: #FF3B30; }
                .tag-blue { background: #EBF4FF; color: #007AFF; }
                .tag-green { background: #EDFAF1; color: #34C759; }
                .tag-orange { background: #FFF8ED; color: #FF9500; }

                /* Expand toggle */
                .expand-btn { width: 100%; background: none; border: none; border-top: 1px solid #F2F2F7; padding: 12px; font-size: 13px; font-weight: 700; color: #007AFF; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s; }
                .expand-btn:hover { background: #F9F9FB; }
                .expand-arrow { transition: transform 0.25s ease; }
                .expand-arrow.open { transform: rotate(180deg); }

                .stats-row { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
                .stat-chip { background: #F2F2F7; border-radius: 8px; padding: 5px 11px; font-size: 12px; font-weight: 600; color: #8E8E93; }

                .disclaimer-text { font-size: 11px; color: #AEAEB2; font-style: italic; line-height: 1.6; margin-top: 10px; }

                @media (min-width: 600px) { .sticky-header { padding: 40px 40px 16px; } .content { padding: 20px 40px 0; } }
            `}</style>

            <div className="timeline-root">
                <div className="bg-blob blob-1"/><div className="bg-blob blob-2"/>

                <div className="sticky-header">
                    <div className="header-inner">
                        <div>
                            <h1 className="page-title">Timeline</h1>
                            <p className="page-sub">Your medical journey at a glance.</p>
                        </div>
                        {reports.length > 0 && <span className="report-count">{reports.length} Reports</span>}
                    </div>
                </div>

                <div className="content">
                    {loading ? (
                        <div className="loading-wrap">
                            <div className="loader"/>
                            <p className="loading-text">Loading your health history...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="empty-wrap">
                            <div className="empty-icon">🗂️</div>
                            <div className="empty-title">No reports yet</div>
                            <div className="empty-sub">Upload your first medical report to get started</div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {reports.map((report, index) => {
                                const ai = report.aiAnalysis || {};
                                const isExpanded = expandedId === report._id;
                                return (
                                    <motion.div key={report._id} className="report-card"
                                        initial={{opacity:0, y:24}}
                                        animate={{opacity:1, y:0}}
                                        exit={{opacity:0, scale:0.95, height:0}}
                                        transition={{delay:index*0.05, type:'spring', stiffness:240, damping:22}}>

                                        {/* Image */}
                                        <div className="report-img-wrap">
                                            {report.fileUrl ? (
                                                <><img src={report.fileUrl} alt="Report" className="report-img"/><div className="img-overlay"/></>
                                            ) : (
                                                <div className="img-placeholder">📄</div>
                                            )}
                                            <span className="date-badge">
                                                {new Date(report.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                                            </span>
                                            <button className="delete-btn" onClick={() => handleDelete(report._id)} disabled={deletingId === report._id}>
                                                {deletingId === report._id ? (
                                                    <div className="del-spinner"/>
                                                ) : (
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                                                    </svg>
                                                )}
                                                Delete
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="report-body">
                                            <div className="report-top-row">
                                                <span className="ai-badge"><div className="ai-dot"/>Gemini AI</span>
                                            </div>
                                            <h3 className="report-filename">{report.fileName}</h3>

                                            {/* English Summary */}
                                            {ai.summaryEnglish && (
                                                <div className="summary-block">
                                                    <p className="summary-label">📋 English Summary</p>
                                                    <p className="summary-en">{ai.summaryEnglish}</p>
                                                </div>
                                            )}

                                            {/* Urdu Summary */}
                                            {ai.summaryUrdu && (
                                                <div className="summary-block">
                                                    <p className="summary-label">🌙 Roman Urdu Summary</p>
                                                    <p className="summary-ur">{ai.summaryUrdu}</p>
                                                </div>
                                            )}

                                            {/* Abnormal values always visible */}
                                            {ai.abnormalValues?.length > 0 && (
                                                <div className="tag-section">
                                                    <p className="tag-title">⚠️ Abnormal Values</p>
                                                    <div className="tag-list">
                                                        {ai.abnormalValues.map((v,i) => <span key={i} className="tag tag-red">{v}</span>)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expandable details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{opacity:0, height:0}}
                                                        animate={{opacity:1, height:'auto'}}
                                                        exit={{opacity:0, height:0}}
                                                        transition={{duration:0.3}}>

                                                        {ai.doctorQuestions?.length > 0 && (
                                                            <div className="tag-section">
                                                                <p className="tag-title">🩺 Doctor se Puchein</p>
                                                                <div className="tag-list">
                                                                    {ai.doctorQuestions.map((q,i) => <span key={i} className="tag tag-blue">{q}</span>)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {ai.foodsToAvoid?.length > 0 && (
                                                            <div className="tag-section">
                                                                <p className="tag-title">🚫 Foods to Avoid</p>
                                                                <div className="tag-list">
                                                                    {ai.foodsToAvoid.map((f,i) => <span key={i} className="tag tag-red">{f}</span>)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {ai.recommendedFoods?.length > 0 && (
                                                            <div className="tag-section">
                                                                <p className="tag-title">✅ Recommended Foods</p>
                                                                <div className="tag-list">
                                                                    {ai.recommendedFoods.map((f,i) => <span key={i} className="tag tag-green">{f}</span>)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {ai.homeRemedies?.length > 0 && (
                                                            <div className="tag-section">
                                                                <p className="tag-title">🌿 Home Remedies</p>
                                                                <div className="tag-list">
                                                                    {ai.homeRemedies.map((r,i) => <span key={i} className="tag tag-orange">{r}</span>)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {ai.disclaimer && (
                                                            <p className="disclaimer-text">⚕️ {ai.disclaimer}</p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="stats-row">
                                                <span className="stat-chip">📋 Analyzed</span>
                                                <span className="stat-chip">🔒 Private</span>
                                                {ai.abnormalValues?.length > 0 && <span className="stat-chip" style={{background:'#FFF1F0',color:'#FF3B30'}}>⚠️ {ai.abnormalValues.length} Abnormal</span>}
                                            </div>
                                        </div>

                                        {/* Expand button */}
                                        {(ai.doctorQuestions?.length > 0 || ai.foodsToAvoid?.length > 0 || ai.recommendedFoods?.length > 0 || ai.homeRemedies?.length > 0) && (
                                            <button className="expand-btn" onClick={() => toggleExpand(report._id)}>
                                                {isExpanded ? 'Show Less' : 'Show More Details'}
                                                <svg className={`expand-arrow ${isExpanded?'open':''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </>
    );
};

export default Timeline;