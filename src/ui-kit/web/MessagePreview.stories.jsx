import { Centered } from '../_helpers';
import { USERS } from '../../data';
import { CloseIcon } from '../../components/Icons';

export default {
  title: 'Web/Misc/Message Preview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Small inline preview that slides above the composer when replying to a message or editing a draft. Shows sender name, snippet, and a close button to cancel.',
      },
    },
  },
};

const Card = ({ children }) => (
  <Centered maxWidth={620} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

const Preview = ({ label, sender, text }) => (
  <div style={{
    padding: '8px 10px',
    marginBottom: 8,
    background: 'var(--accent-light)',
    borderLeft: '3px solid var(--accent)',
    borderRadius: 6,
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>
        {label}{sender ? ` · ${sender.name}` : ''}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
    </div>
    <button className="icon-btn"><CloseIcon size={14} /></button>
  </div>
);

export const Default = {
  render: () => <Card><Preview label="Replying to" sender={USERS[0]} text="Can you review the auth flow before EOD?" /></Card>,
};

export const EditingOwnMessage = {
  render: () => <Card><Preview label="Editing message" text="The old draft text that's being edited" /></Card>,
};

export const ReplyToLongMessage = {
  render: () => (
    <Card>
      <Preview label="Replying to" sender={USERS[0]} text="This is a very long quoted message that needs to be truncated with an ellipsis so it doesn't push the preview too wide in the composer." />
    </Card>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <Card>
      <Preview label="Replying to" sender={USERS[0]} text="Can you review the auth flow before EOD?" />
      <Preview label="Editing message" text="The old draft text that's being edited" />
    </Card>
  ),
};
