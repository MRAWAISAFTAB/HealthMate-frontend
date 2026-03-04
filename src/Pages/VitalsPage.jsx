import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const typeConfig = {
    BP:     { icon: '🫀', color: '#FF3B30', bg: '#FFF1F0', unit: 'mmHg' },
    Sugar:  { icon: '🩸', color: '#FF9500', bg: '#FFF8ED', unit: 'mg/dL' },
    Weight: { icon: '⚖️', color: '#34C759', bg: '#EDFAF1', unit: 'kg'    },
    Temp:   { icon: '🌡️', color: '#007AFF', bg: '#EBF4FF', unit: '°F'   },
};

const SwipeableVitalCard = ({ v, cfg, onDelete }) => {
    const [swipeX, setSwipeX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const startX = useRef(0);
    const DELETE_THRESHOLD = -75;

    const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; setIsDragging(true); };
    const handleTouchMove = (e) => { const diff = e.touches[0].clientX - startX.current; if (diff < 0) setSwipeX(Math.max(diff, -110)); };
    const handleTouchEnd = () => { setIsDragging(false); if (swipeX < DELETE_THRESHOLD) setSwipeX(-90); else setSwipeX(0); };

    const handleMouseDown = (e) => { startX.current = e.clientX; setIsDragging(true); };
    const handleMouseMove = (e) => { if (!isDragging) return; const diff = e.clientX - startX.current; if (diff < 0) setSwipeX(Math.max(diff, -110)); };
    const handleMouseUp = () => { setIsDragging(false); if (swipeX < DELETE_THRESHOLD) setSwipeX(-90); else setSwipeX(0); };

    const handleDelete = async () => { setIsDeleting(true); await onDelete(v._id); };
    const handleReset = () => setSwipeX(0);

    return (
        <AnimatePresence>
            {!isDeleting && (
                <motion.div style={{position:'relative', overflow:'hidden', borderRadius:'20px'}}
                    exit={{opacity:0, scale:0.85, height:0}} transition={{duration:0.28}}>

                    {/* Red bg */}
                    <div style={{position:'absolute',right:0,top:0,bottom:0,width:'90px',background:'#FF3B30',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'20px',flexDirection:'column',gap:'3px'}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                        <span style={{color:'white',fontSize:'10px',fontWeight:'700'}}>Delete</span>
                    </div>

                    {/* Card */}
                    <motion.div className="vital-card"
                        animate={{x: swipeX}}
                        transition={isDragging ? {duration:0} : {type:'spring',stiffness:320,damping:30}}
                        style={{position:'relative',zIndex:1,cursor:isDragging?'grabbing':'grab',userSelect:'none'}}
                        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                        onClick={swipeX < -10 ? handleReset : undefined}>

                        <div className="vital-card-top">
                            <span className="vital-type-badge" style={{background:cfg.bg,color:cfg.color}}>{v.type}</span>
                            <div className="vital-dot" style={{background:cfg.color}}/>
                        </div>
                        <div className="vital-value">{v.value}</div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div className="vital-date">{new Date(v.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                            <div className="vital-unit">{v.unit}</div>
                        </div>
                    </motion.div>

                    {swipeX <= -75 && (
                        <div onClick={handleDelete} style={{position:'absolute',right:0,top:0,bottom:0,width:'90px',zIndex:2,cursor:'pointer'}}/>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const VitalsPage = () => {
    const [vitals, setVitals] = useState([]);
    const [type, setType] = useState('BP');
    const [value, setValue] = useState('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchVitals = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/vitals`, { headers: { Authorization: `Bearer ${token}` } });
            setVitals(res.data);
        } catch (err) { console.error("Fetch error:", err); }
    };

    useEffect(() => { if (token) fetchVitals(); }, []);

    const handleSave = async () => {
        if (!value) return;
        try {
            await axios.post('http://localhost:5000/api/vitals/add',
                { type, value, unit: typeConfig[type].unit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setValue(''); fetchVitals();
        } catch (err) { alert("Save failed! Login check karein."); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/vitals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setVitals(prev => prev.filter(v => v._id !== id));
        } catch (err) { alert("Delete nahi hua!"); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
                .vitals-root { min-height: 100vh; background: #F2F2F7; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; padding-bottom: 110px; position: relative; overflow-x: hidden; }
                .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
                .blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%); top: -100px; right: -100px; animation: blobFloat 8s ease-in-out infinite; }
                .blob-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,59,48,0.07) 0%, transparent 70%); bottom: 100px; left: -80px; animation: blobFloat 11s ease-in-out infinite reverse; }
                @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(12px,-18px) scale(1.04);} }
                .content { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 0 20px; }
                .page-header { padding: 56px 0 24px; }
                .welcome-label { font-size: 13px; font-weight: 700; color: #007AFF; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px; }
                .page-title { font-size: clamp(32px,5vw,44px); font-weight: 800; color: #1C1C1E; letter-spacing: -1.5px; line-height: 1.05; margin: 0; }
                .type-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin: 24px 0 20px; scrollbar-width: none; }
                .type-pills::-webkit-scrollbar { display: none; }
                .pill { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 50px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; white-space: nowrap; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); background: white; color: #8E8E93; box-shadow: 0 2px 8px rgba(0,0,0,0.06); font-family: inherit; }
                .pill.active { color: white; transform: scale(1.04); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
                .pill-icon { font-size: 16px; }
                .input-card { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: clamp(20px,4vw,28px); margin-bottom: 32px; }
                .input-label { font-size: 11px; font-weight: 700; color: #8E8E93; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
                .value-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #F2F2F7; padding-bottom: 12px; }
                .value-input { flex: 1; font-size: clamp(40px,8vw,56px); font-weight: 800; color: #1C1C1E; background: transparent; border: none; outline: none; font-family: inherit; letter-spacing: -2px; line-height: 1; min-width: 0; }
                .value-input::placeholder { color: #E5E5EA; }
                .value-unit { font-size: 16px; font-weight: 600; color: #AEAEB2; padding-bottom: 8px; flex-shrink: 0; }
                .save-btn { width: 100%; padding: 16px; border-radius: 14px; font-size: 17px; font-weight: 700; font-family: inherit; border: none; cursor: pointer; color: white; transition: transform 0.15s ease; position: relative; overflow: hidden; }
                .save-btn:active { transform: scale(0.97); }
                .save-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); animation:shimmer 3s infinite 1s; }
                @keyframes shimmer { 0%{left:-100%;} 40%,100%{left:160%;} }
                .section-label { font-size: 11px; font-weight: 800; color: #AEAEB2; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
                .swipe-hint { font-size: 11px; color: #C7C7CC; font-weight: 500; margin-bottom: 14px; display: flex; align-items: center; gap: 5px; }
                .vitals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
                .vital-card { background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 20px; padding: 18px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
                .vital-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .vital-type-badge { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 8px; border-radius: 6px; }
                .vital-dot { width: 8px; height: 8px; border-radius: 50%; }
                .vital-value { font-size: 28px; font-weight: 800; color: #1C1C1E; letter-spacing: -1px; line-height: 1; margin-bottom: 8px; }
                .vital-date { font-size: 11px; color: #AEAEB2; font-weight: 500; }
                .vital-unit { font-size: 10px; color: #C7C7CC; font-weight: 600; }
                .empty-state { grid-column: 1/-1; text-align: center; padding: 48px 0; }
                .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.3; }
                .empty-text { font-size: 15px; font-weight: 600; color: #AEAEB2; }
                @media (min-width: 600px) { .vitals-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 900px) { .content { padding: 0 40px; } .vitals-grid { grid-template-columns: repeat(4, 1fr); } }
            `}</style>

            <div className="vitals-root">
                <div className="bg-blob blob-1"/><div className="bg-blob blob-2"/>
                <div className="content">
                    <div className="page-header">
                        <p className="welcome-label">Welcome, {user?.name || 'User'}</p>
                        <h1 className="page-title">Health<br/>Vitals</h1>
                    </div>

                    <div className="type-pills">
                        {['BP','Sugar','Weight','Temp'].map(item => {
                            const cfg = typeConfig[item];
                            return (
                                <button key={item} className={`pill ${type===item?'active':''}`}
                                    style={type===item?{background:cfg.color}:{}} onClick={()=>setType(item)}>
                                    <span className="pill-icon">{cfg.icon}</span>{item}
                                </button>
                            );
                        })}
                    </div>

                    <div className="input-card">
                        <p className="input-label">Enter {type} Reading</p>
                        <div className="value-row">
                            <input className="value-input" type="text"
                                placeholder={type==='BP'?'120/80':'95'} value={value}
                                onChange={e=>setValue(e.target.value)}/>
                            <span className="value-unit">{typeConfig[type].unit}</span>
                        </div>
                        <button className="save-btn"
                            style={{background:`linear-gradient(135deg,${typeConfig[type].color},${typeConfig[type].color}CC)`,boxShadow:`0 8px 24px ${typeConfig[type].color}44`}}
                            onClick={handleSave}>Save Entry</button>
                    </div>

                    <p className="section-label">History</p>
                    {vitals.length > 0 && (
                        <p className="swipe-hint">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                            Swipe left to delete
                        </p>
                    )}

                    <div className="vitals-grid">
                        {vitals.length > 0 ? vitals.map((v,i) => {
                            const cfg = typeConfig[v.type] || {color:'#007AFF',bg:'#EBF4FF',unit:''};
                            return (
                                <motion.div key={v._id}
                                    initial={{opacity:0,scale:0.92,y:10}}
                                    animate={{opacity:1,scale:1,y:0}}
                                    transition={{delay:i*0.04,type:'spring',stiffness:260,damping:20}}>
                                    <SwipeableVitalCard v={v} cfg={cfg} onDelete={handleDelete}/>
                                </motion.div>
                            );
                        }) : (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <div className="empty-text">No records yet</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VitalsPage;