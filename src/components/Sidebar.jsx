import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  getUserById,
  getConvName,
  getConvColor,
  getConvInitials,
  STATUS_COLORS,
  formatTime,
  formatFullTime,
  fmtCallDuration,
} from '../data';
import { Avatar, StatusDot } from './Avatar';
import {
  SearchIcon,
  CloseIcon,
  SettingsIcon,
  LogoutIcon,
  StarIcon,
  TrashIcon,
  VerticalDotsIcon,
  NewChatIcon,
  NewGroupIcon,
  PhoneIcon,
  VideoIcon,
  ChevronRightIcon,
  BellIcon,
} from './Icons';

// Detect mobile for bottom sheet rendering
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
};

/* ─── STATUS LABELS ───────────────────────────────────────── */
const STATUS_LABELS = {
  online: 'Online',
  offline: 'Offline',
};

/* ─── CALL STATUS META ────────────────────────────────────── */
const CALL_STATUS_META = {
  completed: { color: '#16a34a', label: 'Completed' },
  missed:    { color: '#dc2626', label: 'Missed' },
  declined:  { color: '#d97706', label: 'Declined' },
};

/* ─── TABS CONFIG ─────────────────────────────────────────── */
const TABS = [
  { id: 'all',    label: 'All' },
  { id: 'users',  label: 'Users' },
  { id: 'groups', label: 'Groups' },
  { id: 'calls',  label: 'Calls' },
];

/* ═══════════════════════════════════════════════════════════
   ConvItem — Individual conversation row
   ═══════════════════════════════════════════════════════════ */
