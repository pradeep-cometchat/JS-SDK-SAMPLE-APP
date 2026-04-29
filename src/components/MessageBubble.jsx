import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getUserById, formatTime, formatFullTime, EMOJIS, STATUS_COLORS } from '../data';
import { Avatar } from './Avatar';
import { FileIcon } from './FileIcon';
import { ThreadIcon, EditIcon, TrashIcon, MoreDotsIcon, EmojiIcon, CopyIcon, PinIcon, BellIcon, DownloadIcon, CloseIcon, InfoIcon, PhoneIcon, VideoIcon } from './Icons';

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

/* ─── POLL VOTES MODAL ────────────────────────────────── */
const PollVotesModal = ({ poll, onClose }) => {
  return createPortal(
    <div className="poll-votes-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="poll-votes-card">
        <div className="poll-votes-header">
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Poll Votes</div>
          <button className="icon-btn" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>
        <div className="poll-votes-body">
          {poll.options.map((opt, i) => (
            <div key={i} className="poll-votes-option">
              <div className="poll-votes-option-label">
                <span>{opt.text}</span>
                <span className="poll-votes-option-count">{opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''}</span>
              </div>
              {opt.votes.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '2px 0' }}>No votes</div>
              ) : (
                opt.votes.map(uid => {
                  const u = getUserById(uid);
                  return u ? (
                    <div key={uid} className="poll-votes-user">
                      <Avatar user={u} size={22} />
                      <span className="poll-votes-user-name">{u.name}</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─── POLL MESSAGE ───────────────────────────────────────── */
const PollMessage = ({ poll, msgId, currentUserId, onVote, isOwn }) => {
  const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
  const userVoted = poll.options.findIndex(o => o.votes.includes(currentUserId));
  const [showVotes, setShowVotes] = useState(false);

  return (
    <div className="poll-bubble">
      <div className="poll-question">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        {poll.question}
      </div>
      <div className="poll-options">
        {poll.options.map((opt, i) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
          const isMyVote = opt.votes.includes(currentUserId);
          const hasVoted = userVoted >= 0;
          return (
            <button key={i} className={`poll-option${isMyVote ? ' my-vote' : ''}${hasVoted ? ' voted' : ''}`}
              onClick={() => !hasVoted && onVote(msgId, i)} disabled={hasVoted}>
              <div className="poll-option-bar" style={{ width: hasVoted ? pct + '%' : '0%' }} />
              <div className="poll-option-content">
                <span className="poll-option-text" style={{ color: isOwn ? '#fff' : 'var(--text)' }}>{opt.text}</span>
                <span className="poll-option-pct">
                  {hasVoted ? `${pct}%` : ''}
                  {isMyVote && <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="poll-footer">
        <span className="poll-total">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        {userVoted >= 0 && (
          <button className="poll-view-votes" onClick={() => setShowVotes(true)}>
            View votes
          </button>
        )}
      </div>
      {showVotes && (
        <PollVotesModal poll={poll} onClose={() => setShowVotes(false)} />
      )}
    </div>
  );
};

/* ─── VOICE NOTE PLAYER (WhatsApp style) ──────────────── */
const WAVEFORM_BARS = Array.from({ length: 28 }, () => Math.random() * 0.7 + 0.3);

const VoiceNotePlayer = ({ file, isOwn }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(file.duration || 0);
  const rafRef = useRef(null);

  const updateProgress = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.duration && isFinite(el.duration)) {
      setProgress(el.currentTime / el.duration);
    }
    if (!el.paused) rafRef.current = requestAnimationFrame(updateProgress);
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      el.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => { setPlaying(false); setProgress(0); cancelAnimationFrame(rafRef.current); };
    const onLoaded = () => { if (el.duration && isFinite(el.duration)) setDuration(Math.round(el.duration)); };
    el.addEventListener('ended', onEnded);
    el.addEventListener('loadedmetadata', onLoaded);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('loadedmetadata', onLoaded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const fmtDur = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const playedBars = Math.floor(progress * WAVEFORM_BARS.length);

  return (
    <div className="voice-note-player" style={{ marginTop: file.name && 0 }}>
      <button className="voice-play-btn" onClick={togglePlay}>
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
      </button>
      <div className="voice-waveform">
        {WAVEFORM_BARS.map((h, i) => (
          <div
            key={i}
            className={`voice-waveform-bar${i < playedBars ? ' played' : ''}`}
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>
      <span className="voice-duration">{fmtDur(duration)}</span>
      <audio ref={audioRef} src={file.previewUrl} preload="metadata" style={{ display: 'none' }} />
    </div>
  );
};

/* ─── MESSAGE BUBBLE ─────────────────────────────────────── */
export const MessageBubble = ({
  msg, prevMsg, isOwn, allUsers, currentUser,
  onReact, onDelete, onEditRequest, onThreadOpen,
  onReply, density, onVote, onMarkUnread, onPin, pinnedMsgIds, isGroup
}) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [justReacted, setJustReacted] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef(null);
  const addBtnRef = useRef(null);
  const overflowRef = useRef(null);
  const longPressTimer = useRef(null);
  const isMobile = useIsMobile();

  const handleTouchStart = () => {
    if (!isMobile) return;
    longPressTimer.current = setTimeout(() => {
      setShowMobileActions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const sender = getUserById(msg.senderId);
  const showName = isGroup && (!prevMsg || prevMsg.senderId !== msg.senderId);
  const showAvatar = isGroup && !isOwn;
  const gap = density === 'compact' ? 2 : 4;

  useEffect(() => {
    if (!showEmojiPicker && !showMoreMenu && !showDeleteConfirm) return;
    const h = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        setShowMoreMenu(false);
        setShowDeleteConfirm(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showEmojiPicker, showMoreMenu, showDeleteConfirm]);

  useEffect(() => {
    if (!showAllReactions) return;
    const h = (e) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target)) {
        setShowAllReactions(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showAllReactions]);

  const handleReact = (emoji) => {
    onReact(msg.id, emoji);
    setJustReacted(emoji);
    setShowEmojiPicker(false);
    setTimeout(() => setJustReacted(null), 600);
  };

  if (msg.deleted) {
    if (!isOwn) return null; // Hide deleted messages from receiver
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-light)', fontStyle: 'italic', padding: '2px 0', marginBottom: gap, justifyContent: 'flex-end' }}>
        <TrashIcon size={13} />
        You deleted this message
      </div>
    );
  }

  const reactionGroups = {};
  (msg.reactions || []).forEach(r => {
    if (!reactionGroups[r.emoji]) reactionGroups[r.emoji] = [];
    reactionGroups[r.emoji].push(...r.userIds);
  });
  const myReactions = new Set((msg.reactions || []).filter(r => r.userIds.includes(currentUser.id)).map(r => r.emoji));

  return (
    <div className={`msg-row${isOwn ? ' own' : ''}`}
      style={{ marginBottom: showName ? (density === 'compact' ? 8 : 12) : gap }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => { if (!isMobile) { setHovered(false); if (!showEmojiPicker && !showMoreMenu) setShowDeleteConfirm(false); } }}>
      {showAvatar && (
        <div style={{ width: 32, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
          {showName ? <Avatar user={sender} size={28} /> : null}
        </div>
      )}
      <div className="msg-content-col" style={{ flex: 1, minWidth: 0 }}>
        {showName && !isOwn && (
          <div className="msg-meta">
            <span className="msg-sender-name" style={{ color: sender?.color }}>{sender?.name}</span>
          </div>
        )}
        <div ref={anchorRef} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
          {/* Toolbar */}
          {hovered && !isMobile && (
            <div className={`msg-toolbar${isOwn ? ' own' : ''}`}>
              {['👍', '❤️', '😂', '🚀'].map(e => (
                <button key={e} className={`tb-emoji-btn${myReactions.has(e) ? ' active' : ''}`} onClick={() => handleReact(e)}>{e}</button>
              ))}
              <div className="tb-divider" />
              <button className="tb-btn" title="React" onClick={() => { setShowEmojiPicker(v => !v); setShowMoreMenu(false); setShowDeleteConfirm(false); }}>
                <EmojiIcon size={14} />
              </button>
              <button className="tb-btn" title="Reply in thread" onClick={() => onThreadOpen(msg)}>
                <ThreadIcon />
              </button>
              <button className="tb-btn" title="Reply" onClick={() => { onReply(msg); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
              </button>
              {isOwn && <button className="tb-btn" title="Edit message" onClick={() => onEditRequest(msg)}><EditIcon /></button>}
              {isOwn && <button className="tb-btn danger" title="Delete" onClick={() => { setShowDeleteConfirm(v => !v); setShowMoreMenu(false); setShowEmojiPicker(false); }}><TrashIcon /></button>}
              <button className="tb-btn" title="More options" onClick={() => { setShowMoreMenu(v => !v); setShowEmojiPicker(false); setShowDeleteConfirm(false); }}>
                <MoreDotsIcon />
              </button>
            </div>
          )}
          {/* Bubble */}
          <div className={`msg-bubble${isOwn ? ' own' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {msg.replyTo && (() => {
              const replySender = getUserById(msg.replyTo.senderId);
              return (
                <div style={{padding:'6px 10px',marginBottom:6,borderLeft:isOwn?'3px solid rgba(255,255,255,0.6)':'3px solid var(--accent)',borderRadius:4,background:isOwn?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.05)',fontSize:12}}>
                  <div style={{fontWeight:600,color:isOwn?'#fff':'var(--accent)',fontSize:11}}>{replySender?.name}</div>
                  <div style={{color:isOwn?'rgba(255,255,255,0.85)':'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} dangerouslySetInnerHTML={{__html: msg.replyTo.text?.slice(0,80) || 'Attachment'}} />
                </div>
              );
            })()}
            {msg.poll ? (
              <PollMessage poll={msg.poll} msgId={msg.id} currentUserId={currentUser.id} onVote={onVote} isOwn={isOwn} />
            ) : (
              <>
                {msg.text && (() => {
                  const plainText = new DOMParser().parseFromString(msg.text, 'text/html').body.textContent || '';
                  const lineCount = (plainText.match(/\n/g) || []).length + 1;
                  const isLong = plainText.length > 200 || lineCount > 6;
                  return (
                    <>
                      <div className={`msg-text${isLong && !expanded ? ' clamped' : ''}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                      {isLong && !expanded && (
                        <button className="read-more-btn" onClick={(e) => { e.stopPropagation(); setExpanded(true); }}>Read more</button>
                      )}
                    </>
                  );
                })()}
              </>
            )}
            {msg.file && (
              msg.file.type === 'group-call' ? (
                <div className="call-msg-card">
                  <div className="call-msg-icon">
                    {msg.file.callType === 'video' ? <VideoIcon size={18} /> : <PhoneIcon size={18} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{msg.file.callType === 'video' ? 'Video call' : 'Voice call'}</div>
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 1 }}>{formatFullTime(msg.file.callTs || msg.ts)}</div>
                  </div>
                </div>
              ) : msg.file.type === 'image' ? (
                <div style={{ marginTop: msg.text ? 8 : 0, maxWidth: '100%', overflow: 'hidden' }}>
                  {msg.file.previewUrl ? (
                    <img src={msg.file.previewUrl} alt={msg.file.name} style={{ maxWidth: '100%', width: '100%', maxHeight: 220, borderRadius: 8, objectFit: 'cover', display: 'block', cursor: 'pointer' }} onClick={() => window.open(msg.file.previewUrl, '_blank')} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: isOwn ? 'rgba(255,255,255,0.1)' : 'var(--bg)', borderRadius: 8, marginTop: msg.text ? 4 : 0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isOwn ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.file.name}</div>
                        {msg.file.size && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1 }}>{msg.file.size}</div>}
                      </div>
                    </div>
                  )}
                  {msg.file.previewUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, opacity: 0.65 }}>
                      <span>{msg.file.name}</span>
                      {msg.file.size && <span>· {msg.file.size}</span>}
                    </div>
                  )}
                </div>
              ) : msg.file.type === 'video' ? (
                <div style={{ marginTop: msg.text ? 8 : 0 }}>
                  {msg.file.previewUrl ? (
                    <video src={msg.file.previewUrl} controls preload="metadata" style={{ maxWidth: 260, maxHeight: 180, borderRadius: 8, display: 'block', background: '#000' }} />
                  ) : (
                    <div style={{ width: 260, height: 140, borderRadius: 8, background: isOwn ? 'rgba(255,255,255,0.1)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileIcon type="video" size={32} color={isOwn ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)'} />
                    </div>
                  )}
                </div>
              ) : msg.file.type === 'audio' && msg.file.previewUrl ? (
                <VoiceNotePlayer file={msg.file} isOwn={isOwn} />
              ) : (msg.file.type === 'whiteboard' || msg.file.type === 'collab-doc') ? (
                <div className="collab-card" style={{ marginTop: msg.text ? 8 : 0 }}>
                  {msg.file.previewUrl && (
                    <div className="collab-card-preview">
                      <img src={msg.file.previewUrl} alt={msg.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="collab-card-info">
                    <div className="collab-card-icon">
                      {msg.file.type === 'whiteboard' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="collab-card-title">{msg.file.name}</div>
                      <div className="collab-card-sub">{msg.file.type === 'whiteboard' ? 'Open whiteboard to draw together' : 'Open document to edit content together'}</div>
                    </div>
                  </div>
                  <button className="collab-card-btn" onClick={() => window.open(msg.file.linkUrl, '_blank')}>
                    Open {msg.file.type === 'whiteboard' ? 'Whiteboard' : 'Document'}
                  </button>
                </div>
              ) : (
                <div className="msg-file" style={{ marginTop: msg.text ? 8 : 0 }}>
                  <div className="file-icon-wrap">
                    <FileIcon type={msg.file.type} size={22} color={isOwn ? 'rgba(255,255,255,0.85)' : 'var(--accent)'} />
                  </div>
                  <div className="file-info">
                    <div className="file-name">{msg.file.name}</div>
                    {msg.file.size && <div className="file-size">{msg.file.size}</div>}
                  </div>
                  <button className="file-dl-btn" title="Download"><DownloadIcon /></button>
                </div>
              )
            )}
            {/* Inline timestamp + read receipt + pin */}
            <div className="msg-bubble-footer">
              {pinnedMsgIds?.includes(msg.id) && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill={isOwn ? 'rgba(255,255,255,0.8)' : 'var(--accent)'} stroke="none" style={{ flexShrink: 0 }}><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg>
              )}
              <span className="msg-bubble-time">{formatTime(msg.ts)}</span>
              {msg.edited && <span className="msg-bubble-edited">(edited)</span>}
              {isOwn && (
                msg.readBy && msg.readBy.length > 0 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /><polyline points="15 6 9 12" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ opacity: 0.4 }}><polyline points="20 6 9 17 4 12" /></svg>
                )
              )}
            </div>
          </div>
          {/* Emoji picker */}
          {showEmojiPicker && !isMobile && (() => {
            const rect = anchorRef.current?.getBoundingClientRect();
            const nearBottom = rect && rect.bottom > window.innerHeight - 280;
            return (
              <div className={`mini-emoji-picker${isOwn ? ' own' : ''}${nearBottom ? ' flip-up' : ''}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4 }}>
                  {EMOJIS.map(e => (
                    <button key={e} className="emoji-btn" onClick={() => handleReact(e)}>{e}</button>
                  ))}
                </div>
              </div>
            );
          })()}
          {/* More menu */}
          {showMoreMenu && !isMobile && (() => {
            const rect = anchorRef.current?.getBoundingClientRect();
            const nearBottom = rect && rect.bottom > window.innerHeight - 200;
            return (
            <div className={`bubble-menu${isOwn ? ' own' : ''}${nearBottom ? ' flip-up' : ''}`}>
              <button className="more-menu-item" onClick={() => {
                const plain = msg.text ? new DOMParser().parseFromString(msg.text, 'text/html').body.textContent : '';
                navigator.clipboard?.writeText(plain).then(() => { setCopiedToast(true); setTimeout(() => setCopiedToast(false), 1500); });
                setShowMoreMenu(false);
              }}><CopyIcon /> Copy text</button>
              <button className="more-menu-item" onClick={() => { onPin?.(msg); setShowMoreMenu(false); }}>
                <PinIcon /> {pinnedMsgIds?.includes(msg.id) ? 'Unpin message' : 'Pin message'}
              </button>
              <button className="more-menu-item" onClick={() => { onMarkUnread?.(msg); setShowMoreMenu(false); }}>
                <BellIcon /> Mark unread
              </button>
              {isOwn && (
                <button className="more-menu-item" onClick={() => { setShowInfoModal(true); setShowMoreMenu(false); }}>
                  <InfoIcon /> Message info
                </button>
              )}
            </div>
            );
          })()}
          {/* Copied toast */}
          {copiedToast && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--text)', color: 'var(--surface)', padding: '4px 12px', borderRadius: 6,
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 40, animation: 'fadeIn 0.15s ease',
            }}>Copied!</div>
          )}
          {/* Delete confirm */}
          {showDeleteConfirm && !isMobile && (() => {
            const rect = anchorRef.current?.getBoundingClientRect();
            const nearBottom = rect && rect.bottom > window.innerHeight - 200;
            return (
            <div className={`bubble-menu${isOwn ? ' own' : ''}${nearBottom ? ' flip-up' : ''}`} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', minWidth: 240 }}>
              <span style={{ fontSize: 13, flex: 1 }}>Delete this message?</span>
              <button className="btn-ghost-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-danger-sm" onClick={() => { onDelete(msg.id); setShowDeleteConfirm(false); }}>Delete</button>
            </div>
            );
          })()}
        </div>
        {/* Mobile action bottom sheet */}
        {isMobile && showMobileActions && createPortal(
          <>
            <div className="bottomsheet-backdrop" onClick={() => setShowMobileActions(false)} />
            <div className="bottomsheet">
              <div className="bottomsheet-handle" />
              {/* Quick reactions */}
              <div className="bottomsheet-emoji-row">
                {['👍', '❤️', '😂', '😮', '🚀', '🙏'].map(e => (
                  <button key={e} className={`tb-emoji-btn${myReactions.has(e) ? ' active' : ''}`}
                    onClick={() => { handleReact(e); setShowMobileActions(false); }}
                    style={{ fontSize: 22, padding: '8px 10px' }}>{e}</button>
                ))}
                <button className="tb-emoji-btn" onClick={() => { setShowMobileActions(false); setShowEmojiPicker(true); }}
                  style={{ fontSize: 16, padding: '8px 10px', color: 'var(--text-muted)' }}>
                  <EmojiIcon size={20} />
                </button>
              </div>
              <div className="bottomsheet-divider" />
              <div className="bottomsheet-actions">
                <button className="bottomsheet-action" onClick={() => { onReply(msg); setShowMobileActions(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
                  Reply
                </button>
                <button className="bottomsheet-action" onClick={() => { onThreadOpen(msg); setShowMobileActions(false); }}>
                  <ThreadIcon size={16} /> Reply in thread
                </button>
                <button className="bottomsheet-action" onClick={() => {
                  const plain = msg.text ? new DOMParser().parseFromString(msg.text, 'text/html').body.textContent : '';
                  navigator.clipboard?.writeText(plain).then(() => { setCopiedToast(true); setTimeout(() => setCopiedToast(false), 1500); });
                  setShowMobileActions(false);
                }}>
                  <CopyIcon size={16} /> Copy text
                </button>
                <button className="bottomsheet-action" onClick={() => { onPin?.(msg); setShowMobileActions(false); }}>
                  <PinIcon size={16} /> {pinnedMsgIds?.includes(msg.id) ? 'Unpin message' : 'Pin message'}
                </button>
                <button className="bottomsheet-action" onClick={() => { onMarkUnread?.(msg); setShowMobileActions(false); }}>
                  <BellIcon size={16} /> Mark unread
                </button>
                {isOwn && (
                  <button className="bottomsheet-action" onClick={() => { onEditRequest(msg); setShowMobileActions(false); }}>
                    <EditIcon size={16} /> Edit message
                  </button>
                )}
                {isOwn && (
                  <>
                    <div className="bottomsheet-divider" />
                    <button className="bottomsheet-action danger" onClick={() => { setShowMobileActions(false); setShowDeleteConfirm(true); }}>
                      <TrashIcon size={16} /> Delete message
                    </button>
                  </>
                )}
                {isOwn && (
                  <button className="bottomsheet-action" onClick={() => { setShowInfoModal(true); setShowMobileActions(false); }}>
                    <InfoIcon size={16} /> Message info
                  </button>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
        {/* Mobile emoji picker bottom sheet */}
        {isMobile && showEmojiPicker && createPortal(
          <>
            <div className="bottomsheet-backdrop" onClick={() => setShowEmojiPicker(false)} />
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
        {/* Mobile delete confirm bottom sheet */}
        {isMobile && showDeleteConfirm && createPortal(
          <>
            <div className="bottomsheet-backdrop" onClick={() => setShowDeleteConfirm(false)} />
            <div className="bottomsheet">
              <div className="bottomsheet-handle" />
              <div className="bottomsheet-confirm">
                <p>Are you sure you want to delete this message? This can't be undone.</p>
                <div className="bottomsheet-confirm-btns">
                  <button className="btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="btn-danger-sm" onClick={() => { onDelete(msg.id); setShowDeleteConfirm(false); }}>Delete</button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
        {/* Reactions */}
        {Object.keys(reactionGroups).length > 0 && (() => {
          const allReactions = Object.entries(reactionGroups);
          const bubbleWidth = anchorRef.current?.offsetWidth || 300;
          const chipWidth = 52;
          const overflowChipWidth = 40;
          let maxVisible = Math.max(1, Math.floor(bubbleWidth / chipWidth));
          if (allReactions.length > maxVisible) {
            maxVisible = Math.max(1, Math.floor((bubbleWidth - overflowChipWidth) / chipWidth));
          }
          const visible = allReactions.slice(0, maxVisible);
          const overflow = allReactions.slice(maxVisible);
          return (
            <div className="reaction-row">
              {visible.map(([emoji, users]) => (
                <button key={emoji} className={`reaction-chip${myReactions.has(emoji) ? ' mine' : ''}`}
                  onClick={() => handleReact(emoji)}
                  title={users.map(id => getUserById(id)?.name).filter(Boolean).join(', ')}>
                  <span className={`reaction-emoji${justReacted === emoji ? ' pop' : ''}`}>{emoji}</span>
                  <span className="reaction-count">{users.length}</span>
                </button>
              ))}
              {overflow.length > 0 && (
                <div style={{ position: 'relative', display: 'inline-flex' }} ref={overflowRef}>
                  <button className="reaction-chip" onClick={() => setShowAllReactions(v => !v)}
                    style={{ fontWeight: 700, fontSize: 12, gap: 3 }}>
                    +{overflow.length}
                  </button>
                  {showAllReactions && !isMobile && createPortal(
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setShowAllReactions(false)}>
                      <div style={{
                        position: 'absolute',
                        ...((() => {
                          const rect = overflowRef.current?.getBoundingClientRect();
                          if (!rect) return { top: 100, left: 100 };
                          const showAbove = rect.top > 200;
                          return showAbove
                            ? { bottom: window.innerHeight - rect.top + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - 240)) }
                            : { top: rect.bottom + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - 240)) };
                        })()),
                        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
                        padding: 12, boxShadow: 'var(--shadow-lg)', minWidth: 200, maxWidth: 280, animation: 'scaleIn 0.12s ease',
                      }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>All reactions</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {allReactions.map(([emoji, users]) => (
                            <button key={emoji} className={`reaction-chip${myReactions.has(emoji) ? ' mine' : ''}`}
                              onClick={() => { handleReact(emoji); }}
                              title={users.map(id => getUserById(id)?.name).filter(Boolean).join(', ')}>
                              <span className="reaction-emoji">{emoji}</span>
                              <span className="reaction-count">{users.length}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                  {showAllReactions && isMobile && createPortal(
                    <>
                      <div className="bottomsheet-backdrop" onClick={() => setShowAllReactions(false)} />
                      <div className="bottomsheet">
                        <div className="bottomsheet-handle" />
                        <div className="bottomsheet-title">All reactions</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 16px 20px' }}>
                          {allReactions.map(([emoji, users]) => (
                            <button key={emoji} className={`reaction-chip${myReactions.has(emoji) ? ' mine' : ''}`}
                              onClick={() => { handleReact(emoji); setShowAllReactions(false); }}
                              title={users.map(id => getUserById(id)?.name).filter(Boolean).join(', ')}>
                              <span className="reaction-emoji">{emoji}</span>
                              <span className="reaction-count">{users.length}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              )}
            </div>
          );
        })()}
        {/* Thread link */}
        {msg.threadCount > 0 && (
          <button className="thread-link" onClick={() => onThreadOpen(msg)}>
            <span>{msg.threadCount} {msg.threadCount === 1 ? 'reply' : 'replies'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>
      {/* Message Info Modal */}
      {showInfoModal && createPortal(
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowInfoModal(false)}>
          <div className="modal-card" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <div className="modal-title">
                <InfoIcon size={16} /> Message Info
              </div>
              <button className="icon-btn" onClick={() => setShowInfoModal(false)}>
                <CloseIcon size={16} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {/* Message preview */}
              <div style={{ padding: '10px 14px', background: 'var(--accent-light)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                {msg.text ? <div dangerouslySetInnerHTML={{ __html: msg.text }} /> : msg.file ? <span style={{ fontStyle: 'italic' }}>{msg.file.name}</span> : <span style={{ fontStyle: 'italic' }}>Poll</span>}
              </div>

              {/* Delivery info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Sent</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(msg.ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/><polyline points="15 6 9 12"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Delivered</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(msg.ts + 1200).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/><polyline points="15 6 9 12"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Read</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {msg.readBy && msg.readBy.length > 0
                      ? new Date(msg.ts + 45000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '—'}
                  </span>
                </div>

                {/* Read by users */}
                {msg.readBy && msg.readBy.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Read by</div>
                    {msg.readBy.map(id => {
                      const u = getUserById(id);
                      return u ? (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                          <Avatar user={u} size={24} />
                          <span style={{ fontSize: 13, color: 'var(--text)' }}>{u.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
