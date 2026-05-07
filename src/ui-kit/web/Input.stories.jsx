import { useState } from 'react';
import { Centered } from '../_helpers';
import { SearchIcon, CloseIcon, PlusIcon } from '../../components/Icons';

export default {
  title: 'Web/Primitives/Input',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every text input variant in the CometChat sample app. Each comes from `app.css` as a utility class you apply to a native `<input>`, `<textarea>`, or `contentEditable` div.',
      },
    },
  },
};

const Card = ({ title, children, maxWidth = 680, desc }) => (
  <Centered maxWidth={maxWidth} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 18px', color: 'var(--text-muted)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 18 }} />}
      {children}
    </div>
  </Centered>
);

const DarkCard = ({ title, children, desc }) => (
  <Centered maxWidth={680} padding={24}>
    <div style={{ background: 'var(--sb-bg)', padding: 24, borderRadius: 12, border: '1px solid var(--sb-border)' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 18px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 18 }} />}
      {children}
    </div>
  </Centered>
);

/* ─── Form input ───────────────────────────────────────── */
export const FormInput = {
  render: () => {
    const [name, setName] = useState('');
    return (
      <Card title="form-input" desc="Standard labeled input. Used in modals (Create Group, Poll, Link Insert).">
        <div className="form-field">
          <label className="form-label">Group name</label>
          <input
            className="form-input"
            placeholder="Enter group name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      </Card>
    );
  },
};

export const FormInputStates = {
  render: () => (
    <Card title="form-input — states" desc="Empty, filled, and focused (click to focus).">
      <div className="form-field" style={{ marginBottom: 16 }}>
        <label className="form-label">Empty</label>
        <input className="form-input" placeholder="Placeholder text" />
      </div>
      <div className="form-field" style={{ marginBottom: 16 }}>
        <label className="form-label">Filled</label>
        <input className="form-input" defaultValue="Engineering team" />
      </div>
      <div className="form-field">
        <label className="form-label">Disabled</label>
        <input className="form-input" defaultValue="Cannot edit" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
      </div>
    </Card>
  ),
};

export const FormTextarea = {
  render: () => (
    <Card title="form-input (textarea)" desc="Same `.form-input` class on a textarea — used for group description, poll question, etc.">
      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          placeholder="What is this group about?"
          rows={4}
          style={{ resize: 'vertical' }}
        />
      </div>
    </Card>
  ),
};

/* ─── Login input ──────────────────────────────────────── */
export const LoginInput = {
  render: () => (
    <Card title="login-input" desc="Input used on the Sign-In and App Credentials screens — slightly larger padding.">
      <div className="login-field">
        <label className="login-field-label">Enter Your UID</label>
        <input className="login-input" placeholder="Enter UID or username" />
      </div>
    </Card>
  ),
};

/* ─── Sidebar search (dark) ────────────────────────────── */
export const SidebarSearch = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <DarkCard title="sb-search / sb-search-input" desc="Dark-themed search pill inside the sidebar.">
        <div className="sb-search">
          <SearchIcon size={14} />
          <input
            className="sb-search-input"
            placeholder="Search…"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          {value && (
            <button className="sb-clear-btn" onClick={() => setValue('')}>
              <CloseIcon size={13} />
            </button>
          )}
        </div>
      </DarkCard>
    );
  },
};

/* ─── Chat header search bar ───────────────────────────── */
export const ChatSearchBar = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Card title="chat-search-bar / chat-search-input" desc="Search-in-conversation bar that slides below the chat header.">
        <div className="chat-search-bar" style={{ borderRadius: 10, border: '1px solid var(--border)' }}>
          <SearchIcon size={14} />
          <input
            className="chat-search-input"
            placeholder="Search messages…"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <span className="search-count">0 of 0</span>
          {value && (
            <button className="icon-btn" onClick={() => setValue('')}>
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </Card>
    );
  },
};

