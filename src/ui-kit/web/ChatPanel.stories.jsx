import { useState } from 'react';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, DesktopChatFrame, noop,
} from '../_helpers';

export default {
  title: 'Web/Chat Panel/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main conversation view. Header, pinned bar, message list with date dividers, rich-text composer with @mentions, voice recorder, reply/edit bars, attach menu, emoji keyboard, poll modal, and search-in-chat.',
      },
    },
  },
};

const baseProps = {
  currentUser: CURRENT_USER,
  allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(), isMobile: false,
  onBack: noop, onMarkUnread: noop,
};

const dmConv = CONVERSATIONS.find(c => c.id === 'dm_u2');
const groupConv = CONVERSATIONS.find(c => c.id === 'grp_eng');

const Stateful = ({ conv, initial }) => {
  const [messages, setMessages] = useState(initial);
  const handleSend = (_id, text, file, poll, replyTo) => {
    const m = {
      id: 'm' + Date.now(),
      senderId: CURRENT_USER.id,
      text, file, poll,
      replyTo: replyTo ? { senderId: replyTo.senderId, id: replyTo.id, text: replyTo.text } : undefined,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    };
    setMessages(prev => [...prev, m]);
  };
  const handleReact = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const reactions = [...(m.reactions || [])];
      const idx = reactions.findIndex(r => r.emoji === emoji);
      if (idx === -1) reactions.push({ emoji, userIds: [CURRENT_USER.id] });
      else {
        const r = { ...reactions[idx] };
        r.userIds = r.userIds.includes(CURRENT_USER.id)
          ? r.userIds.filter(u => u !== CURRENT_USER.id)
          : [...r.userIds, CURRENT_USER.id];
        if (r.userIds.length === 0) reactions.splice(idx, 1); else reactions[idx] = r;
      }
      return { ...m, reactions };
    }));
  };
  const handleDelete = (msgId) => setMessages(prev => prev.map(m => m.id === msgId ? { ...m, deleted: true } : m));
  const handleEdit = (msgId, text) => setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text, edited: true } : m));
  const handleVote = (msgId, idx) => setMessages(prev => prev.map(m => {
    if (m.id !== msgId || !m.poll) return m;
    return {
      ...m,
      poll: {
        ...m.poll,
        options: m.poll.options.map((o, i) => {
          if (i !== idx) return o;
          return o.votes.includes(CURRENT_USER.id)
            ? { ...o, votes: o.votes.filter(v => v !== CURRENT_USER.id) }
            : { ...o, votes: [...o.votes, CURRENT_USER.id] };
        }),
      },
    };
  }));

  return (
    <DesktopChatFrame width={1100}>
      <ChatPanel
        {...baseProps}
        conv={conv}
        messages={messages}
        onSend={handleSend}
        onReact={handleReact}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onVote={handleVote}
      />
    </DesktopChatFrame>
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

export const CompactDensity = {
  render: () => (
    <DesktopChatFrame width={1100}>
      <ChatPanel {...baseProps} conv={dmConv} messages={INITIAL_MESSAGES.dm_u2} density="compact" />
    </DesktopChatFrame>
  ),
};
