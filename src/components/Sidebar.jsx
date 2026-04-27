import { useState, useEffect, useRef } from 'react';
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
            <div className="conv-meta">
              {conv.pinned && (
                <span style={{color:'rgba(255,255,255,0.4)',display:'flex'}}><StarIcon size={10} /></span>
              )}
              {conv.unread > 0 && (
                <span className="unread-badge">{conv.unread}</span>
              )}
            </div>
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

      {/* Context menu trigger */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
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

        {showMenu && !isMobile && (
          <div ref={menuRef} className="conv-context-menu">
            <button
              className="conv-ctx-item"
              onClick={() => {
                onPin?.(conv.id);
                setShowMenu(false);
              }}
            >
              <StarIcon />
              {conv.pinned ? 'Unpin' : 'Pin'}
            </button>
            <div style={{ height: 1, background: 'var(--border)', margin: '3px 8px' }} />
            <button
              className="conv-ctx-item danger"
              onClick={() => {
                onDelete?.(conv.id);
                setShowMenu(false);
              }}
            >
              <TrashIcon />
              {conv.type === 'dm' ? 'Delete conversation' : 'Delete group'}
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
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CallHistoryList — Shown when "Calls" tab is active
   ═══════════════════════════════════════════════════════════ */
const CallHistoryList = ({ callHistory, onCallSelect, onCallStart, search = '' }) => {
  const [selectedCallId, setSelectedCallId] = useState(null);

  const filtered = callHistory.filter((c) => {
    const u = getUserById(c.withUserId);
    return !search || (u && u.name.toLowerCase().includes(search.toLowerCase()));
  });

  const handleSelect = (call) => {
    setSelectedCallId((prev) => (prev === call.id ? null : call.id));
    onCallSelect?.(call);
  };

  return (
    <div>
      {filtered.length === 0 && (
        <div className="conv-empty">No calls found</div>
      )}
      {filtered.map((call) => {
        const user = getUserById(call.withUserId);
        if (!user) return null;
        const meta = CALL_STATUS_META[call.status] || CALL_STATUS_META.completed;
        const isSelected = selectedCallId === call.id;

        return (
          <div key={call.id}>
            {/* Call row */}
            <div
              className={`call-hist-item${isSelected ? ' selected' : ''}`}
              onClick={() => handleSelect(call)}
            >
              <div className="avatar-wrap" style={{ flexShrink: 0 }}>
                <Avatar user={user} size={36} />
                <StatusDot status={user.status} size={9} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 4,
                  }}
                >
                  <span className="conv-name">{user.name}</span>
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
                <div className="call-detail-row">
                  <span className="call-detail-label">Time</span>
                  <span className="call-detail-val">
                    {formatFullTime(call.ts)}
                  </span>
                </div>
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
}) => {
  const [search, setSearch]         = useState('');
  const [section, setSection]       = useState('all');
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
    return matchSearch;
  });

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
          className="sb-search-input"
          aria-label="Search conversations"
        />
        {search && (
          <button
            className="sb-clear-btn"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <CloseIcon size={13} />
          </button>
        )}
      </div>

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
            {filtered.length === 0 && (
              <div className="conv-empty">No conversations found</div>
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
