import { useState } from 'react';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, MobileFrame, noop,
} from '../_helpers';

export default {
  title: 'Mobile/Chat Panel/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main chat view on mobile. Includes a back button in the header, full-width composer, bottom-sheet action menus on long-press.',
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
  isMobile: true, onBack: noop, onMarkUnread: noop,
};

const dmConv = CONVERSATIONS.find(c => c.id === 'dm_u2');
const groupConv = CONVERSATIONS.find(c => c.id === 'grp_eng');

const Stateful = ({ conv, initial }) => {
  const [messages, setMessages] = useState(initial);
  const handleSend = (_id, text, file, poll, replyTo) => {
    const m = {
      id: 'm' + Date.now(), senderId: CURRENT_USER.id,
      text, file, poll,
      replyTo: replyTo ? { senderId: replyTo.senderId, id: replyTo.id, text: replyTo.text } : undefined,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    };
    setMessages(prev => [...prev, m]);
  };
  return (
    <MobileFrame>
      <ChatPanel {...baseProps} conv={conv} messages={messages} onSend={handleSend} />
    </MobileFrame>
  );
};

export const DirectMessage = {
  render: () => <Stateful conv={dmConv} initial={INITIAL_MESSAGES.dm_u2} />,
};

export const GroupChat = {
  render: () => <Stateful conv={groupConv} initial={INITIAL_MESSAGES.grp_eng} />,
};

export const EmptyConversation = {
  render: () => <Stateful conv={{ id: 'dm_new', type: 'dm', userId: 'u5', unread: 0 }} initial={[]} />,
};
