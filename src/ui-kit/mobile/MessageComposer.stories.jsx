import { useState } from 'react';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, MobileFrame, noop,
} from '../_helpers';

export default {
  title: 'Mobile/Messages/Message Composer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composer in a mobile viewport. The format toolbar is hidden on mobile; attach menu, emoji keyboard, and action menus open as bottom sheets.',
      },
    },
  },
};

const baseProps = {
  currentUser: CURRENT_USER, allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(),
  isMobile: true, onBack: noop, onMarkUnread: noop,
};

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');

export const Default = {
  render: () => <MobileFrame><ChatPanel {...baseProps} conv={dm} messages={[]} /></MobileFrame>,
};

export const Empty = Default;

export const WithHistory = {
  render: () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES.dm_u2);
    const handleSend = (_id, text) => setMessages(prev => [...prev, {
      id: 'm' + Date.now(), senderId: CURRENT_USER.id, text, ts: Date.now(),
      reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    }]);
    return (
      <MobileFrame>
        <ChatPanel {...baseProps} conv={dm} messages={messages} onSend={handleSend} />
      </MobileFrame>
    );
  },
};

export const AllVariantsShowcase = WithHistory;
