import { useState } from 'react';
import { ProfilePanel } from '../../components/Overlays';
import { USERS, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Overlays/ProfilePanel',
  component: ProfilePanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: 'Side panel showing a user profile, About section, Call/Video actions, and Block/Unblock.' },
    },
  },
};

const Frame = ({ children }) => (
  <Centered maxWidth={480} padding={24}>
    <div style={{ width: 420, height: 720, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>{children}</div>
  </Centered>
);

export const OnlineUser = {
  render: () => <Frame><ProfilePanel user={USERS[0]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} /></Frame>,
};

export const OfflineUser = {
  render: () => <Frame><ProfilePanel user={USERS[1]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} /></Frame>,
};

export const BlockedUser = {
  render: () => <Frame><ProfilePanel user={USERS[1]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set(['u3'])} /></Frame>,
};

export const Interactive = {
  render: () => {
    const [blocked, setBlocked] = useState(new Set());
    return (
      <Frame>
        <ProfilePanel
          user={USERS[0]}
          onClose={noop}
          onCall={(type, user) => alert(`Starting ${type} call with ${user.name}`)}
          onBlock={(id) => setBlocked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          })}
          blockedUsers={blocked}
        />
      </Frame>
    );
  },
};
