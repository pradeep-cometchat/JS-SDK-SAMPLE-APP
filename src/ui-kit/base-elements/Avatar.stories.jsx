import { Avatar, StatusDot } from '../../components/Avatar';
import { CURRENT_USER, USERS, Centered } from '../_helpers';

export default {
  title: 'Base Elements/Avatar',
  component: Avatar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "User avatar — renders `avatarUrl` when available, otherwise a gradient tile with the user's initials. Color is derived from `user.color`. `StatusDot` is a separate indicator that only renders when `status === 'online'`.",
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 20, max: 120, step: 2 } },
  },
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

export const Default = { args: { user: USERS[0], size: 48 } };
export const WithImage = { args: { user: USERS[0], size: 48 } };
export const InitialsFallback = { args: { user: USERS[2], size: 48 } };
export const CurrentUser = { args: { user: CURRENT_USER, size: 48 } };
export const Small = { args: { user: USERS[0], size: 24 } };
export const Large = { args: { user: USERS[0], size: 80 } };

export const AllVariantsShowcase = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Centered maxWidth={780} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 12 }}>Sizes</div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[24, 32, 48, 64, 80].map(s => (
              <div key={s} style={{ textAlign: 'center' }}>
                <Avatar user={USERS[0]} size={s} />
                <div style={{ fontSize: 11, marginTop: 8, color: 'var(--text-muted)' }}>{s}px</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 12 }}>With image vs initials</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Avatar user={USERS[0]} size={56} />
            <Avatar user={USERS[2]} size={56} />
            <Avatar user={CURRENT_USER} size={56} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 12 }}>All users + status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 20 }}>
            {[CURRENT_USER, ...USERS].map(u => (
              <div key={u.id} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar user={u} size={48} />
                  <StatusDot status={u.status} />
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Centered>
  ),
};
