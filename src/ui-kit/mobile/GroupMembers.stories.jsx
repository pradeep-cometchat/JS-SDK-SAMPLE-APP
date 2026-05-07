import { GroupMembersPanel } from '../../components/Overlays';
import { CURRENT_USER, CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Groups/Group Members',
  component: GroupMembersPanel,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Group members side panel on mobile — takes the whole screen.' } },
  },
};

const eng = CONVERSATIONS.find(c => c.id === 'grp_eng');
const design = CONVERSATIONS.find(c => c.id === 'grp_design');

export const Default = {
  render: () => (
    <MobileFrame>
      <GroupMembersPanel conv={{ ...eng, ownerId: CURRENT_USER.id }} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </MobileFrame>
  ),
};

export const AsOwner = Default;

export const AsMember = {
  render: () => (
    <MobileFrame>
      <GroupMembersPanel conv={design} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </MobileFrame>
  ),
};

export const AllVariantsShowcase = Default;
