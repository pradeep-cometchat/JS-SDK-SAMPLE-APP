import { useState } from 'react';
import { PollModal } from '../../components/ChatPanel';
import { Centered } from '../_helpers';

export default {
  title: 'Web/Chat Panel/PollModal',
  component: PollModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Create-a-poll modal. Question + 2–10 options. Validates empty fields and duplicate options.',
      },
    },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [last, setLast] = useState(null);
    return (
      <Centered maxWidth={720} minHeight="100vh" padding={24}>
        {!open ? (
          <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn-primary" onClick={() => { setLast(null); setOpen(true); }}>Open Poll modal</button>
            {last && (
              <pre style={{ marginTop: 16, background: 'var(--bg)', padding: 12, borderRadius: 8, fontSize: 12, textAlign: 'left' }}>
                {JSON.stringify(last, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <PollModal onClose={() => setOpen(false)} onSend={(poll) => { setLast(poll); setOpen(false); }} />
        )}
      </Centered>
    );
  },
};
