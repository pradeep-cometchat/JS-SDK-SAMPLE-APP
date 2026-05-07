import { Avatar } from '../../components/Avatar';
import { STATUS_COLORS } from '../../data';
import { CURRENT_USER, USERS, Centered as Frame } from '../_helpers';
import { ChevronRightIcon } from '../../components/Icons';

export default {
  title: 'Web/Groups/Group Member Item',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single member row in the Group Members panel. Shows avatar + status dot, name + "you" marker, role badge (Owner), and role sub-line.',
      },
    },
  },
};

const Card = ({ children, maxWidth = 460 }) => (
  <Frame maxWidth={maxWidth} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 10, borderRadius: 12, border: '1px solid var(--border)' }}>{children}</div>
  </Frame>
);

const Row = ({ user, isOwner = false, isMe = false }) => (
  <button
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: 8, background: 'none', border: 'none', borderRadius: 8,
      cursor: isMe ? 'default' : 'pointer', fontFamily: 'var(--font)', color: 'var(--text)', textAlign: 'left',
    }}
  >
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <Avatar user={user} size={34} />
      <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: STATUS_COLORS[user.status], border: '2px solid var(--surface)' }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="user-select-name">{user.name}{isMe ? ' (you)' : ''}</span>
        {isOwner && (
          <span style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b', background: '#f59e0b18', padding: '1px 6px', borderRadius: 99 }}>Owner</span>
        )}
      </div>
      <div className="user-select-role">{user.role}</div>
    </div>
    {!isMe && <ChevronRightIcon size={14} />}
  </button>
);

export const Default = { render: () => <Card><Row user={USERS[0]} /></Card> };

export const MemberRole = { render: () => <Card><Row user={USERS[0]} /></Card> };

export const OwnerRole = { render: () => <Card><Row user={USERS[3]} isOwner /></Card> };

export const CurrentUser = {
  render: () => <Card><Row user={CURRENT_USER} isOwner isMe /></Card>,
};

export const AllVariantsShowcase = {
  render: () => (
    <Card maxWidth={520}>
      <Row user={CURRENT_USER} isOwner isMe />
      {USERS.map(u => <Row key={u.id} user={u} />)}
    </Card>
  ),
};
