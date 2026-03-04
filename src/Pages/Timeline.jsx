import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Timeline = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/reports/my-history', {
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

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

                .timeline-root {
                    min-height: 100vh;
                    background: #F2F2F7;
                    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
                    padding-bottom: 100px;
                    position: relative;
                }

                .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
                .blob-1 { width: 360px; height: 360px; background: radial-gradient(circle,rgba(0,122,255,0.09) 0%,transparent 70%); top: -60px; right: -60px; animation: blobFloat 9s ease-in-out infinite; }
                .blob-2 { width: 280px; height: 280px; background: radial-gradient(circle,rgba(175,82,222,0.07) 0%,transparent 70%); bottom: 80px; left: -60px; animation: blobFloat 12s ease-in-out infinite reverse; }
                @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(10px,-14px) scale(1.04);} }

                /* Sticky header */
                .sticky-header {
                    position: sticky; top: 0; z-index: 10;
                    background: rgba(242,242,247,0.85);
                    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    padding: 56px 20px 16px;
                }
                .header-inner { max-width: 800px; margin: 0 auto; }
                .page-title { font-size: clamp(28px,5vw,40px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0 0 3px 0; }
                .page-sub { font-size: 14px; color: #8E8E93; font-weight: 400; margin: 0; }

                .content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 20px 20px 0; }

                /* Loading */
                .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 16px; }
                .loader { width: 32px; height: 32px; border: 3px solid rgba(0,122,255,0.15); border-top-color: #007AFF; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to{transform:rotate(360deg);} }
                .loading-text { font-size: 14px; color: #8E8E93; font-weight: 500; }

                /* Empty */
                .empty-wrap { display: flex; flex-direction: column; align-items: center; padding: 80px 0; }
                .empty-icon { font-size: 56px; margin-bottom: 14px; opacity: 0.25; }
                .empty-title { font-size: 18px; font-weight: 700; color: #AEAEB2; margin-bottom: 6px; }
                .empty-sub { font-size: 14px; color: #C7C7CC; font-weight: 400; }

                /* Report card */
                .report-card {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.8);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    overflow: hidden; margin-bottom: 16px;
                }

                /* Image area */
                .report-img-wrap {
                    height: clamp(160px,20vw,220px);
                    position: relative; overflow: hidden;
                    background: linear-gradient(135deg,#E8EAED,#D1D1D6);
                }
                .report-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: transform 0.4s ease; }
                .report-card:hover .report-img { transform: scale(1.02); }
                .img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%); }
                .date-badge {
                    position: absolute; top: 14px; right: 14px;
                    background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
                    padding: 5px 12px; border-radius: 50px;
                    font-size: 11px; font-weight: 700; color: #3A3A3C;
                }
                .img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; opacity: 0.3; }

                /* Card body */
                .report-body { padding: clamp(16px,3vw,24px); }
                .ai-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: #EBF4FF; color: #007AFF;
                    font-size: 10px; font-weight: 800;
                    padding: 4px 10px; border-radius: 7px;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }
                .ai-dot { width: 5px; height: 5px; background: #007AFF; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

                .report-filename { font-size: clamp(16px,2.5vw,20px); font-weight: 700; color: #1C1C1E; letter-spacing: -0.4px; margin-bottom: 14px; }

                .summary-section { border-top: 1px solid #F2F2F7; padding-top: 14px; }
                .summary-label { font-size: 10px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .summary-text { font-size: 15px; color: #3A3A3C; line-height: 1.7; font-weight: 400; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', system-ui; }

                /* Stats row */
                .stats-row { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
                .stat-chip { background: #F2F2F7; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: #8E8E93; }

                @media (min-width: 600px) {
                    .sticky-header { padding: 40px 40px 16px; }
                    .content { padding: 20px 40px 0; }
                }
            `}</style>

            <div className="timeline-root">
                <div className="bg-blob blob-1"/><div className="bg-blob blob-2"/>

                <div className="sticky-header">
                    <div className="header-inner">
                        <h1 className="page-title">Timeline</h1>
                        <p className="page-sub">Your medical journey at a glance.</p>
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
                        reports.map((report, index) => (
                            <motion.div
                                key={report._id}
                                className="report-card"
                                initial={{opacity:0, y:24}}
                                whileInView={{opacity:1, y:0}}
                                viewport={{once:true, margin:'-40px'}}
                                transition={{delay:index*0.06, type:'spring', stiffness:240, damping:22}}>

                                {/* Image */}
                                <div className="report-img-wrap">
                                    {report.fileUrl ? (
                                        <>
                                            <img src={report.fileUrl} alt="Report" className="report-img"/>
                                            <div className="img-overlay"/>
                                        </>
                                    ) : (
                                        <div className="img-placeholder">📄</div>
                                    )}
                                    <span className="date-badge">
                                        {new Date(report.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="report-body">
                                    <span className="ai-badge"><div className="ai-dot"/>Gemini AI Analysis</span>
                                    <h3 className="report-filename">{report.fileName}</h3>

                                    {report.aiAnalysis?.summaryUrdu && (
                                        <div className="summary-section">
                                            <p className="summary-label">Summary (Urdu)</p>
                                            <p className="summary-text">{report.aiAnalysis.summaryUrdu}</p>
                                        </div>
                                    )}

                                    <div className="stats-row">
                                        <span className="stat-chip">📋 Analyzed</span>
                                        <span className="stat-chip">🔒 Private</span>
                                        {report.aiAnalysis?.keyFindings && <span className="stat-chip">✦ Key Findings</span>}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Timeline;