const ConvItem = ({ conv, active, onSelect, onDelete, onPin }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const isMobile = useIsMobile();

  const name     = getConvName(conv);
  const color    = getConvColor(conv);
  const initials = getConvInitials(conv);
  const user     = conv.type === 'dm' ? getUserById(conv.userId) : null;

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div className={`conv-item${active ? ' active' : ''}`}>
      <div className="conv-item-inner" onClick={() => onSelect(conv.id)}>
        {/* Avatar */}
        <div className="avatar-wrap" style={{ flexShrink: 0 }}>
          {conv.type === 'dm' && user ? (
            <Avatar user={user} size={36} />
          ) : (
            <div
              className="group-avatar"
              style={{
                background: `linear-gradient(145deg,${color}44,${color}22)`,
                color,
              }}
            >
              {initials}
            </div>
          )}
          {conv.type === 'dm' && user && <StatusDot status={user.status} />}
        </div>

        {/* Name + preview */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="conv-row">
            <span className="conv-name">{name}</span>
          </div>
          <div className="conv-preview">
            {conv.type === 'group'
              ? `${conv.memberIds.length} members`
              : user
                ? user.role
                : ''}
          </div>
        </div>
      </div>

      {/* Right side: badge (default) / more-btn (on hover) — same position */}
      <div className="conv-right-actions">
        <span className="conv-badge-area">
          {conv.pinned && <span className="conv-pin-icon"><StarIcon size={10} /></span>}
          {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
        </span>
        <button
          className="conv-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((v) => !v);
          }}
          title="More"
          aria-label="Conversation options"
        >
          <VerticalDotsIcon />
        </button>
      </div>

        {showMenu && !isMobile && (
          <div ref={menuRef} className="conv-context-menu" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 60 }}>
            <button className="conv-ctx-item" onClick={() => { onPin?.(conv.id); setShowMenu(false); }}>
              <StarIcon /> {conv.pinned ? 'Unpin' : 'Pin'}
            </button>
            <div style={{ height: 1, background: 'var(--border)', margin: '3px 8px' }} />
            <button className="conv-ctx-item danger" onClick={() => { onDelete?.(conv.id); setShowMenu(false); }}>
              <TrashIcon /> {conv.type === 'dm' ? 'Delete conversation' : 'Delete group'}
            </button>
          </div>
        )}
        {showMenu && isMobile && createPortal(
          <>
            <div className="bottomsheet-backdrop" onClick={() => setShowMenu(false)} />
            <div className="bottomsheet">
              <div className="bottomsheet-handle" />
              <div className="bottomsheet-title">{name}</div>
              <div className="bottomsheet-actions">
                <button className="bottomsheet-action" onClick={() => { onPin?.(conv.id); setShowMenu(false); }}>
                  <StarIcon size={16} /> {conv.pinned ? 'Unpin' : 'Pin'}
                </button>
                <div className="bottomsheet-divider" />
                <button className="bottomsheet-action danger" onClick={() => { onDelete?.(conv.id); setShowMenu(false); }}>
                  <TrashIcon size={16} /> {conv.type === 'dm' ? 'Delete conversation' : 'Delete group'}
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CallHistoryList — Shown when "Calls" tab is active
   ═══════════════════════════════════════════════════════════ */
const CallHistoryList = ({ callHistory, onCallSelect, onCallStart, search = '' }) => {
  const [selectedCallId, setSelectedCallId] = useState(null);

  const filtered = callHistory.filter((c) => {
    if (c.groupId) {
      return !search || c.groupName.toLowerCase().includes(search.toLowerCase());
    }
    const u = getUserById(c.withUserId);
    return !search || (u && u.name.toLowerCase().includes(search.toLowerCase()));
  });

  const handleSelect = (call) => {
    setSelectedCallId((prev) => (prev === call.id ? null : call.id));
  };

  return (
    <div>
      {filtered.length === 0 && (
        <div className="conv-empty">No calls found</div>
      )}
      {filtered.map((call) => {
        const isGroupCall = !!call.groupId;
        const user = !isGroupCall ? getUserById(call.withUserId) : null;
        if (!isGroupCall && !user) return null;
        const meta = CALL_STATUS_META[call.status] || CALL_STATUS_META.completed;
        const isSelected = selectedCallId === call.id;
        const displayName = isGroupCall ? call.groupName : user.name;

        return (
          <div key={call.id}>
            {/* Call row */}
            <div
              className={`call-hist-item${isSelected ? ' selected' : ''}`}
              onClick={() => handleSelect(call)}
            >
              {isGroupCall ? (
                <div className="group-avatar" style={{ width: 36, height: 36, background: 'var(--accent)22', color: 'var(--accent)', fontSize: 13 }}>
                  {call.groupName.slice(0, 2).toUpperCase()}
                </div>
              ) : (
              <div className="avatar-wrap" style={{ flexShrink: 0 }}>
                <Avatar user={user} size={36} />
                <StatusDot status={user.status} size={9} />
              </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4,
                  }}
                >
                  <span className="conv-name">{displayName}{isGroupCall ? ' (Group)' : ''}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.38)',
                      flexShrink: 0,
                    }}
                  >
                    {formatTime(call.ts)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 3,
                  }}
                >
                  {/* Direction arrow */}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={meta.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {call.direction === 'outgoing' ? (
                      <>
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </>
                    ) : (
                      <>
                        <line x1="17" y1="7" x2="7" y2="17" />
                        <polyline points="17 17 7 17 7 7" />
                      </>
                    )}
                  </svg>

                  {/* Call type icon */}
                  {call.type === 'video' ? (
                    <span style={{ color: meta.color, display: 'flex' }}><VideoIcon size={11} /></span>
                  ) : (
                    <span style={{ color: meta.color, display: 'flex' }}><PhoneIcon size={11} /></span>
                  )}

                  <span
                    style={{ fontSize: 11, color: meta.color, fontWeight: 600 }}
                  >
                    {meta.label}
                  </span>

                  {call.status === 'completed' && call.duration > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.38)',
                      }}
                    >
                      · {fmtCallDuration(call.duration)}
                    </span>
                  )}
                </div>
              </div>

              {/* Chevron */}
              <ChevronRightIcon size={13} />
            </div>

            {/* Expandable detail */}
            {isSelected && (
              <div className="call-detail">
                <div className="call-detail-row">
                  <span className="call-detail-label">Type</span>
                  <span className="call-detail-val">
                    {call.type === 'video' ? 'Video call' : 'Voice call'}
                  </span>
                </div>
                <div className="call-detail-row">
                  <span className="call-detail-label">Direction</span>
                  <span
                    className="call-detail-val"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {call.direction}
                  </span>
                </div>
                <div className="call-detail-row">
                  <span className="call-detail-label">Status</span>
                  <span
                    className="call-detail-val"
                    style={{ color: meta.color, fontWeight: 600 }}
                  >
                    {meta.label}
                  </span>
                </div>
                {call.duration > 0 && (
                  <div className="call-detail-row">
                    <span className="call-detail-label">Duration</span>
                    <span className="call-detail-val">
                      {fmtCallDuration(call.duration)}
                    </span>
                  </div>
                )}
                {call.members && (
                  <div className="call-detail-row">
                    <span className="call-detail-label">Members</span>
                    <span className="call-detail-val">
                      {call.members} participant{call.members !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <div className="call-detail-row">
                  <span className="call-detail-label">Time</span>
                  <span className="call-detail-val">
                    {formatFullTime(call.ts)}
                  </span>
                </div>
                {!isGroupCall && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="call-detail-btn audio" onClick={() => onCallStart?.('audio', user)}>
                    <PhoneIcon size={13} />
                    Call back
                  </button>
                  <button className="call-detail-btn video" onClick={() => onCallStart?.('video', user)}>
                    <VideoIcon size={13} />
                    Video
                  </button>
                </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Sidebar — Main sidebar component
   ═══════════════════════════════════════════════════════════ */
const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  currentUser,
  onNewGroup,
  onNewDM,
  onDeleteConv,
  onPinConv,
  callHistory,
  onCallSelect,
  onCallStart,
  onLogout,
  allMessages,
}) => {
  const [search, setSearch]         = useState('');
  const [section, setSection]       = useState('all');
  const [searchFilter, setSearchFilter] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef(null);
  const isMobile = useIsMobile();

  /* Close logout menu on outside click */
  useEffect(() => {
    if (!showLogout || isMobile) return;
    const handleClickOutside = (e) => {
      if (logoutRef.current && !logoutRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogout, isMobile]);

  /* Filter conversations by tab + search */
  const filtered = conversations.filter((c) => {
    const name = getConvName(c).toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q);
    if (section === 'users')  return c.type === 'dm' && matchSearch;
    if (section === 'groups') return c.type === 'group' && matchSearch;
    if (section === 'calls')  return false;
    if (searchFilter === 'unread') return c.unread > 0 && matchSearch;
    if (searchFilter === 'groups') return c.type === 'group' && matchSearch;
    return matchSearch;
  });

  /* Deep search inside messages when searching on All tab */
  const messageSearchResults = useMemo(() => {
    if (section !== 'all') return [];
    // If a media filter is active, search for that media type across all messages
    const mediaFilters = { photos: 'image', videos: 'video', audio: 'audio', docs: 'doc', links: null };
    const isMediaFilter = searchFilter && mediaFilters[searchFilter] !== undefined;
    
    if (!search.trim() && !isMediaFilter) return [];
    
    const q = search.toLowerCase();
    const results = [];
    conversations.forEach(conv => {
      const msgs = allMessages?.[conv.id] || [];
      msgs.forEach(msg => {
        if (msg.deleted) return;
        const plainText = msg.text ? new DOMParser().parseFromString(msg.text, 'text/html').body.textContent || '' : '';
        
        // Apply media filter
        if (searchFilter === 'photos' && (!msg.file || msg.file.type !== 'image')) return;
        if (searchFilter === 'videos' && (!msg.file || msg.file.type !== 'video')) return;
        if (searchFilter === 'audio' && (!msg.file || msg.file.type !== 'audio')) return;
        if (searchFilter === 'docs' && (!msg.file || (msg.file.type !== 'doc' && msg.file.type !== 'pdf'))) return;
        if (searchFilter === 'links' && !plainText.match(/https?:\/\//i)) return;
        
        // Text search (skip if media filter is active and no search query)
        if (q && !plainText.toLowerCase().includes(q)) return;
        if (!q && isMediaFilter) {
          // Show all matching media type
          results.push({ conv, msg, text: msg.file ? msg.file.name : plainText });
          return;
        }
        if (q) {
          results.push({ conv, msg, text: plainText });
        }
      });
    });
    return results.slice(0, 20);
  }, [search, section, searchFilter, conversations, allMessages]);

  const pinned = filtered.filter((c) => c.pinned);
  const rest   = filtered.filter((c) => !c.pinned);

  return (
    <div className="sidebar">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-name">Chats</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="sb-icon-btn sb-action-btn"
            title="New message"
            aria-label="New message"
            onClick={onNewDM}
          >
            <NewChatIcon />
          </button>
          <button
            className="sb-icon-btn sb-action-btn"
            title="New group"
            aria-label="New group"
            onClick={onNewGroup}
          >
            <NewGroupIcon />
          </button>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="sb-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`sb-tab${section === t.id ? ' active' : ''}`}
            onClick={() => {
              setSection(t.id);
              setSearch('');
              setSearchFilter(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────── */}
      <div className="sb-search">
        <SearchIcon size={14} />
        <input
          placeholder={section === 'calls' ? 'Search calls…' : 'Search…'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
          className="sb-search-input"
          aria-label="Search conversations"
        />
        {search && (
          <button
            className="sb-clear-btn"
            onClick={() => { setSearch(''); setSearchFilter(null); }}
            aria-label="Clear search"
          >
            <CloseIcon size={13} />
          </button>
        )}
      </div>

      {/* ── Search filter chips ────────────────────────── */}
      {section === 'all' && (searchFocused || search || searchFilter) && (
        <div className="sb-filter-chips">
          {[
            { id: 'unread', label: 'Unread', icon: <BellIcon size={11} /> },
            { id: 'groups', label: 'Groups', icon: <NewGroupIcon /> },
            { id: 'photos', label: 'Photos', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
            { id: 'videos', label: 'Videos', icon: <VideoIcon size={12} /> },
            { id: 'links', label: 'Links', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
            { id: 'docs', label: 'Docs', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { id: 'audio', label: 'Audio', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
          ].map(f => (
            <button
              key={f.id}
              className={`sb-filter-chip${searchFilter === f.id ? ' active' : ''}`}
              onClick={() => setSearchFilter(prev => prev === f.id ? null : f.id)}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Conversation / Call list ───────────────────── */}
      <div className="conv-list">
        {section === 'calls' ? (
          <CallHistoryList
            callHistory={callHistory}
            onCallSelect={onCallSelect}
            onCallStart={onCallStart}
            search={search}
          />
        ) : (
          <>
            {/* Pinned section */}
            {pinned.length > 0 && (
              <div className="conv-section-label">
                <StarIcon size={9} />
                Pinned
              </div>
            )}
            {pinned.map((c) => (
              <ConvItem
                key={c.id}
                conv={c}
                active={activeId === c.id}
                onSelect={onSelect}
                onDelete={onDeleteConv}
                onPin={onPinConv}
              />
            ))}

            {/* Recent section */}
            {rest.length > 0 && pinned.length > 0 && (
              <div className="conv-section-label">Recent</div>
            )}
            {rest.map((c) => (
              <ConvItem
                key={c.id}
                conv={c}
                active={activeId === c.id}
                onSelect={onSelect}
                onDelete={onDeleteConv}
                onPin={onPinConv}
              />
            ))}

            {/* Empty state */}
            {filtered.length === 0 && messageSearchResults.length === 0 && (
              <div className="conv-empty">No conversations found</div>
            )}

            {/* Message search results */}
            {section === 'all' && messageSearchResults.length > 0 && (
              <>
                <div className="conv-section-label">Messages</div>
                {messageSearchResults.map((r, i) => {
                  const convName = getConvName(r.conv);
                  const sender = getUserById(r.msg.senderId);
                  const user = r.conv.type === 'dm' ? getUserById(r.conv.userId) : null;
                  // Highlight search term in preview
                  const previewText = r.text.slice(0, 60);
                  const q = search.toLowerCase();
                  let previewEl;
                  if (q && previewText.toLowerCase().includes(q)) {
                    const idx = previewText.toLowerCase().indexOf(q);
                    previewEl = (
                      <span>
                        {previewText.slice(0, idx)}
                        <span style={{ color: '#fff', fontWeight: 600, background: 'var(--accent)', borderRadius: 2, padding: '0 2px' }}>{previewText.slice(idx, idx + q.length)}</span>
                        {previewText.slice(idx + q.length)}
                        {r.text.length > 60 ? '…' : ''}
                      </span>
                    );
                  } else {
                    previewEl = <span>{previewText}{r.text.length > 60 ? '…' : ''}</span>;
                  }
                  return (
                    <div key={`sr-${i}`} className="conv-item" onClick={() => onSelect(r.conv.id)}>
                      <div className="conv-item-inner">
                        <div className="avatar-wrap" style={{ flexShrink: 0 }}>
                          {user ? <Avatar user={user} size={36} /> : (
                            <div className="group-avatar" style={{ background: `${getConvColor(r.conv)}22`, color: getConvColor(r.conv) }}>
                              {getConvInitials(r.conv)}
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="conv-name">{convName}</div>
                          <div className="conv-preview" style={{ display: 'flex', gap: 4 }}>
                            {sender && <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{sender.name.split(' ')[0]}:</span>}
                            {previewEl}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <div className="sb-footer">
        <div className="avatar-wrap">
          <Avatar user={currentUser} size={32} />
          <StatusDot status={currentUser.status} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-footer-name">{currentUser.name}</div>
          <div className="sb-footer-status">
            {STATUS_LABELS[currentUser.status]}
          </div>
        </div>
        <div style={{ position: 'relative' }} ref={logoutRef}>
          <button
            className="sb-icon-btn"
            title="Settings"
            aria-label="Settings"
            onClick={() => setShowLogout((v) => !v)}
          >
            <SettingsIcon />
          </button>
          {showLogout && !isMobile && (
            <div className="logout-menu">
              <button
                className="logout-menu-item danger"
                onClick={() => {
                  setShowLogout(false);
                  onLogout?.();
                }}
              >
                <LogoutIcon />
                Sign out
              </button>
            </div>
          )}
          {showLogout && isMobile && createPortal(
            <>
              <div className="bottomsheet-backdrop" onClick={() => setShowLogout(false)} />
              <div className="bottomsheet">
                <div className="bottomsheet-handle" />
                <div className="bottomsheet-actions">
                  <button className="bottomsheet-action danger" onClick={() => { setShowLogout(false); onLogout?.(); }}>
                    <LogoutIcon size={16} /> Sign out
                  </button>
                </div>
              </div>
            </>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
