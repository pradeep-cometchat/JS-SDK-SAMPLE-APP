import { CallOverlay } from '../../components/Overlays';
import { CURRENT_USER, USERS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Calls/Incoming Call',
  component: CallOverlay,
  parameters: { layout: 'fullscreen' },
};

const target = USERS[0];

export const Default = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'audio', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const IncomingAudio = Default;

export const IncomingVideo = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'video', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const AllVariantsShowcase = Default;
