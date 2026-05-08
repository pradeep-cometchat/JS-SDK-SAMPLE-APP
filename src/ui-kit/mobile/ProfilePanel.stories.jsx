import { ProfilePanel } from '../../components/Overlays';
import { USERS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Misc/Profile Panel',
  component: ProfilePanel,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Profile panel on mobile. Block confirmation opens as a bottom sheet.' } },
  },
};

export const Default = {
  render: () => <MobileFrame><ProfilePanel user={USERS[0]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} /></MobileFrame>,
};

export const OnlineUser = Default;

export const OfflineUser = {
  render: () => <MobileFrame><ProfilePanel user={USERS[1]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} /></MobileFrame>,
};

export const BlockedUser = {
  render: () => <MobileFrame><ProfilePanel user={USERS[1]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set(['u3'])} /></MobileFrame>,
};

export const AllVariantsShowcase = Default;
