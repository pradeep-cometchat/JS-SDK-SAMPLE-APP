import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getUserById, getConvName, CURRENT_USER, formatTime, formatFullTime, EMOJIS, EMOJI_CATEGORIES } from '../data';
import { Avatar, StatusDot } from './Avatar';
import { FileIcon } from './FileIcon';
import { MessageBubble } from './MessageBubble';
import {
  SearchIcon, CloseIcon, PhoneIcon, VideoIcon, UserIcon, UsersIcon,
  PlusIcon, EmojiIcon, SendIcon, CheckIcon, EditIcon, PollIcon,
  ChevronUpIcon, ChevronDownIcon, MicIcon, StopIcon, TrashIcon, PinIcon,
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

/* ─── EMOJI KEYBOARD ─────────────────────────────────────── */
const EmojiKeyboard = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const all = EMOJI_CATEGORIES.flatMap(c => c.emojis).filter((e, i, a) => a.indexOf(e) === i);
    return all.slice(0, 64);
  }, [search]);

  const currentEmojis = searchResults || EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.emojis || [];

  const EMOJI_TAB_ICONS = { recent: '🕐', smileys: '😀', gestures: '👋', animals: '🐻', food: '🍔', objects: '💡', symbols: '❤️' };

  return (
    <div ref={containerRef} className="emoji-keyboard">
      <div className="ek-search-row">
        <SearchIcon size={14} />
        <input
          ref={searchRef}
          className="ek-search-input"
          placeholder="Search emoji…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="ek-clear" onClick={() => setSearch('')}>
            <CloseIcon size={13} />
          </button>
        )}
      </div>
      {!search && (
        <div className="ek-tabs">
          {EMOJI_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`ek-tab${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
            >
              {EMOJI_TAB_ICONS[cat.id] || cat.label.slice(0, 2)}
            </button>
          ))}
        </div>
      )}
      <div className="ek-cat-label">
        {search
          ? `Search results (${currentEmojis.length})`
          : EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.label}
      </div>
      <div className="ek-grid">
        {currentEmojis.map((e, i) => (
          <button key={`${e}-${i}`} className="ek-emoji-btn" onClick={() => onSelect(e)} title={e}>
            {e}
          </button>
        ))}
        {currentEmojis.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No emoji found
          </div>
        )}
      </div>
    </div>
  );
};


/* ─── POLL MODAL ─────────────────────────────────────────── */
const PollModal = ({ onClose, onSend }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const qRef = useRef(null);

  useEffect(() => {
    setTimeout(() => qRef.current?.focus(), 50);
  }, []);

  const addOption = () => {
    if (options.length >= 10) return;
    setOptions(prev => [...prev, '']);
  };

  const removeOption = (i) => {
    if (options.length <= 2) return;
    setOptions(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateOption = (i, val) => {
    setOptions(prev => prev.map((o, idx) => (idx === i ? val : o)));
  };

  const handleSend = () => {
    if (!question.trim()) { setError('Please enter a question.'); return; }
    const filled = options.map(o => o.trim()).filter(Boolean);
    if (filled.length < 2) { setError('Please add at least 2 options.'); return; }
    const dupes = filled.filter((o, i) => filled.indexOf(o) !== i);
    if (dupes.length > 0) { setError('Options must be unique.'); return; }
    onSend({
      question: question.trim(),
      options: filled.map(text => ({ text, votes: [] })),
      createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PollIcon size={18} />
            Create a Poll
          </div>
          <button className="icon-btn" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '8px 12px',
              borderRadius: 8, marginBottom: 12, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Question */}
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label className="form-label">Question *</label>
            <textarea
              ref={qRef}
              className="form-input"
              placeholder="Ask a question…"
              value={question}
              onChange={e => { setQuestion(e.target.value); setError(''); }}
              rows={2}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Options */}
          <div className="form-label" style={{ marginBottom: 8 }}>Options ({options.length}/10)</div>
          {options.map((opt, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--accent-light)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <input
                className="form-input"
                style={{ flex: 1 }}
                placeholder={`Option ${i + 1}${i < 2 ? ' (required)' : ''}`}
                value={opt}
                onChange={e => { updateOption(i, e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (i === options.length - 1) addOption(); } }}
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(i)}
                  style={{
                    padding: 4, color: 'var(--text-muted)', border: 'none',
                    background: 'none', cursor: 'pointer', borderRadius: 4, flexShrink: 0,
                  }}
                >
                  <CloseIcon size={15} />
                </button>
              )}
            </div>
          ))}

          {options.length < 10 && (
            <button
              onClick={addOption}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                borderRadius: 8, border: '1.5px dashed var(--border)', background: 'none',
                color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
                width: '100%', justifyContent: 'center', marginBottom: 16, fontFamily: 'var(--font)',
              }}
            >
              <PlusIcon size={14} />
              Add option
            </button>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSend} disabled={!question.trim()}>
            <PollIcon size={14} />
            <span style={{ marginLeft: 6 }}>Send Poll</span>
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─── ATTACH MENU ────────────────────────────────────────── */
const AttachMenu = ({ onAttach, onClose, onPoll }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const items = [
    { id: 'camera',     label: 'Camera',       color: '#6851D6', icon: <VideoIcon size={20} /> },
    { id: 'image',      label: 'Attach Image',  color: '#0ea5e9', icon: <FileIcon type="image" size={20} color="#0ea5e9" /> },
    { id: 'video',      label: 'Attach Video',  color: '#8b5cf6', icon: <VideoIcon size={20} /> },
    { id: 'audio',      label: 'Attach Audio',  color: '#ec4899', icon: <FileIcon type="audio" size={20} color="#ec4899" /> },
    { id: 'doc',        label: 'Document',       color: '#f59e0b', icon: <FileIcon type="doc" size={20} color="#f59e0b" /> },
    { id: 'poll',       label: 'Create Poll',    color: '#10b981', icon: <PollIcon size={20} /> },
    { id: 'whiteboard', label: 'Whiteboard',     color: '#f97316', icon: <EditIcon size={20} /> },
    { id: 'collab-doc', label: 'Collab Doc',     color: '#6851D6', icon: <FileIcon type="doc" size={20} color="#6851D6" /> },
  ];

  const handleClick = (item) => {
    if (item.id === 'poll') { onPoll(); onClose(); return; }
    if (['image', 'video', 'audio', 'doc'].includes(item.id)) {
      const accept =
        item.id === 'image' ? 'image/*' :
        item.id === 'video' ? 'video/*' :
        item.id === 'audio' ? 'audio/*' :
        '.pdf,.doc,.docx,.txt,.xls,.xlsx,.pptx';
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = accept;
      inp.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const size = file.size < 1024
          ? file.size + ' B'
          : file.size < 1048576
            ? (file.size / 1024).toFixed(1) + ' KB'
            : (file.size / 1048576).toFixed(1) + ' MB';
        const previewUrl = (item.id === 'image' || item.id === 'video') ? URL.createObjectURL(file) : null;
        onAttach({ name: file.name, size, type: item.id, previewUrl });
      };
      inp.click();
    } else if (item.id === 'camera') {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.capture = 'environment';
      inp.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const size = (file.size / 1024).toFixed(1) + ' KB';
        onAttach({ name: file.name, size, type: 'image', previewUrl: URL.createObjectURL(file) });
      };
      inp.click();
    } else {
      onAttach({ name: item.label + ' Session', size: '', type: 'doc', demo: true });
    }
    onClose();
  };

  return (
    <div ref={menuRef} className="attach-menu">
      <div className="attach-grid">
        {items.map(item => (
          <button key={item.id} className="attach-item" onClick={() => handleClick(item)}>
            <div className="attach-item-icon" style={{ background: item.color + '18', color: item.color }}>
              {item.icon}
            </div>
            <span className="attach-item-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


/* ─── CHAT PANEL ─────────────────────────────────────────── */
const ChatPanel = ({
  conv, messages, currentUser, allUsers,
  onSend, onReact, onDelete, onEdit, onVote,
  onThreadOpen, onCallStart, onViewProfile, onViewMembers,
  typingUsers, density, blockedUsers,
  isMobile, onBack, onMarkUnread: onMarkUnreadProp,
}) => {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showEmojiKb, setShowEmojiKb] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [editingMsg, setEditingMsg] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [simulatedTyping, setSimulatedTyping] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIdx, setSearchIdx] = useState(0);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [activeFormats, setActiveFormats] = useState({});
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [pinnedMsgId, setPinnedMsgId] = useState(null);
  const savedSelectionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioChunksRef = useRef([]);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const isMobileScreen = useIsMobile();

  // In DMs, userId is the "other" person. If logged-in user IS that person, swap to show CURRENT_USER as the other side.
  const dmOtherUserId = conv.type === 'dm' ? (conv.userId === currentUser.id ? CURRENT_USER.id : conv.userId) : null;
  const otherUser = dmOtherUserId ? getUserById(dmOtherUserId) : null;
  const convName = getConvName(conv);
  const isBlocked = conv.type === 'dm' && otherUser && blockedUsers?.has(otherUser.id);

  /* Mention filtering */
  const filteredMentionUsers = useMemo(() => {
    if (!showMentions) return [];
    const q = mentionQuery.toLowerCase();
    return (allUsers || []).filter(u =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
    );
  }, [showMentions, mentionQuery, allUsers, currentUser.id]);

  const handleInputChange = (e) => {
    const html = e.target.innerHTML || '';
    const plainText = e.target.innerText?.trim() || '';

    // Clear residual <br> / empty divs so :empty placeholder shows
    if (!plainText) {
      e.target.innerHTML = '';
      setInput('');
      setActiveFormats({});
    } else {
      setInput(html);
      updateActiveFormats();
    }

    // Detect @mention from plain text
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE) {
        const textBefore = textNode.textContent.slice(0, range.startOffset);
        const atMatch = textBefore.match(/@(\w*)$/);
        if (atMatch) {
          setShowMentions(true);
          setMentionQuery(atMatch[1]);
          return;
        }
      }
    }
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleMentionSelect = (user) => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent;
      const offset = range.startOffset;
      const atIdx = text.lastIndexOf('@', offset - 1);
      if (atIdx >= 0) {
        textNode.textContent = text.slice(0, atIdx) + `@${user.username} ` + text.slice(offset);
        const newPos = atIdx + user.username.length + 2;
        range.setStart(textNode, newPos);
        range.setEnd(textNode, newPos);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setInput(el.innerHTML);
    setShowMentions(false);
    setMentionQuery('');
  };

  /* Voice recording */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch {
      console.warn('Microphone access denied');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      clearInterval(recordingTimerRef.current);
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setIsPaused(false);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setIsPaused(false);
    setAudioBlob(null);
    setShowVoiceRecorder(false);
    audioChunksRef.current = [];
  };

  const sendVoiceNote = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const size = audioBlob.size < 1024
      ? audioBlob.size + ' B'
      : audioBlob.size < 1048576
        ? (audioBlob.size / 1024).toFixed(1) + ' KB'
        : (audioBlob.size / 1048576).toFixed(1) + ' MB';
    const duration = recordingTime;
    onSend(conv.id, '', { name: `Voice note (${fmtRecTime(recordingTime)})`, size, type: 'audio', previewUrl: url, duration });
    setAudioBlob(null);
    setRecordingTime(0);
    setShowVoiceRecorder(false);
  };

  const fmtRecTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  /* Detect active formatting at cursor position */
  const updateActiveFormats = () => {
    const text = inputRef.current?.innerText?.trim() || '';
    if (!text) {
      setActiveFormats({});
      return;
    }
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strike: document.queryCommandState('strikeThrough'),
      ol: document.queryCommandState('insertOrderedList'),
      ul: document.queryCommandState('insertUnorderedList'),
    });
  };

  /* Save current selection (for link modal) */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  /* Rich text formatting — uses execCommand on contentEditable */
  const applyFormat = (tag) => {
    if (tag === 'link') {
      saveSelection();
      const sel = window.getSelection();
      setLinkText(sel.toString() || '');
      setLinkUrl('https://');
      setShowLinkModal(true);
      return;
    }
    inputRef.current?.focus();
    switch (tag) {
      case 'bold': document.execCommand('bold'); break;
      case 'italic': document.execCommand('italic'); break;
      case 'underline': document.execCommand('underline'); break;
      case 'strike': document.execCommand('strikeThrough'); break;
      case 'ol': document.execCommand('insertOrderedList'); break;
      case 'ul': document.execCommand('insertUnorderedList'); break;
      case 'quote': document.execCommand('formatBlock', false, 'blockquote'); break;
      case 'code': {
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const range = sel.getRangeAt(0);
          const code = document.createElement('code');
          range.surroundContents(code);
        }
        break;
      }
      case 'codeblock': {
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const range = sel.getRangeAt(0);
          const pre = document.createElement('pre');
          const code = document.createElement('code');
          code.appendChild(range.extractContents());
          pre.appendChild(code);
          range.insertNode(pre);
        }
        break;
      }
      default: break;
    }
    if (inputRef.current) setInput(inputRef.current.innerHTML);
    updateActiveFormats();
  };

  const handleInsertLink = () => {
    restoreSelection();
    inputRef.current?.focus();
    if (linkText && linkUrl) {
      const sel = window.getSelection();
      if (sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const a = document.createElement('a');
        a.href = linkUrl;
        a.textContent = linkText;
        a.target = '_blank';
        range.insertNode(a);
        range.setStartAfter(a);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    if (inputRef.current) setInput(inputRef.current.innerHTML);
    setShowLinkModal(false);
    setLinkText('');
    setLinkUrl('');
    savedSelectionRef.current = null;
  };

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (!searchOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, conv.id, searchOpen]);

  /* Reset state when conversation changes */
  useEffect(() => {
    setInput('');
    setAttachedFile(null);
    setEditingMsg(null);
    setReplyTo(null);
    setShowEmojiKb(false);
    setShowAttachMenu(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchIdx(0);
    if (inputRef.current) { inputRef.current.innerHTML = ''; inputRef.current.focus(); }
    setActiveFormats({});
    setPinnedMsgId(null);
    // Clean up any active voice recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        }
      } catch {}
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setIsPaused(false);
    setShowVoiceRecorder(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
  }, [conv.id]);

  /* Focus search input when opened */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  /* Edit request from MessageBubble */
  const handleEditRequest = (msg) => {
    setEditingMsg(msg);
    setInput(msg.text || '');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.innerHTML = msg.text || '';
        inputRef.current.focus();
      }
    }, 50);
  };

  const cancelEdit = () => {
    setEditingMsg(null);
    setInput('');
    if (inputRef.current) inputRef.current.innerHTML = '';
    setActiveFormats({});
  };

  /* Search matching */
  const matchedMsgIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messages
      .filter(m => !m.deleted && m.text && m.text.toLowerCase().includes(q))
      .map(m => m.id);
  }, [messages, searchQuery]);

  const currentMatchId = matchedMsgIds[searchIdx] || null;

  /* Scroll to current search match */
  useEffect(() => {
    if (!currentMatchId || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-msg-id="${currentMatchId}"]`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, [currentMatchId]);

  /* Send / save edit */
  const handleSend = () => {
    const html = inputRef.current?.innerHTML || '';
    const plainText = inputRef.current?.innerText?.trim() || '';
    if (editingMsg) {
      if (plainText && html !== editingMsg.text) onEdit(editingMsg.id, html);
      cancelEdit();
      return;
    }
    if (!plainText && !attachedFile) return;
    onSend(conv.id, html, attachedFile, null, replyTo);
    setInput('');
    if (inputRef.current) inputRef.current.innerHTML = '';
    setActiveFormats({});
    setAttachedFile(null);
    setReplyTo(null);
    if (conv.type === 'dm') {
      setSimulatedTyping(true);
      setTimeout(() => setSimulatedTyping(false), 2200);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape' && editingMsg) { cancelEdit(); }
    setTimeout(() => {
      if (inputRef.current) setInput(inputRef.current.innerHTML);
      updateActiveFormats();
    }, 0);
  };

  const handlePollSend = (pollData) => {
    onSend(conv.id, '', null, pollData);
  };

  /* Group messages by date */
  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDate = null;
    messages.forEach((msg, i) => {
      const d = new Date(msg.ts);
      const dateStr = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
      if (dateStr !== lastDate) {
        groups.push({ type: 'date', label: dateStr });
        lastDate = dateStr;
      }
      groups.push({ type: 'msg', msg, prev: messages[i - 1] || null });
    });
    return groups;
  }, [messages]);

  const typingList = simulatedTyping && otherUser ? [otherUser.name] : [];

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          {isMobile && onBack && (
            <button className="header-btn mobile-back-btn" onClick={onBack} title="Back" aria-label="Back to conversations">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          {conv.type === 'dm' && otherUser ? (
            <button className="header-identity" onClick={() => onViewProfile(otherUser)}>
              <div className="avatar-wrap">
                <Avatar user={otherUser} size={36} />
                <StatusDot status={otherUser.status} />
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div className="header-name">{otherUser.name}</div>
                </div>
                <div className="header-sub">
                  {otherUser.role} ·{' '}
                  {otherUser.status === 'online' ? 'Active now' : 'Offline'}
                </div>
              </div>
            </button>
          ) : (
            <button className="header-identity" onClick={() => onViewMembers(conv)}>
              <div className="group-avatar-sm" style={{ background: conv.color + '22', color: conv.color }}>
                {conv.initials}
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div className="header-name">{convName}</div>
                </div>
                <div className="header-sub">{conv.memberIds?.length} members · {conv.groupType}</div>
              </div>
            </button>
          )}
        </div>
        <div className="chat-header-right">
          {conv.type === 'dm' && (
            <>
              <button className="header-btn" onClick={() => onCallStart('audio', otherUser)} title="Voice call">
                <PhoneIcon size={16} />
              </button>
              <button className="header-btn" onClick={() => onCallStart('video', otherUser)} title="Video call">
                <VideoIcon size={16} />
              </button>
            </>
          )}
          <button
            className={`header-btn${searchOpen ? ' active' : ''}`}
            onClick={() => setSearchOpen(v => !v)}
            title="Search"
          >
            <SearchIcon size={15} />
          </button>
        </div>
      </div>


      {/* Search bar */}
      {searchOpen && (
        <div className="chat-search-bar">
          <SearchIcon size={14} />
          <input
            ref={searchRef}
            className="chat-search-input"
            placeholder="Search messages…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchIdx(0); }}
            onKeyDown={e => {
              if (e.key === 'Enter') setSearchIdx(i => (i < matchedMsgIds.length - 1 ? i + 1 : 0));
              if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setSearchIdx(0); }
            }}
          />
          {searchQuery && (
            <span className="search-count">
              {matchedMsgIds.length === 0 ? 'No results' : `${searchIdx + 1} / ${matchedMsgIds.length}`}
            </span>
          )}
          <button
            className="search-nav-btn"
            onClick={() => setSearchIdx(i => (i > 0 ? i - 1 : matchedMsgIds.length - 1))}
            disabled={matchedMsgIds.length === 0}
            title="Previous"
          >
            <ChevronUpIcon size={13} />
          </button>
          <button
            className="search-nav-btn"
            onClick={() => setSearchIdx(i => (i < matchedMsgIds.length - 1 ? i + 1 : 0))}
            disabled={matchedMsgIds.length === 0}
            title="Next"
          >
            <ChevronDownIcon size={13} />
          </button>
          <button
            className="search-close-btn"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchIdx(0); }}
          >
            <CloseIcon size={14} />
          </button>
        </div>
      )}

      {/* Pinned message banner */}
      {pinnedMsgId && (() => {
        const pinnedMsg = messages.find(m => m.id === pinnedMsgId);
        if (!pinnedMsg) return null;
        const pinnedSender = getUserById(pinnedMsg.senderId);
        return (
          <div className="pinned-banner" onClick={() => {
            const el = listRef.current?.querySelector(`[data-msg-id="${pinnedMsgId}"]`);
            if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }}>
            <PinIcon size={13} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>Pinned by {pinnedSender?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                dangerouslySetInnerHTML={{ __html: pinnedMsg.text?.slice(0, 80) || 'Attachment' }} />
            </div>
            <button onClick={(e) => { e.stopPropagation(); setPinnedMsgId(null); }} style={{ padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 4, flexShrink: 0 }}>
              <CloseIcon size={14} />
            </button>
          </div>
        );
      })()}

      {/* Messages */}
      <div className="msg-list" ref={listRef}>
        {groupedMessages.map((item, idx) =>
          item.type === 'date' ? (
            <div key={`d-${idx}`} className="date-divider">
              <div className="date-line" />
              <span className="date-label">{item.label}</span>
              <div className="date-line" />
            </div>
          ) : (
            <div
              key={item.msg.id}
              data-msg-id={item.msg.id}
              className={searchQuery && currentMatchId === item.msg.id ? 'search-highlight-row' : ''}
            >
              <MessageBubble
                msg={item.msg}
                prevMsg={item.prev}
                isOwn={item.msg.senderId === currentUser.id}
                allUsers={allUsers}
                currentUser={currentUser}
                onReact={onReact}
                onDelete={onDelete}
                onEditRequest={handleEditRequest}
                onThreadOpen={onThreadOpen}
                onReply={setReplyTo}
                onVote={onVote}
                density={density}
                onMarkUnread={(msg) => {
                  const idx = messages.findIndex(m => m.id === msg.id);
                  if (idx >= 0) {
                    const unreadCount = messages.length - idx;
                    onMarkUnreadProp?.(conv.id, unreadCount);
                  }
                }}
                onPin={(msg) => {
                  setPinnedMsgId(prev => prev === msg.id ? null : msg.id);
                }}
                pinnedMsgId={pinnedMsgId}
              />
            </div>
          )
        )}

        {typingList.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots"><span /><span /><span /></div>
            <span className="typing-text">{typingList[0]} is typing…</span>
          </div>
        )}
      </div>


      {/* Input area */}
      {isBlocked ? (
        <div className="blocked-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <span>You've blocked <strong>{otherUser.name}</strong>. Unblock them to send messages.</span>
        </div>
      ) : (
      <div className="chat-input-area" style={{ position: 'relative' }}>
        {/* Reply banner */}
        {replyTo && (
          <div className="reply-banner">
            <div className="reply-banner-bar" />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:600,color:'var(--accent)'}}>Replying to {getUserById(replyTo.senderId)?.name}</div>
              <div style={{fontSize:12,color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} dangerouslySetInnerHTML={{__html: replyTo.text?.slice(0,80) || 'Attachment'}} />
            </div>
            <button onClick={() => setReplyTo(null)} style={{padding:4,border:'none',background:'none',cursor:'pointer',color:'var(--text-muted)',borderRadius:4,flexShrink:0}}>
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Edit banner */}
        {editingMsg && (
          <div className="edit-banner">
            <EditIcon size={14} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)' }}>Editing message</div>
              <div style={{
                fontSize: 12, color: 'var(--text-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
              }}>
                {editingMsg.text?.slice(0, 60)}{editingMsg.text?.length > 60 ? '…' : ''}
              </div>
            </div>
            <button
              onClick={cancelEdit}
              style={{
                padding: 4, border: 'none', background: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 4, flexShrink: 0,
              }}
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Attached file preview */}
        {attachedFile && (
          <div className="input-file-preview">
            {attachedFile.previewUrl && attachedFile.type === 'image' ? (
              <img
                src={attachedFile.previewUrl}
                alt=""
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
              />
            ) : attachedFile.previewUrl && attachedFile.type === 'video' ? (
              <video
                src={attachedFile.previewUrl}
                style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                muted
              />
            ) : (
              <div style={{ flexShrink: 0 }}>
                <FileIcon type={attachedFile.type} size={20} color="var(--accent)" />
              </div>
            )}
            <span className="file-preview-name">{attachedFile.name}</span>
            {attachedFile.size && <span className="file-preview-size">{attachedFile.size}</span>}
            <button className="file-preview-remove" onClick={() => setAttachedFile(null)}>
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Formatting toolbar — always visible */}
        <div className="format-toolbar">
          <button className={`fmt-btn${activeFormats.bold ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('bold')} title="Bold (Ctrl+B)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
          </button>
          <button className={`fmt-btn${activeFormats.italic ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('italic')} title="Italic (Ctrl+I)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </button>
          <button className={`fmt-btn${activeFormats.underline ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('underline')} title="Underline (Ctrl+U)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
          </button>
          <button className={`fmt-btn${activeFormats.strike ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('strike')} title="Strikethrough">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.3 4.9c-1.2-.8-2.8-1.4-4.8-1.4-3.2 0-5.2 1.6-5.2 4 0 1.2.5 2.2 1.5 2.9"/><line x1="4" y1="12" x2="20" y2="12"/><path d="M15.6 13.4c.4.6.6 1.4.6 2.1 0 2.8-2.2 4.5-5.6 4.5-2 0-3.8-.6-5-1.6"/></svg>
          </button>
          <div className="fmt-divider" />
          <button className="fmt-btn" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('link')} title="Insert Link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </button>
          <button className={`fmt-btn${activeFormats.ol ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('ol')} title="Ordered List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </button>
          <button className={`fmt-btn${activeFormats.ul ? ' active' : ''}`} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('ul')} title="Unordered List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
          </button>
          <div className="fmt-divider" />
          <button className="fmt-btn" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('quote')} title="Block Quote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button className="fmt-btn" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('code')} title="Inline Code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>
          </button>
          <button className="fmt-btn" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat('codeblock')} title="Code Block">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 8l-3 4 3 4"/><path d="M14 8l3 4-3 4"/></svg>
          </button>
        </div>

        {/* Inline voice recorder (WhatsApp style) */}
        {showVoiceRecorder ? (
          <div className="input-row voice-rec-inline">
            {/* Delete / Cancel */}
            <button className="input-btn" onClick={cancelRecording} title="Cancel" style={{ color: '#ef4444' }}>
              <TrashIcon size={17} />
            </button>

            {/* Recording indicator + timer */}
            {isRecording && !audioBlob && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div className={`voice-rec-dot${!isPaused ? ' active' : ''}`} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{fmtRecTime(recordingTime)}</span>
                <div className="voice-rec-wave-inline">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className={`voice-wave-bar-inline${!isPaused ? ' active' : ''}`} style={{ animationDelay: `${i * 0.06}s`, height: `${Math.random() * 60 + 40}%` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Preview state */}
            {audioBlob && !isRecording && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{fmtRecTime(recordingTime)}</span>
                <audio src={URL.createObjectURL(audioBlob)} controls style={{ flex: 1, height: 32, minWidth: 0 }} />
              </div>
            )}

            {/* Pause/Resume */}
            {isRecording && !audioBlob && (
              <button className="input-btn" onClick={isPaused ? resumeRecording : pauseRecording} title={isPaused ? 'Resume' : 'Pause'}>
                {isPaused ? <MicIcon size={17} /> : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                )}
              </button>
            )}

            {/* Stop (when recording) */}
            {isRecording && !audioBlob && (
              <button className="input-btn" onClick={stopRecording} title="Stop" style={{ color: 'var(--accent)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
              </button>
            )}

            {/* Send (when preview) */}
            {audioBlob && !isRecording && (
              <button className="send-btn active" onClick={sendVoiceNote} title="Send">
                <SendIcon />
              </button>
            )}
          </div>
        ) : (
        <div className="input-row">
          {/* Attach */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              className={`input-btn${showAttachMenu ? ' active' : ''}`}
              onClick={() => { setShowAttachMenu(v => !v); setShowEmojiKb(false); }}
              title="Attach"
            >
              <PlusIcon size={17} />
            </button>
            {showAttachMenu && isMobileScreen && createPortal(
              <div className="bottomsheet-backdrop" onClick={() => setShowAttachMenu(false)} />,
              document.body
            )}
            {showAttachMenu && (
              <AttachMenu
                onAttach={(file) => { setAttachedFile(file); inputRef.current?.focus(); }}
                onClose={() => setShowAttachMenu(false)}
                onPoll={() => { setShowPollModal(true); setShowAttachMenu(false); }}
              />
            )}
          </div>

          {/* Input */}
          <div className="input-wrap" style={{ position: 'relative' }}>
            {/* Mention dropdown */}
            {showMentions && filteredMentionUsers.length > 0 && (
              <div className="mention-dropdown">
                {filteredMentionUsers.map(user => (
                  <button
                    key={user.id}
                    className="mention-item"
                    onClick={() => handleMentionSelect(user)}
                  >
                    <Avatar user={user} size={28} />
                    <div>
                      <div className="mention-item-name">{user.name}</div>
                      <div className="mention-item-role">{user.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div
              ref={inputRef}
              className="chat-input-editable"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              data-placeholder={editingMsg ? 'Edit your message…' : `Message ${conv.type === 'dm' ? otherUser?.name : convName}…`}
            />
          </div>

          {/* Emoji */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              className={`input-btn${showEmojiKb ? ' active' : ''}`}
              onClick={() => { setShowEmojiKb(v => !v); setShowAttachMenu(false); }}
              title="Emoji"
            >
              <EmojiIcon size={17} />
            </button>
            {showEmojiKb && isMobileScreen && createPortal(
              <div className="bottomsheet-backdrop" onClick={() => setShowEmojiKb(false)} />,
              document.body
            )}
            {showEmojiKb && (
              <EmojiKeyboard
                onSelect={(e) => {
                  inputRef.current?.focus();
                  document.execCommand('insertText', false, e);
                  setInput(inputRef.current?.innerHTML || '');
                  setShowEmojiKb(false);
                }}
                onClose={() => setShowEmojiKb(false)}
              />
            )}
          </div>

          {/* Voice note button */}
          {!showVoiceRecorder && (
            <button className="input-btn" onClick={() => { setShowVoiceRecorder(true); startRecording(); }} title="Record voice note">
              <MicIcon size={17} />
            </button>
          )}

          {/* Send */}
          <button
            className={`send-btn${(input && input !== '<br>' && input !== '<div><br></div>' || attachedFile) ? (editingMsg ? ' active save' : ' active') : ''}`}
            onClick={handleSend}
            disabled={!input || (input === '<br>' || input === '<div><br></div>') && !attachedFile}
            title={editingMsg ? 'Save edit' : 'Send'}
          >
            {editingMsg ? <CheckIcon size={15} /> : <SendIcon />}
          </button>
        </div>
        )}
      </div>
      )}

      {/* Poll modal */}
      {showPollModal && (
        <PollModal onClose={() => setShowPollModal(false)} onSend={handlePollSend} />
      )}

      {/* Link modal */}
      {showLinkModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (() => { setShowLinkModal(false); savedSelectionRef.current = null; })()}>
          <div className="modal-card" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div className="modal-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Insert Link
              </div>
              <button className="icon-btn" onClick={() => { setShowLinkModal(false); savedSelectionRef.current = null; }}>
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-field">
                <label className="form-label">Text</label>
                <input className="form-input" placeholder="Link text" value={linkText} onChange={e => setLinkText(e.target.value)} autoFocus />
              </div>
              <div className="form-field">
                <label className="form-label">URL</label>
                <input className="form-input" placeholder="https://example.com" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleInsertLink(); }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => { setShowLinkModal(false); savedSelectionRef.current = null; }}>Cancel</button>
              <button className="btn-primary" onClick={handleInsertLink} disabled={!linkUrl || linkUrl === 'https://'}>Insert Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatPanel };