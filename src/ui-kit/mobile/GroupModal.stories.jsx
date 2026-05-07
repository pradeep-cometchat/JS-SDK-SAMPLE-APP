import { GroupModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Overlays/GroupModal',
  component: GroupModal,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => (
    <MobileFrame>
      <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={noop} onCreate={noop} />
    </MobileFrame>
  ),
};
