import { useState } from 'react';
import { GroupModal } from '../../components/Overlays';
import { CURRENT_USER, USERS, Centered } from '../_helpers';

export default {
  title: 'Web/Overlays/GroupModal',
  component: GroupModal,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Two-step modal for creating a group. Step 1: name, type, description. Step 2: members.' } },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [last, setLast] = useState(null);
    return (
      <Centered maxWidth={720} padding={24} minHeight="100vh">
        {!open ? (
          <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => { setLast(null); setOpen(true); }}>Open Create Group</button>
            {last && (
              <pre style={{ marginTop: 16, background: 'var(--bg)', padding: 12, borderRadius: 8, fontSize: 12, textAlign: 'left' }}>
                {JSON.stringify(last, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={() => setOpen(false)} onCreate={(data) => { setLast(data); setOpen(false); }} />
        )}
      </Centered>
    );
  },
};
