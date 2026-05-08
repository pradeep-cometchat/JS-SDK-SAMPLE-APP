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
import { CheckIcon, BackIcon, ChatBubbleIcon } from './components/Icons';
import './app.css';

/* ─── ERROR BOUNDARY ──────────────────────────────────── */
export class ErrorBoundary extends Component {
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
          <button onClick={() => this.setState({ hasError: false, error: null })} style={{ padding: '8px 20px', background: '#004EEB', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12 }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── LOGIN SCREEN ────────────────────────────────────── */
export const LoginScreen = ({ onLogin }) => {
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
    if (!user) { setError('User not found. Try a username like user-comet-chat-1'); return; }
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
                  <CheckIcon size={10} />
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
const TWEAK_DEFAULTS = { theme: 'light', density: 'comfortable', accentColor: '#004EEB' };

/* ─── APP ─────────────────────────────────────────────── */
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tweaks, setTweaks] = useState(() => {
    try { return { ...TWEAK_DEFAULTS, ...JSON.parse(localStorage.getItem('cc_tweaks') || '{}') }; }
    catch { return { ...TWEAK_DEFAULTS }; }
  });

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
    const r = n >> 16, g = (n >> 8) & 0xff, b = n & 0xff;
    const dk = (v) => Math.min(255, Math.max(0, v - 20));
    const dr = dk(r), dg = dk(g), db = dk(b);
    document.documentElement.style.setProperty('--accent-dark', '#' + [dr, dg, db].map(x => x.toString(16).padStart(2, '0')).join(''));
    document.documentElement.style.setProperty('--accent-rgb', `${r},${g},${b}`);
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.2)`);
    document.documentElement.style.setProperty('--accent-light', `rgba(${r},${g},${b},0.08)`);
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

  const handleCallStart = (type, user, groupInfo) => {
    callStartTimeRef.current = Date.now();
    setActiveCall({ type, user, incoming: false, ...groupInfo });
  };
  const handleCallEnd = () => {
    setActiveCall(currentCall => {
      if (currentCall) {
        const startTime = callStartTimeRef.current || Date.now();
        const durationSec = Math.round((Date.now() - startTime) / 1000);
        const entry = currentCall.groupId ? {
          id: 'c_' + Date.now(),
          type: currentCall.type,
          groupId: currentCall.groupId,
          groupName: currentCall.groupName,
          direction: 'outgoing',
          status: durationSec > 3 ? 'completed' : 'missed',
          duration: durationSec > 3 ? durationSec : 0,
          members: 2,
          ts: startTime,
        } : {
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
        // Show group call banner after call ends
        if (currentCall.onGroupCallEnd) {
          setTimeout(() => currentCall.onGroupCallEnd(), 100);
        }
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

  // Incoming call demo disabled — use Tweaks FAB to trigger manually
  // useEffect(() => { ... }, [loggedInUser]);

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
          allMessages={messages}
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
              onMarkUnread={(convId, count) => {
                setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: count } : c));
              }}
            />
          ) : (
            <div className="empty-state">
              {isMobile && (
                <button className="mobile-back-btn" onClick={handleBackToSidebar} style={{position:'absolute',top:16,left:16}}>
                  <BackIcon size={20} />
                </button>
              )}
              <div className="empty-state-icon">
                <ChatBubbleIcon size={64} />
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
    </div>
    </ErrorBoundary>
  );
};

export default App;