/* ─── Chat textarea (plain) ────────────────────────────── */
export const ChatTextarea = {
  render: () => (
    <Card title="chat-textarea" desc="Plain textarea variant — used in the thread reply composer.">
      <div className="input-row" style={{ padding: 8 }}>
        <textarea
          className="chat-textarea"
          placeholder="Reply in thread…"
          rows={2}
        />
      </div>
    </Card>
  ),
};

/* ─── Rich text (contentEditable) ──────────────────────── */
export const RichTextEditor = {
  render: () => (
    <Card title="chat-input-editable" desc="Rich-text contentEditable used by the main composer. Supports bold, italic, underline, strike, lists, code, and links.">
      <div className="input-row" style={{ padding: 12 }}>
        <div
          className="chat-input-editable"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Type a message…"
          dangerouslySetInnerHTML={{
            __html: '<b>Bold</b> / <i>italic</i> / <u>underline</u> / <a href="#">a link</a>, plus <code>inline code</code>.',
          }}
          style={{ minHeight: 48 }}
        />
      </div>
    </Card>
  ),
  parameters: { docs: { description: { story: 'Focus the field and type to test — HTML formatting persists from the initial seed.' } } },
};

/* ─── Emoji keyboard search ────────────────────────────── */
export const EmojiKeyboardSearch = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Card title="ek-search-row / ek-search-input" desc="The search row at the top of the emoji picker.">
        <div className="ek-search-row" style={{ border: '1px solid var(--border)', borderRadius: 10 }}>
          <SearchIcon size={14} />
          <input
            className="ek-search-input"
            placeholder="Search emoji…"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          {value && (
            <button className="ek-clear" onClick={() => setValue('')}>
              <CloseIcon size={13} />
            </button>
          )}
        </div>
      </Card>
    );
  },
};

/* ─── Error state ──────────────────────────────────────── */
export const ErrorState = {
  render: () => (
    <Card title="login-error" desc="Inline error message shown above an input.">
      <div className="login-error">User not found. Try a username like user-comet-chat-1</div>
      <div style={{ height: 8 }} />
      <input className="login-input" defaultValue="invalid.user" />
    </Card>
  ),
};

/* ─── Gallery ──────────────────────────────────────────── */
export const AllInputsGallery = {
  render: () => (
    <Centered maxWidth={760} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div className="form-label" style={{ marginBottom: 6 }}>form-input</div>
          <input className="form-input" placeholder="Placeholder" />
        </div>
        <div>
          <div className="login-field-label">login-input</div>
          <input className="login-input" placeholder="Enter UID" />
        </div>
        <div>
          <div className="form-label" style={{ marginBottom: 6 }}>chat-search-bar</div>
          <div className="chat-search-bar" style={{ borderRadius: 10, border: '1px solid var(--border)' }}>
            <SearchIcon size={14} />
            <input className="chat-search-input" placeholder="Search messages…" />
          </div>
        </div>
        <div>
          <div className="form-label" style={{ marginBottom: 6 }}>chat-textarea (in input-row)</div>
          <div className="input-row" style={{ padding: 8 }}>
            <textarea className="chat-textarea" placeholder="Reply in thread…" rows={2} />
          </div>
        </div>
        <div>
          <div className="form-label" style={{ marginBottom: 6 }}>chat-input-editable</div>
          <div className="input-row" style={{ padding: 12 }}>
            <div
              className="chat-input-editable"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Type a message…"
              style={{ minHeight: 32 }}
            />
          </div>
        </div>
        <div style={{ background: 'var(--sb-bg)', padding: 20, borderRadius: 10 }}>
          <div className="form-label" style={{ marginBottom: 6, color: 'rgba(255,255,255,0.55)' }}>sb-search (dark)</div>
          <div className="sb-search" style={{ margin: 0 }}>
            <SearchIcon size={14} />
            <input className="sb-search-input" placeholder="Search…" />
          </div>
        </div>
      </div>
    </Centered>
  ),
};
