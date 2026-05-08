import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, Centered, noop,
} from '../_helpers';

export default {
  title: 'Web/Messages/Message List',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Scrollable list of messages inside a ChatPanel. Includes date dividers, sender grouping, in-line timestamps, read receipts, thread indicators, and auto-scroll-to-bottom on new messages. Stories hide the header and composer so only the list is visible.',
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

const ListFrame = ({ children, width = 820, height = 580 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <style>{`
      .list-stage .chat-header,
      .list-stage .chat-input-area,
      .list-stage .pinned-bar,
      .list-stage .blocked-banner { display: none !important; }
      .list-stage .chat-panel { height: 100% !important; }
    `}</style>
    <div className="list-stage" style={{ width: '100%', height, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </Centered>
);

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => (
    <ListFrame>
      <ChatPanel {...baseProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
    </ListFrame>
  ),
};

export const EmptyState = {
  render: () => (
    <ListFrame>
      <ChatPanel {...baseProps} conv={{ id: 'dm_new', type: 'dm', userId: 'u5', unread: 0 }} messages={[]} />
    </ListFrame>
  ),
  parameters: { docs: { description: { story: 'No messages yet — shows the empty placeholder.' } } },
};

export const DmConversation = {
  render: () => (
    <ListFrame>
      <ChatPanel {...baseProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
    </ListFrame>
  ),
};

export const GroupConversation = {
  render: () => (
    <ListFrame>
      <ChatPanel {...baseProps} conv={group} messages={INITIAL_MESSAGES.grp_eng} />
    </ListFrame>
  ),
  parameters: { docs: { description: { story: 'Group list — sender names + avatars appear above each new sender\'s messages.' } } },
};

export const CompactDensity = {
  render: () => (
    <ListFrame>
      <ChatPanel {...baseProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} density="compact" />
    </ListFrame>
  ),
  parameters: { docs: { description: { story: 'Compact density — smaller vertical gaps between consecutive messages.' } } },
};

export const AllVariantsShowcase = GroupConversation;
