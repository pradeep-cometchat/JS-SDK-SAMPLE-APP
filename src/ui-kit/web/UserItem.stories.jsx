import { Avatar, StatusDot } from '../../components/Avatar';
import { USERS, CURRENT_USER, Centered } from '../_helpers';

export default {
  title: 'Web/Users/User Item',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'User row used in the Login screen user grid, the New DM modal, and Group Members list. Renders an avatar with status dot, name, and a sub-line (role / username).',
      },
    },
  },
};

const Card = ({ children, maxWidth = 520 }) => (
  <Centered maxWidth={maxWidth} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

const Row = ({ user, sub, active = false }) => (
  <button
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: 10, border: 'none', borderRadius: 8,
      background: active ? 'var(--accent-light)' : 'transparent',
      cursor: 'pointer', fontFamily: 'var(--font)', color: 'var(--text)', textAlign: 'left',
    }}
  >
    <div style={{ position: 'relative' }}>
      <Avatar user={user} size={40} />
      <StatusDot status={user.status} />
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub || user.role}</div>
    </div>
  </button>
);

export const Default = {
  render: () => <Card><Row user={USERS[0]} /></Card>,
};

export const OnlineUser = {
  render: () => <Card><Row user={USERS[0]} /></Card>,
};

export const OfflineUser = {
  render: () => <Card><Row user={USERS[1]} /></Card>,
};

export const Selected = {
  render: () => <Card><Row user={USERS[0]} active /></Card>,
};

export const CurrentUser = {
  render: () => <Card><Row user={CURRENT_USER} sub="Online" /></Card>,
};

export const AllVariantsShowcase = {
  render: () => (
    <Card maxWidth={560}>
      {[CURRENT_USER, ...USERS].map(u => (
        <Row key={u.id} user={u} />
      ))}
    </Card>
  ),
};
