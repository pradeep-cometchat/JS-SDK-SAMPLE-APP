import { useEffect } from 'react';
import { CallOverlay } from '../../components/Overlays';
import { CURRENT_USER, USERS, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Calls/Ongoing Call',
  component: CallOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'In-call UI after the outgoing call connects. Self-video PIP, virtual background picker, mute, camera, screen share, record, and end-call controls.',
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
  render: () => <Stage><CallOverlay call={{ type: 'video', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
  parameters: { docs: { description: { story: 'Wait ~3s for the outgoing call to transition to the in-call state — then you can try every in-call control.' } } },
};

export const ActiveCallState = Default;

export const AudioOngoing = {
  render: () => <Stage><CallOverlay call={{ type: 'audio', user: target, incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} /></Stage>,
};

export const AllVariantsShowcase = Default;
