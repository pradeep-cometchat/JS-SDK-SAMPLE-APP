import { useRef, useState } from 'react';
import { DraggableFab } from '../../App';
import { USERS, Centered } from '../_helpers';

export default {
  title: 'Web/Sidebar/DraggableFab',
  component: DraggableFab,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Floating draggable Tweaks FAB. Click to toggle the Tweaks panel (theme, density, accent color, and demo actions). Drag it anywhere on the screen.',
      },
    },
  },
};

export const Collapsed = {
  render: () => {
    const [tweaks, setTweaks] = useState({ theme: 'light', density: 'comfortable', accentColor: '#004EEB' });
    const [showTweaks, setShowTweaks] = useState(false);
    const callStartTimeRef = useRef(null);
    return (
      <Centered maxWidth={720} minHeight="90vh">
        <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0 }}>Drag the FAB around</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            The FAB sits near the bottom-right of the viewport by default. Click it to open the Tweaks panel, or drag it anywhere.
          </p>
        </div>
        <DraggableFab
          showTweaks={showTweaks}
          setShowTweaks={setShowTweaks}
          tweaks={tweaks}
          saveTweaks={setTweaks}
          setActiveCall={() => alert('ring triggered')}
          callStartTimeRef={callStartTimeRef}
          setShowGroupModal={() => alert('open group modal')}
          setShowNewDM={() => alert('open new message modal')}
          users={USERS}
        />
      </Centered>
    );
  },
};

export const TweaksPanelOpen = {
  render: () => {
    const [tweaks, setTweaks] = useState({ theme: 'light', density: 'comfortable', accentColor: '#004EEB' });
    const callStartTimeRef = useRef(null);
    return (
      <Centered maxWidth={720} minHeight="90vh">
        <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0 }}>Tweaks panel</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Toggle Dark mode, flip density to Compact, change the accent color, or fire demo actions.
          </p>
        </div>
        <DraggableFab
          showTweaks
          setShowTweaks={() => {}}
          tweaks={tweaks}
          saveTweaks={setTweaks}
          setActiveCall={() => {}}
          callStartTimeRef={callStartTimeRef}
          setShowGroupModal={() => {}}
          setShowNewDM={() => {}}
          users={USERS}
        />
      </Centered>
    );
  },
};
