import { useState } from 'react';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, Centered, noop,
} from '../_helpers';

export default {
  title: 'Web/Messages/Message Composer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The message composer — bottom section of the ChatPanel. Includes the rich-text format toolbar (bold, italic, underline, strike, link, lists, quote, code), attach menu, contentEditable input with mentions, emoji picker, voice recorder, and send button. These stories mount a full ChatPanel but hide everything except the composer so you can focus on its states.',
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

const ComposerFrame = ({ children, width = 820, height = 200 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <style>{`
      .composer-stage .chat-header,
      .composer-stage .msg-list,
      .composer-stage .pinned-bar,
      .composer-stage .blocked-banner { display: none !important; }
      .composer-stage .chat-panel { height: auto !important; }
    `}</style>
    <div className="composer-stage" style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', minHeight: height, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </Centered>
);

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
  return <ChatPanel {...baseProps} conv={conv} messages={messages} onSend={handleSend} />;
};

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => <ComposerFrame><Stateful conv={dm} initial={[]} /></ComposerFrame>,
};

export const EmptyState = {
  render: () => <ComposerFrame><Stateful conv={dm} initial={[]} /></ComposerFrame>,
};

export const InGroup = {
  render: () => <ComposerFrame><Stateful conv={group} initial={[]} /></ComposerFrame>,
  parameters: { docs: { description: { story: 'In a group, typing `@` opens a mention picker.' } } },
};

export const WithHistory = {
  render: () => <ComposerFrame><Stateful conv={dm} initial={INITIAL_MESSAGES.dm_u2} /></ComposerFrame>,
};

export const WithRichText = {
  render: () => <ComposerFrame><Stateful conv={dm} initial={[]} /></ComposerFrame>,
  parameters: { docs: { description: { story: 'Try the format toolbar: bold, italic, underline, strikethrough, link, ordered / unordered list, quote, inline code, code block.' } } },
};

export const AllVariantsShowcase = {
  render: () => <ComposerFrame><Stateful conv={dm} initial={INITIAL_MESSAGES.dm_u2} /></ComposerFrame>,
};
