import { useState } from 'react';
import { NewDMModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, CONVERSATIONS, Centered } from '../_helpers';

export default {
  title: 'Web/Users/Users',
  component: NewDMModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'User list modal. Lets the current user start a new direct message with anyone. Supports search and filters out the current user.',
      },
    },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [picked, setPicked] = useState(null);
    return (
      <Centered maxWidth={720} padding={24} minHeight="100vh">
        {!open ? (
          <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => { setPicked(null); setOpen(true); }}>Open Users</button>
            {picked && (
              <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }}>
                Would open DM with <strong>{picked.name}</strong>
              </div>
            )}
          </div>
        ) : (
          <NewDMModal allUsers={USERS} currentUser={CURRENT_USER} conversations={CONVERSATIONS} onClose={() => setOpen(false)} onSelect={(u) => { setPicked(u); setOpen(false); }} />
        )}
      </Centered>
    );
  },
};

export const SearchActive = Default;

export const AllVariantsShowcase = Default;
