import { Avatar, StatusDot } from '../../components/Avatar';
import { CURRENT_USER, USERS, Centered } from '../_helpers';

export default {
  title: 'Web/Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "User avatar — renders `avatarUrl` when available, otherwise a gradient tile with the user's initials. `StatusDot` is a separate indicator rendered only when `status === 'online'`.",
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 20, max: 120, step: 2 } },
  },
  // Center the default-rendered stories (the ones that only use `args`)
  decorators: [
    (Story) => (
      <Centered maxWidth={720} padding={48}>
        <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
          <Story />
        </div>
      </Centered>
    ),
  ],
};

export const WithImage = { args: { user: USERS[0], size: 48 } };
export const InitialsFallback = { args: { user: USERS[2], size: 48 } };
export const CurrentUser = { args: { user: CURRENT_USER, size: 48 } };

export const AllSizes = {
  decorators: [(Story) => <Story />], // Override parent decorator — uses Centered internally
  render: () => (
    <Centered maxWidth={520}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
        {[24, 32, 48, 64, 80].map(s => (
          <div key={s} style={{ textAlign: 'center' }}>
            <Avatar user={USERS[0]} size={s} />
            <div style={{ fontSize: 11, marginTop: 8, color: 'var(--text-muted)' }}>{s}px</div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};

export const AllUsersWithStatus = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Centered maxWidth={640}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[CURRENT_USER, ...USERS].map(u => (
          <div key={u.id} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar user={u} size={56} />
              <StatusDot status={u.status} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.status}</div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};
