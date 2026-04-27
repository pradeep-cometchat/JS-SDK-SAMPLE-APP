import { useState, useEffect, useRef, Component } from 'react';
import {
  CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS,
  INITIAL_MESSAGES, THREAD_MESSAGES, CALL_HISTORY,
  getUserById,
} from './data';
import { Avatar } from './components/Avatar';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import {
  CallOverlay, ThreadPanel, ProfilePanel,
  GroupModal, NewDMModal, GroupMembersPanel,
} from './components/Overlays';
import './app.css';

/* ─── ERROR BOUNDARY ──────────────────────────────────── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Chat app error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
          <h2>Something went wrong</h2>
          <pre style={{ fontSize: 12, textAlign: 'left', maxWidth: 600, margin: '20px auto', background: '#fee2e2', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ padding: '8px 20px', background: '#6851D6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12 }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── LOGIN SCREEN ────────────────────────────────────── */
const LoginScreen = ({ onLogin }) => {
  const [selected, setSelected] = useState(CURRENT_USER.id);
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [region, setRegion] = useState('US');
  const [appId, setAppId] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  useEffect(() => {
    const h = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const avatarSize = winWidth <= 480 ? 36 : winWidth <= 768 ? 40 : 52;

  const handleContinue = () => {
    const targetId = uid.trim() || selected;
    const user = ALL_USERS.find(u => u.id === targetId || u.username === targetId);
    if (!user) { setError('User not found. Try a username like alex.chen'); return; }
    onLogin(user);
  };

  if (showCredentials) {
    return (
      <div className="login-screen">
        <div className="login-logo">
          <img src={`${import.meta.env.BASE_URL}cometchat-wordmark.png`} alt="CometChat" height="40" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /><span className="login-brand-fallback" style={{display:'none',alignItems:'center',gap:8}}><img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" width="28" height="28" style={{borderRadius:5}} /><span style={{fontSize:22,fontWeight:400,color:'var(--text)'}}>comet<strong>chat</strong></span></span>
        </div>
        <div className="login-card">
          <h2 className="login-title">App Credentials</h2>

          <div className="form-field" style={{marginBottom:20}}>
            <label className="form-label">Region</label>
            <div style={{display:'flex',gap:8,marginTop:6}}>
              {[
                {id:'US',flag:'🇺🇸'},
                {id:'EU',flag:'🇪🇺'},
                {id:'IN',flag:'🇮🇳'},
              ].map(r => (
                <button key={r.id}
                  className={`region-btn${region===r.id?' selected':''}`}
                  onClick={() => setRegion(r.id)}>
                  <span style={{fontSize:18}}>{r.flag}</span> {r.id}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field" style={{marginBottom:20}}>
            <label className="form-label">App ID</label>
            <input className="login-input" placeholder="Enter the app ID" value={appId} onChange={e => setAppId(e.target.value)} />
          </div>

          <div className="form-field" style={{marginBottom:24}}>
            <label className="form-label">Auth Key</label>
            <input className="login-input" placeholder="Enter the Auth Key" value={authKey} onChange={e => setAuthKey(e.target.value)} />
          </div>

          <button className="login-btn" onClick={() => setShowCredentials(false)}>Continue</button>
          <div className="login-footer-link" style={{marginTop:16}}>
            <span style={{color:'var(--accent)',cursor:'pointer'}} onClick={() => setShowCredentials(false)}>← Back to Sign In</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-logo">
        <img src={`${import.meta.env.BASE_URL}cometchat-wordmark.png`} alt="CometChat" height="40" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /><span className="login-brand-fallback" style={{display:'none',alignItems:'center',gap:8}}><img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" width="28" height="28" style={{borderRadius:5}} /><span style={{fontSize:22,fontWeight:400,color:'var(--text)'}}>comet<strong>chat</strong></span></span>
      </div>
      <div className="login-card">
        <h2 className="login-title">Sign in to CometChat</h2>
        <div className="login-section-label">Choose a Sample User</div>
        <div className="login-user-grid">
          {ALL_USERS.map(user => (
            <button key={user.id}
              className={`login-user-card${selected === user.id ? ' selected' : ''}`}
              onClick={() => { setSelected(user.id); setUid(''); setError(''); }}>
              {selected === user.id && (
                <div className="login-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
              <div className="login-user-avatar"><Avatar user={user} size={avatarSize} /></div>
              <div className="login-user-name">{user.name.split(' ')[0]}</div>
              <div className="login-user-uid">{user.username}</div>
            </button>
          ))}
        </div>
        <div className="login-or"><span>Or</span></div>
        <div className="login-field">
          <label className="login-field-label">Enter Your UID</label>
          <input className="login-input" placeholder="Enter UID or username" value={uid}
            onChange={e => { setUid(e.target.value); setSelected(''); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleContinue()} />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" onClick={handleContinue}>Continue</button>
        <div className="login-footer-link">
          Change <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setShowCredentials(true)}>App Credentials</span>
        </div>
      </div>
    </div>
  );
};

/* ─── TWEAKS DEFAULTS ─────────────────────────────────── */
const TWEAK_DEFAULTS = { theme: 'light', density: 'comfortable', accentColor: '#6851D6' };

/* ─── DRAGGABLE FAB ────────────────────────────────────── */
const DraggableFab = ({ showTweaks, setShowTweaks, tweaks, saveTweaks, setActiveCall, callStartTimeRef, setShowGroupModal, setShowNewDM, users }) => {
  const [fabPos, setFabPos] = useState({ x: window.innerWidth - 60, y: window.innerHeight - 120 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const wasDragged = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setFabPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 40),
        y: Math.min(prev.y, window.innerHeight - 40),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      if (!dragStart.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.current.mx;
      const dy = clientY - dragStart.current.my;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDragged.current = true;
      setFabPos({
        x: Math.max(0, Math.min(window.innerWidth - 40, dragStart.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.y + dy)),
      });
    };
    const handleUp = () => {
      setDragging(false);
      dragStart.current = null;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging]);

  const handleStart = (e) => {
    wasDragged.current = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: fabPos.x, y: fabPos.y, mx: clientX, my: clientY };
    setDragging(true);
  };

  const handleClick = () => {
    if (!wasDragged.current) setShowTweaks(v => !v);
  };

  // Position tweaks panel relative to FAB
  const panelStyle = {
    position: 'fixed',
    left: Math.min(fabPos.x, window.innerWidth - 260),
    top: Math.max(0, fabPos.y - 320),
    zIndex: 300,
  };

  return (
    <>
      <button
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={handleClick}
        style={{
          position: 'fixed', left: fabPos.x, top: fabPos.y, zIndex: 301,
          width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(104,81,214,0.4)', border: 'none',
          cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
        }}
        title="Tweaks"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
      </button>
      {showTweaks && (
        <div className="tweaks-panel visible" style={panelStyle}>
          <div className="tweaks-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
            Tweaks
          </div>
          <div className="tweak-row">
            <span className="tweak-label">Dark mode</span>
            <button className={`tweak-toggle${tweaks.theme === 'dark' ? ' on' : ''}`} onClick={() => saveTweaks({ ...tweaks, theme: tweaks.theme === 'dark' ? 'light' : 'dark' })} />
          </div>
          <div className="tweak-row">
            <span className="tweak-label">Density</span>
            <select className="tweak-select" value={tweaks.density} onChange={e => saveTweaks({ ...tweaks, density: e.target.value })}>
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="tweak-row">
            <span className="tweak-label">Accent color</span>
            <input type="color" value={tweaks.accentColor} onChange={e => saveTweaks({ ...tweaks, accentColor: e.target.value })} style={{ width: 36, height: 28, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'none' }} />
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 12px' }} />
          <div className="tweak-row">
            <span className="tweak-label">Trigger call demo</span>
            <button className="btn-primary-sm" style={{ fontSize: 11 }} onClick={() => { callStartTimeRef.current = Date.now(); setActiveCall({ type: 'video', user: users[1], incoming: true }); }}>Ring</button>
          </div>
          <div className="tweak-row">
            <span className="tweak-label">Create group</span>
            <button className="btn-ghost-sm" style={{ fontSize: 11 }} onClick={() => setShowGroupModal(true)}>Open</button>
          </div>
          <div className="tweak-row">
            <span className="tweak-label">New message</span>
            <button className="btn-ghost-sm" style={{ fontSize: 11 }} onClick={() => setShowNewDM(true)}>Open</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── APP ─────────────────────────────────────────────── */
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tweaks, setTweaks] = useState(() => {
    try { return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem('cc_tweaks') || '{}') }; }
    catch { return { ...TWEAK_DEFAULTS }; }
  });
  const [showTweaks, setShowTweaks] = useState(false);

  // Mobile responsive state
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Core state
  const [activeId, setActiveId] = useState(null);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [threadReplies, setThreadReplies] = useState(THREAD_MESSAGES);
  const [blockedUsers, setBlockedUsers] = useState(new Set());

  // Panel state
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState(CALL_HISTORY);
  const callStartTimeRef = useRef(null);
  const [threadMsg, setThreadMsg] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [membersConv, setMembersConv] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
  }, [tweaks.theme]);

  // Accent color
  useEffect(() => {
    const hex = tweaks.accentColor;
    document.documentElement.style.setProperty('--accent', hex);
    const n = parseInt(hex.replace('#', ''), 16);
    const dk = (v) => Math.min(255, Math.max(0, v - 20));
    const dr = dk(n >> 16), dg = dk((n >> 8) & 0xff), db = dk(n & 0xff);
    document.documentElement.style.setProperty('--accent-dark', '#' + [dr, dg, db].map(x => x.toString(16).padStart(2, '0')).join(''));
    document.documentElement.style.setProperty('--accent-glow', hex + '22');
    document.documentElement.style.setProperty('--accent-light', hex + '12');
    document.documentElement.style.setProperty('--bubble-own', hex);
  }, [tweaks.accentColor]);

  const saveTweaks = (next) => {
    setTweaks(next);
    localStorage.setItem('cc_tweaks', JSON.stringify(next));
  };

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMsgs = messages[activeId] || [];

  const handleSelect = (id) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setThreadMsg(null); setProfileUser(null); setMembersConv(null);
    if (isMobile) setShowSidebar(false);
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setActiveId(null);
    setThreadMsg(null); setProfileUser(null); setMembersConv(null);
  };

  const handleSend = (convId, text, file, poll, replyTo) => {
    const m = {
      id: 'msg_' + Date.now(), senderId: loggedInUser.id, text,
      file: file || undefined, poll: poll || undefined,
      replyTo: replyTo ? { senderId: replyTo.senderId, text: replyTo.text, id: replyTo.id } : undefined,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    };
    setMessages(prev => ({ ...prev, [convId]: [...(prev[convId] || []), m] }));
  };

  const handleReact = (msgId, emoji) => {
    setMessages(prev => {
      const list = [...(prev[activeId] || [])];
      const idx = list.findIndex(m => m.id === msgId);
      if (idx === -1) return prev;
      const msg = { ...list[idx], reactions: [...(list[idx].reactions || [])] };
      const ri = msg.reactions.findIndex(r => r.emoji === emoji);
      if (ri === -1) { msg.reactions.push({ emoji, userIds: [loggedInUser.id] }); }
      else {
        const r = { ...msg.reactions[ri] };
        if (r.userIds.includes(loggedInUser.id)) {
          r.userIds = r.userIds.filter(id => id !== loggedInUser.id);
          if (r.userIds.length === 0) msg.reactions.splice(ri, 1); else msg.reactions[ri] = r;
        } else { r.userIds = [...r.userIds, loggedInUser.id]; msg.reactions[ri] = r; }
      }
      list[idx] = msg;
      return { ...prev, [activeId]: list };
    });
  };

  const handleDelete = (msgId) =>
    setMessages(prev => ({ ...prev, [activeId]: (prev[activeId] || []).map(m => m.id === msgId ? { ...m, deleted: true } : m) }));

  const handleEdit = (msgId, text) =>
    setMessages(prev => ({ ...prev, [activeId]: (prev[activeId] || []).map(m => m.id === msgId ? { ...m, text, edited: true } : m) }));

  const handleThreadOpen = (msg) => { setThreadMsg(msg); setProfileUser(null); setMembersConv(null); };
  const handleThreadReply = (pid, text) => {
    const r = { id: 'tr_' + Date.now(), senderId: loggedInUser.id, text, ts: Date.now(), reactions: [] };
    setThreadReplies(prev => ({ ...prev, [pid]: [...(prev[pid] || []), r] }));
    setMessages(prev => ({ ...prev, [activeId]: (prev[activeId] || []).map(m => m.id === pid ? { ...m, threadCount: (m.threadCount || 0) + 1 } : m) }));
  };

  const handleVote = (msgId, optionIdx) => {
    setMessages(prev => {
      const list = [...(prev[activeId] || [])];
      const idx = list.findIndex(m => m.id === msgId);
      if (idx === -1) return prev;
      const msg = { ...list[idx] };
      if (!msg.poll) return prev;
      const poll = {
        ...msg.poll, options: msg.poll.options.map((o, i) => {
          if (i !== optionIdx) return o;
          const alreadyVoted = o.votes.includes(loggedInUser.id);
          return { ...o, votes: alreadyVoted ? o.votes.filter(v => v !== loggedInUser.id) : [...o.votes, loggedInUser.id] };
        })
      };
      msg.poll = poll;
      list[idx] = msg;
      return { ...prev, [activeId]: list };
    });
  };

  const handleCallStart = (type, user) => {
    callStartTimeRef.current = Date.now();
    setActiveCall({ type, user, incoming: false });
  };
  const handleCallEnd = () => {
    setActiveCall(currentCall => {
      if (currentCall) {
        const startTime = callStartTimeRef.current || Date.now();
        const durationSec = Math.round((Date.now() - startTime) / 1000);
        const entry = {
          id: 'c_' + Date.now(),
          type: currentCall.type,
          withUserId: currentCall.user.id,
          direction: currentCall.incoming ? 'incoming' : 'outgoing',
          status: durationSec > 3 ? 'completed' : (currentCall.incoming ? 'declined' : 'missed'),
          duration: durationSec > 3 ? durationSec : 0,
          ts: startTime,
        };
        setCallHistory(prev => [entry, ...prev]);
        callStartTimeRef.current = null;
      }
      return null;
    });
  };
  const handleViewProfile = (user) => { setProfileUser(user); setThreadMsg(null); setMembersConv(null); };
  const handleViewMembers = (conv) => { setMembersConv(conv); setProfileUser(null); setThreadMsg(null); };
  const handleBlock = (uid) => setBlockedUsers(prev => { const s = new Set(prev); s.has(uid) ? s.delete(uid) : s.add(uid); return s; });

  const handleAddMember = (convId, userId) => {
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, memberIds: [...c.memberIds, userId] } : c
    ));
  };

  const handleDeleteConv = (convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeId === convId) {
      const remaining = conversations.filter(c => c.id !== convId);
      setActiveId(remaining[0]?.id || null);
    }
    setMembersConv(null);
  };

  const handleLeaveGroup = (convId) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, memberIds: c.memberIds.filter(id => id !== loggedInUser.id) } : c));
    handleDeleteConv(convId);
  };

  const handlePinConv = (convId) =>
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, pinned: !c.pinned } : c));

  const handleLogout = () => setLoggedInUser(null);

  const handleCreateGroup = (data) => {
    const nc = {
      id: 'grp_' + Date.now(), type: 'group',
      name: data.name.replace(/^#/, '').trim(),
      initials: data.name.slice(0, 2).toUpperCase(), color: tweaks.accentColor,
      icon: '💬', memberIds: data.memberIds, description: data.description,
      groupType: data.groupType, unread: 0, pinned: false, ownerId: loggedInUser.id,
    };
    setConversations(prev => [nc, ...prev]);
    setMessages(prev => ({ ...prev, [nc.id]: [] }));
    setActiveId(nc.id);
  };

  const handleNewDM = (user) => {
    const ex = conversations.find(c => c.type === 'dm' && c.userId === user.id);
    if (ex) { handleSelect(ex.id); setShowNewDM(false); return; }
    const nc = { id: 'dm_' + user.id, type: 'dm', userId: user.id, unread: 0, muted: false, pinned: false };
    setConversations(prev => [nc, ...prev]);
    setMessages(prev => ({ ...prev, ['dm_' + user.id]: [] }));
    setActiveId('dm_' + user.id);
    setShowNewDM(false);
  };

  // Simulate incoming call after 8s (demo) — only after login
  useEffect(() => {
    if (!loggedInUser) return;
    const t = setTimeout(() => {
      // Check activeCall via latest state using functional update pattern
      setActiveCall(current => {
        if (current) return current; // Don't override an active call
        callStartTimeRef.current = Date.now();
        return { type: 'video', user: USERS[0], incoming: true };
      });
    }, 8000);
    return () => clearTimeout(t);
  }, [loggedInUser]);

  // Login guard — must be after all hooks
  if (!loggedInUser) return <LoginScreen onLogin={u => setLoggedInUser(u)} />;

  const rightPanel = threadMsg ? 'thread' : membersConv ? 'members' : profileUser ? 'profile' : null;

  return (
    <ErrorBoundary>
    <div className={`app-shell${isMobile ? ' mobile' : ''}`}>
      {(!isMobile || showSidebar) && (
        <Sidebar
          conversations={conversations} activeId={activeId} onSelect={handleSelect}
          currentUser={loggedInUser} onNewGroup={() => setShowGroupModal(true)} onNewDM={() => setShowNewDM(true)}
          onDeleteConv={handleDeleteConv} onPinConv={handlePinConv}
          onLogout={handleLogout} callHistory={callHistory} onCallStart={handleCallStart}
          onCallSelect={(call) => {
            const dmId = 'dm_' + call.withUserId;
            const ex = conversations.find(c => c.id === dmId || (c.type === 'dm' && c.userId === call.withUserId));
            if (ex) handleSelect(ex.id);
          }}
        />
      )}

      {(!isMobile || !showSidebar) && (
        <>
          {activeConv ? (
            <ChatPanel
              conv={activeConv} messages={activeMsgs}
              currentUser={loggedInUser} allUsers={USERS}
              onSend={handleSend} onReact={handleReact}
              onDelete={handleDelete} onEdit={handleEdit} onVote={handleVote}
              onThreadOpen={handleThreadOpen} onCallStart={handleCallStart}
              onViewProfile={handleViewProfile} onViewMembers={handleViewMembers}
              typingUsers={[]} density={tweaks.density}
              blockedUsers={blockedUsers}
              isMobile={isMobile}
              onBack={handleBackToSidebar}
            />
          ) : (
            <div className="empty-state">
              {isMobile && (
                <button className="mobile-back-btn" onClick={handleBackToSidebar} style={{position:'absolute',top:16,left:16}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <h3 className="empty-state-title">Welcome to CometChat</h3>
              <p className="empty-state-text">Select a conversation from the sidebar to start chatting</p>
            </div>
          )}
        </>
      )}

      {rightPanel === 'thread' && threadMsg && (
        <ThreadPanel parentMsg={threadMsg} replies={threadReplies[threadMsg.id] || []} currentUser={loggedInUser} onClose={() => setThreadMsg(null)} onSend={handleThreadReply} onReactThread={(replyId, emoji) => {
          setThreadReplies(prev => {
            const pid = threadMsg.id;
            const list = [...(prev[pid] || [])];
            const idx = list.findIndex(r => r.id === replyId);
            if (idx === -1) return prev;
            const reply = { ...list[idx], reactions: [...(list[idx].reactions || [])] };
            const ri = reply.reactions.findIndex(r => r.emoji === emoji);
            if (ri === -1) { reply.reactions.push({ emoji, userIds: [loggedInUser.id] }); }
            else {
              const r = { ...reply.reactions[ri] };
              if (r.userIds.includes(loggedInUser.id)) {
                r.userIds = r.userIds.filter(id => id !== loggedInUser.id);
                if (r.userIds.length === 0) reply.reactions.splice(ri, 1); else reply.reactions[ri] = r;
              } else { r.userIds = [...r.userIds, loggedInUser.id]; reply.reactions[ri] = r; }
            }
            list[idx] = reply;
            return { ...prev, [pid]: list };
          });
        }} />
      )}
      {rightPanel === 'members' && membersConv && (
        <GroupMembersPanel conv={membersConv} currentUser={loggedInUser} onClose={() => setMembersConv(null)} onViewProfile={handleViewProfile} onLeave={handleLeaveGroup} onDelete={handleDeleteConv} onAddMember={handleAddMember} />
      )}
      {rightPanel === 'profile' && profileUser && (
        <ProfilePanel user={profileUser} onClose={() => setProfileUser(null)} onCall={handleCallStart} onBlock={handleBlock} blockedUsers={blockedUsers} />
      )}

      {activeCall && <CallOverlay call={activeCall} currentUser={loggedInUser} onAccept={() => { callStartTimeRef.current = Date.now(); }} onEnd={handleCallEnd} />}
      {showGroupModal && <GroupModal allUsers={USERS} currentUser={loggedInUser} onClose={() => setShowGroupModal(false)} onCreate={handleCreateGroup} />}
      {showNewDM && <NewDMModal allUsers={USERS} currentUser={loggedInUser} conversations={conversations} onClose={() => setShowNewDM(false)} onSelect={handleNewDM} />}

      {/* Draggable Tweaks FAB */}
      <DraggableFab showTweaks={showTweaks} setShowTweaks={setShowTweaks} tweaks={tweaks} saveTweaks={saveTweaks} setActiveCall={setActiveCall} callStartTimeRef={callStartTimeRef} setShowGroupModal={setShowGroupModal} setShowNewDM={setShowNewDM} users={USERS} />
    </div>
    </ErrorBoundary>
  );
};

export default App;
