// Shared helpers + mock data for stories
import React from 'react';
import ReactDOM from 'react-dom';
import { CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, THREAD_MESSAGES, CALL_HISTORY } from '../data';

export { CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, THREAD_MESSAGES, CALL_HISTORY };

/**
 * Centers a story inside the viewport with a max-width container.
 * Use this for anything that should appear in the middle of the preview.
 */
export const Centered = ({ children, maxWidth = 960, padding = 24, bg = 'var(--bg)', minHeight = 'auto' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding, background: bg, minHeight, width: '100%', boxSizing: 'border-box' }}>
    <div style={{ width: '100%', maxWidth, fontFamily: 'var(--font)', color: 'var(--text)' }}>
      {children}
    </div>
  </div>
);

/**
 * A light surface card centered in the preview — good for sub-components
 * that don't own their own background (like MessageBubble).
 */
export const CenteredSurface = ({ children, maxWidth = 720, padding = 24 }) => (
  <Centered maxWidth={maxWidth} padding={padding} bg="var(--bg)">
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
      {children}
    </div>
  </Centered>
);

/**
 * Desktop sidebar frame. The sidebar uses a dark background, so it is always
 * wrapped in the `.sidebar` element so child text (white-on-dark) is legible.
 * We don't force a width — the component's own CSS (`width: 264px`) is used
 * so rows have no extra empty space on the right.
 */
export const DesktopSidebarFrame = ({ children, height = 720 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 24, background: 'var(--bg)', width: '100%', boxSizing: 'border-box' }}>
    <div className="sidebar" style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

/**
 * When a standalone row from the sidebar (ConvItem, CallHistoryList) needs to be
 * shown outside of a full Sidebar, wrap it in this dark container so colours match the real app.
 */
export const DesktopSidebarSlice = ({ children, padding = 8 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 24, background: 'var(--bg)', width: '100%', boxSizing: 'border-box' }}>
    <div className="sidebar" style={{ padding, borderRadius: 12, display: 'block' }}>
      {children}
    </div>
  </div>
);

/**
 * Desktop chat frame — white surface, centered.
 */
export const DesktopChatFrame = ({ children, width = 1040, height = 720 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <div style={{ width: '100%', height, display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {children}
    </div>
  </Centered>
);

/**
 * Desktop app shell — includes sidebar + chat side by side.
 */
export const DesktopAppShell = ({ sidebar, main, rightPanel, height = 720, width = 1160 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <div className="app-shell" style={{ width: '100%', height, display: 'flex', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {sidebar}
      <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>{main}</div>
      {rightPanel}
    </div>
  </Centered>
);

/**
 * Mobile frame — renders the child inside a 390×844 iPhone-like iframe
 * that is centered in the preview. Because the iframe is actually 390px wide,
 * the `@media (max-width: 768px)` CSS rules activate inside it.
 */
export const MobileFrame = ({ children, width = 390, height = 740, label = null }) => {
  // Use srcDoc iframe so media queries activate properly inside a narrow viewport.
  const [ref, setRef] = React.useState(null);
  const [body, setBody] = React.useState(null);
  React.useEffect(() => {
    if (!ref) return;
    const doc = ref.contentDocument;
    if (!doc) return;
    // Copy existing <style> and <link> tags from parent (so app.css + fonts apply)
    doc.open();
    const parentHead = Array.from(document.head.querySelectorAll('style,link[rel="stylesheet"]'))
      .map((el) => el.outerHTML).join('\n');
    doc.write(`<!doctype html><html data-theme="${document.documentElement.dataset.theme || 'light'}"><head>${parentHead}<style>
      /* Reset the Storybook preview-head.html override — inside the mobile iframe
         we want the body to actually be 100% tall so child height:100% works. */
      html, body { height: 100% !important; min-height: 100% !important; overflow: hidden !important; }
      html, body { margin: 0; padding: 0; background: var(--bg); font-family: var(--font); color: var(--text); }
      #_mount { height: 100%; width: 100%; display: flex; }
    </style></head><body><div id="_mount"></div></body></html>`);
    doc.close();
    setBody(doc.getElementById('_mount'));
  }, [ref]);
  return (
    <Centered maxWidth={width + 160} padding={24}>
      {label && <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>{label}</div>}
      <iframe
        ref={setRef}
        title="mobile-preview"
        style={{
          width,
          height,
          border: '10px solid #1f2937',
          borderRadius: 32,
          background: 'var(--bg)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          display: 'block',
          margin: '0 auto',
          boxSizing: 'content-box',
        }}
      />
      {body && ReactDOM.createPortal(
        <div className="app-shell mobile" style={{ height: '100%', width: '100%', flex: 1 }}>
          {children}
        </div>,
        body,
      )}
    </Centered>
  );
};

/**
 * A mobile-sized dark sidebar wrapper (for ConvItem / CallHistoryList on mobile).
 */
export const MobileSidebarFrame = ({ children }) => (
  <MobileFrame>
    <div className="sidebar" style={{ width: '100%', minWidth: '100%', height: '100%', border: 'none', borderRadius: 0 }}>
      {children}
    </div>
  </MobileFrame>
);

// Shell with sidebar dimensions for sidebar-like components (backward-compat alias)
export const SidebarFrame = DesktopSidebarFrame;
export const ChatFrame = DesktopChatFrame;
export const Frame = Centered;

// No-op action handler
export const noop = () => {};

// Sample message factory
export const makeMsg = (o = {}) => ({
  id: 'msg_' + Math.random().toString(36).slice(2, 7),
  senderId: 'u2',
  text: 'Hello',
  ts: Date.now() - 5 * 60000,
  reactions: [],
  readBy: [],
  threadCount: 0,
  edited: false,
  deleted: false,
  ...o,
});
