import { GroupMembersPanel } from '../../components/Overlays';
import { CURRENT_USER, CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Overlays/GroupMembersPanel',
  component: GroupMembersPanel,
  parameters: { layout: 'fullscreen' },
};

const eng = CONVERSATIONS.find(c => c.id === 'grp_eng');
const design = CONVERSATIONS.find(c => c.id === 'grp_design');

export const AsOwner = {
  render: () => (
    <MobileFrame>
      <GroupMembersPanel conv={{ ...eng, ownerId: CURRENT_USER.id }} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </MobileFrame>
  ),
};

export const AsMember = {
  render: () => (
    <MobileFrame>
      <GroupMembersPanel conv={design} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </MobileFrame>
  ),
};
