import { CallOverlay } from '../../components/Overlays';
import { CURRENT_USER, USERS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Calls/Outgoing Call',
  component: CallOverlay,
  parameters: { layout: 'fullscreen' },
};

const target = USERS[0];

export const Default = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'video', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const OutgoingVideo = Default;

export const OutgoingAudio = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'audio', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const AllVariantsShowcase = Default;
