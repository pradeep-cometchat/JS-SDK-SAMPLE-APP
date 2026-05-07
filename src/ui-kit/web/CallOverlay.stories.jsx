import { CallOverlay } from '../../components/Overlays';
import { CURRENT_USER, USERS, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Overlays/CallOverlay',
  component: CallOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-screen call UI. States: ringing (incoming), calling (outgoing), in-call. Controls include mute, camera, screen share, record, virtual background, end.',
      },
    },
  },
};

const target = USERS[0];

const Stage = ({ children }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ position: 'relative', height: 720, background: '#0b0f19', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

export const IncomingAudio = {
  render: () => <Stage><CallOverlay call={{ type: 'audio', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const IncomingVideo = {
  render: () => <Stage><CallOverlay call={{ type: 'video', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const OutgoingAudio = {
  render: () => <Stage><CallOverlay call={{ type: 'audio', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const OutgoingVideo = {
  render: () => <Stage><CallOverlay call={{ type: 'video', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};
