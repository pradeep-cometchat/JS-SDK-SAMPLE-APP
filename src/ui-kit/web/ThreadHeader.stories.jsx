import { ThreadPanel } from '../../components/Overlays';
import { CURRENT_USER, INITIAL_MESSAGES, THREAD_MESSAGES, noop } from '../_helpers';

export default {
  title: 'Web/Messages/Thread Header',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Header + parent-message block at the top of the thread panel. Shows the title "Thread", a close button, and the parent message. The list below and composer are hidden in these stories so you can focus on the header.',
      },
    },
  },
};

const HeaderStage = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 24, background: 'var(--bg)', width: '100%', boxSizing: 'border-box' }}>
    <style>{`
      .th-stage .thread-body > .thread-divider,
      .th-stage .thread-body > .thread-reply,
      .th-stage .thread-input { display: none !important; }
    `}</style>
    <div className="th-stage" style={{ height: 260, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
      {children}
    </div>
  </div>
);

const parent = INITIAL_MESSAGES.dm_u2[1];

export const Default = {
  render: () => (
    <HeaderStage>
      <ThreadPanel parentMsg={parent} replies={THREAD_MESSAGES.m2} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </HeaderStage>
  ),
};

export const ZeroReplies = {
  render: () => (
    <HeaderStage>
      <ThreadPanel parentMsg={parent} replies={[]} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </HeaderStage>
  ),
};

export const AllVariantsShowcase = Default;
