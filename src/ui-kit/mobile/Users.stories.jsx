import { NewDMModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Users/Users',
  component: NewDMModal,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'User list modal on mobile for starting a new direct message.' } },
  },
};

export const Default = {
  render: () => (
    <MobileFrame>
      <NewDMModal allUsers={USERS} currentUser={CURRENT_USER} conversations={CONVERSATIONS} onClose={noop} onSelect={noop} />
    </MobileFrame>
  ),
};

export const AllVariantsShowcase = Default;
