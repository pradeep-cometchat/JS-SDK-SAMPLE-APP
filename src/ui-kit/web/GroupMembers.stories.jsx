import { useState } from 'react';
import { GroupMembersPanel } from '../../components/Overlays';
import { CURRENT_USER, CONVERSATIONS, noop } from '../_helpers';

export default {
  title: 'Web/Groups/Group Members',
  component: GroupMembersPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Side panel listing all members of a group. Includes a header with the group badge + type, search, add-member row, and footer actions (leave / delete).',
      },
    },
  },
};

const Frame = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 24, background: 'var(--bg)', width: '100%', boxSizing: 'border-box' }}>
    <div style={{ height: 720, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
      {children}
    </div>
  </div>
);

const eng = CONVERSATIONS.find(c => c.id === 'grp_eng');
const design = CONVERSATIONS.find(c => c.id === 'grp_design');

export const Default = {
  render: () => (
    <Frame>
      <GroupMembersPanel conv={{ ...eng, ownerId: CURRENT_USER.id }} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </Frame>
  ),
};

export const AsOwner = Default;

export const AsMember = {
  render: () => (
    <Frame>
      <GroupMembersPanel conv={design} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </Frame>
  ),
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

export const AllVariantsShowcase = Default;
