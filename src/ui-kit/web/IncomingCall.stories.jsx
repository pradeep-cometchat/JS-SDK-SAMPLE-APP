import { CallOverlay } from '../../components/Overlays';
import { CURRENT_USER, USERS, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Calls/Incoming Call',
  component: CallOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-screen ringing UI for an incoming call. Shows caller avatar with pulsing rings, Accept and Decline buttons.',
      },
    },
  },
};

const Stage = ({ children }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ position: 'relative', height: 720, background: '#0b0f19', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

const target = USERS[0];

export const Default = {
  render: () => <Stage><CallOverlay call={{ type: 'audio', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const IncomingAudio = Default;

export const IncomingVideo = {
  render: () => <Stage><CallOverlay call={{ type: 'video', user: target, incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const AllVariantsShowcase = Default;
