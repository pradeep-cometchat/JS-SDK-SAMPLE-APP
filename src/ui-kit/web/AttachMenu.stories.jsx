import { useState } from 'react';
import { AttachMenu } from '../../components/ChatPanel';
import { Centered, noop } from '../_helpers';

export default {
  title: 'Web/Misc/Attach Menu',
  component: AttachMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Attachment grid that pops above the composer (Camera, Image, Video, Audio, Document, Poll, Whiteboard, Collab Document). Absolutely positioned — opens upward from its anchor.',
      },
    },
  },
};

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
      .attach-menu.stretched .attach-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
      .attach-menu.stretched .attach-item { padding: 16px 8px !important; }
      .attach-menu.stretched .attach-item-icon { width: 56px !important; height: 56px !important; border-radius: 16px !important; }
      .attach-menu.stretched .attach-item-label { font-size: 12px !important; }
    `}</style>
    <div>{children}</div>
  </Centered>
);

const AttachMenuStretched = (props) => (
  <div ref={(el) => {
    if (!el) return;
    const menu = el.querySelector('.attach-menu');
    menu?.classList.add('stretched');
  }}>
    <AttachMenu {...props} />
  </div>
);

const Stage = ({ children, height = 380, width = 340 }) => (
  <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 0 }}>{children}</div>
  </div>
);

export const Default = {
  render: () => (
    <Centered maxWidth={420} padding={24}>
      <Stage height={360} width={320}>
        <AttachMenu onAttach={noop} onClose={noop} onPoll={noop} />
      </Stage>
    </Centered>
  ),
};

export const JustTheMenu = Default;

export const Stretched_ = {
  name: 'Stretched',
  render: () => (
    <Stretched maxWidth={760}>
      <AttachMenuStretched onAttach={noop} onClose={noop} onPoll={noop} />
    </Stretched>
  ),
};

export const WithPickedState = {
  render: () => {
    const [picked, setPicked] = useState(null);
    return (
      <Centered maxWidth={760} padding={24}>
        <Stretched maxWidth={760}>
          <AttachMenuStretched onAttach={setPicked} onClose={noop} onPoll={() => setPicked({ type: 'poll' })} />
        </Stretched>
        <div style={{ marginTop: 16, padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Last chosen:</div>
          <pre style={{ margin: 0, padding: 12, background: 'var(--bg)', borderRadius: 8, fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 220, overflowY: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
            {picked ? JSON.stringify(picked, null, 2) : '–'}
          </pre>
        </div>
      </Centered>
    );
  },
};

export const AllVariantsShowcase = Default;
