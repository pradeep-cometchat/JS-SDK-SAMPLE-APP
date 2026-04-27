import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getUserById, ALL_USERS, STATUS_COLORS, EMOJIS, formatTime, formatFullTime } from '../data';
import { Avatar, StatusDot } from './Avatar';
import { CloseIcon, SearchIcon, PhoneIcon, VideoIcon, ScreenShareIcon, RecordIcon, TrashIcon, LogoutIcon, ChevronRightIcon, EmojiIcon } from './Icons';

/* ─── MOBILE DETECT HOOK ───────────────────────────────────── */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
};

/* ─── CALL OVERLAY ─────────────────────────────────────────── */
export const CallOverlay = ({ call, onAccept, onEnd, currentUser }) => {
  const [callState, setCallState] = useState(call.incoming ? 'ringing' : 'calling');
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showVBg, setShowVBg] = useState(false);
  const [virtualBg, setVirtualBg] = useState('none');
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const selfVideoRef = useRef(null);

  // Attach stream to video element when available
  useEffect(() => {
    if (selfVideoRef.current && streamRef.current) {
      selfVideoRef.current.srcObject = streamRef.current;
    }
  });

  useEffect(() => {
    if (!call.incoming) {
      const constraints = { audio: true, video: call.type === 'video' };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          streamRef.current = stream;
          if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
        })
        .catch(() => console.warn('Permission denied'));
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [call.incoming, call.type]);

  useEffect(() => {
    if (!call.incoming) {
      const t = setTimeout(() => setCallState('in-call'), 2800);
      return () => clearTimeout(t);
    }
  }, [call.incoming]);

  useEffect(() => {
    if (callState === 'in-call') {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  const fmtDuration = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const handleAccept = () => {
    const constraints = { audio: true, video: call.type === 'video' };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        streamRef.current = stream;
        if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
      })
      .catch(() => console.warn('Permission denied'));
    setCallState('in-call');
    onAccept?.();
  };
  const handleEnd = () => {
    clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    onEnd();
  };
  const vBgOptions = ['none', 'blur', 'office', 'mountains', 'gradient'];

  return (
    <div className="call-overlay">
      <div className="call-modal">
        <div className={`call-bg-shimmer ${callState}`} />
        {call.type === 'video' && callState === 'in-call' ? (
          <div className="video-call-area">
            <div className="video-main" style={{ background: virtualBg === 'blur' ? '#1a1628' : virtualBg === 'office' ? '#2d3748' : virtualBg === 'mountains' ? '#1e3a5f' : virtualBg === 'gradient' ? 'linear-gradient(135deg,#6851D6,#0ea5e9)' : '#1a1628' }}>
              <div className="video-user-label">{call.user.name}</div>
              {/* Remote user — show avatar (demo, no real remote stream) */}
              <div className="video-avatar-large"><Avatar user={call.user} size={80} /></div>
              {videoOff && <div className="video-off-badge">Camera off</div>}
            </div>
            {/* Self video PIP — show real camera feed */}
            <div className="video-self-pip" style={{ background: videoOff ? '#2a2338' : 'transparent', overflow: 'hidden' }}>
              {!videoOff && streamRef.current ? (
                <video ref={selfVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              ) : (
                <>
                  <Avatar user={currentUser} size={32} />
                  <div className="pip-label">You</div>
                </>
              )}
            </div>
            {screenSharing && (
              <div className="screen-share-badge"><ScreenShareIcon size={12} /> Screen sharing active</div>
            )}
          </div>
        ) : (
          <div className="audio-call-area">
            <div className={`call-avatar-ring ${callState}`}>
              <div className="ring ring1" /><div className="ring ring2" /><div className="ring ring3" />
              <div className="call-avatar-center"><Avatar user={call.user} size={72} /></div>
            </div>
            <div className="call-user-name">{call.user.name}</div>
            <div className="call-status-text">
              {callState === 'ringing' ? 'Incoming call…' : callState === 'calling' ? 'Calling…' : fmtDuration(duration)}
            </div>
            {callState === 'in-call' && call.type === 'audio' && (
              <div className="audio-wave">
                {[...Array(12)].map((_, i) => <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />)}
              </div>
            )}
          </div>
        )}
        {showVBg && call.type === 'video' && (
          <div className="vbg-panel">
            <div className="vbg-title">Virtual Background</div>
            <div className="vbg-options">
              {vBgOptions.map(bg => (
                <button key={bg} className={`vbg-opt${virtualBg === bg ? ' selected' : ''}`} onClick={() => setVirtualBg(bg)}>
                  <div className="vbg-preview" style={{ background: bg === 'none' ? '#2a2338' : bg === 'blur' ? '#1a1628' : bg === 'office' ? '#2d3748' : bg === 'mountains' ? '#1e3a5f' : 'linear-gradient(135deg,#6851D6,#0ea5e9)' }} />
                  <span>{bg === 'none' ? 'None' : bg.charAt(0).toUpperCase() + bg.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="call-controls">
          {callState === 'ringing' ? (
            <>
              <div style={{ textAlign: 'center' }}>
                <button className="call-ctrl-btn decline" onClick={handleEnd} title="Decline">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9a11.1 11.1 0 00-3.37 2.46c-.18.18-.43.29-.7.29-.28 0-.53-.11-.71-.29L.29 14.46A.996.996 0 010 13.75c0-.28.11-.53.29-.71C3.34 9.78 7.46 8 12 8s8.66 1.78 11.71 5.04c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-1.77 1.77c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.29a11.1 11.1 0 00-3.37-2.46.981.981 0 01-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Decline</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button className="call-ctrl-btn accept" onClick={handleAccept} title="Accept">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1H8c.55 0 1 .45 1 1 0 1.26.2 2.47.57 3.58.11.35.03.74-.24 1.02L6.6 10.8z" /></svg>
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Accept</div>
              </div>
            </>
          ) : callState === 'calling' ? (
            <div style={{ textAlign: 'center' }}>
              <button className="call-ctrl-btn decline" onClick={handleEnd} title="Cancel">
                <CloseIcon size={24} />
              </button>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Cancel</div>
            </div>
          ) : (
            <div className="in-call-controls">
              <button className={`call-ctrl-sm${muted ? ' active' : ''}`} onClick={() => {
                const newMuted = !muted;
                setMuted(newMuted);
                if (streamRef.current) {
                  streamRef.current.getAudioTracks().forEach(t => { t.enabled = !newMuted; });
                }
              }} title={muted ? 'Unmute' : 'Mute'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {muted ? <><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" /><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" /></> : <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>}
                </svg>
                <span>{muted ? 'Unmute' : 'Mute'}</span>
              </button>
              {call.type === 'video' && (
                <button className={`call-ctrl-sm${videoOff ? ' active' : ''}`} onClick={() => {
                  const newOff = !videoOff;
                  setVideoOff(newOff);
                  if (streamRef.current) {
                    streamRef.current.getVideoTracks().forEach(t => { t.enabled = !newOff; });
                  }
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {videoOff ? <><line x1="1" y1="1" x2="23" y2="23" /><path d="M21 21H3a2 2 0 01-2-2V8" /><path d="M16 16H3a2 2 0 01-2-2V6a2 2 0 012-2h8m7.5 5.5L23 7v10" /></> : <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>}
                  </svg>
                  <span>{videoOff ? 'Start cam' : 'Stop cam'}</span>
                </button>
              )}
              <button className={`call-ctrl-sm${screenSharing ? ' active' : ''}`} onClick={() => setScreenSharing(!screenSharing)}>
                <ScreenShareIcon size={16} />
                <span>{screenSharing ? 'Stop share' : 'Share'}</span>
              </button>
              <button className={`call-ctrl-sm${recording ? ' active rec' : ''}`} onClick={() => setRecording(!recording)}>
                <RecordIcon size={16} recording={recording} />
                <span>{recording ? 'Stop rec' : 'Record'}</span>
              </button>
              {call.type === 'video' && (
                <button className={`call-ctrl-sm${showVBg ? ' active' : ''}`} onClick={() => setShowVBg(!showVBg)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9l4-4 4 4 4-4 4 4" /><path d="M3 15l4 4 4-4 4 4 4-4" /></svg>
                  <span>Bg</span>
                </button>
              )}
              <button className="call-ctrl-sm end-call" onClick={handleEnd}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" strokeLinecap="round" /></svg>
                <span>End</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ─── THREAD REPLY BUBBLE ──────────────────────────────────── */
const ThreadReplyBubble = ({ r, currentUser, onReact }) => {
  const [hovered, setHovered] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const rSender = getUserById(r.senderId);
  const isOwn = r.senderId === currentUser.id;
  const pickerRef = useRef(null);
  const longPressTimer = useRef(null);
  const isMobile = useIsMobile();

  const myReactions = new Set((r.reactions || []).filter(rx => rx.userIds.includes(currentUser.id)).map(rx => rx.emoji));

  useEffect(() => {
    if (!showPicker) return;
    const h = (e) => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showPicker]);

  const handleTouchStart = () => {
    if (!isMobile) return;
    longPressTimer.current = setTimeout(() => setShowMobileActions(true), 500);
  };
  const handleTouchEnd = () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } };
  const handleTouchMove = () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } };

  const handleReact = (emoji) => {
    onReact?.(r.id, emoji);
    setShowPicker(false);
    setShowMobileActions(false);
  };

  return (
    <div className={`thread-reply${isOwn ? ' own' : ''}`}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => { if (!isMobile) { setHovered(false); if (!showPicker) setShowPicker(false); } }}>
      {!isOwn && <Avatar user={rSender} size={28} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
        {!isOwn && (
          <div className="msg-meta">
            <span className="msg-sender-name" style={{ color: rSender?.color }}>{rSender?.name}</span>
            <span className="msg-timestamp">{formatTime(r.ts)}</span>
          </div>
        )}
        {isOwn && (
          <div className="msg-meta" style={{ justifyContent: 'flex-end' }}>
            <span className="msg-timestamp">{formatTime(r.ts)}</span>
          </div>
        )}
        <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
          {/* Desktop hover toolbar */}
          {hovered && !isMobile && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', right: isOwn ? 0 : 'auto', left: isOwn ? 'auto' : 0,
              display: 'flex', alignItems: 'center', gap: 1, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '2px 3px', boxShadow: 'var(--shadow-md)', zIndex: 20, whiteSpace: 'nowrap',
            }}>
              {['👍', '❤️', '😂', '🚀'].map(e => (
                <button key={e} className="tb-emoji-btn" onClick={() => handleReact(e)} style={{ fontSize: 13, padding: '3px 4px' }}>{e}</button>
              ))}
              <div className="tb-divider" style={{ height: 14 }} />
              <button className="tb-btn" title="More reactions" onClick={() => setShowPicker(v => !v)} style={{ padding: '3px 4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
            </div>
          )}
          {/* Desktop emoji picker */}
          {showPicker && !isMobile && (
            <div ref={pickerRef} style={{
              position: 'absolute', bottom: 'calc(100% + 36px)', right: isOwn ? 0 : 'auto', left: isOwn ? 'auto' : 0,
              zIndex: 30, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
              padding: 14, boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4 }}>
                {EMOJIS.map(e => (
                  <button key={e} className="emoji-btn" onClick={() => handleReact(e)}>{e}</button>
                ))}
              </div>
            </div>
          )}
          <div className={`msg-bubble${isOwn ? ' own' : ''}`} style={{ display: 'inline-block', maxWidth: '100%' }}
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
            <div className="msg-text">{r.text}</div>
          </div>
        </div>
        {r.reactions?.length > 0 && (
          <div className="reaction-row" style={{ marginTop: 4 }}>
            {r.reactions.map(rx => (
              <button key={rx.emoji} className={`reaction-chip${rx.userIds.includes(currentUser.id) ? ' mine' : ''}`}
                onClick={() => handleReact(rx.emoji)}>
                {rx.emoji} <span className="reaction-count">{rx.userIds.length}</span>
              </button>
            ))}
            <button className="reaction-add-btn" onClick={() => isMobile ? setShowMobileActions(true) : setShowPicker(v => !v)}>+</button>
          </div>
        )}
      </div>
      {/* Mobile action bottom sheet */}
      {isMobile && showMobileActions && createPortal(
        <>
          <div className="bottomsheet-backdrop" onClick={() => setShowMobileActions(false)} />
          <div className="bottomsheet">
            <div className="bottomsheet-handle" />
            <div className="bottomsheet-emoji-row">
              {['👍', '❤️', '😂', '😮', '🚀', '🙏'].map(e => (
                <button key={e} className={`tb-emoji-btn${myReactions.has(e) ? ' active' : ''}`}
                  onClick={() => handleReact(e)}
                  style={{ fontSize: 22, padding: '8px 10px' }}>{e}</button>
              ))}
              <button className="tb-emoji-btn" onClick={() => { setShowMobileActions(false); setShowPicker(true); }}
                style={{ fontSize: 16, padding: '8px 10px', color: 'var(--text-muted)' }}>
                <EmojiIcon size={20} />
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
      {/* Mobile full emoji picker bottom sheet */}
      {isMobile && showPicker && createPortal(
        <>
          <div className="bottomsheet-backdrop" onClick={() => setShowPicker(false)} />
          <div className="bottomsheet">
            <div className="bottomsheet-handle" />
            <div className="bottomsheet-title">React with emoji</div>
            <div className="bottomsheet-emoji-grid">
              {EMOJIS.map(e => (
                <button key={e} className="emoji-btn" onClick={() => handleReact(e)}>{e}</button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

/* ─── THREAD PANEL ─────────────────────────────────────────── */
export const ThreadPanel = ({ parentMsg, replies, currentUser, onClose, onSend, onReactThread }) => {
  const [input, setInput] = useState('');
  const sender = getUserById(parentMsg.senderId);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [replies]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(parentMsg.id, input.trim());
    setInput('');
  };

  return (
    <div className="thread-panel">
      <div className="thread-header">
        <div className="thread-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          Thread
        </div>
        <button className="icon-btn" onClick={onClose}><CloseIcon size={16} /></button>
      </div>
      <div className="thread-body" ref={listRef}>
        <div className="thread-parent">
          <Avatar user={sender} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="msg-meta">
              <span className="msg-sender-name" style={{ color: sender?.color }}>{sender?.name}</span>
              <span className="msg-timestamp">{formatFullTime(parentMsg.ts)}</span>
            </div>
            <div className="thread-parent-text">{parentMsg.text}</div>
          </div>
        </div>
        <div className="thread-divider">
          <div className="date-line" /><span className="date-label">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span><div className="date-line" />
        </div>
        {replies.map((r) => (
          <ThreadReplyBubble key={r.id} r={r} currentUser={currentUser} onReact={onReactThread} />
        ))}
      </div>
      <div className="thread-input">
        <Avatar user={currentUser} size={28} />
        <div className="input-wrap" style={{ flex: 1 }}>
          <textarea className="chat-textarea" placeholder="Reply in thread…" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={1} style={{ resize: 'none' }} />
        </div>
        <button className={`send-btn${input.trim() ? ' active' : ''}`} onClick={handleSend} disabled={!input.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
};

/* ─── PROFILE PANEL ─────────────────────────────────────────── */
export const ProfilePanel = ({ user, onClose, onCall, onBlock, blockedUsers }) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const isBlocked = blockedUsers.has(user.id);
  const isMobile = useIsMobile();
  const statusLabel = { online: 'Active now', offline: 'Offline' };

  return (
    <div className="profile-panel">
      <div className="thread-header">
        <div className="thread-title">Profile</div>
        <button className="icon-btn" onClick={onClose}><CloseIcon size={16} /></button>
      </div>
      <div className="profile-body">
        <div className="profile-hero">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar user={user} size={80} />
            <StatusDot status={user.status} size={16} />
          </div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-username">@{user.username}</div>
          <div className="profile-status-text" style={{ color: STATUS_COLORS[user.status] }}>{statusLabel[user.status]}</div>
        </div>
        <div className="profile-actions">
          <button className="profile-action-btn" onClick={() => onCall('audio', user)}>
            <PhoneIcon size={16} /> Call
          </button>
          <button className="profile-action-btn" onClick={() => onCall('video', user)}>
            <VideoIcon size={16} /> Video
          </button>
        </div>
        <div className="profile-section">
          <div className="profile-section-title">About</div>
          <div className="profile-field"><span className="pf-label">Role</span><span className="pf-value">{user.role}</span></div>
          <div className="profile-field"><span className="pf-label">Username</span><span className="pf-value">@{user.username}</span></div>
          <div className="profile-field"><span className="pf-label">Status</span>
            <span className="pf-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[user.status] }} />
              {statusLabel[user.status]}
            </span>
          </div>
        </div>
        <div className="profile-section">
          <div className="profile-section-title">Actions</div>
          {!showBlockConfirm ? (
            <button className="profile-danger-btn" onClick={() => setShowBlockConfirm(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
              {isBlocked ? `Unblock ${user.name}` : `Block ${user.name}`}
            </button>
          ) : !isMobile ? (
            <div className="block-confirm">
              <p>{isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}? They won't be able to message you.`}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-ghost-sm" onClick={() => setShowBlockConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onBlock(user.id); setShowBlockConfirm(false); }}>{isBlocked ? 'Unblock' : 'Block'}</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Mobile block confirm bottom sheet */}
      {isMobile && showBlockConfirm && createPortal(
        <>
          <div className="bottomsheet-backdrop" onClick={() => setShowBlockConfirm(false)} />
          <div className="bottomsheet">
            <div className="bottomsheet-handle" />
            <div className="bottomsheet-confirm">
              <p>{isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}? They won't be able to message you.`}</p>
              <div className="bottomsheet-confirm-btns">
                <button className="btn-ghost" onClick={() => setShowBlockConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onBlock(user.id); setShowBlockConfirm(false); }}>{isBlocked ? 'Unblock' : 'Block'}</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

/* ─── GROUP CREATION MODAL ─────────────────────────────────── */
export const GroupModal = ({ allUsers, currentUser, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('public');
  const [password, setPassword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const others = allUsers.filter(u => u.id !== currentUser.id);
  const filtered = others.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));
  const toggleUser = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      onCreate({ name: name.trim() || 'New Group', description, groupType, memberIds: [currentUser.id, ...selectedIds] });
      onClose();
    }, 900);
  };

  const groupTypeInfo = {
    public: { label: 'Public', desc: 'Anyone can find and join this group' },
    private: { label: 'Private', desc: 'Only invited members can join' },
    password: { label: 'Password', desc: 'Members need a password to join' },
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">Create Group</div>
          <button className="icon-btn" onClick={onClose}><CloseIcon size={16} /></button>
        </div>
        <div className="modal-steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-item${step === s ? ' current' : step > s ? ' done' : ''}`}>
              <div className="step-dot">{step > s ? '✓' : s}</div>
              <span>{s === 1 ? 'Details' : s === 2 ? 'Type' : 'Members'}</span>
              {s < 3 && <div className="step-line" />}
            </div>
          ))}
        </div>
        <div className="modal-body">
          {step === 1 && (
            <div className="modal-step-content">
              <div className="form-field">
                <label className="form-label">Group Name *</label>
                <input className="form-input" placeholder="e.g. team-frontend" value={name} onChange={e => setName(e.target.value)} autoFocus />
              </div>
              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="What's this group about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: 'none' }} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="modal-step-content">
              <div className="form-label" style={{ marginBottom: 12 }}>Group Type</div>
              {Object.entries(groupTypeInfo).map(([type, info]) => (
                <button key={type} className={`group-type-option${groupType === type ? ' selected' : ''}`} onClick={() => setGroupType(type)}>
                  <div className="gtype-icon" style={{ color: groupType === type ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {type === 'public' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    ) : type === 'private' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div className="gtype-label">{info.label}</div>
                    <div className="gtype-desc">{info.desc}</div>
                  </div>
                  <div className={`gtype-radio${groupType === type ? ' checked' : ''}`} />
                </button>
              ))}
              {groupType === 'password' && (
                <div className="form-field" style={{ marginTop: 16 }}>
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="Set group password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="modal-step-content">
              <div className="modal-search-box" style={{ marginBottom: 12 }}>
                <SearchIcon size={14} />
                <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} className="modal-search-input" />
                {search && <button className="modal-search-clear" onClick={() => setSearch('')}><CloseIcon size={13} /></button>}
              </div>
              {selectedIds.length > 0 && (
                <div className="selected-chips">
                  {selectedIds.map(id => { const u = getUserById(id); return u ? (
                    <span key={id} className="selected-chip" onClick={() => toggleUser(id)}>
                      <span style={{ color: u.color }}>{u.initials}</span> {u.name.split(' ')[0]} ×
                    </span>
                  ) : null; })}
                </div>
              )}
              <div className="user-select-list">
                {filtered.map(u => (
                  <button key={u.id} className={`user-select-row${selectedIds.includes(u.id) ? ' selected' : ''}`} onClick={() => toggleUser(u.id)}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <Avatar user={u} size={32} />
                      <StatusDot status={u.status} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="user-select-name">{u.name}</div>
                      <div className="user-select-role">{u.role}</div>
                    </div>
                    <div className={`checkbox${selectedIds.includes(u.id) ? ' checked' : ''}`}>
                      {selectedIds.includes(u.id) && '✓'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={step === 1 ? onClose : () => setStep(step - 1)}>{step === 1 ? 'Cancel' : 'Back'}</button>
          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && !name.trim()}>Next</button>
          ) : (
            <button className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating…' : `Create Group${selectedIds.length > 0 ? ` (${selectedIds.length + 1})` : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── NEW DM MODAL ─────────────────────────────────────────── */
export const NewDMModal = ({ allUsers, currentUser, conversations, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const others = allUsers.filter(u => u.id !== currentUser.id);
  const filtered = others.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div className="modal-title">New Direct Message</div>
          <button className="icon-btn" onClick={onClose}><CloseIcon size={16} /></button>
        </div>
        <div style={{ padding: '14px 20px 4px' }}>
          <div className="modal-search-box">
            <SearchIcon size={15} />
            <input ref={inputRef} className="modal-search-input" placeholder="Find a person…" value={search}
              onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Escape' && onClose()} />
            {search && <button className="modal-search-clear" onClick={() => { setSearch(''); inputRef.current?.focus(); }}><CloseIcon size={13} /></button>}
          </div>
        </div>
        <div style={{ padding: '4px 12px 0', maxHeight: 320, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No users found</div>
          ) : filtered.map(u => (
            <button key={u.id} className="user-select-row" onClick={() => onSelect(u)} style={{ width: '100%' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar user={u} size={38} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[u.status], border: '2px solid var(--surface)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div className="user-select-name">{u.name}</div>
                <div className="user-select-role">{u.role}</div>
              </div>
              <ChevronRightIcon size={14} />
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ─── GROUP MEMBERS PANEL ──────────────────────────────────── */
export const GroupMembersPanel = ({ conv, currentUser, onClose, onViewProfile, onLeave, onDelete, onAddMember }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const isMobile = useIsMobile();

  const members = (conv.memberIds || []).map(id => getUserById(id)).filter(Boolean);
  const filtered = members.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  const isOwner = conv.ownerId === currentUser.id;
  const roleLabel = (id) => id === conv.ownerId ? { label: 'Owner', color: '#f59e0b' } : { label: 'Member', color: 'var(--text-muted)' };

  const memberIdSet = new Set(conv.memberIds || []);
  const addableUsers = ALL_USERS.filter(u => !memberIdSet.has(u.id) && u.name.toLowerCase().includes(addSearch.toLowerCase()));

  return (
    <div className="profile-panel">
      <div className="thread-header">
        <div className="thread-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
          Members ({members.length})
        </div>
        <button className="icon-btn" onClick={onClose}><CloseIcon size={16} /></button>
      </div>
      <div className="profile-body">
        <div className="profile-hero" style={{ paddingBottom: 16 }}>
          <div className="group-avatar-lg" style={{ background: conv.color + '22', color: conv.color, width: 56, height: 56, fontSize: 28 }}>{conv.initials}</div>
          <div className="profile-name">{conv.name}</div>
          <div className="profile-username">{conv.groupType} group</div>
        </div>
        <div style={{ padding: '12px 16px 4px' }}>
          <div className="modal-search-box">
            <SearchIcon size={14} />
            <input placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} className="modal-search-input" />
            {search && <button className="modal-search-clear" onClick={() => setSearch('')}><CloseIcon size={13} /></button>}
          </div>
        </div>
        <div style={{ padding: '8px 8px 4px', maxHeight: 300, overflowY: 'auto' }}>
          {/* Add Member button */}
          <button className="user-select-row" onClick={() => setShowAddMember(v => !v)}
            style={{ width: '100%', padding: 8, borderRadius: 8, cursor: 'pointer', marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <span className="user-select-name" style={{ color: 'var(--accent)' }}>Add Member</span>
            </div>
          </button>
          {showAddMember && (
            <div style={{ padding: '4px 0 8px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
              <div className="modal-search-box" style={{ marginBottom: 8 }}>
                <SearchIcon size={14} />
                <input placeholder="Search users to add…" value={addSearch} onChange={e => setAddSearch(e.target.value)} className="modal-search-input" autoFocus />
                {addSearch && <button className="modal-search-clear" onClick={() => setAddSearch('')}><CloseIcon size={13} /></button>}
              </div>
              <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                {addableUsers.length === 0 ? (
                  <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No users to add</div>
                ) : addableUsers.map(u => (
                  <button key={u.id} className="user-select-row" onClick={() => { onAddMember(conv.id, u.id); setAddSearch(''); setShowAddMember(false); }}
                    style={{ width: '100%', padding: 6, borderRadius: 6, cursor: 'pointer' }}>
                    <Avatar user={u} size={28} />
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div className="user-select-name">{u.name}</div>
                      <div className="user-select-role">{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {filtered.map(u => {
            const role = roleLabel(u.id);
            const isMe = u.id === currentUser.id;
            return (
              <button key={u.id} className="user-select-row" onClick={() => !isMe && onViewProfile(u)}
                style={{ width: '100%', padding: 8, borderRadius: 8, cursor: isMe ? 'default' : 'pointer' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar user={u} size={34} />
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: STATUS_COLORS[u.status], border: '2px solid var(--surface)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="user-select-name">{u.name}{isMe ? ' (you)' : ''}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: role.color, background: role.color + '18', padding: '1px 6px', borderRadius: 99 }}>{role.label}</span>
                  </div>
                  <div className="user-select-role">{u.role}</div>
                </div>
                {!isMe && <ChevronRightIcon size={14} />}
              </button>
            );
          })}
        </div>
        <div className="profile-section" style={{ marginTop: 8 }}>
          <div className="profile-section-title">Group Actions</div>
          {!showLeaveConfirm ? (
            <button className="profile-danger-btn" style={{ marginBottom: 8 }} onClick={() => setShowLeaveConfirm(true)}>
              <LogoutIcon size={14} /> Leave group
            </button>
          ) : !isMobile ? (
            <div className="block-confirm" style={{ marginBottom: 8 }}>
              <p>Leave <strong>{conv.name}</strong>? You won't be able to see messages.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-ghost-sm" onClick={() => setShowLeaveConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onLeave(conv.id); onClose(); }}>Leave</button>
              </div>
            </div>
          ) : null}
          {isOwner && !showDeleteConfirm && (
            <button className="profile-danger-btn" onClick={() => setShowDeleteConfirm(true)}>
              <TrashIcon size={14} /> Delete group
            </button>
          )}
          {isOwner && showDeleteConfirm && !isMobile && (
            <div className="block-confirm">
              <p>Permanently delete <strong>{conv.name}</strong>? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-ghost-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onDelete(conv.id); onClose(); }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile leave confirm bottom sheet */}
      {isMobile && showLeaveConfirm && createPortal(
        <>
          <div className="bottomsheet-backdrop" onClick={() => setShowLeaveConfirm(false)} />
          <div className="bottomsheet">
            <div className="bottomsheet-handle" />
            <div className="bottomsheet-confirm">
              <p>Leave <strong>{conv.name}</strong>? You won't be able to see messages.</p>
              <div className="bottomsheet-confirm-btns">
                <button className="btn-ghost" onClick={() => setShowLeaveConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onLeave(conv.id); onClose(); }}>Leave</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
      {/* Mobile delete confirm bottom sheet */}
      {isMobile && showDeleteConfirm && createPortal(
        <>
          <div className="bottomsheet-backdrop" onClick={() => setShowDeleteConfirm(false)} />
          <div className="bottomsheet">
            <div className="bottomsheet-handle" />
            <div className="bottomsheet-confirm">
              <p>Permanently delete <strong>{conv.name}</strong>? This cannot be undone.</p>
              <div className="bottomsheet-confirm-btns">
                <button className="btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={() => { onDelete(conv.id); onClose(); }}>Delete</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
