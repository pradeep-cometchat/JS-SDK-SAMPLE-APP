import { useState } from 'react';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CURRENT_USER, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES, Centered, noop,
} from '../_helpers';

export default {
  title: 'Web/Chat Panel/MessageComposer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The message composer — the lower section of the ChatPanel. It includes the rich-text format toolbar (bold, italic, underline, strikethrough, link, ordered/unordered list, quote, inline code, code block), the attach button, the contentEditable input, the emoji picker, voice recorder, and the send button. These stories mount a ChatPanel but clip the viewport so only the composer region is visible.',
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

/**
 * Clip to the composer region. The ChatPanel lays itself out as
 * [header, body, input-area]. We grow the container so the input area
 * stays visible and hide the header/body with CSS, so stories stay in sync
 * with the real component without maintaining a separate copy.
 */
const ComposerFrame = ({ children, width = 820, height = 200 }) => (
  <Centered maxWidth={width + 48} padding={24}>
    <style>{`
      .composer-stage .chat-header { display: none !important; }
      .composer-stage .msg-list    { display: none !important; }
      .composer-stage .pinned-bar  { display: none !important; }
      .composer-stage .blocked-banner { display: none !important; }
      .composer-stage .chat-panel  {
        height: auto !important;
      }
    `}</style>
    <div
      className="composer-stage"
      style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  </Centered>
);

const Stateful = ({ conv, initial }) => {
  const [messages, setMessages] = useState(initial);
  const handleSend = (_id, text, file, poll) => {
    const m = {
      id: 'm' + Date.now(), senderId: CURRENT_USER.id,
      text, file, poll,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0,
      edited: false, deleted: false,
    };
    setMessages(prev => [...prev, m]);
  };
  return <ChatPanel {...baseProps} conv={conv} messages={messages} onSend={handleSend} />;
};

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => (
    <ComposerFrame>
      <Stateful conv={dm} initial={[]} />
    </ComposerFrame>
  ),
  parameters: { docs: { description: { story: 'Empty composer in a DM conversation. Format toolbar, attach, contentEditable input, emoji, mic, and send.' } } },
};

export const InGroup = {
  render: () => (
    <ComposerFrame>
      <Stateful conv={group} initial={[]} />
    </ComposerFrame>
  ),
  parameters: { docs: { description: { story: 'Composer in a group chat. `@` triggers the mention picker.' } } },
};

export const Interactive = {
  render: () => (
    <ComposerFrame>
      <Stateful conv={dm} initial={INITIAL_MESSAGES.dm_u2} />
    </ComposerFrame>
  ),
  parameters: { docs: { description: { story: 'Composer with seeded history. Try the format toolbar (bold / italic / underline / strikethrough / list / quote / code), attach a file from the + menu, pick an emoji, or record a voice note.' } } },
};
