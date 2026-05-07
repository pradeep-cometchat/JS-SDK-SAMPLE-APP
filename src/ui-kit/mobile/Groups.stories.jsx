import { GroupModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Groups/Groups',
  component: GroupModal,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Create-group modal on mobile.' } },
  },
};

export const Default = {
  render: () => (
    <MobileFrame>
      <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={noop} onCreate={noop} />
    </MobileFrame>
  ),
};

export const AllVariantsShowcase = Default;
