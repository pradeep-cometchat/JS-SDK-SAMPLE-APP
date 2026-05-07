import { useState } from 'react';
import { GroupMembersPanel } from '../../components/Overlays';
import { CURRENT_USER, CONVERSATIONS, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Overlays/GroupMembersPanel',
  component: GroupMembersPanel,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Side panel listing group members. Tap to open a profile; add members; leave; owner can delete the group.' } },
  },
};

const Frame = ({ children }) => (
  <Centered maxWidth={480} padding={24}>
    <div style={{ width: 420, height: 720, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>{children}</div>
  </Centered>
);

const eng = CONVERSATIONS.find(c => c.id === 'grp_eng');
const design = CONVERSATIONS.find(c => c.id === 'grp_design');

export const AsOwner = {
  render: () => <Frame><GroupMembersPanel conv={{ ...eng, ownerId: CURRENT_USER.id }} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} /></Frame>,
};

export const AsMember = {
  render: () => <Frame><GroupMembersPanel conv={design} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} /></Frame>,
};

export const Interactive = {
  render: () => {
    const [conv, setConv] = useState({ ...eng, ownerId: CURRENT_USER.id });
    const [deleted, setDeleted] = useState(false);
    if (deleted) return <Frame><div style={{ padding: 20, color: 'var(--text-muted)' }}>Group deleted.</div></Frame>;
    return (
      <Frame>
        <GroupMembersPanel
          conv={conv}
          currentUser={CURRENT_USER}
          onClose={noop}
          onViewProfile={(u) => alert(`Open profile: ${u.name}`)}
          onLeave={() => alert('Left the group')}
          onDelete={() => setDeleted(true)}
          onAddMember={(_id, userId) => setConv(prev => ({ ...prev, memberIds: [...prev.memberIds, userId] }))}
        />
      </Frame>
    );
  },
};
