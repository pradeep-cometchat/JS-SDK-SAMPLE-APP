import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, Centered, noop,
} from '../_helpers';

export default {
  title: 'Web/Messages/Message Header',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Header at the top of a chat — avatar / group badge, name, status sub-line, and action buttons (audio, video, search, members). These stories mount a ChatPanel but hide the body and composer so only the header is visible.',
      },
    },
  },
};

const baseProps = {
  currentUser: CURRENT_USER,
  allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(),
  isMobile: false, onBack: noop, onMarkUnread: noop,
};

const HeaderFrame = ({ children, width = 820 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <style>{`
      .header-stage .msg-list,
      .header-stage .pinned-bar,
      .header-stage .blocked-banner,
      .header-stage .chat-input-area { display: none !important; }
      .header-stage .chat-panel { height: auto !important; }
    `}</style>
    <div className="header-stage" style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </Centered>
);

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const dmOffline = CONVERSATIONS.find(c => c.id === 'dm_u3');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => (
    <HeaderFrame>
      <ChatPanel {...baseProps} conv={dm} messages={[]} />
    </HeaderFrame>
  ),
};

export const UserChatHeader = {
  render: () => (
    <HeaderFrame>
      <ChatPanel {...baseProps} conv={dm} messages={[]} />
    </HeaderFrame>
  ),
  parameters: { docs: { description: { story: 'Header for a 1:1 chat with an online user.' } } },
};

export const OfflineUserHeader = {
  render: () => (
    <HeaderFrame>
      <ChatPanel {...baseProps} conv={dmOffline} messages={[]} />
    </HeaderFrame>
  ),
};

export const GroupChatHeader = {
  render: () => (
    <HeaderFrame>
      <ChatPanel {...baseProps} conv={group} messages={[]} />
    </HeaderFrame>
  ),
  parameters: { docs: { description: { story: 'Group chat header — initialed tile + member count.' } } },
};

export const AllVariantsShowcase = {
  render: () => (
    <Centered maxWidth={860} padding={24}>
      <style>{`
        .h-stage .msg-list,
        .h-stage .pinned-bar,
        .h-stage .blocked-banner,
        .h-stage .chat-input-area { display: none !important; }
        .h-stage .chat-panel { height: auto !important; }
      `}</style>
      {[{ label: 'User online', c: dm }, { label: 'User offline', c: dmOffline }, { label: 'Group', c: group }].map(row => (
        <div key={row.label} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{row.label}</div>
          <div className="h-stage" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <ChatPanel {...baseProps} conv={row.c} messages={[]} />
          </div>
        </div>
      ))}
    </Centered>
  ),
};
