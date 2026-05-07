import { useState } from 'react';
import { AttachMenu } from '../../components/ChatPanel';
import { Centered, noop } from '../_helpers';

export default {
  title: 'Web/Chat Panel/AttachMenu',
  component: AttachMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Attachment grid that pops above the composer — Camera, Image, Video, Audio, Document, Poll, Whiteboard, Collab Document. The real component is positioned absolutely and opens upward from its anchor. In these stories we stretch it across the full width of a centered container so it is easy to inspect.',
      },
    },
  },
};

/**
 * Stretch the attach menu to fill the container width. The component uses
 * `width: 300px` inline — we override that (and its `position: absolute`) via a
 * scoped style so it becomes a full-width card in the story canvas.
 */
const Stretched = ({ children, maxWidth = 720 }) => (
  <Centered maxWidth={maxWidth} padding={32}>
    <style>{`
      .attach-menu.stretched {
        position: static !important;
        width: 100% !important;
        max-width: none !important;
        transform-origin: top center;
        animation: none;
        box-shadow: var(--shadow-md);
      }
      .attach-menu.stretched .attach-grid {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 8px !important;
      }
      .attach-menu.stretched .attach-item {
        padding: 16px 8px !important;
      }
      .attach-menu.stretched .attach-item-icon {
        width: 56px !important;
        height: 56px !important;
        border-radius: 16px !important;
      }
      .attach-menu.stretched .attach-item-label {
        font-size: 12px !important;
      }
    `}</style>
    <div className="attach-menu-host" style={{ position: 'relative' }}>
      <div className="attach-menu-wrapper">
        {children}
      </div>
    </div>
  </Centered>
);

/**
 * The underlying component hard-codes `className="attach-menu"`. We wrap it
 * in a div and tag that wrapper so our overrides apply without editing the
 * source component.
 */
const AttachMenuStretched = (props) => (
  <div
    ref={(el) => {
      // Add `stretched` to the rendered attach-menu so our overrides kick in.
      if (!el) return;
      const menu = el.querySelector('.attach-menu');
      menu?.classList.add('stretched');
    }}
  >
    <AttachMenu {...props} />
  </div>
);

export const Default = {
  render: () => {
    const [picked, setPicked] = useState(null);
    return (
      <Stretched maxWidth={760}>
        <AttachMenuStretched
          onAttach={setPicked}
          onClose={noop}
          onPoll={() => setPicked({ type: 'poll' })}
        />
        <div
          style={{
            marginTop: 16,
            padding: 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontSize: 12,
            minWidth: 0,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Last chosen:</div>
          <pre
            style={{
              margin: 0,
              padding: 12,
              background: 'var(--bg)',
              borderRadius: 8,
              fontSize: 11,
              lineHeight: 1.5,
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              overflowWrap: 'anywhere',
              maxHeight: 220,
              overflowY: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {picked ? JSON.stringify(picked, null, 2) : '–'}
          </pre>
        </div>
      </Stretched>
    );
  },
  parameters: { docs: { description: { story: 'Attach menu stretched to the full container width. Click any tile to fire the corresponding callback — the last chosen value is echoed below.' } } },
};

export const Wide = {
  render: () => (
    <Stretched maxWidth={1000}>
      <AttachMenuStretched onAttach={noop} onClose={noop} onPoll={noop} />
    </Stretched>
  ),
  parameters: { docs: { description: { story: 'Even wider container — the 4-column grid scales the tile size up rather than growing columns, matching the app where the menu is a fixed card.' } } },
};

/* ── Original popover shape (for reference) ────────────────── */
export const PopoverShape = {
  render: () => (
    <Centered maxWidth={420} padding={32}>
      <div style={{ position: 'relative', height: 360 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 0 }}>
          <AttachMenu onAttach={noop} onClose={noop} onPoll={noop} />
        </div>
      </div>
    </Centered>
  ),
  parameters: { docs: { description: { story: 'The component at its native size — the same 300px-wide popover that opens above the composer in the real app.' } } },
};
