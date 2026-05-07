import { NewDMModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Overlays/NewDMModal',
  component: NewDMModal,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => (
    <MobileFrame>
      <NewDMModal allUsers={USERS} currentUser={CURRENT_USER} conversations={CONVERSATIONS} onClose={noop} onSelect={noop} />
    </MobileFrame>
  ),
};
